import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Logger } from '../logging/Logger';
import { LogLevel } from '../logging/LogLevel';
import { CLIENT_ACTION_EXPIRY_MARGIN_MS, ClientActionManager } from './ClientActionManager';
import type {
  ClientAction,
  ClientActionEnvelope,
  ClientActionHandler,
  ClientActionOutcome,
  ClientActionResult,
  ClientActionUpdate,
} from './types';

const NOW = 1_760_000_000_000;

/** A test-only action that needs a click and resolves however the test says. */
function gestureHandler(overrides: Partial<ClientActionHandler<{ n: number }>> = {}) {
  let finish: (outcome: ClientActionOutcome) => void = () => {};
  const handler: ClientActionHandler<{ n: number }> = {
    type: 'confirm_thing',
    interaction: 'user-gesture',
    parse: (payload) => (typeof payload === 'object' && payload !== null ? (payload as { n: number }) : null),
    perform: vi.fn(
      () =>
        new Promise<ClientActionOutcome>((resolve) => {
          finish = resolve;
        }),
    ),
    ...overrides,
  };
  return { handler, finish: (outcome: ClientActionOutcome) => finish(outcome) };
}

/** A test-only UI action the server does not wait on, like refreshing the page. */
function uiOnlyHandler() {
  const ran: unknown[] = [];
  const handler: ClientActionHandler<string> = {
    type: 'refresh_page',
    interaction: 'none',
    parse: (payload) => (typeof payload === 'string' ? payload : null),
    perform: async (payload) => {
      ran.push(payload);
      return { status: 'completed' };
    },
  };
  return { handler, ran };
}

function envelope(overrides: Partial<ClientActionEnvelope> = {}): ClientActionEnvelope {
  return {
    type: 'confirm_thing',
    actionId: 'call-1',
    awaitsResult: true,
    expiresAt: NOW + 600_000,
    payload: { n: 1 },
    ...overrides,
  };
}

