import type { OidcClientLike } from './ToolAuthorizationClient.js';
import type { ToolAuthorizationRequest } from './types.js';

/**
 * The `OidcClient` constructor, as `oidc-client-ts` exports it.
 *
 * Injected rather than imported so this module stays testable without the library resolved, and so
 * a host that already loads `oidc-client-ts` can hand in the copy it has instead of bundling a
 * second one.
 */
export type OidcClientConstructor = new (settings: Record<string, unknown>) => OidcClientLike;

const STATE_KEY_PREFIX = 'egain_aia_tool_pkce_state:';

/**
 * Where `oidc-client-ts` keeps a sign-in attempt's PKCE verifier and `state` between opening the
 * popup and processing the callback: `sessionStorage`, not the library's default `localStorage`.
 *
 * A completed attempt removes its entry, but one that is declined, closed, timed out or abandoned
 * for a typed message is never come back to. In `localStorage` that entry would outlive the tab: on
 * a shared machine, a lasting record of which providers someone started signing in to.
 * `sessionStorage` clears with the tab, the same boundary the token cache uses (`ToolTokenCache`).
 * Only the window that wrote an entry reads it back: the widget processes the callback itself, so
 * the popup never needs it.
 *
 * Shaped as the library's `StateStore` rather than built from its `WebStorageStateStore`, so it works
 * with whichever copy of the library a host injects.
 */
export const sessionStateStore = {
  async set(key: string, value: string): Promise<void> {
    sessionStorage.setItem(STATE_KEY_PREFIX + key, value);
  },
  async get(key: string): Promise<string | null> {
    return sessionStorage.getItem(STATE_KEY_PREFIX + key);
  },
  async remove(key: string): Promise<string | null> {
    const value = sessionStorage.getItem(STATE_KEY_PREFIX + key);
    sessionStorage.removeItem(STATE_KEY_PREFIX + key);
    return value;
  },
  async getAllKeys(): Promise<string[]> {
    const keys: string[] = [];
    for (let index = 0; index < sessionStorage.length; index++) {
      const key = sessionStorage.key(index);
      if (key?.startsWith(STATE_KEY_PREFIX)) {
        keys.push(key.slice(STATE_KEY_PREFIX.length));
      }
    }
    return keys;
  },
};

/**
 * Forget every unfinished sign-in attempt in this tab, for sign-out. An attempt's entry names the
 * provider it was for, and an exchange still waiting on one now fails instead of completing for
 * someone who has left.
 */
export function clearSignInAttempts(): void {
  try {
    const doomed: string[] = [];
    for (let index = 0; index < sessionStorage.length; index++) {
      const key = sessionStorage.key(index);
      if (key?.startsWith(STATE_KEY_PREFIX)) doomed.push(key);
    }
    doomed.forEach((key) => sessionStorage.removeItem(key));
  } catch {
    /* nothing to do */
  }
}

/**
 * Build an OIDC client for one credential.
 *
 * Two things here are deliberate and easy to get wrong.
 *
 * **Metadata is supplied, not discovered.** A stored credential gives us the authorize and token
 * endpoints directly; it does not promise the provider serves a `.well-known` document, and many
 * plain OAuth 2.0 providers do not. Handing the endpoints over as `metadata` skips discovery
 * entirely, which is also how the existing customer-widget integration configures it.
 *
 * **The scopes are used exactly as configured.** In particular `openid` is not added. The library
 * treats a response as OpenID only when the scope asks for it or an ID token comes back, so
 * leaving the scopes alone is what lets a plain OAuth 2.0 provider work at all -- adding `openid`
 * would make the library expect an ID token the provider never issues.
 */
export function makeOidcClientFactory(OidcClient: OidcClientConstructor) {
  return (request: ToolAuthorizationRequest): OidcClientLike =>
    new OidcClient({
      authority: originOf(request.authorizationUrl),
      client_id: request.clientId,
      redirect_uri: request.redirectUri,
      scope: request.scopes,
      response_type: 'code',
      // No client secret: that absence is the whole reason a PKCE exchange can happen in a
      // browser at all, and the library derives the verifier and challenge itself.
      loadUserInfo: false,
      stateStore: sessionStateStore,
      metadata: {
        issuer: originOf(request.authorizationUrl),
        authorization_endpoint: request.authorizationUrl,
        token_endpoint: request.tokenUrl,
      },
    });
}

function originOf(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}
