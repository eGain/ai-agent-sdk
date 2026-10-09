/**
 * Subset of the agent details response (`GET /core/aiservices/v4/aiagent/details/agent/{agentId}`)
 * that drives authentication. The full response is kept untyped; this names only the fields
 * the auth flow reads.
 */
export interface AgentAuthDetails {
  /** Whether the agent requires an authenticated (PKCE) user. */
  isAuthenticated?: boolean;
  /** Which permission prefix and deployment client id apply. */
  userType?: 'agent' | 'customer';
  /**
   * Unprefixed OAuth resource scopes configured on the agent (Settings → Advanced). Always appended
   * (deduplicated) to the scope list the SDK would otherwise use, for both the anonymous
   * client-credentials token and the PKCE token.
   */
  extraScopes?: string[];
  /**
   * OAuth client app id configured on the agent (Settings → Advanced). Used as the PKCE/MSAL client id
   * with priority `initParams.egclientid` > `clientAppId` > deployment `intClientId` / `extClientId` /
   * `clientId`. Not used by the anonymous client-credentials token.
   */
  clientAppId?: string | null;
}

/**
 * Default OAuth resource scopes when neither the embed nor the platform supplies any.
 * @param userType - 'customer' adds `core.customermgr.read`
 */
export function buildDefaultAuthScopes(userType?: 'agent' | 'customer'): string[] {
  const scopes = ['knowledge.portalmgr.manage', 'core.aiservices.read'];
  if (userType === 'customer') {
    scopes.push('core.customermgr.read');
  }
  return scopes;
}

/** Scopes from {@link AgentAuthDetails.extraScopes}: trimmed, non-empty, deduplicated, order preserved. */
export function getAgentExtraScopes(agentDetails: AgentAuthDetails | null | undefined): string[] {
  const raw = agentDetails?.extraScopes;
  if (!Array.isArray(raw)) return [];
  const scopes: string[] = [];
  for (const scope of raw) {
    if (typeof scope !== 'string') continue;
    const trimmed = scope.trim();
    if (trimmed.length > 0 && !scopes.includes(trimmed)) scopes.push(trimmed);
  }
  return scopes;
}

/** `base` followed by the agent's extra scopes, with duplicates removed and order preserved. */
export function mergeAgentExtraScopes(base: string[], agentDetails: AgentAuthDetails | null | undefined): string[] {
  return Array.from(new Set([...base, ...getAgentExtraScopes(agentDetails)]));
}

/** {@link AgentAuthDetails.clientAppId} as a trimmed non-empty string, or `undefined` when unset. */
export function getAgentClientAppId(agentDetails: AgentAuthDetails | null | undefined): string | undefined {
  const raw = agentDetails?.clientAppId;
  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
