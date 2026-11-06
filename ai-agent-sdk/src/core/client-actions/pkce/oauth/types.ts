/**
 * Types for tool authorization: letting an end user sign in to a third-party provider mid-chat so a
 * tool can call that provider's API as them.
 *
 * Distinct from the strategies in `../auth`, which authenticate the *widget session* to eGain. This
 * is the person authorizing one specific tool against one specific provider, and it can happen many
 * times in a conversation against different providers.
 */

/** Everything the browser needs to run one authorization. All public: a PKCE client has no secret. */
export interface ToolAuthorizationRequest {
  /** Identifies the paused tool call. Must be echoed back untouched or the result is refused. */
  toolCallId: string;
  /** Stable id of the stored credential; part of the cache key (see {@link ToolTokenSource}). */
  credentialId: string;
  authorizationUrl: string;
  tokenUrl: string;
  clientId: string;
  redirectUri: string;
  /** Space-separated, as configured in Studio. */
  scopes: string;
  /** Provider label for the card ("Connect to Acme"). */
  serviceName: string;
  /** What the agent is trying to do, for the card's subtitle. */
  toolPurpose: string;
}

/** Why an authorization did not produce a token. Reported as-is so the UI can vary its copy. */
export type ToolAuthorizationFailure =
  | 'declined'
  | 'popup_blocked'
  | 'timeout'
  | 'state_mismatch'
  | 'exchange_failed'
  | 'unknown';

/**
 * The outcome, on its way back to the paused tool call.
 *
 * A failure is still a result and still gets sent. The tool call stays open until something answers
 * it, so staying silent strands the turn instead of ending it.
 */
export type ToolAuthorizationResult =
  | { toolCallId: string; accessToken: string; failureReason?: undefined }
  | { toolCallId: string; accessToken?: undefined; failureReason: ToolAuthorizationFailure };

/**
 * What a cached token was issued for: the credential, the provider app and endpoints that issued
 * it, and its scopes. A credential edited in Studio to change any of them must miss the cache --
 * a token from the old app is rejected by the new one's API, and no sign-in card would appear to
 * fix it.
 */
export type ToolTokenSource = Pick<
  ToolAuthorizationRequest,
  'credentialId' | 'clientId' | 'tokenUrl' | 'authorizationUrl' | 'scopes'
>;

/** A cached token for one {@link ToolTokenSource}, as held in sessionStorage. */
export interface CachedToolToken {
  accessToken: string;
  refreshToken?: string;
  /** Epoch milliseconds. */
  expiresAt: number;
  /** The scopes this token was actually issued for. */
  scopes: string;
}

/** How the flow reports progress, so the card can show the right state without polling. */
export type ToolAuthorizationPhase =
  | 'cached'
  | 'refreshing'
  | 'prompting'
  | 'waiting'
  | 'authorized'
  | 'failed';
