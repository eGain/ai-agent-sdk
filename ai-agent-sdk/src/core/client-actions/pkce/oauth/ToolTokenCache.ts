import type { CachedToolToken, ToolTokenSource } from './types.js';

/**
 * Per-tab cache of tokens the end user has authorized, one entry per {@link ToolTokenSource}.
 *
 * `sessionStorage` rather than `localStorage`, deliberately. It survives a new chat and a page
 * reload in the same tab -- which is what "returning user" means here -- and clears when the tab
 * closes. On a shared contact-center machine that boundary is doing real work: the next person to
 * open a tab starts clean rather than inheriting the last person's provider session.
 */
export class ToolTokenCache {
  private static readonly PREFIX = 'egain_aia_tool_pkce_auth:';

  /** Treat a token as expired this far ahead of its real expiry, to cover clock skew and flight time. */
  private static readonly SKEW_MS = 60_000;

  /**
   * Counts {@link clearAll} calls in this tab. Static because sign-out clears through a cache of its
   * own (`AiAgent.clearClientActionCredentials`), not the one a sign-in in flight is holding.
   */
  private static clears = 0;

  /**
   * Read before asking the provider for a token, and hand it to {@link set}: a token that arrives
   * after a sign-out then belongs to someone who has left, and is not written back.
   */
  static generation(): number {
    return ToolTokenCache.clears;
  }

  /**
   * The storage key for `source`. Every field of it is in the key: a credential edited in Studio to
   * request more permissions must not be satisfied by a narrower token issued before the change, nor
   * one repointed at another provider app by a token that app never issued. Scope order does not
   * count. Public so a refresh in flight can be shared under exactly the same identity.
   */
  static keyFor(source: ToolTokenSource): string {
    const normalizedScopes = source.scopes.trim().split(/\s+/).filter(Boolean).sort().join(' ');
    // JSON rather than a separator: URLs and client ids may contain any separator we would pick.
    return `${ToolTokenCache.PREFIX}${JSON.stringify([
      source.credentialId,
      source.clientId,
      source.tokenUrl,
      source.authorizationUrl,
      normalizedScopes,
    ])}`;
  }

  /**
   * The usable token for this credential, or `null`.
   *
   * Returns `null` for an expired access token even when a refresh token is present -- refreshing
   * is the caller's decision, not a side effect of a read. Use {@link peek} to see the entry
   * regardless of expiry.
   */
  get(source: ToolTokenSource): CachedToolToken | null {
    const entry = this.peek(source);
    if (!entry) return null;
    return entry.expiresAt - ToolTokenCache.SKEW_MS > Date.now() ? entry : null;
  }

  /** The stored entry whether or not it has expired, for the refresh path. */
  peek(source: ToolTokenSource): CachedToolToken | null {
    try {
      const raw = sessionStorage.getItem(ToolTokenCache.keyFor(source));
      return raw ? (JSON.parse(raw) as CachedToolToken) : null;
    } catch {
      // Private browsing, disabled storage, or a corrupt entry. A cache miss is always a safe
      // answer -- it costs the person one sign-in, where throwing would break the conversation.
      return null;
    }
  }

  /** Store `token`, unless `generation` (from {@link generation}) predates a {@link clearAll}. */
  set(source: ToolTokenSource, token: CachedToolToken, generation?: number): void {
    if (generation !== undefined && generation !== ToolTokenCache.clears) return;
    try {
      sessionStorage.setItem(ToolTokenCache.keyFor(source), JSON.stringify(token));
    } catch {
      // Storage full or unavailable: the flow still works, it just cannot be skipped next time.
    }
  }

  remove(source: ToolTokenSource): void {
    try {
      sessionStorage.removeItem(ToolTokenCache.keyFor(source));
    } catch {
      /* nothing to do */
    }
  }

  /** Drop every tool token in this tab. For sign-out, or handing the machine to someone else. */
  clearAll(): void {
    ToolTokenCache.clears += 1;
    try {
      const doomed: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(ToolTokenCache.PREFIX)) doomed.push(key);
      }
      doomed.forEach((key) => sessionStorage.removeItem(key));
    } catch {
      /* nothing to do */
    }
  }
}
