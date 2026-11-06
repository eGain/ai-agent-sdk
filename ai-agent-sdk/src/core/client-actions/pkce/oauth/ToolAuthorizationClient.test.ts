import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installFakeDom } from './test-dom';
import { ToolAuthorizationClient, type OidcClientLike } from './ToolAuthorizationClient';
import { ToolTokenCache } from './ToolTokenCache';
import type { ToolAuthorizationRequest } from './types';

const REQUEST: ToolAuthorizationRequest = {
  toolCallId: 'call-1',
  credentialId: 'cred-9',
  authorizationUrl: 'https://login.acme.com/authorize',
  tokenUrl: 'https://login.acme.com/oauth/token',
  clientId: 'client-3x9k',
  redirectUri: 'https://tenant1.egain.cloud/oauth/callback',
  scopes: 'openid profile',
  serviceName: 'Acme',
  toolPurpose: 'look up your booking',
};

const STATE_ID = 'state-abc';

function fakeOidc(overrides: Partial<OidcClientLike> = {}): OidcClientLike {
  return {
    createSigninRequest: vi.fn(async () => ({
      url: 'https://login.acme.com/authorize?code_challenge=xyz',
      state: { id: STATE_ID },
    })),
    processSigninResponse: vi.fn(async () => ({
      access_token: 'FRESH-TOKEN',
      refresh_token: 'REFRESH',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    })),
    useRefreshToken: vi.fn(async () => ({
      access_token: 'REFRESHED-TOKEN',
      refresh_token: 'REFRESH-2',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    })),
    ...overrides,
  };
}

