import type { ToolAuthorizationFailure } from './types.js';

/**
 * The `source` a PKCE callback page must put on the message it posts back to the widget.
 *
 * Exported because the page is not part of the SDK: eGain's is a static file in cc-widget
 * (`public/oauth-callback.html`), which cannot import this, so the widget's test of that page
 * asserts against this constant instead of repeating the string.
 */
export const PKCE_CALLBACK_MESSAGE_SOURCE = 'egain-tool-auth';

/** What the callback page posts back to the widget. */
interface CallbackMessage {
  source: typeof PKCE_CALLBACK_MESSAGE_SOURCE;
  /** The full callback URL, so the OAuth library can parse and validate it itself. */
  url: string;
  /** Echoed from the authorize request; proves the message belongs to this attempt. */
  state: string;
}

export interface PopupOutcome {
  callbackUrl?: string;
  failureReason?: ToolAuthorizationFailure;
}

/**
 * The popup and the message bridge that carries the authorization code back.
 *
 * `oidc-client-ts` has a popup bridge of its own, but it posts its callback to `window.opener` with
 * `targetOrigin = window.location.origin` -- the *callback page's* origin -- so it works only when
 * that page is same-origin with the widget, and otherwise the browser drops the message silently:
 * no error, just a flow that never completes. eGain's callback page is served beside the widget, on
 * the tenant's server, so the two do match; but the redirect URI comes from the credential, and the
 * SDK cannot assume every host's callback page sits on its own origin. Owning the bridge keeps the
 * check explicit: the message is accepted only from the redirect URI's origin, then only for this
 * attempt's `state`.
 *
 * So we own the bridge and the library keeps everything else -- verifier, state, exchange, refresh.
 */
export class AuthorizationPopup {
  private static readonly FEATURES =
    'width=500,height=650,resizable=yes,scrollbars=yes,status=yes';
  /** Fixed, so a second sign-in reuses the window rather than opening another. */
  private static readonly WINDOW_NAME = 'egain-tool-auth';

  private readonly timeoutMs: number;
  private readonly allowedOrigins: string[];
  private readonly popup: Window;

  private constructor(popup: Window, options: { redirectUri: string; timeoutMs?: number }) {
    this.popup = popup;
    this.timeoutMs = options.timeoutMs ?? 180_000;
    this.allowedOrigins = [originOf(options.redirectUri)].filter(Boolean);
  }

  /**
   * Open the window. **Call this synchronously from the click that started it.**
   *
   * Opening comes first and the destination is set afterwards, because that ordering is the only
   * one browsers accept. `window.open` is allowed while a user gesture is being handled and
   * refused once anything has been awaited -- and deriving the PKCE challenge is asynchronous, so
   * building the authorize URL first would reliably lose the popup in Safari and Firefox. Opening
   * blank costs nothing: the window exists, and {@link navigate} points it somewhere a moment
   * later.
   *
   * Returns `null` when the browser blocked it, which is a normal outcome to report rather than
   * an error to throw.
   */
  static open(options: { redirectUri: string; timeoutMs?: number }): AuthorizationPopup | null {
    const popup = window.open('', AuthorizationPopup.WINDOW_NAME, AuthorizationPopup.FEATURES);
    return popup ? new AuthorizationPopup(popup, options) : null;
  }

  /** Send the already-open window to the provider's authorize URL. */
  navigate(url: string): void {
    try {
      this.popup.location.href = url;
    } catch {
      // Cross-origin assignment can throw in odd embedding setups; the awaited callback will
      // time out and report itself, which is a better message than this exception would be.
    }
  }

  close(): void {
    try {
      this.popup.close();
    } catch {
      /* already gone */
    }
  }

  /** Resolve once the callback page reports back, the person gives up, or time runs out. */
  awaitCallback(expectedState: string): Promise<PopupOutcome> {
    return new Promise<PopupOutcome>((resolve) => {
      let settled = false;

      const finish = (outcome: PopupOutcome) => {
        if (settled) return;
        settled = true;
        window.removeEventListener('message', onMessage);
        clearInterval(closedPoll);
        clearTimeout(timer);
        this.close();
        resolve(outcome);
      };

      const onMessage = (event: MessageEvent) => {
        // Origin first, before touching the payload at all: anything on the page can post here,
        // and `event.data` from an unknown origin is not evidence of anything.
        if (!this.allowedOrigins.includes(event.origin)) return;
        const data = event.data as CallbackMessage | undefined;
        if (!data || data.source !== PKCE_CALLBACK_MESSAGE_SOURCE || typeof data.url !== 'string') return;
        // A late or replayed message from an earlier attempt must not satisfy this one.
        if (data.state !== expectedState) {
          finish({ failureReason: 'state_mismatch' });
          return;
        }
        finish({ callbackUrl: data.url });
      };

      window.addEventListener('message', onMessage);

      // Closing the window is how most people decline -- there is no event for it, so poll.
      const closedPoll = window.setInterval(() => {
        if (this.popup.closed) finish({ failureReason: 'declined' });
      }, 500);

      const timer = window.setTimeout(() => finish({ failureReason: 'timeout' }), this.timeoutMs);
    });
  }
}

function originOf(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
}
