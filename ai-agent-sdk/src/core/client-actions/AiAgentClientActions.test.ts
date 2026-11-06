/**
 * The AiAgent surface for client actions: turning an incoming `client action` message into the
 * event, answering over the socket -- and the guard that stops a result (and the token it may
 * carry) being queued when there is nowhere to send it.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AiAgent } from '../AiAgent';
import { createClientActionResultMessage } from '../message/MessageTypes';
import { PERSONA, ROLE } from '../message/types';
import { FakeSessionStorage } from './pkce/oauth/test-dom';
import { ToolTokenCache } from './pkce/oauth/ToolTokenCache';
import type { ClientActionHandler, ClientActionOutcome } from './types';

function confirmHandler(perform = vi.fn(async (): Promise<ClientActionOutcome> => ({ status: 'completed' }))) {
  const handler: ClientActionHandler<Record<string, unknown>> = {
    type: 'confirm_thing',
    interaction: 'user-gesture',
    parse: (payload) => (typeof payload === 'object' && payload !== null ? (payload as Record<string, unknown>) : null),
    perform,
  };
  return handler;
}

describe('createClientActionResultMessage', () => {
  it('sends the result as metadata, with no prose', () => {
    const message = createClientActionResultMessage({
      actionId: 'call-1',
      type: 'pkce_user_auth',
      status: 'completed',
      data: { accessToken: 'ACCESS-TOKEN' },
    });

    expect(message.persona).toBe(PERSONA.METADATA);
    expect(message.role).toBe(ROLE.CLIENT_ACTION_RESULT);
    expect(message.content).toBe('');
    expect(message.messageData).toEqual({
      actionId: 'call-1',
      type: 'pkce_user_auth',
      status: 'completed',
      data: { accessToken: 'ACCESS-TOKEN' },
    });
  });
});

describe('AiAgent client actions', () => {
  let agent: AiAgent;
  let connection: { isConnected: () => boolean; send: ReturnType<typeof vi.fn>; on: ReturnType<typeof vi.fn> };

  const deliver = async (messageData: Record<string, unknown>, role: string = ROLE.CLIENT_ACTION) => {
    (agent as any).setupConnectionEvents();
    const onMessage = connection.on.mock.calls.find(([name]) => name === 'message')![1];
    await onMessage({
      data: JSON.stringify({ messageId: 'm-1', persona: PERSONA.AGENT, role, content: '', messageData }),
      timestamp: Date.now(),
    });
  };

  const action = {
    clientAction: {
      type: 'confirm_thing',
      actionId: 'call-1',
      awaitsResult: true,
      expiresAt: Date.now() + 600_000,
      payload: { n: 1 },
    },
  };

  beforeEach(() => {
    agent = new AiAgent({ id: 'agent-1', endpoint: 'https://example.com', autoConnect: false });
    connection = { isConnected: () => true, send: vi.fn().mockResolvedValue(undefined), on: vi.fn() };
    (agent as any).connection = connection;
  });

  it('adds nothing to the socket URL for registered handlers', () => {
    // The server does not negotiate client actions; an unregistered type is answered `unsupported`.
    (agent as any).deploymentInfo = { aiAgentDomain: 'test.example.com' };
    agent.registerClientActionHandler(confirmHandler());

    const url = new URL((agent as any).getWsEndpoint('session-1'));
    expect([...url.searchParams.keys()]).toEqual(['sessionId']);
  });

  it('turns a client action message into the event, not an agent message', async () => {
    agent.registerClientActionHandler(confirmHandler());
    const onAction = vi.fn();
    const onAgentMessage = vi.fn();
    const onMessage = vi.fn();
    agent.on('clientAction', onAction);
    agent.on('agentMessage', onAgentMessage);
    agent.on('message', onMessage);

    await deliver(action);

    expect(onAction).toHaveBeenCalledOnce();
    expect(onAction.mock.calls[0][0].payload.action).toMatchObject({
      actionId: 'call-1',
      type: 'confirm_thing',
      interaction: 'user-gesture',
      lifecycle: 'pending',
    });
    // The card is the whole turn; an agent message would render as an empty bubble.
    expect(onAgentMessage).not.toHaveBeenCalled();
    // The raw message still goes out first, which hosts that render from it depend on.
    expect(onMessage).toHaveBeenCalledOnce();
  });

  it('answers the server over the open connection once the action is performed', async () => {
    agent.registerClientActionHandler(confirmHandler());
    await deliver(action);

    await expect(agent.performClientAction('call-1')).resolves.toEqual({ status: 'completed' });

    expect(connection.send).toHaveBeenCalledTimes(1);
    const sent = JSON.parse(connection.send.mock.calls[0][0]);
    expect(sent.role).toBe(ROLE.CLIENT_ACTION_RESULT);
    expect(sent.messageData).toEqual({ actionId: 'call-1', type: 'confirm_thing', status: 'completed' });
  });

  it('tells the server about a decline', async () => {
    agent.registerClientActionHandler(confirmHandler());
    await deliver(action);

    agent.declineClientAction('call-1');
    await Promise.resolve();

    expect(JSON.parse(connection.send.mock.calls[0][0]).messageData.status).toBe('declined');
  });

  it('answers an action of a type nobody registered as unsupported', async () => {
    await deliver(action);
    await Promise.resolve();

    expect(JSON.parse(connection.send.mock.calls[0][0]).messageData).toEqual({
      actionId: 'call-1',
      type: 'confirm_thing',
      status: 'unsupported',
    });
  });

  it('cancels the pending action when the person types, without a reply of its own', async () => {
    agent.registerClientActionHandler(confirmHandler());
    const updates: unknown[] = [];
    agent.on('clientActionUpdate', (event) => updates.push(event.payload));
    await deliver(action);

    await agent.send('never mind, what are your hours?', { from: 'customer', to: 'agent' });

    expect(updates).toContainEqual(expect.objectContaining({ actionId: 'call-1', status: 'cancelled' }));
    const roles = connection.send.mock.calls.map(([payload]) => JSON.parse(payload).role);
    expect(roles).toEqual([ROLE.HUMAN]);
  });

  it('drops the result rather than queueing it for a closed connection', async () => {
    // Queued, it would be delivered after a reconnect -- by which time the server has very likely
    // stopped waiting. Holding an end user's credential in a queue for a turn that cannot be
    // resumed is the worse of the two outcomes.
    agent.registerClientActionHandler(confirmHandler());
    await deliver(action);
    connection.isConnected = () => false;

    await expect(agent.performClientAction('call-1')).resolves.toEqual({ status: 'completed' });

    expect(connection.send).not.toHaveBeenCalled();
    expect((agent as any).messageQueue.size()).toBe(0);
  });

  describe('signing out', () => {
    const token = { accessToken: 'END-USER-TOKEN', refreshToken: 'R', expiresAt: Date.now() + 3_600_000, scopes: 'openid' };
    const source = {
      credentialId: 'cred-9',
      clientId: 'client-3x9k',
      tokenUrl: 'https://login.acme.com/oauth/token',
      authorizationUrl: 'https://login.acme.com/authorize',
      scopes: 'openid',
    };

    beforeEach(() => {
      vi.stubGlobal('sessionStorage', new FakeSessionStorage());
      sessionStorage.setItem('unrelated', 'kept');
      new ToolTokenCache().set(source, token);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("forgets the end user's tool tokens, so the next person in the tab signs in for themselves", () => {
      sessionStorage.setItem('egain_aia_tool_pkce_state:attempt-1', '{"code_verifier":"v"}');

      agent.clearClientActionCredentials();

      expect(new ToolTokenCache().peek(source)).toBeNull();
      expect(sessionStorage.getItem('egain_aia_tool_pkce_state:attempt-1')).toBeNull();
      expect(sessionStorage.getItem('unrelated')).toBe('kept');
    });

    it('forgets them on logout', async () => {
      vi.spyOn(agent, 'disconnect').mockResolvedValue(undefined);
      vi.spyOn((agent as any).authService, 'logout').mockResolvedValue(undefined);

      await agent.logout();

      expect(new ToolTokenCache().peek(source)).toBeNull();
    });
  });
});
