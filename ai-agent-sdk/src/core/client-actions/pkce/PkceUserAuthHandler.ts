import { OidcClient } from 'oidc-client-ts';
import { makeOidcClientFactory, type OidcClientConstructor } from './oauth/createOidcClient.js';
import { ToolAuthorizationClient } from './oauth/ToolAuthorizationClient.js';
import { ToolTokenCache } from './oauth/ToolTokenCache.js';
import type { ToolAuthorizationRequest, ToolAuthorizationResult } from './oauth/types.js';
import type { ClientActionContext, ClientActionHandler, ClientActionOutcome } from '../types.js';

/** The client action that has the person sign in to a third-party provider for a paused tool call. */
export const PKCE_USER_AUTH_ACTION_TYPE = 'pkce_user_auth';

/**
 * What a `pkce_user_auth` action asks the browser to do: run an OAuth 2.0 PKCE authorization
 * against the provider's endpoints. Every field is public -- a PKCE client has no secret.
 */
export interface PkceUserAuthPayload {
  credentialId: string;
  authorizationUrl: string;
  tokenUrl: string;
  clientId: string;
  redirectUri: string;
  /** Space-separated, exactly as the provider expects them. */
  scopes: string;
  /** Provider label for the card ("Connect to Acme"); may be empty. */
  serviceName: string;
  /** What the agent is trying to do, for the card ("so I can look up your booking"). */
  toolPurpose: string;
}

export interface PkceUserAuthHandlerOptions {
  /**
   * The `OidcClient` constructor to use. Defaults to the SDK's own `oidc-client-ts`; a host that
   * already loads the library can hand in its copy instead.
   */
  oidcClient?: OidcClientConstructor;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/**
 * `value` when it is an absolute https: URL, otherwise ''. The authorization URL is assigned to a
 * popup that starts out on this page's origin, so a `javascript:` one would run as this page. The
 * server checks the same on the credential; this is the check that does not depend on it.
 */
function httpsUrl(value: unknown): string {
  const raw = text(value);
  try {
    return new URL(raw).protocol === 'https:' ? raw : '';
  } catch {
    return '';
  }
}

function toOutcome(result: ToolAuthorizationResult): ClientActionOutcome {
  if (result.accessToken) {
    // The key stays `accessToken`: the server's log redaction matches on it.
    return { status: 'completed', data: { accessToken: result.accessToken } };
  }
  switch (result.failureReason) {
    case 'declined':
      return { status: 'declined' };
    case 'timeout':
      return { status: 'timeout' };
    default:
      return { status: 'failed', reason: result.failureReason ?? 'unknown' };
  }
}

/**
 * The handler for {@link PKCE_USER_AUTH_ACTION_TYPE}. Register it to let this client ask people to
 * sign in mid-chat. The server pauses every PKCE-linked tool call regardless; without this handler
 * the client answers `unsupported` and the agent answers without that tool's data.
 *
 * A person is only asked when they have to be: a token cached from an earlier sign-in, or one a
 * stored refresh token can renew, finishes the action before any card waits for a click.
 */
export function createPkceUserAuthHandler(
  options: PkceUserAuthHandlerOptions = {},
): ClientActionHandler<PkceUserAuthPayload> {
  /** Runs in flight, by action id, so the client's phase reports reach the right action. */
  const running = new Map<string, ClientActionContext>();
  let client: ToolAuthorizationClient | undefined;

  // One client for the page, built on first use: the refresh single-flight lives on it.
  const authorizationClient = () =>
    (client ??= new ToolAuthorizationClient({
      createOidcClient: makeOidcClientFactory(options.oidcClient ?? (OidcClient as unknown as OidcClientConstructor)),
      cache: new ToolTokenCache(),
      onPhase: (phase, request) => running.get(request.toolCallId)?.progress(phase),
    }));

  const requestFor = (payload: PkceUserAuthPayload, context: ClientActionContext): ToolAuthorizationRequest => ({
    toolCallId: context.actionId,
    ...payload,
  });

  /** Registered before `start` runs, so even a phase reported synchronously reaches the action. */
  const track = <T>(context: ClientActionContext, start: () => Promise<T>): Promise<T> => {
    running.set(context.actionId, context);
    return start().finally(() => running.delete(context.actionId));
  };

  return {
    type: PKCE_USER_AUTH_ACTION_TYPE,
    interaction: 'user-gesture',

    parse(payload: unknown): PkceUserAuthPayload | null {
      if (typeof payload !== 'object' || payload === null) {
        return null;
      }
      const raw = payload as Record<string, unknown>;
      const parsed: PkceUserAuthPayload = {
        credentialId: text(raw.credentialId),
        authorizationUrl: httpsUrl(raw.authorizationUrl),
        tokenUrl: httpsUrl(raw.tokenUrl),
        clientId: text(raw.clientId),
        redirectUri: httpsUrl(raw.redirectUri),
        scopes: text(raw.scopes),
        serviceName: text(raw.serviceName),
        toolPurpose: text(raw.toolPurpose),
      };
      // Without any of these, or with an endpoint that is not https:, there is no authorization to run.
      return parsed.authorizationUrl && parsed.tokenUrl && parsed.clientId && parsed.redirectUri ? parsed : null;
    },

    async tryWithoutUser(payload, context) {
      const result = await track(context, () => authorizationClient().resolveSilently(requestFor(payload, context)));
      return result ? toOutcome(result) : null;
    },

    perform(payload, context) {
      // Synchronous up to the popup: authorizeInteractive opens it before anything is awaited.
      const timeoutMs = context.expiresAt !== undefined ? Math.max(context.expiresAt - Date.now(), 0) : undefined;
      return track(context, () =>
        authorizationClient().authorizeInteractive(requestFor(payload, context), { timeoutMs, signal: context.signal }),
      ).then(toOutcome);
    },
  };
}
