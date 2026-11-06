import { AuthorizationPopup } from './AuthorizationPopup.js';
import { ToolTokenCache } from './ToolTokenCache.js';
import type {
  ToolAuthorizationPhase,
  ToolAuthorizationRequest,
  ToolAuthorizationResult,
} from './types.js';

/**
 * The subset of `oidc-client-ts`'s `OidcClient` this module uses.
 *
 * Declared structurally rather than imported as a type so the SDK stays buildable and testable
 * without the library resolved, and so the seam is small enough to see: we hand it settings, it
 * gives us an authorize URL, and it turns a callback URL into tokens.
 */
export interface OidcClientLike {
  createSigninRequest(args: Record<string, unknown>): Promise<{ url: string; state: { id: string } }>;
  processSigninResponse(url: string): Promise<{
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
  }>;
  useRefreshToken(args: {
    state: { refresh_token: string; session_state?: string | null; scope?: string; profile?: unknown };
  }): Promise<{ access_token: string; refresh_token?: string; expires_at?: number }>;
}

export type OidcClientFactory = (request: ToolAuthorizationRequest) => OidcClientLike;

/**
 * Runs one tool authorization to completion and reports the outcome.
 *
 * The order matters more than any single step. A returning person should not be asked to sign in
 * again for a token we already hold, and someone whose access token has merely aged out should not
 * be asked either -- so the cache is tried first, then a silent refresh, and only then the card.
 * That ordering is what turns fourteen edge cases into one code path.
 */
export class ToolAuthorizationClient {
  private readonly cache: ToolTokenCache;
  private readonly createOidcClient: OidcClientFactory;
  private readonly timeoutMs?: number;
  private readonly onPhase?: (phase: ToolAuthorizationPhase, request: ToolAuthorizationRequest) => void;

  /** In-flight refreshes by `ToolTokenCache.keyFor`, so concurrent calls share one exchange. */
  private readonly refreshesInFlight = new Map<string, Promise<string | null>>();

  constructor(options: {
    createOidcClient: OidcClientFactory;
    cache?: ToolTokenCache;
    timeoutMs?: number;
    onPhase?: (phase: ToolAuthorizationPhase, request: ToolAuthorizationRequest) => void;
  }) {
    this.createOidcClient = options.createOidcClient;
    this.cache = options.cache ?? new ToolTokenCache();
    this.timeoutMs = options.timeoutMs;
    this.onPhase = options.onPhase;
  }

  /**
   * Try to satisfy the request without involving the person at all.
   *
   * Returns a result when a cached or refreshed token covers it, and `null` when the only way
   * forward is to ask -- at which point the caller shows the card and waits for a click before
   * calling {@link authorizeInteractive}.
   *
   * The split is not cosmetic. A popup may only be opened while a user gesture is being handled,
   * and both steps here are asynchronous, so anything awaited before `window.open` loses the
   * window. Separating them also matches what the person sees: the silent paths are a brief pill,
   * and the card only appears once there is genuinely a decision to make.
   */
  async resolveSilently(request: ToolAuthorizationRequest): Promise<ToolAuthorizationResult | null> {
    const cached = this.cache.get(request);
    if (cached) {
      this.onPhase?.('cached', request);
      return { toolCallId: request.toolCallId, accessToken: cached.accessToken };
    }

    const refreshed = await this.tryRefresh(request);
    if (refreshed) {
      return { toolCallId: request.toolCallId, accessToken: refreshed };
    }

    return null;
  }

  /**
   * Run the full authorization, opening a popup.
   *
   * **Must be called synchronously from the click that triggered it.** The window is opened before
   * anything is awaited, for the reason given on {@link AuthorizationPopup.open}.
   *
   * `timeoutMs` overrides the client-wide timeout for this one run -- the server says how long it
   * will wait, and there is no point in the popup outliving that. Aborting `signal` closes the
   * popup; whatever the run then reports is the caller's to ignore.
   */
  async authorizeInteractive(
    request: ToolAuthorizationRequest,
    options: { timeoutMs?: number; signal?: AbortSignal } = {},
  ): Promise<ToolAuthorizationResult> {
    // First statement in the method, deliberately: everything else can wait, this cannot.
    const popup = AuthorizationPopup.open({
      redirectUri: request.redirectUri,
      timeoutMs: options.timeoutMs ?? this.timeoutMs,
    });
    if (!popup) {
      this.onPhase?.('failed', request);
      return { toolCallId: request.toolCallId, failureReason: 'popup_blocked' };
    }
    options.signal?.addEventListener('abort', () => popup.close(), { once: true });
    return this.promptAndExchange(request, popup);
  }

