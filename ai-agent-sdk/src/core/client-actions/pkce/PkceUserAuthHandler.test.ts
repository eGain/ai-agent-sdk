import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installFakeDom } from './oauth/test-dom';
import type { OidcClientLike } from './oauth/ToolAuthorizationClient';
import { ToolTokenCache } from './oauth/ToolTokenCache';
import type { ClientActionContext } from '../types';
import { createPkceUserAuthHandler, PKCE_USER_AUTH_ACTION_TYPE, type PkceUserAuthPayload } from './PkceUserAuthHandler';

const PAYLOAD: PkceUserAuthPayload = {
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

function fakeOidc(): OidcClientLike {
  return {
    createSigninRequest: vi.fn(async () => ({ url: 'https://login.acme.com/authorize?x=1', state: { id: STATE_ID } })),
    processSigninResponse: vi.fn(async () => ({
      access_token: 'FRESH-TOKEN',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    })),
    useRefreshToken: vi.fn(async () => {
      throw new Error('no refresh token');
    }),
  };
}

describe('createPkceUserAuthHandler', () => {
  let dom: ReturnType<typeof installFakeDom>;
  let oidc: OidcClientLike;
  let progress: string[];

  const handler = () =>
    createPkceUserAuthHandler({
      // A constructor stand-in: `new` on a function returning an object yields that object.
      oidcClient: function FakeOidcClient() {
        return oidc;
      } as never,
    });

  const context = (overrides: Partial<ClientActionContext> = {}): ClientActionContext => ({
    actionId: 'call-1',
    signal: new AbortController().signal,
    progress: (detail) => progress.push(detail),
    ...overrides,
  });

  const deliverCallback = () =>
    setTimeout(
      () =>
        dom.window.post({
          origin: 'https://tenant1.egain.cloud',
          data: { source: 'egain-tool-auth', url: 'https://tenant1.egain.cloud/oauth/callback?code=C', state: STATE_ID },
        } as never),
      5,
    );

  beforeEach(() => {
    dom = installFakeDom();
    oidc = fakeOidc();
    progress = [];
  });

  afterEach(() => dom.restore());

  it('is the pkce_user_auth action, and needs a click', () => {
    const h = handler();

    expect(h.type).toBe(PKCE_USER_AUTH_ACTION_TYPE);
    expect(h.interaction).toBe('user-gesture');
  });

  describe('parse', () => {
    it('keeps the fields the authorization needs', () => {
      expect(handler().parse({ ...PAYLOAD, extra: 'ignored' })).toEqual(PAYLOAD);
    });

    it('refuses a payload missing an endpoint, since there is nothing to run', () => {
      expect(handler().parse({ ...PAYLOAD, tokenUrl: undefined })).toBeNull();
      expect(handler().parse(null)).toBeNull();
      expect(handler().parse('nope')).toBeNull();
    });

    it('refuses an endpoint that is not an absolute https: URL', () => {
      for (const field of ['authorizationUrl', 'tokenUrl', 'redirectUri'] as const) {
        for (const url of ['javascript:alert(1)', 'http://login.acme.com/authorize', '/authorize']) {
          expect(handler().parse({ ...PAYLOAD, [field]: url })).toBeNull();
        }
      }
    });
  });

  describe('without the person', () => {
    it('finishes from a token cached by an earlier sign-in', async () => {
      new ToolTokenCache().set(PAYLOAD, {
        accessToken: 'CACHED',
        expiresAt: Date.now() + 3_600_000,
        scopes: 'openid profile',
      });

      await expect(handler().tryWithoutUser!(PAYLOAD, context())).resolves.toEqual({
        status: 'completed',
        data: { accessToken: 'CACHED' },
      });
      expect(progress).toEqual(['cached']);
    });

    it('needs the person when there is nothing to reuse', async () => {
      await expect(handler().tryWithoutUser!(PAYLOAD, context())).resolves.toBeNull();
    });
  });

  describe('perform', () => {
    it('opens the popup before anything is awaited', async () => {
      const open = vi.spyOn(dom.window, 'open');
      const controller = new AbortController();

      const outcome = handler().perform(PAYLOAD, context({ signal: controller.signal }));

      // Inside the call itself, while the click would still be live.
      expect(open).toHaveBeenCalledTimes(1);
      controller.abort();
      await outcome;
    });

    it('sends the token back under the key the server redacts', async () => {
      deliverCallback();

      await expect(handler().perform(PAYLOAD, context())).resolves.toEqual({
        status: 'completed',
        data: { accessToken: 'FRESH-TOKEN' },
      });
      expect(progress).toEqual(['prompting', 'waiting', 'authorized']);
    });

    it('reports a blocked popup as a failure with its reason', async () => {
      dom.restore();
      dom = installFakeDom({ popupBlocked: true });

      await expect(handler().perform(PAYLOAD, context())).resolves.toEqual({
        status: 'failed',
        reason: 'popup_blocked',
      });
    });

    it('reports a closed popup as a decline', async () => {
      const outcome = handler().perform(PAYLOAD, context());
      setTimeout(() => dom.popup.close(), 5);

      await expect(outcome).resolves.toEqual({ status: 'declined' });
    });

    it('stops when the server does', async () => {
      // An expiry 50ms away: the popup gives up then, rather than after its own three minutes.
      await expect(handler().perform(PAYLOAD, context({ expiresAt: Date.now() + 50 }))).resolves.toEqual({
        status: 'timeout',
      });
    });

    it('closes the popup when the action is cancelled', async () => {
      const controller = new AbortController();
      const outcome = handler().perform(PAYLOAD, context({ signal: controller.signal }));

      controller.abort();

      expect(dom.popup.closed).toBe(true);
      await outcome;
    });
  });
});