describe('ToolAuthorizationClient', () => {
  let dom: ReturnType<typeof installFakeDom>;
  let cache: ToolTokenCache;

  beforeEach(() => {
    dom = installFakeDom();
    cache = new ToolTokenCache();
  });

  afterEach(() => dom.restore());

  const client = (oidc: OidcClientLike, phases?: string[], timeoutMs = 50) =>
    new ToolAuthorizationClient({
      createOidcClient: () => oidc,
      cache,
      timeoutMs,
      onPhase: phases ? (phase) => phases.push(phase) : undefined,
    });

  /** Drive the popup to success by delivering the callback the bridge is waiting for. */
  const deliverCallback = () =>
    setTimeout(
      () =>
        dom.window.post({
          origin: 'https://tenant1.egain.cloud',
          data: {
            source: 'egain-tool-auth',
            url: 'https://tenant1.egain.cloud/oauth/callback?code=CODE',
            state: STATE_ID,
          },
        } as never),
      5,
    );

  it('uses a cached token without troubling the person', async () => {
    // Edge case 9: already authorized in this chat -- no card, no pill, the tool just runs.
    cache.set(REQUEST, {
      accessToken: 'CACHED',
      expiresAt: Date.now() + 3_600_000,
      scopes: 'openid profile',
    });
    const oidc = fakeOidc();

    const result = await client(oidc).resolveSilently(REQUEST);

    expect(result).toEqual({ toolCallId: 'call-1', accessToken: 'CACHED' });
    expect(oidc.createSigninRequest).not.toHaveBeenCalled();
  });

  it('refreshes silently rather than showing a card again', async () => {
    // Edge case 4: access expired, refresh works -- nothing user-visible beyond a brief pill.
    cache.set(REQUEST, {
      accessToken: 'STALE',
      refreshToken: 'REFRESH',
      expiresAt: Date.now() - 1000,
      scopes: 'openid profile',
    });
    const oidc = fakeOidc();

    const result = await client(oidc).resolveSilently(REQUEST);

    expect(result).toEqual({ toolCallId: 'call-1', accessToken: 'REFRESHED-TOKEN' });
    expect(oidc.createSigninRequest).not.toHaveBeenCalled();
  });

  it('keeps the refresh token when the provider does not send a new one', async () => {
    cache.set(REQUEST, {
      accessToken: 'STALE',
      refreshToken: 'REFRESH',
      expiresAt: Date.now() - 1000,
      scopes: 'openid profile',
    });
    const oidc = fakeOidc({
      useRefreshToken: vi.fn(async () => ({
        access_token: 'REFRESHED-TOKEN',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      })),
    });

    await client(oidc).resolveSilently(REQUEST);

    expect(cache.peek(REQUEST)?.refreshToken).toBe('REFRESH');
  });

  it('stores the new refresh token when the provider rotates it', async () => {
    cache.set(REQUEST, {
      accessToken: 'STALE',
      refreshToken: 'REFRESH',
      expiresAt: Date.now() - 1000,
      scopes: 'openid profile',
    });

    await client(fakeOidc()).resolveSilently(REQUEST);

    expect(cache.peek(REQUEST)?.refreshToken).toBe('REFRESH-2');
  });

  it('falls back to the card when the refresh token is no longer good', async () => {
    // Edge case 5: refresh impossible -- the full card returns.
    cache.set(REQUEST, {
      accessToken: 'STALE',
      refreshToken: 'REVOKED',
      expiresAt: Date.now() - 1000,
      scopes: 'openid profile',
    });
    const oidc = fakeOidc({
      useRefreshToken: vi.fn(async () => {
        throw new Error('invalid_grant');
      }),
    });
    deliverCallback();

    const result = await client(oidc).authorizeInteractive(REQUEST);

    expect(result).toEqual({ toolCallId: 'call-1', accessToken: 'FRESH-TOKEN' });
  });

  it('refreshes once when two calls need the same credential at the same time', async () => {
    // The bug this prevents: against a provider that rotates refresh tokens on use, the second
    // exchange invalidates the first. It looks like a random sign-out and only reproduces
    // under concurrency.
    cache.set(REQUEST, {
      accessToken: 'STALE',
      refreshToken: 'REFRESH',
      expiresAt: Date.now() - 1000,
      scopes: 'openid profile',
    });
    const oidc = fakeOidc();
    const subject = client(oidc);

    const [first, second] = await Promise.all([
      subject.resolveSilently(REQUEST),
      subject.resolveSilently({ ...REQUEST, toolCallId: 'call-2' }),
    ]);

    expect(oidc.useRefreshToken).toHaveBeenCalledTimes(1);
    expect(first?.accessToken).toBe('REFRESHED-TOKEN');
    expect(second?.accessToken).toBe('REFRESHED-TOKEN');
  });

  it('does not share a refresh between two requests for different scopes', async () => {
    // Same credential, but each is its own cached token: sharing would hand the second request a
    // token issued for the first one's scopes.
    const wider = { ...REQUEST, toolCallId: 'call-2', scopes: 'openid profile email' };
    for (const request of [REQUEST, wider]) {
      cache.set(request, {
        accessToken: 'STALE',
        refreshToken: 'REFRESH',
        expiresAt: Date.now() - 1000,
        scopes: request.scopes,
      });
    }
    const useRefreshToken = vi.fn(async (args: { state: { scope?: string } }) => ({
      access_token: `REFRESHED:${args.state.scope}`,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    }));
    const subject = client(fakeOidc({ useRefreshToken }));

    const [first, second] = await Promise.all([subject.resolveSilently(REQUEST), subject.resolveSilently(wider)]);

    expect(useRefreshToken).toHaveBeenCalledTimes(2);
    expect(first?.accessToken).toBe('REFRESHED:openid profile');
    expect(second?.accessToken).toBe('REFRESHED:openid profile email');
  });

  it('asks again when the credential was repointed at another provider app', async () => {
    // The token from the old app would be sent without a card, and the new app's API would reject
    // it on every question until it expired.
    cache.set(REQUEST, { accessToken: 'OLD-APP-TOKEN', expiresAt: Date.now() + 3_600_000, scopes: 'openid profile' });

    const result = await client(fakeOidc()).resolveSilently({ ...REQUEST, clientId: 'client-prod' });

    expect(result).toBeNull();
  });

  it('does not write a refreshed token back after a sign-out during the refresh', async () => {
    // Sign-out clears through a cache of its own (AiAgent.clearClientActionCredentials), so this
    // does too: the refresh in flight must notice a clear it did not make.
    cache.set(REQUEST, {
      accessToken: 'STALE',
      refreshToken: 'REFRESH',
      expiresAt: Date.now() - 1000,
      scopes: 'openid profile',
    });
    const oidc = fakeOidc({
      useRefreshToken: vi.fn(async () => {
        new ToolTokenCache().clearAll();
        return {
          access_token: 'REFRESHED-TOKEN',
          refresh_token: 'REFRESH-2',
          expires_at: Math.floor(Date.now() / 1000) + 3600,
        };
      }),
    });

    await client(oidc).resolveSilently(REQUEST);

    expect(cache.peek(REQUEST)).toBeNull();
  });

  it('does not cache a sign-in whose exchange finishes after a sign-out', async () => {
    const oidc = fakeOidc({
      processSigninResponse: vi.fn(async () => {
        new ToolTokenCache().clearAll();
        return {
          access_token: 'FRESH-TOKEN',
          refresh_token: 'REFRESH',
          expires_at: Math.floor(Date.now() / 1000) + 3600,
        };
      }),
    });
    deliverCallback();

    await client(oidc).authorizeInteractive(REQUEST);

    expect(cache.peek(REQUEST)).toBeNull();
  });

  it('caches again once a sign-in starts after the sign-out', async () => {
    new ToolTokenCache().clearAll();
    deliverCallback();

    await client(fakeOidc()).authorizeInteractive(REQUEST);

    expect(cache.get(REQUEST)?.accessToken).toBe('FRESH-TOKEN');
  });

  it('prompts and exchanges when nothing is cached', async () => {
    const oidc = fakeOidc();
    deliverCallback();

    const result = await client(oidc).authorizeInteractive(REQUEST);

    expect(result).toEqual({ toolCallId: 'call-1', accessToken: 'FRESH-TOKEN' });
    expect(oidc.processSigninResponse).toHaveBeenCalledWith(
      'https://tenant1.egain.cloud/oauth/callback?code=CODE',
    );
  });

  it('asks the provider for credentials even when it still has a login session', async () => {
    // The provider's session cookie outlives the tab, so without prompt=login a shared machine
    // signs the next person in as the previous one.
    const oidc = fakeOidc();
    deliverCallback();

    await client(oidc).authorizeInteractive(REQUEST);

    expect(oidc.createSigninRequest).toHaveBeenCalledWith(expect.objectContaining({ prompt: 'login' }));
  });

  it('caches what it just obtained so the next call is silent', async () => {
    deliverCallback();
    await client(fakeOidc()).authorizeInteractive(REQUEST);

    expect(cache.get(REQUEST)?.accessToken).toBe('FRESH-TOKEN');
  });

  it('reports a decline as a result rather than throwing', async () => {
    // Edge case 6: the tool call is still open, so something must answer it either way.
    const oidc = fakeOidc();
    setTimeout(() => (dom.popup.closed = true), 5);

    // Timeout set above the 500ms closed-poll on purpose. In production that relationship holds
    // by a wide margin (500ms against three minutes); inverting it here would report a timeout
    // for someone who actually declined, and the two are meant to read differently to the user.
    const result = await client(oidc, undefined, 2_000).authorizeInteractive(REQUEST);

    expect(result).toEqual({ toolCallId: 'call-1', failureReason: 'declined' });
  });

  it('reports a failed exchange without losing the tool call id', async () => {
    const oidc = fakeOidc({
      processSigninResponse: vi.fn(async () => {
        throw new Error('bad_verifier');
      }),
    });
    deliverCallback();

    const result = await client(oidc).authorizeInteractive(REQUEST);

    expect(result).toEqual({ toolCallId: 'call-1', failureReason: 'exchange_failed' });
  });

  it('announces the phases the card renders from', async () => {
    const phases: string[] = [];
    deliverCallback();
    await client(fakeOidc(), phases).authorizeInteractive(REQUEST);

    expect(phases).toEqual(['prompting', 'waiting', 'authorized']);
  });

  it('announces a cache hit distinctly, so no card is shown for it', async () => {
    cache.set(REQUEST, {
      accessToken: 'CACHED',
      expiresAt: Date.now() + 3_600_000,
      scopes: 'openid profile',
    });
    const phases: string[] = [];

    await client(fakeOidc(), phases).resolveSilently(REQUEST);

    expect(phases).toEqual(['cached']);
  });
});