describe('ClientActionManager', () => {
  let sent: ClientActionResult[];
  let actions: ClientAction[];
  let updates: ClientActionUpdate[];
  let manager: ClientActionManager;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    sent = [];
    actions = [];
    updates = [];
    manager = new ClientActionManager({
      logger: new Logger({ level: LogLevel.ERROR, enableConsole: false }),
      sendResult: async (result) => {
        sent.push(result);
      },
      onAction: (action) => actions.push(action),
      onUpdate: (update) => updates.push(update),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('opting in', () => {
    it('answers an unregistered type the server waits on as unsupported, at once', () => {
      // Leaving it unanswered would hold the server until its deadline.
      manager.handle(envelope({ type: 'something_new' }));

      expect(sent).toEqual([{ actionId: 'call-1', type: 'something_new', status: 'unsupported' }]);
      expect(actions).toEqual([]);
    });

    it('ignores an unregistered type the server does not wait on', () => {
      manager.handle(envelope({ type: 'something_new', awaitsResult: false }));

      expect(sent).toEqual([]);
    });

    it('fails an action whose payload the handler cannot use', () => {
      manager.register(gestureHandler().handler);

      manager.handle(envelope({ payload: 'not an object' }));

      expect(sent).toEqual([{ actionId: 'call-1', type: 'confirm_thing', status: 'failed', reason: 'invalid_payload' }]);
    });

    it('tells the host an action with an unusable payload has ended', () => {
      // The host may already show it from the message: a card left live would offer a sign-in
      // nothing can run.
      manager.register(gestureHandler().handler);

      manager.handle(envelope({ payload: 'not an object', awaitsResult: false }));

      expect(updates).toEqual([
        { actionId: 'call-1', type: 'confirm_thing', lifecycle: 'failed', status: 'failed', reason: 'invalid_payload' },
      ]);
      expect(sent).toEqual([]);
    });

    it('fails an action whose parser throws, rather than leaving the server waiting', () => {
      manager.register(
        gestureHandler({
          parse: () => {
            throw new Error('unexpected payload shape');
          },
        }).handler,
      );

      expect(() => manager.handle(envelope())).not.toThrow();

      expect(sent).toEqual([{ actionId: 'call-1', type: 'confirm_thing', status: 'failed', reason: 'invalid_payload' }]);
      expect(actions).toEqual([]);
    });
  });

  describe('a user-gesture action', () => {
    it('waits for the click, then answers once with how it ended', async () => {
      const { handler, finish } = gestureHandler();
      manager.register(handler);
      manager.handle(envelope());

      expect(actions).toHaveLength(1);
      expect(actions[0]).toMatchObject({ actionId: 'call-1', lifecycle: 'pending', payload: { n: 1 } });
      expect(handler.perform).not.toHaveBeenCalled();

      const outcome = manager.perform('call-1');
      expect(handler.perform).toHaveBeenCalledTimes(1);
      finish({ status: 'completed', data: { answer: 42 } });

      await expect(outcome).resolves.toEqual({ status: 'completed', data: { answer: 42 } });
      expect(sent).toEqual([{ actionId: 'call-1', type: 'confirm_thing', status: 'completed', data: { answer: 42 } }]);
      expect(updates.map((u) => u.lifecycle)).toEqual(['in_progress', 'completed']);
    });

    it('runs the handler inside the perform call, so the click is not spent', () => {
      const { handler } = gestureHandler();
      manager.register(handler);
      manager.handle(envelope());

      void manager.perform('call-1');

      // Synchronously -- before anything has been awaited.
      expect(handler.perform).toHaveBeenCalledTimes(1);
    });

    it('tells the server about a decline', () => {
      manager.register(gestureHandler().handler);
      manager.handle(envelope());

      manager.decline('call-1');

      expect(sent).toEqual([{ actionId: 'call-1', type: 'confirm_thing', status: 'declined' }]);
    });

    it('finishes without a click when the silent attempt succeeds', async () => {
      const { handler } = gestureHandler({ tryWithoutUser: async () => ({ status: 'completed' }) });
      manager.register(handler);

      manager.handle(envelope());
      expect(actions[0].lifecycle).toBe('in_progress');
      await vi.runAllTicks();
      await Promise.resolve();

      expect(sent).toEqual([{ actionId: 'call-1', type: 'confirm_thing', status: 'completed' }]);
      expect(handler.perform).not.toHaveBeenCalled();
    });

    it('waits for the person when the silent attempt cannot finish', async () => {
      manager.register(gestureHandler({ tryWithoutUser: async () => null }).handler);

      manager.handle(envelope());
      await Promise.resolve();
      await Promise.resolve();

      expect(sent).toEqual([]);
      expect(updates.at(-1)?.lifecycle).toBe('pending');
    });

    it('waits for the person when the silent attempt throws before it starts', async () => {
      // A synchronous throw is not a rejected promise: uncaught, it would escape `handle` and the
      // action would sit in progress, never asking the person and never answering the server.
      const { handler } = gestureHandler({
        tryWithoutUser: () => {
          throw new Error('storage unavailable');
        },
      });
      manager.register(handler);

      expect(() => manager.handle(envelope())).not.toThrow();
      await Promise.resolve();
      await Promise.resolve();

      expect(sent).toEqual([]);
      expect(updates.at(-1)?.lifecycle).toBe('pending');
      // Still answerable: the click goes through as usual.
      manager.perform('call-1');
      expect(handler.perform).toHaveBeenCalled();
    });
  });

  describe('answers exactly once', () => {
    it('drops a late outcome after the action was cancelled', async () => {
      const { handler, finish } = gestureHandler();
      manager.register(handler);
      manager.handle(envelope());
      const outcome = manager.perform('call-1');

      manager.cancelPending();
      finish({ status: 'completed', data: { answer: 42 } });

      await expect(outcome).resolves.toEqual({ status: 'cancelled' });
      expect(sent).toEqual([]);
    });

    it('drops a late outcome after the agent was torn down', async () => {
      const { handler, finish } = gestureHandler();
      manager.register(handler);
      manager.handle(envelope());
      const outcome = manager.perform('call-1');

      manager.clear();
      finish({ status: 'completed', data: { answer: 42 } });

      await expect(outcome).resolves.toEqual({ status: 'cancelled', reason: 'disconnected' });
      expect(sent).toEqual([]);
    });

    it('tells the host every action ended when the agent is torn down, sending nothing', () => {
      manager.register(gestureHandler().handler);
      manager.handle(envelope());
      updates = [];

      manager.clear();

      expect(updates).toEqual([
        { actionId: 'call-1', type: 'confirm_thing', lifecycle: 'cancelled', status: 'cancelled', reason: 'disconnected' },
      ]);
      expect(sent).toEqual([]);
      // Nothing left to act on: a click after the teardown is not a run.
      return expect(manager.perform('call-1')).resolves.toEqual({ status: 'failed', reason: 'not_pending' });
    });

    it('tells the host nothing more after a teardown, even when the run finishes later', async () => {
      const { handler, finish } = gestureHandler();
      manager.register(handler);
      manager.handle(envelope());
      const outcome = manager.perform('call-1');
      manager.clear();
      updates = [];

      finish({ status: 'completed', data: { answer: 42 } });
      await outcome;

      expect(updates).toEqual([]);
    });

    it('drops a silent attempt that finishes after the agent was torn down', async () => {
      let finish: (outcome: ClientActionOutcome | null) => void = () => {};
      const { handler } = gestureHandler({
        tryWithoutUser: () =>
          new Promise<ClientActionOutcome | null>((resolve) => {
            finish = resolve;
          }),
      });
      manager.register(handler);
      manager.handle(envelope());

      manager.clear();
      finish({ status: 'completed', data: { answer: 42 } });
      await Promise.resolve();
      await Promise.resolve();

      expect(sent).toEqual([]);
    });

    it('reports a second perform as the run already in flight', () => {
      const { handler } = gestureHandler();
      manager.register(handler);
      manager.handle(envelope());

      const first = manager.perform('call-1');
      const second = manager.perform('call-1');

      expect(second).toBe(first);
      expect(handler.perform).toHaveBeenCalledTimes(1);
    });

    it('turns a throwing handler into a failure rather than silence', async () => {
      manager.register(
        gestureHandler({
          perform: () => {
            throw new Error('boom');
          },
        }).handler,
      );
      manager.handle(envelope());

      await expect(manager.perform('call-1')).resolves.toEqual({ status: 'failed', reason: 'unknown' });
      expect(sent).toEqual([{ actionId: 'call-1', type: 'confirm_thing', status: 'failed', reason: 'unknown' }]);
    });

    it('says an action that is no longer pending cannot be performed', async () => {
      manager.register(gestureHandler().handler);

      await expect(manager.perform('never-sent')).resolves.toEqual({ status: 'failed', reason: 'not_pending' });
    });
  });

  describe('typing', () => {
    it('cancels the pending action without telling the server', () => {
      // The typed message reaches the server as the answer; a result on top would be a second one.
      manager.register(gestureHandler().handler);
      manager.handle(envelope());

      manager.cancelPending();

      expect(sent).toEqual([]);
      expect(updates.at(-1)).toMatchObject({ lifecycle: 'cancelled', status: 'cancelled' });
    });

    it('leaves a UI-only action alone', async () => {
      const { handler, ran } = uiOnlyHandler();
      manager.register(handler);
      manager.handle(envelope({ type: 'refresh_page', awaitsResult: false, payload: 'now' }));

      manager.cancelPending();
      await Promise.resolve();
      await Promise.resolve();

      expect(ran).toEqual(['now']);
    });
  });

  describe('a newer action', () => {
    it('supersedes the one the server was waiting on', () => {
      manager.register(gestureHandler().handler);
      manager.handle(envelope({ actionId: 'call-1' }));

      manager.handle(envelope({ actionId: 'call-2' }));

      expect(updates).toContainEqual(
        expect.objectContaining({ actionId: 'call-1', lifecycle: 'cancelled', status: 'superseded' }),
      );
      expect(sent).toEqual([]);
      // Only the newer one is still pending.
      manager.cancelPending();
      expect(updates.at(-1)).toMatchObject({ actionId: 'call-2', status: 'cancelled' });
    });
  });

  describe('expiry', () => {
    it('gives up shortly before the server does, and says so', () => {
      manager.register(gestureHandler().handler);
      manager.handle(envelope({ expiresAt: NOW + 60_000 }));

      vi.advanceTimersByTime(60_000 - CLIENT_ACTION_EXPIRY_MARGIN_MS - 1);
      expect(sent).toEqual([]);
      vi.advanceTimersByTime(1);

      expect(sent).toEqual([{ actionId: 'call-1', type: 'confirm_thing', status: 'timeout' }]);
      expect(updates.at(-1)).toMatchObject({ lifecycle: 'expired' });
    });

    it('expires an action that arrives already too late', () => {
      manager.register(gestureHandler().handler);

      manager.handle(envelope({ expiresAt: NOW + 1_000 }));

      expect(sent).toEqual([{ actionId: 'call-1', type: 'confirm_thing', status: 'timeout' }]);
      expect(actions).toEqual([]);
    });

    it('aborts the run in progress', () => {
      const seen: AbortSignal[] = [];
      manager.register(
        gestureHandler({
          perform: (_payload, context) => {
            seen.push(context.signal);
            return new Promise(() => {});
          },
        }).handler,
      );
      manager.handle(envelope({ expiresAt: NOW + 60_000 }));
      void manager.perform('call-1');

      vi.advanceTimersByTime(60_000);

      expect(seen[0].aborted).toBe(true);
    });
  });

  describe('a UI-only action', () => {
    it('runs on arrival and sends nothing back', async () => {
      const { handler, ran } = uiOnlyHandler();
      manager.register(handler);

      manager.handle(envelope({ type: 'refresh_page', awaitsResult: false, expiresAt: undefined, payload: 'now' }));
      await Promise.resolve();
      await Promise.resolve();

      expect(ran).toEqual(['now']);
      expect(sent).toEqual([]);
      expect(updates.at(-1)).toMatchObject({ actionId: 'call-1', lifecycle: 'completed' });
    });
  });

  it('reports handler progress to whatever renders the action', () => {
    manager.register(
      gestureHandler({
        perform: (_payload, context) => {
          context.progress('prompting');
          return new Promise(() => {});
        },
      }).handler,
    );
    manager.handle(envelope());

    void manager.perform('call-1');

    expect(updates.at(-1)).toMatchObject({ lifecycle: 'in_progress', progress: 'prompting' });
  });
});
