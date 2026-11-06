import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { OidcClient } from 'oidc-client-ts';
import { clearSignInAttempts, makeOidcClientFactory, sessionStateStore } from './createOidcClient';
import { FakeSessionStorage } from './test-dom';
import type { ToolAuthorizationRequest } from './types';

const REQUEST: ToolAuthorizationRequest = {
  toolCallId: 'call-1',
  credentialId: 'cred-9',
  authorizationUrl: 'https://login.acme.com/oauth2/v1/authorize',
  tokenUrl: 'https://login.acme.com/oauth2/v1/token',
  clientId: 'client-3x9k',
  redirectUri: 'https://tenant1.egain.cloud/oauth/callback',
  scopes: 'read:bookings write:bookings',
  serviceName: 'Acme',
  toolPurpose: 'look up your booking',
};

/** Captures the settings the factory would hand to the real constructor. */
function capture(request = REQUEST): Record<string, any> {
  let settings: Record<string, any> = {};
  const Fake = function (this: unknown, s: Record<string, unknown>) {
    settings = s;
  } as unknown as new (s: Record<string, unknown>) => never;
  makeOidcClientFactory(Fake)(request);
  return settings;
}

describe('makeOidcClientFactory', () => {
  it('supplies the endpoints instead of relying on discovery', () => {
    // A stored credential gives us the endpoints directly and promises nothing about a
    // .well-known document, which many plain OAuth 2.0 providers do not serve.
    const settings = capture();

    expect(settings.metadata).toEqual({
      issuer: 'https://login.acme.com',
      authorization_endpoint: 'https://login.acme.com/oauth2/v1/authorize',
      token_endpoint: 'https://login.acme.com/oauth2/v1/token',
    });
  });

  it('passes the configured scopes through untouched', () => {
    // Adding `openid` would flip the library into OpenID mode and make it expect an ID token this
    // provider never issues -- turning a working plain-OAuth2 credential into a broken one.
    const settings = capture();

    expect(settings.scope).toBe('read:bookings write:bookings');
    expect(settings.scope).not.toContain('openid');
  });

  it('leaves an OIDC credential exactly as configured too', () => {
    const settings = capture({ ...REQUEST, scopes: 'openid profile' });

    expect(settings.scope).toBe('openid profile');
  });

  it('never carries a client secret', () => {
    // Its absence is the entire reason this exchange may happen in a browser.
    const settings = capture();

    expect(settings).not.toHaveProperty('client_secret');
    expect(settings.client_id).toBe('client-3x9k');
    expect(settings.response_type).toBe('code');
  });

  it('uses the redirect uri the credential was registered with', () => {
    expect(capture().redirect_uri).toBe('https://tenant1.egain.cloud/oauth/callback');
  });
});

describe('where a sign-in attempt keeps its state', () => {
  const globals = globalThis as unknown as Record<string, unknown>;
  let session: FakeSessionStorage;
  let local: FakeSessionStorage;
  let previous: { sessionStorage: unknown; localStorage: unknown };

  beforeEach(() => {
    previous = { sessionStorage: globals.sessionStorage, localStorage: globals.localStorage };
    session = new FakeSessionStorage();
    local = new FakeSessionStorage();
    globals.sessionStorage = session;
    globals.localStorage = local;
  });

  afterEach(() => {
    globals.sessionStorage = previous.sessionStorage;
    globals.localStorage = previous.localStorage;
  });

  it('is handed to the library as its state store', () => {
    expect(capture().stateStore).toBe(sessionStateStore);
  });

  it('writes the real library\'s attempt state to sessionStorage, never localStorage', async () => {
    // An attempt that is declined, closed or times out is never come back to, so its entry stays
    // wherever it was written. In localStorage that would outlive the tab; here it goes with it.
    const client = makeOidcClientFactory(OidcClient as unknown as Parameters<typeof makeOidcClientFactory>[0])(REQUEST);

    const signin = await client.createSigninRequest({});

    expect(local.length).toBe(0);
    expect(session.length).toBe(1);
    const stored = JSON.parse(session.getItem(`egain_aia_tool_pkce_state:${signin.state.id}`) as string);
    expect(stored.code_verifier).toEqual(expect.any(String));
  });

  it('reads back, lists and removes only its own entries', async () => {
    session.setItem('egain_aia_tool_pkce_auth:cred-9:openid', 'a cached token');

    await sessionStateStore.set('attempt-1', '{"id":"attempt-1"}');

    expect(await sessionStateStore.get('attempt-1')).toBe('{"id":"attempt-1"}');
    expect(await sessionStateStore.getAllKeys()).toEqual(['attempt-1']);
    expect(await sessionStateStore.remove('attempt-1')).toBe('{"id":"attempt-1"}');
    expect(await sessionStateStore.get('attempt-1')).toBeNull();
    // The token cache shares this storage and is not the library's to list or remove.
    expect(session.getItem('egain_aia_tool_pkce_auth:cred-9:openid')).toBe('a cached token');
  });

  it('forgets every unfinished attempt on sign-out, and nothing else', async () => {
    session.setItem('unrelated', 'kept');
    await sessionStateStore.set('attempt-1', '{"id":"attempt-1"}');
    await sessionStateStore.set('attempt-2', '{"id":"attempt-2"}');

    clearSignInAttempts();

    expect(await sessionStateStore.getAllKeys()).toEqual([]);
    expect(session.getItem('unrelated')).toBe('kept');
  });
});