describe('ToolAuthorizationClient popup gesture', () => {
  let dom: ReturnType<typeof installFakeDom>;

  afterEach(() => dom.restore());

  it('opens the window before awaiting anything', async () => {
    // Browsers allow window.open only while a user gesture is being handled, and refuse it once
    // anything has been awaited. Building the authorize URL is async (deriving the PKCE
    // challenge), so opening after it loses the popup in Safari and Firefox -- silently, and only
    // in those browsers. Assert the ordering rather than trusting it.
    dom = installFakeDom();
    let openedWhileGestureAlive = false;
    const originalOpen = dom.window.open;
    dom.window.open = (...args) => {
      openedWhileGestureAlive = !dom.gestureSpent();
      return originalOpen(...args);
    };

    const client = new ToolAuthorizationClient({
      createOidcClient: () => fakeOidc(),
      cache: new ToolTokenCache(),
      timeoutMs: 20,
    });
    await client.authorizeInteractive(REQUEST);

    expect(openedWhileGestureAlive).toBe(true);
  });

  it('never opens a window on the silent path', async () => {
    // A cached or refreshable token must not flash a popup: those states are a pill, not a card.
    dom = installFakeDom();
    let opens = 0;
    dom.window.open = () => {
      opens += 1;
      return dom.popup;
    };
    const cache = new ToolTokenCache();
    cache.set(REQUEST, {
      accessToken: 'CACHED',
      expiresAt: Date.now() + 3_600_000,
      scopes: 'openid profile',
    });

    await new ToolAuthorizationClient({
      createOidcClient: () => fakeOidc(),
      cache,
    }).resolveSilently(REQUEST);

    expect(opens).toBe(0);
  });
});
