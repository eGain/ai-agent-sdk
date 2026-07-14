/**
 * Bidirectional facade between the SDK and platform connector scripts.
 *
 * The SDK builds an implementation internally (closing over `AiAgent` state)
 * and passes it to the connector via `PlatformComponentService.setHookContract()`.
 * Connector authors can type their code against these interfaces.
 *
 * **Not intended for SDK consumers** — only for platform connector authors.
 *
 * @module HookContract
 */

import type { Portal } from '../types/PortalTypes.js';

/**
 * A single entry in the call transcript — the live customer-agent
 * conversation on the telephony platform (Genesys, Amazon Connect, etc.).
 *
 * This is distinct from the AiAgent chat transcript (`Transcript` /
 * `TranscriptEntry`), which tracks WebSocket messages between the SDK
 * and the AI Agent backend.
 */
export interface CallTranscriptEntry {
  sender: string;
  content: string;
  timestamp: Date;
}

/**
 * Caller information pushed by the platform connector.
 */
export interface CallerInfo {
  name?: string;
  phone?: string;
  email?: string;
  [key: string]: unknown;
}

/**
 * Bidirectional contract between the SDK and a platform connector script.
 *
 * Read-only getters return live state (not stale snapshots) because the
 * implementation closes over the `AiAgent` instance.
 */
export interface HookContract {
  // --- Read-only getters (connector reads SDK state) ---

  /** Returns the current call transcript entries (telephony conversation, not AI chat). */
  getTranscript: () => CallTranscriptEntry[];

  /** Returns a shallow copy of the initialization parameters. */
  getInitParams: () => Record<string, string>;

  /**
   * Legacy alias for {@link HookContract.getInitParams}.
   * Existing platform connectors (e.g. Genesys) may still call this name.
   */
  getQueryParams: () => Record<string, string>;

  /** Returns the agent details object. */
  getAgentDetails: () => any;

  /** Returns the current MSAL/auth access token. */
  getMsalAccessToken: () => Promise<string | null>;

  /** Returns the deployment info object. */
  getDeploymentInfo: () => any;

  /** Returns the platform type string (e.g. "genesys"). */
  getPlatformType: () => string | null;

  /** Returns the deployment environment ("dev" | "qa" | "prod"). */
  getEnvironment: () => string;

  /** Returns the user ID from init params. */
  getUserId: () => string | null;

  /** Returns the user context object. */
  getUserContext: () => Record<string, unknown> | null;

  /** Returns the conversation ID set by the connector. */
  getConversationId: () => string | null;

  /**
   * Returns effective OAuth resource scopes for the auth flow: after the platform connector runs,
   * the merged list in `config.scopes` wins; otherwise non-empty `initParams.scopes` (comma-separated)
   * overrides `config.scopes`, then defaults (including `core.customermgr.read` for customer when
   * neither query nor config supplies scopes).
   */
  getAuthScopes: () => string[];

  /** Returns the tenant ID from deployment info. */
  getTenantId: () => string | null;

  /** Returns the currently selected portal, or null before selection. */
  getSelectedPortal: () => Portal | null;

  /** Returns the caller info set by the connector. */
  getCallerInfo: () => CallerInfo | null;

  // --- Write methods (connector pushes state into SDK) ---

  /** Add an entry to the call transcript (telephony conversation, not AI chat). */
  addToTranscript: (entry: { sender: string; content: string; timestamp?: Date }) => void;

  /** Set caller information (e.g. from CTI integration). */
  setCallerInfo: (callerInfo: CallerInfo) => void;

  /** Mark the platform as authenticated. */
  setPlatformAuthenticated: (value: boolean) => void;

  /** Store a secondary platform-specific token. */
  setPlatformToken: (token: string) => void;

  /** Set the conversation/interaction ID. */
  setConversationId: (id: string) => void;

  /** Append to the user context (merge, not overwrite). */
  setUserContext: (userContext: Record<string, unknown>) => void;

  /** Set filter tags for portal content filtering. */
  setUserFilterTags: (filterTags: Record<string, string[]>) => void;

  // --- Event subscription ---

  /** Subscribe to agent widget actions. Returns an unsubscribe function. */
  subscribeToAgentWidgetActions: (callback: (action: string, data: unknown) => void) => () => void;

  // --- Chat interaction hooks ---

  /** Forward a user message through the SDK's send pipeline. */
  onUserMessage: (message: string) => void;

  /** Handle a source click from the connector. */
  onSourceClick: (source: { id: string; title: string; url?: string; [key: string]: unknown }) => void;

  /** Handle an intent confirmation from the connector. */
  onIntentConfirm: (intent: { id: string; intent: string; confidence: number; [key: string]: unknown }) => void;
}