  /**
   * Trade a stored refresh token for a new access token, if there is one.
   *
   * Single-flight per cached token. Two tool calls resuming together would otherwise both refresh,
   * and against a provider that rotates refresh tokens on use the second exchange invalidates the
   * first -- producing a sign-out that looks random and reproduces only under concurrency. Keyed
   * like the cache (`ToolTokenCache.keyFor`), so two requests share a refresh only when they would
   * share its token.
   */
  private async tryRefresh(request: ToolAuthorizationRequest): Promise<string | null> {
    const stored = this.cache.peek(request);
    if (!stored?.refreshToken) return null;

    const key = ToolTokenCache.keyFor(request);
    const inFlight = this.refreshesInFlight.get(key);
    if (inFlight) return inFlight;

    this.onPhase?.('refreshing', request);
    const generation = ToolTokenCache.generation();
    const attempt = (async (): Promise<string | null> => {
      try {
        const response = await this.createOidcClient(request).useRefreshToken({
          state: { refresh_token: stored.refreshToken as string, scope: request.scopes },
        });
        // Many providers (Google among them) do not rotate the refresh token, and send none back.
        this.store(request, response, generation, stored.refreshToken);
        return response.access_token;
      } catch {
        // An expired or revoked refresh token is an ordinary outcome, not an error: fall through
        // and ask the person to sign in again.
        this.cache.remove(request);
        return null;
      } finally {
        this.refreshesInFlight.delete(key);
      }
    })();

    this.refreshesInFlight.set(key, attempt);
    return attempt;
  }

  private async promptAndExchange(
    request: ToolAuthorizationRequest,
    popup: AuthorizationPopup,
  ): Promise<ToolAuthorizationResult> {
    const generation = ToolTokenCache.generation();
    const client = this.createOidcClient(request);
    let signinRequest: { url: string; state: { id: string } };
    try {
      signinRequest = await client.createSigninRequest({
        redirect_uri: request.redirectUri,
        scope: request.scopes,
        response_type: 'code',
        // The provider keeps its own login session in a cookie on its domain, which closing the tab
        // does not clear. Without this, the next person at a shared machine who clicks "Sign in" is
        // signed in as the previous one without typing anything. The silent paths never reach here,
        // so only a new tab, or a token that can no longer be refreshed, asks again.
        prompt: 'login',
      });
    } catch {
      popup.close();
      this.onPhase?.('failed', request);
      return { toolCallId: request.toolCallId, failureReason: 'exchange_failed' };
    }

    this.onPhase?.('prompting', request);
    popup.navigate(signinRequest.url);
    const outcome = await popup.awaitCallback(signinRequest.state.id);

    if (!outcome.callbackUrl) {
      this.onPhase?.('failed', request);
      return { toolCallId: request.toolCallId, failureReason: outcome.failureReason ?? 'unknown' };
    }

    this.onPhase?.('waiting', request);
    try {
      // The library verifies `state` and performs the PKCE exchange with the verifier it stored
      // when it built the request. We never see the verifier, which is the point of using it.
      const response = await client.processSigninResponse(outcome.callbackUrl);
      this.store(request, response, generation);
      this.onPhase?.('authorized', request);
      return { toolCallId: request.toolCallId, accessToken: response.access_token };
    } catch {
      this.onPhase?.('failed', request);
      return { toolCallId: request.toolCallId, failureReason: 'exchange_failed' };
    }
  }

  /**
   * Cache what the provider returned. `generation` is the cache's when the request started: a
   * sign-out while it was in flight means the person it was for has gone, so nothing is stored.
   */
  private store(
    request: ToolAuthorizationRequest,
    response: { access_token: string; refresh_token?: string; expires_at?: number },
    generation: number,
    previousRefreshToken?: string,
  ): void {
    this.cache.set(
      request,
      {
        accessToken: response.access_token,
        refreshToken: response.refresh_token ?? previousRefreshToken,
        // `expires_at` is seconds since epoch. Providers may omit it; a short assumed life is safer
        // than an unbounded one, because a stale token fails the call rather than the sign-in.
        expiresAt: response.expires_at ? response.expires_at * 1000 : Date.now() + 300_000,
        scopes: request.scopes,
      },
      generation,
    );
  }
}
