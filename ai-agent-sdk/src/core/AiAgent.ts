import { Connection } from './connection/Connection.js';
import { ConnectionState } from './connection/ConnectionState.js';
import { MessageQueue } from './queue/MessageQueue.js';
import { AuthenticationService, AuthenticationInput, PKCEAuthServiceConfig } from './auth/AuthenticationService.js';
import { PKCEAuthConfig, PKCEAuthStrategy } from './auth/PKCEAuthStrategy.js';
import { EventEmitter } from './events/EventEmitter.js';
import { ConnectionError, MessageError } from './errors/SDKError.js';
import { ApiHelper, CacheConfig, type UserDetails } from './api/ApiHelper.js';
import { CacheAdapter, createCacheAdapter } from './api/CacheAdapter.js';
import { MessageProcessor } from './message/MessageProcessor.js';
import { Message } from './message/Message.js';
import { MessageHandlerResult, PERSONA, ROLE } from './message/types.js';
import { TokenRefreshHandler } from './message/handlers/TokenRefreshHandler.js';
import { Logger } from './logging/Logger.js';
import { LogLevel } from './logging/LogLevel.js';
import { createGracefulDisconnectMessage, createTokenMessage, createContextMessage } from './message/MessageTypes.js';
import { Transcript, TranscriptConfig, TranscriptOptions, TranscriptEntry } from './message/Transcript.js';
import { PortalInitializer } from './portal-initializer/PortalInitializer.js';
import type { Portal, UserProfile, AgentListItem } from './types/PortalTypes.js';
import type { HookContract, CallerInfo, CallTranscriptEntry } from './platform/HookContract.js';
import type { PlatformComponentService } from './platform/PlatformComponentService.js';
import { loadPlatformScript, deriveEnvironment, buildPlatformScriptUrl } from './platform/PlatformScriptLoader.js';

export type { UserDetails } from './api/ApiHelper.js';

/**
 * Configuration options for creating an AiAgent instance.
 * 
 * @example
 * ```typescript
 * const config: AiAgentConfig = {
 *   id: "123-456-789",
 *   endpoint: "https://api.egain.com",
 *   auth: { type: "pre-auth", accessToken: "your-access-token" },
 *   autoConnect: true,
 *   logLevel: LogLevel.DEBUG
 * };
 * ```
 * 
 * @category Core
 */
export interface AiAgentConfig {
  /**
   * Agent ID
   */
  id: string;

  /**
   * WebSocket endpoint URL
   */
  endpoint: string;

  /**
   * Authentication configuration (optional)
   * Can be:
   * - AuthenticationServiceConfig: Configuration object (e.g., { type: 'pre-auth', accessToken: '...' })
   * - AuthProvider: Custom auth provider implementing getToken()
   * - AuthStrategy: Full authentication strategy with lifecycle
   * - undefined: Falls back to anonymous authentication
   */
  auth?: AuthenticationInput;

  /**
   * Automatically connect after initialize() completes
   * @default false
   */
  autoConnect?: boolean;

  /**
   * Maximum queue size
   * @default 1000
   */
  maxQueueSize?: number;

  /**
   * Maximum reconnection attempts
   * @default Infinity
   */
  maxReconnectAttempts?: number;

  /**
   * Base reconnection delay in milliseconds
   * @default 1000
   */
  baseReconnectDelay?: number;

  /**
   * Maximum reconnection delay in milliseconds
   * @default 30000
   */
  maxReconnectDelay?: number;

  /**
   * Logger instance (optional)
   * If not provided, a new logger instance will be created
   * @default undefined (creates new instance)
   */
  logger?: Logger;

  /**
   * Logging level for the agent
   * @default INFO
   */
  logLevel?: LogLevel;

  /**
   * Enable console output for logs
   * @default true
   */
  enableLogging?: boolean;

  /**
   * Transcript configuration (optional)
   * Controls whether and how messages are stored in the transcript
   */
  transcriptConfig?: TranscriptConfig;

  /**
   * Cache configuration for API calls (optional)
   * Controls caching of agent details, portal details, and other API responses
   * @default { enabled: true, storageType: 'session', ttl: 300000 }
   */
  cache?: CacheConfig;

  /**
   * Custom OAuth scopes to request during authentication (optional)
   * If not provided, default scopes will be used:
   * - ["knowledge.portalmgr.manage", "core.aiservices.read"] for agents
   * - ["knowledge.portalmgr.manage", "core.aiservices.read", "core.customermgr.read"] for customers
   * 
   * You can provide additional scopes to extend the default ones, or replace them entirely.
   * @example
   * ```typescript
   * // Add additional scopes
   * scopes: ["knowledge.portalmgr.manage", "core.aiservices.read", "custom.scope"]
   * ```
   */
  scopes?: string[];

  /**
   * Pre-provided session ID (optional)
   * If provided, the SDK will skip fetching sessionId from the network during initialization.
   * Useful when you already have a session ID from a previous session or external source.
   *
   * @default undefined (fetches from network)
   *
   * @example
   * ```typescript
   * // Use existing sessionId (skips network fetch)
   * const agent = new AiAgent({
   *   id: "agent-id",
   *   endpoint: "https://api.egain.com",
   *   sessionId: "existing-session-id"
   * });
   * ```
   */
  sessionId?: string | number;

  /**
   * Initialization parameters forwarded from the host application.
   * SDK consumers pass them explicitly so the SDK remains URL-agnostic.
   *
   * The SDK uses specific well-known keys internally:
   * - `agentid` — when set and Flow A (`isDefaultAgent` is not `"true"`), portals are intersected with `agentDetails.portals` (cc-widget parity)
   * - `departmentId` — optional fallback in Flow B when `agentDetails.departmentId` is missing; prefer agent details from the default agent API (cc-widget parity)
   * - `portalIds` — comma-separated portal IDs; when set, skips `getMyPortals` and uses minimal portal objects
   * - `templateName` — alias for theme short URL template sent as `shortUrlTemplate` to portalmgr APIs
   * - `authType` — signals the authentication mode ("user" | "customer")
   * - `scopes` — comma-separated OAuth scopes to request; when non-empty after parsing, **overrides** `config.scopes` and default scopes for PKCE / token acquisition
   * - `userid` — user identifier for portal cache keying
   * - `isDefaultAgent` — when "true", enables Flow B (agent selection mode)
   *
   * All other keys are stored and accessible via `agent.getInitParams()`
   * for use by the consuming application.
   *
   * @example
   * ```typescript
   * initParams: {
   *   agentid: "agent-123",
   *   userid: "user-456",
   *   authType: "user",
   *   isDefaultAgent: "true",
   *   scopes: "knowledge.portalmgr.manage,core.aiservices.read"
   * }
   * ```
   */
  initParams?: Record<string, string>;

  /**
   * Override URL for the platform connector script.
   * When provided, the SDK loads this URL instead of constructing one
   * from the platform name and deployment environment.
   * Useful for local development or custom connector deployments.
   */
  platformScriptUrl?: string;

  /**
   * Authentication scheme for the PKCE flow.
   * - 'popup': Opens a popup window for login (default)
   * - 'redirect': Redirects the current page to the identity provider
   *
   * Only applies when the SDK auto-builds PKCE config from deployment info.
   * Ignored when a full PKCEAuthConfig is supplied via `config.auth`.
   * @default 'popup'
   */
  authScheme?: 'popup' | 'redirect';
}

/**
 * Agent event type identifiers
 */
export type AgentEventType =
  | 'connected'
  | 'message'
  | 'agentMessage'
  | 'errorMessage'
  | 'error'
  | 'closed'
  | 'stateChanged'
  | 'queueFlushed'
  | 'heartbeat'
  | 'tokenExpiring'
  | 'transcriptUpdate'
  | 'callTranscriptUpdate'
  | 'callerInfoUpdate'
  | 'conversationIdUpdate'
  | 'userContextUpdate'
  | 'filterTagsUpdate'
  | 'initialized'
  | 'portalsAvailable'
  | 'agentsAvailable'
  | 'profilesAvailable';

/**
 * Payload map for agent events
 */
export interface AgentEventPayloadMap {
  connected: Record<string, never>;
  message: { data: any };
  agentMessage: Omit<MessageHandlerResult, 'timestamp' | 'sessionId' | 'agentId'>;
  errorMessage: { message: Message; error: Error };
  error: { error: Error };
  closed: { code?: number; reason?: string };
  stateChanged: { state: ConnectionState; previousState: ConnectionState };
  queueFlushed: { count: number };
  heartbeat: Omit<MessageHandlerResult, 'timestamp' | 'sessionId' | 'agentId'>;
  tokenExpiring: { reason: 'expiring' | 'transport_request'; expiresAt?: number };
  transcriptUpdate: { entry: TranscriptEntry };
  callTranscriptUpdate: { entry: CallTranscriptEntry };
  callerInfoUpdate: { callerInfo: CallerInfo };
  conversationIdUpdate: { conversationId: string };
  userContextUpdate: { userContext: Record<string, unknown> };
  filterTagsUpdate: { filterTags: Record<string, string[]> };
  /** Always includes at least agent (agentId, name). When CC pipeline completes: portal, portalDetails?, agent?, profile, availableProfiles, availablePortals. */
  initialized: {
    portal?: Portal;
    portalDetails?: any;
    agent?: AgentListItem | Record<string, unknown>;
    profile?: UserProfile;
    availableProfiles?: UserProfile[];
    availablePortals?: Portal[];
  };
  portalsAvailable: { portals: Portal[] };
  agentsAvailable: { agents: AgentListItem[] };
  profilesAvailable: { profiles: UserProfile[]; selectedPortal: Portal };
}

/**
 * Wrapped agent event structure
 */
export interface AgentEvent<T extends AgentEventType = AgentEventType> {
  /**
   * Event type identifier
   */
  type: T;
  
  /**
   * Timestamp when the event occurred (milliseconds since epoch)
   */
  timestamp: number;
  
  /**
   * Session ID associated with the event
   */
  sessionId?: string | number;
  
  /**
   * Agent ID associated with the event
   */
  agentId?: string | number;
  
  /**
   * Event-specific payload data
   * Type varies based on the event type
   */
  payload: AgentEventPayloadMap[T];
}

/**
 * Agent event map
 */
export interface AgentEvents {
  /**
   * Emitted when connection is established
   */
  connected: AgentEvent<'connected'>;

  /**
   * Emitted when a message is received
   */
  message: AgentEvent<'message'>;

  /**
   * Emitted when an agent message is received
   */
  agentMessage: AgentEvent<'agentMessage'>;

  /**
   * Emitted when an error message is received
   */
  errorMessage: AgentEvent<'errorMessage'>;

  /**
   * Emitted when an error occurs
   */
  error: AgentEvent<'error'>;

  /**
   * Emitted when connection is closed
   */
  closed: AgentEvent<'closed'>;

  /**
   * Emitted when connection state changes
   */
  stateChanged: AgentEvent<'stateChanged'>;

  /**
   * Emitted when queue is flushed
   */
  queueFlushed: AgentEvent<'queueFlushed'>;

  /**
   * Emitted when a heartbeat message is received
   * Indicates the agent is processing/typing - UI can show a loader
   */
  heartbeat: AgentEvent<'heartbeat'>;

  /**
   * Emitted when the access token is about to expire or needs refresh
   * Triggered by JWT expiration detection (with 3-min buffer) or transport layer request
   */
  tokenExpiring: AgentEvent<'tokenExpiring'>;

  /**
   * Emitted when the transcript is updated (message sent or received)
   * Contains the new transcript entry with message and direction
   */
  transcriptUpdate: AgentEvent<'transcriptUpdate'>;

  /**
   * Emitted when the platform connector pushes a call transcript entry
   * via HookContract.addToTranscript(). Entries arrive incrementally during a call.
   */
  callTranscriptUpdate: AgentEvent<'callTranscriptUpdate'>;

  /**
   * Emitted when the platform connector sets caller information
   * via HookContract.setCallerInfo().
   */
  callerInfoUpdate: AgentEvent<'callerInfoUpdate'>;

  /**
   * Emitted when the platform connector sets the conversation/interaction ID
   * via HookContract.setConversationId().
   */
  conversationIdUpdate: AgentEvent<'conversationIdUpdate'>;

  /**
   * Emitted when the platform connector appends to user context
   * via HookContract.setUserContext(). Payload contains the merged context.
   */
  userContextUpdate: AgentEvent<'userContextUpdate'>;

  /**
   * Emitted when the platform connector sets filter tags
   * via HookContract.setUserFilterTags().
   */
  filterTagsUpdate: AgentEvent<'filterTagsUpdate'>;

  /**
   * Emitted when the pipeline (or direct flow) is fully complete.
   * Safe to call connect(). Consumer is responsible for calling connect() after this.
   * Payload is never empty in practice: always at least agent (agentId, name). When the CC pipeline
   * completed, also includes portal, optional portalDetails, optional agent, profile, availableProfiles, availablePortals.
   */
  initialized: AgentEvent<'initialized'>;

  /**
   * Emitted when multiple portals are available.
   * Consumer must call selectPortal(portal) to continue.
   */
  portalsAvailable: AgentEvent<'portalsAvailable'>;

  /**
   * Emitted when multiple agents are available (Flow B only).
   * Consumer must call selectAgent(agent) to continue.
   */
  agentsAvailable: AgentEvent<'agentsAvailable'>;

  /**
   * Emitted when multiple user profiles exist and neither last-used nor default profile is found.
   * Payload includes profiles and selectedPortal. Consumer must call selectUserProfile(profile) to continue.
   */
  profilesAvailable: AgentEvent<'profilesAvailable'>;
}

/**
 * Cache key prefix for context storage
 */
const CONTEXT_CACHE_KEY_PREFIX = 'egain_aiagent_context_';

/** Session-scoped cache key prefix for profile list (restart reuse). Suffix: agentId_portalId. */
const PIPELINE_PROFILES_CACHE_KEY_PREFIX = 'eg_profiles_';

/**
 * Main class for interacting with the eGain AI Agent platform.
 *
 * The AiAgent class provides:
 * - WebSocket connection management with automatic reconnection
 * - Message queuing when offline
 * - Event-driven communication
 * - Transcript management
 * - Context persistence
 *
 * **Initialization flows**
 *
 * After authentication, one of two paths runs:
 *
 * - **Direct flow** (non–contact-center agents): fetches session, creates the WebSocket connection,
 *   emits `initialized`. With {@link AiAgentConfig.autoConnect}, `connect()` runs automatically.
 * - **Contact Center (CC) flow** (contact-center agents, per API `agentType` / authenticated agents
 *   with legacy empty type): runs a REST-only portal → (optional agent) → profile pipeline, then
 *   emits `initialized`. The WebSocket is created when you call `connect()` (or automatically if
 *   `autoConnect` is true after the pipeline completes).
 *
 * **Flow A (specific agent)** — Use the target agent ID in {@link AiAgentConfig.id}. CC pipeline:
 * portal selection → profile selection.
 *
 * **Flow B (default agent / agent selection)** — Set `initParams: { isDefaultAgent: "true" }`.
 * CC pipeline: portal → agent → profile. The selected agent becomes the chat identity
 * (`resolvedAgentId`); subsequent session and chat use that ID, not the bootstrap `config.id`.
 *
 * When the CC pipeline has multiple options at a step, it emits `portalsAvailable`,
 * `agentsAvailable`, or `profilesAvailable`. Call {@link AiAgent.selectPortal},
 * {@link AiAgent.selectAgent}, or {@link AiAgent.selectUserProfile} to continue. After the
 * `initialized` event, call {@link AiAgent.connect} unless `autoConnect` already connected you.
 *
 * @example Direct flow (typical non–Contact Center agent)
 * ```typescript
 * import { AiAgent } from "@egain/ai-agent-sdk";
 *
 * const agent = new AiAgent({
 *   id: "agent-id",
 *   endpoint: "https://api.egain.com",
 *   auth: { type: "pre-auth", accessToken: "your-access-token" },
 *   autoConnect: true,
 * });
 *
 * agent.on("agentMessage", (event) => {
 *   console.log("Agent:", event.payload.message?.content);
 * });
 *
 * await agent.initialize();
 * await agent.send("Hello!");
 * ```
 *
 * @example Contact Center flow (register handlers before `initialize`)
 * ```typescript
 * const agent = new AiAgent({
 *   id: "agent-id",
 *   endpoint: "https://api.egain.com",
 *   auth: { type: "pkce", config: { ... } },
 *   initParams: { userid: "user-123" },
 * });
 *
 * agent.on("portalsAvailable", (e) => agent.selectPortal(e.payload.portals[0]));
 * agent.on("agentsAvailable", (e) => agent.selectAgent(e.payload.agents[0]));
 * agent.on("profilesAvailable", (e) => agent.selectUserProfile(e.payload.profiles[0]));
 * agent.on("initialized", async () => {
 *   await agent.connect();
 * });
 * await agent.initialize();
 * ```
 *
 * @example With context
 * ```typescript
 * import { AiAgent, createContextMessage } from "@egain/ai-agent-sdk";
 *
 * await agent.send(createContextMessage({
 *   context: { userId: "123", accountType: "premium" },
 * }));
 * ```
 *
 * @category Core
 * @see {@link AiAgentConfig} for configuration options
 * @see {@link AgentEvents} for available events
 */
export class AiAgent extends EventEmitter<AgentEvents> {
  private connection?: Connection;
  private messageQueue!: MessageQueue;
  private messageProcessor!: MessageProcessor;
  private authService: AuthenticationService;
  private config: AiAgentConfig;
  private isInitialized: boolean;
  private isFlushingQueue: boolean;
  private deploymentInfo: any;
  private apiHelper?: ApiHelper;
  private agentDetails?: any;
  private sessionId?: any;
  private transcript!: Transcript;
  private contextCacheAdapter: CacheAdapter;
  public logger: Logger;
  private resolvedAgentId: string;
  private portalInitializer?: PortalInitializer;
  private isAgentSelectionMode: boolean;
  private initParams: Record<string, string>;
  /** Cached profiles for restart (user-associated; portal details and agents are not cached). */
  private cachedProfiles?: UserProfile[];
  /** True when the agent completed the portal initialization pipeline (needed for restart guard). */
  private completedPortalPipeline = false;
  /** Last selected portal from pipeline (needed for updateUserProfile). */
  private lastSelectedPortal?: Portal;

  // --- Platform connector state (Phase 2) ---
  private callerInfo: CallerInfo | null = null;
  private userContext: Record<string, unknown> | null = null;
  private platformToken: string | null = null;
  private isPlatformAuthenticated = false;
  private conversationId: string | null = null;
  private filterTags: Record<string, string[]> = {};
  private callTranscript: CallTranscriptEntry[] = [];
  private hookContract?: HookContract;
  private platformComponentService?: PlatformComponentService;
  private userDetails: UserDetails | null = null;
  /** True after `addCustomAuthScopes` merged scopes into `config.scopes` (PKCE/hooks must use that list). */
  private authScopesAugmentedByPlatform = false;

  constructor(config: AiAgentConfig) {
    super();
    this.isFlushingQueue = false;
    this.isInitialized = false;
    this.config = config;
    this.resolvedAgentId = config.id;
    this.isAgentSelectionMode = (config.initParams?.isDefaultAgent?.toLowerCase() ?? '') === 'true';
    this.initParams = config.initParams ?? {};
    // Debug: track instance identity
    (this as any)._instanceId = Math.random().toString(36).substring(7);

    // Validate configuration
    if (!config.endpoint) {
      throw new Error('Endpoint is required');
    }
    if (!config.id) {
      throw new Error('Agent ID is required');
    }

    // Store sessionId from config if provided
    if (config.sessionId !== undefined) {
      this.sessionId = config.sessionId;
      // Note: Logger will be initialized below and will use this.sessionId in contextProvider
    }

    // Initialize logger
    if (config.logger) {
      this.logger = config.logger;
      // Note: If a custom logger is provided, sessionId won't be automatically included
      // unless the custom logger has its own contextProvider configured
    } else {
      this.logger = new Logger({
        level: config.logLevel ?? LogLevel.INFO,
        enableConsole: config.enableLogging ?? true,
        name: `AiAgent:${config.id}`,
        contextProvider: () => ({
          sessionId: this.sessionId,
        }),
      });
    }

    // Log if sessionId was provided in config
    if (config.sessionId !== undefined) {
      this.logger.debug('SessionId provided in config, will skip network fetch', { 
        sessionId: this.sessionId,
        agentId: config.id 
      });
    }

    // Initialize message queue
    this.messageQueue = new MessageQueue(config.maxQueueSize ?? 1000);

    // Initialize message processor
    this.messageProcessor = new MessageProcessor(this.logger.createChild('MessageProcessor'));

    // Initialize transcript
    this.transcript = new Transcript(config.transcriptConfig);

    // Create authentication service - handles all input types internally
    // Pass cache config so AnonymousAuthStrategy can use it for caching metadata
    this.authService = new AuthenticationService(
      config.auth,
      this.logger.createChild('AuthenticationService'),
      config.cache
    );

    // Initialize context cache adapter
    // Use custom adapter if provided in cache config, otherwise create based on storage type
    if (config.cache?.adapter) {
      this.contextCacheAdapter = config.cache.adapter;
    } else {
      this.contextCacheAdapter = createCacheAdapter(config.cache?.storageType || 'session');
    }

    // Replace default TokenRefreshHandler with one that has callbacks for token refresh
    this.setupTokenRefreshHandler();

    this.logger.debug('AiAgent instance created', { agentId: config.id, endpoint: config.endpoint });
  }

  /**
   * Setup TokenRefreshHandler with callbacks for automatic token refresh
   * Replaces the default handler with one that can actually perform token refresh
   */
  private setupTokenRefreshHandler(): void {
    const handlers = this.messageProcessor.getHandlers();
    const defaultTokenHandler = handlers.find(
      (h) => h instanceof TokenRefreshHandler
    );

    if (defaultTokenHandler) {
      // Remove default handler
      this.messageProcessor.removeHandler(defaultTokenHandler);

      // Add handler with callbacks
      const tokenRefreshHandler = new TokenRefreshHandler({
        getAccessToken: async () => {
          const token = await this.authService.getToken();
          if (!token) {
            throw new Error('Failed to get access token for refresh');
          }
          return token;
        },
        sendToConnection: async (payload: any) => {
          if (!this.connection?.isConnected()) {
            this.logger.warn('Cannot send token refresh: connection not available');
            return;
          }
          const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
          await this.connection.send(payloadString);
        },
      });

      // Add at priority 0 (highest priority)
      this.messageProcessor.addHandler(tokenRefreshHandler, 0);
    }
  }

  private parseQueryScopes(): string[] {
    const raw = this.initParams.scopes?.trim();
    if (!raw) return [];
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  /**
   * Base OAuth resource scopes before platform augmentation: comma-separated `initParams.scopes`
   * overrides `config.scopes` and defaults. Used to seed `addCustomAuthScopes`. For PKCE and hooks
   * after the platform merges scopes, use {@link getAuthScopesForFlow}.
   */
  private resolveEffectiveAuthScopes(): string[] {
    const fromQuery = this.parseQueryScopes();
    if (fromQuery.length > 0) {
      return [...fromQuery];
    }
    if (this.config.scopes && this.config.scopes.length > 0) {
      return [...this.config.scopes];
    }
    const scopes = ['knowledge.portalmgr.manage', 'core.aiservices.read'];
    if (this.agentDetails?.userType === 'customer') {
      scopes.push('core.customermgr.read');
    }
    return scopes;
  }

  /**
   * Scopes used for PKCE, AuthenticationService.initialize, and HookContract.getAuthScopes.
   * After the platform connector augments scopes into `config.scopes`, that merged list wins.
   */
  private getAuthScopesForFlow(): string[] {
    if (this.authScopesAugmentedByPlatform && this.config.scopes && this.config.scopes.length > 0) {
      return [...this.config.scopes];
    }
    return this.resolveEffectiveAuthScopes();
  }

  /**
   * Initialize the agent. Must be called after construction and awaited before use.
   *
   * Authenticates (falls back to {@link AnonymousAuthStrategy} if no auth is configured), then:
   *
   * - **Direct flow:** fetches session, creates the WebSocket connection, emits `initialized`.
   *   With `autoConnect`, opens the WebSocket automatically.
   * - **Contact Center flow:** runs portal / agent / profile selection over REST only (no WebSocket
   *   yet). May emit `portalsAvailable`, `agentsAvailable`, or `profilesAvailable` — call the
   *   corresponding `select*` method. Then emits `initialized`. Call {@link AiAgent.connect}
   *   afterward (or rely on `autoConnect` after the pipeline completes).
   *
   * @example
   * ```typescript
   * const agent = new AiAgent({ id: 'agent-id', endpoint: 'https://...' });
   * await agent.initialize();
   * // Direct flow: often already connected if autoConnect. CC flow: connect after `initialized`.
   * await agent.connect();
   * ```
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.debug('Agent already initialized', { agentId: this.config.id });
      return;
    }
    this.logger.debug('Initializing agent', { agentId: this.config.id });

    try {
      this.authScopesAugmentedByPlatform = false;

      // Get deployment info (use cached if getAgentDetails was called first)
      if (!this.deploymentInfo) {
        this.deploymentInfo = await ApiHelper.getDeploymentInfo(this.config.endpoint);
      }

      if (!this.deploymentInfo) {
        const error = new Error('Deployment information not found');
        this.logger.error('Failed to initialize: deployment information not found', error, { agentId: this.config.id });
        throw error;
      }

      // Set up apiHelper if not already set (may have been set by getAgentDetails)
      if (!this.apiHelper) {
        this.apiHelper = new ApiHelper({
          apiDomain: this.deploymentInfo.apiDomain,
          cache: this.config.cache,
          getToken: () => this.authService.getToken(),
        });
      }
      this.logger.debug('Deployment info retrieved', { apiDomain: this.deploymentInfo.apiDomain });

      // Set up token expiring callback to emit tokenExpiring event
      this.authService.setTokenExpiringCallback((expiresAt: number) => {
        this.logger.debug('Token expiring callback triggered', { expiresAt, agentId: this.config.id });
        this.emit('tokenExpiring', this.createAgentEventResponse('tokenExpiring', {
          reason: 'expiring',
          expiresAt,
        }));
      });

      if (!this.agentDetails) {
        // Initialize auth service with deployment info if not already initialized
        // Default strategy is already anonymous, so we can get token from current strategy
        if (!this.authService.getIsInitialized()) {
          await this.authService.initialize({
            deploymentInfo: this.deploymentInfo,
            // No postAuthentication - we don't want session ID or connection yet
          });
        }
        const accessToken = await this.authService.getToken();
        this.agentDetails = await this.fetchAgentDetails(accessToken);
      }

      // Load platform connector script if applicable (before auth so scopes can be augmented)
      const platform = this.initParams.platform?.toLowerCase();
      const shouldLoadPlatformScript =
        platform != null &&
        platform !== 'standalone' &&
        platform !== 'test' &&
        /^[a-zA-Z]+$/.test(platform) &&
        this.agentDetails?.agentType === 'contact-center';

      if (shouldLoadPlatformScript) {
        await this.loadAndInitializePlatform();
      }

      // Branch based on whether agent requires authentication
      if (this.agentDetails?.isAuthenticated) {
        const effectiveScopes = this.getAuthScopesForFlow();

        // Agent requires authentication - use PKCE
        // Check if current strategy is anonymous, and switch to PKCE if needed
        // Otherwise keep the same strategy
        if (this.authService.isAnonymousStrategy()) {
          // Build PKCE config from deployment info and agent details
          let pkceConfig: PKCEAuthConfig;

          // Check if PKCE config was provided in the original auth config
          if (this.config.auth && typeof this.config.auth === 'object' && 'type' in this.config.auth && this.config.auth.type === 'pkce') {
            pkceConfig = (this.config.auth as PKCEAuthServiceConfig).config;
            if (this.parseQueryScopes().length > 0 || this.authScopesAugmentedByPlatform) {
              pkceConfig = { ...pkceConfig, scopes: [...effectiveScopes] };
            }
          } else {
            // Build PKCE config from deployment info and agent details
            try {
              const egClientId = this.initParams.egclientid || this.initParams.egclientId || this.initParams.egClientId;
              const localLogin = this.initParams.localLogin === 'true' || undefined;
              pkceConfig = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
                this.deploymentInfo,
                this.agentDetails,
                this.config.endpoint,
                effectiveScopes,
                this.logger.createChild('PKCEAuthStrategy'),
                this.config.authScheme,
                egClientId,
                localLogin
              );
            } catch (error) {
              const err = error instanceof Error ? error : new Error(String(error));
              this.logger.error('Failed to build PKCE config from deployment info', err, { agentId: this.config.id });
              throw new Error(`Failed to build PKCE configuration: ${err.message}`);
            }
          }

          // Switch to PKCE strategy with postAuthentication callback
          // postAuthentication will be called once authentication type is confirmed
          this.logger.debug('Switching from anonymous to PKCE strategy', { agentId: this.config.id });
          await this.authService.switchStrategyTo(pkceConfig, this.onAuthComplete.bind(this));
        } else {
          this.logger.debug('Current strategy is not anonymous, keeping existing strategy', {
            agentId: this.config.id,
            currentType: this.authService.getAuthenticationType()
          });
        }

        // Initialize and authenticate - postAuthentication callback will be called after authentication completes
        this.logger.debug('Agent requires authentication, initializing PKCE flow', { agentId: this.config.id });

        await this.authService.initialize({
          deploymentInfo: this.deploymentInfo,
          postAuthentication: this.onAuthComplete,
          scopes: effectiveScopes,
          userType: this.agentDetails?.userType,
        });

        await this.authService.authenticate();

      } else {
        // Agent doesn't require authentication - use anonymous strategy
        this.logger.debug('Agent does not require authentication, using anonymous strategy', { agentId: this.config.id });
        // Complete initialization manually (get session, create connection)

        // TODO: POST AUTHENTICATION CALLBACK
        const accessToken = await this.authService.getToken();
        await this.onAuthComplete(accessToken);
      }
    } catch (error) {
      // Ensure we don't mark as initialized if initialization failed
      this.isInitialized = false;
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Failed to initialize agent', err, { agentId: this.config.id });
      throw err;
    }
  }

  /**
   * Build the HookContract by closing over `this`.
   * All getters return live state (not stale snapshots).
   */
  private buildHookContract(): HookContract {
    return {
      getTranscript: () => [...this.callTranscript],
      getInitParams: () => ({ ...this.initParams }),
      getQueryParams: () => ({ ...this.initParams }),
      getAgentDetails: () => this.agentDetails,
      getMsalAccessToken: () => this.authService.getToken(),
      getDeploymentInfo: () => this.deploymentInfo,
      getPlatformType: () => this.initParams.platform ?? null,
      getEnvironment: () => deriveEnvironment(this.initParams.env),
      getUserId: () => this.initParams.userid ?? this.initParams.userId ?? null,
      getUserContext: () => this.userContext,
      getConversationId: () => this.conversationId,
      getAuthScopes: () => this.getAuthScopesForFlow(),
      getTenantId: () => this.deploymentInfo?.tenantId ?? null,
      getSelectedPortal: () => this.lastSelectedPortal ?? null,
      getCallerInfo: () => this.callerInfo,

      addToTranscript: (entry) => {
        const newEntry: CallTranscriptEntry = {
          sender: entry.sender,
          content: entry.content,
          timestamp: entry.timestamp ?? new Date(),
        };
        this.callTranscript.push(newEntry);
        this.emit('callTranscriptUpdate', this.createAgentEventResponse('callTranscriptUpdate', {
          entry: newEntry,
        }));
      },
      setCallerInfo: (info) => {
        this.callerInfo = info;
        this.emit('callerInfoUpdate', this.createAgentEventResponse('callerInfoUpdate', {
          callerInfo: info,
        }));
      },
      setPlatformAuthenticated: (v) => { this.isPlatformAuthenticated = v; },
      setPlatformToken: (token) => { this.platformToken = token; },
      setConversationId: (id) => {
        this.conversationId = id;
        this.emit('conversationIdUpdate', this.createAgentEventResponse('conversationIdUpdate', {
          conversationId: id,
        }));
      },
      setUserContext: (ctx) => {
        this.userContext = { ...this.userContext, ...ctx };
        this.emit('userContextUpdate', this.createAgentEventResponse('userContextUpdate', {
          userContext: this.userContext as Record<string, unknown>,
        }));
      },
      setUserFilterTags: (tags) => {
        this.filterTags = tags;
        this.emit('filterTagsUpdate', this.createAgentEventResponse('filterTagsUpdate', {
          filterTags: tags,
        }));
      },

      subscribeToAgentWidgetActions: (cb) => {
        const handler = (event: any) => { cb(event?.type ?? 'unknown', event?.payload); };
        this.on('message' as any, handler);
        return () => { this.off('message' as any, handler); };
      },

      onUserMessage: (msg) => { this.send(msg); },
      onSourceClick: (source) => { this.emit('message' as any, this.createAgentEventResponse('message' as any, { type: 'sourceClick', source })); },
      onIntentConfirm: (intent) => { this.emit('message' as any, this.createAgentEventResponse('message' as any, { type: 'intentConfirm', intent })); },
    };
  }

  /**
   * Load the platform connector script and wire up the HookContract.
   * Called from initialize() when a non-standalone platform is detected.
   */
  private async loadAndInitializePlatform(): Promise<void> {
    const platform = this.initParams.platform!.toLowerCase();
    const environment = deriveEnvironment(
      this.deploymentInfo?.apiDomain,
      this.initParams.env,
    );

    this.logger.info('Loading platform connector', { platform, environment });

    await loadPlatformScript({
      platform,
      baseUrl: environment,
      overrideUrl: this.config.platformScriptUrl,
      logger: this.logger,
    });

    this.platformComponentService =
      (typeof window !== 'undefined' ? (window as any) : globalThis).PlatformComponentService ?? undefined;

    if (!this.platformComponentService) {
      throw new Error(`Failed to load platform connector script for '${platform}'`);
    }

    this.hookContract = this.buildHookContract();

    if (this.platformComponentService.setHookContract) {
      this.platformComponentService.setHookContract(this.hookContract);
    }

    if (this.platformComponentService.loadCustomHook) {
      this.platformComponentService.loadCustomHook(this.hookContract);
    }

    if (this.platformComponentService.addCustomAuthScopes) {
      const currentScopes = this.resolveEffectiveAuthScopes();
      const augmentedScopes = await this.platformComponentService.addCustomAuthScopes(currentScopes);
      if (augmentedScopes && Array.isArray(augmentedScopes)) {
        this.config.scopes = augmentedScopes;
        this.authScopesAugmentedByPlatform = true;
      }
    }

    this.logger.info('Platform connector initialized', { platform });
  }

  /**
   * Whether to run the portal-based initializer (portals → optional agents → profiles) vs direct session setup.
   * True when portal-related init params or agent configuration indicate a portal-trained / contact-center flow.
   */
  private shouldRunPortalInitializationPipeline(): boolean {
    const q = this.initParams;
    if ((q.portalIds ?? q.portalids ?? '').trim().length > 0) {
      return true;
    }
    const portals = this.agentDetails?.portals;
    if (Array.isArray(portals) && portals.length > 0) {
      return true;
    }
    // if (this.agentDetails?.agentType === 'contact-center') {
    //   return true;
    // }
    if ((q.isDefaultAgent?.toLowerCase() ?? '') === 'true') {
      return true;
    }
    return false;
  }

  /**
   * Session + connection + `initialized` for the non-portal path after auth.
   */
  private async runDirectInitializationAfterAuth(accessToken: any): Promise<void> {
    this.isInitialized = true;
    this.sessionId = await this.getSessionId(accessToken);
    await this.createConnection(this.sessionId);
    const agentDetails = this.agentDetails ?? (this.apiHelper && (await this.fetchAgentDetails(accessToken)));
    const payload: AgentEventPayloadMap['initialized'] = {
      agent: agentDetails ?? { agentId: this.resolvedAgentId, name: 'Unknown' },
    };
    this.emit('initialized', this.createAgentEventResponse('initialized', payload));
    if (this.config.autoConnect) {
      await this.connect();
    }
  }

  private async runPortalInitializerPipeline(accessToken: any): Promise<void> {
    if (this.platformComponentService?.initPlatform) {
      await this.platformComponentService.initPlatform(this.hookContract!);
    }

    this.portalInitializer = new PortalInitializer({
      agentId: this.config.id,
      apiHelper: this.apiHelper!,
      logger: this.logger.createChild('PortalInitializer'),
      authService: this.authService,
      initParams: this.initParams,
      platformComponentService: this.platformComponentService,
      hookContract: this.hookContract,
      emit: (type, event) => {
        if (type === 'initialized') {
          const payload = event?.payload;
          if (payload?.agent) {
            this.resolvedAgentId = (payload.agent as any).agentId ?? (payload.agent as any).id ?? this.resolvedAgentId;
          }
          this.completedPortalPipeline = true;
          this.lastSelectedPortal = payload?.portal;
          if (payload?.availableProfiles) {
            this.cachedProfiles = payload.availableProfiles;
            const portalId = payload?.portal?.id;
            const profilesCacheKey = this.getPipelineProfilesCacheKey(portalId);
            const existingEntry = this.contextCacheAdapter.get<UserProfile[]>(profilesCacheKey);
            if (!existingEntry) {
              this.contextCacheAdapter.set(profilesCacheKey, {
                value: payload.availableProfiles,
                timestamp: Date.now(),
              });
            }
          }
          this.isInitialized = true;
        }
        this.emit(type as any, event);
        if (type === 'initialized' && this.config.autoConnect) {
          this.connect();
        }
      },
      createAgentEventResponse: (type, payload) => this.createAgentEventResponse(type as any, payload),
      isAgentSelectionMode: this.isAgentSelectionMode,
      agentDetails: this.agentDetails,
      pipelineCache: {
        adapter: this.contextCacheAdapter,
        profilesKey: (portalId) => this.getPipelineProfilesCacheKey(portalId),
        ttl: this.config.cache?.ttl ?? 60 * 60 * 1000, // 1 hour
      },
    });

    void this.portalInitializer.start();
  }

  /**
   * Post-authentication callback. Runs the portal initializer when
   * {@link shouldRunPortalInitializationPipeline} is true; otherwise session + connection (direct flow).
   * @param accessToken - The access token to use for authentication
   */
  private readonly onAuthComplete = async (accessToken: any) => {
    const runPortalPipeline = this.shouldRunPortalInitializationPipeline();
    this.logger.debug('onAuthComplete callback invoked', {
      agentId: this.config.id,
      agentType: this.agentDetails?.agentType,
      runPortalPipeline,
      instanceId: (this as any)._instanceId,
    });

    await this.fetchUserOrCustomerDetails(accessToken);

    if (runPortalPipeline) {
      this.logger.info('Running portal initializer pipeline', { agentId: this.config.id });
      await this.runPortalInitializerPipeline(accessToken);
    } else {
      this.logger.info('Running direct initialization pipeline', { agentId: this.config.id });
      await this.runDirectInitializationAfterAuth(accessToken);
    }

    this.logger.debug('onAuthComplete completed', {
      agentId: this.resolvedAgentId,
      isInitialized: this.isInitialized,
    });
  };

  /**
   * Fetch user or customer details after authentication.
   * Determination: if userType is 'customer', fetches customer details; otherwise fetches user details.
   * Best-effort — logs a warning on failure but does not throw.
   */
  private async fetchUserOrCustomerDetails(accessToken: string): Promise<void> {
    if (!this.apiHelper) return;
    try {
      const userType = this.agentDetails?.userType || 'user';
      this.userDetails = userType === 'customer'
        ? await this.apiHelper.getCustomerDetails({ authToken: accessToken })
        : await this.apiHelper.getUserDetails({ authToken: accessToken });
    } catch (error) {
      this.logger.warn('Failed to fetch user/customer details', {
        error: error instanceof Error ? error : new Error(String(error)),
        agentId: this.config.id,
      });
      this.userDetails = null;
    }
  }

  /**
   * Fetch agent details from API
   * @param accessToken - The access token to use for authentication
   * @returns The agent details
   */
  private async fetchAgentDetails(accessToken: any): Promise<any> {
    if (this.agentDetails) {
      this.backfillAgentDetailsId(this.agentDetails);
      return this.agentDetails;
    }
    accessToken = accessToken ?? await this.authService.getToken() ?? null;
    if (!accessToken) {
      const error = new Error('Access token not found.');
      this.logger.error('Failed to get agent details: access token not found', error, { agentId: this.config.id });
      throw error;
    }
    this.logger.debug('Fetching agent details', { agentId: this.config.id });
    this.agentDetails = await this.apiHelper?.getAiAgentDetails({
      agentId: this.config.id,
      authToken: accessToken,
    });
    this.backfillAgentDetailsId(this.agentDetails);
    this.logger.debug('Agent details retrieved', { agentId: this.config.id });
    return this.agentDetails;
  }

  /**
   * Ensures agent details have agentId from the request context when API omits it.
   * 
   * @param details - The agent details to backfill the agentId for
   * @returns The agent details with the agentId backfilled
   */
  private backfillAgentDetailsId(details: any): void {
    if (!details) return;
    const knownId = this.resolvedAgentId ?? this.config.id;
    if (knownId == null) return;
    if (details.agentId == null || details.agentId === '') {
      details.agentId = knownId;
    }
  }

  /**
   * Get the agent details
   * Returns cached agent details if available, otherwise fetches from network.
   * If called before initialize(), performs minimal initialization to fetch agent details only
   * (gets deployment info, fetches anonymous token, fetches agent details - without getting session ID or creating connection).
   * @returns Promise resolving to the agent details
   */
  async getAgentDetails(): Promise<any> {
    if (this.agentDetails) {
      return this.agentDetails;
    }

    // If SDK is fully initialized, just fetch with existing token
    if (this.isInitialized) {
      const accessToken = await this.authService.getToken();
      return await this.fetchAgentDetails(accessToken);
    }

    // Minimal initialization: only what's needed for agent details
    this.logger.debug('Performing minimal initialization to fetch agent details', { agentId: this.config.id });

    // 1. Get deployment info (uses cache if available)
    const deploymentInfo = await this.getDeploymentInfo();
    if (!deploymentInfo) {
      const error = new Error('Deployment information not found');
      this.logger.error('Failed to get agent details: deployment info not found', error, { agentId: this.config.id });
      throw error;
    }

    // 2. Ensure apiHelper is set up
    if (!this.apiHelper) {
      this.apiHelper = new ApiHelper({
        apiDomain: deploymentInfo.apiDomain,
        cache: this.config.cache,
        getToken: () => this.authService.getToken(),
      });
    }

    // 3. Get token from the main strategy (defaults to anonymous if no auth config provided)
    // Initialize auth service if not already initialized
    if (!this.authService.getIsInitialized()) {
      await this.authService.initialize({
        deploymentInfo: deploymentInfo,
        // No postAuthentication - we don't want session ID or connection yet
      });
    }
    const accessToken = await this.authService.getToken();
    return await this.fetchAgentDetails(accessToken);
  }

  /**
   * Get the deployment information
   * Returns cached deployment info if available, otherwise fetches from network.
   * Does not require initialization - only needs the endpoint URL.
   * @returns Promise resolving to the deployment information
   */
  async getDeploymentInfo(): Promise<any> {
    if (this.deploymentInfo) {
      return this.deploymentInfo;
    }
    // Fetch from network if not cached
    this.logger.debug('Fetching deployment info from network', { endpoint: this.config.endpoint });
    this.deploymentInfo = await ApiHelper.getDeploymentInfo(this.config.endpoint);
    return this.deploymentInfo;
  }

  /**
   * Get the agent name from cached agent details
   * @returns The agent name
   */
  private async getAgentName(): Promise<string> {
    if (!this.agentDetails) {
      throw new Error('Agent details not found. Call initialize() first.');
    }
    return this.agentDetails?.name ?? this.agentDetails?.agentProfileDetails?.name ?? '';
  }

  /**
   * Get session ID
   * @param accessToken - The access token to use for authentication
   * @returns The session ID
   */
  private async getSessionId(accessToken: any): Promise<any> {
    // If sessionId was provided in config, return it (skip network fetch)
    if (this.sessionId !== undefined) {
      this.logger.debug('Using sessionId from config, skipping network fetch', {
        sessionId: this.sessionId,
        agentId: this.resolvedAgentId,
      });
      return this.sessionId;
    }

    // Otherwise, fetch from network (uses resolvedAgentId for chat identity)
    return await this.apiHelper?.getAiAgentSession({
      agentId: this.resolvedAgentId,
      authToken: accessToken ?? await this.authService.getToken() ?? null,
    });
  }

  /**
   * Get WebSocket endpoint
   * @param sessionId - The session ID
   * @returns The WebSocket endpoint
   */
  private getWsEndpoint(sessionId: any): string {
    let websocketUrl = this.deploymentInfo?.aiAgentDomain;
    websocketUrl = websocketUrl.indexOf("http") !== 0 ? "https://" + websocketUrl : websocketUrl;
    try {
      const parsedUrl = new URL(websocketUrl);
      parsedUrl.hostname = `chat.${parsedUrl.hostname}`;
      websocketUrl = parsedUrl.toString();
      websocketUrl = `${websocketUrl}?sessionId=${sessionId}`;
      this.logger.debug('WebSocket endpoint constructed', { endpoint: websocketUrl, sessionId });
    } catch (error) {
      const err = new Error('Failed to get WebSocket endpoint');
      this.logger.error('Failed to construct WebSocket endpoint', err, { sessionId });
      throw err;
    }
    return websocketUrl;
  }

  /**
   * Create the connection after authentication is complete
   * This is called by the postAuthentication callback
   */
  private async createConnection(sessionId: string): Promise<void> {
    if (this.connection) {
      this.logger.debug('Connection already exists, skipping creation', { sessionId });
      return; // Connection already exists
    }

    const wsEndpoint = this.getWsEndpoint(sessionId);
    this.logger.info('Creating connection', { endpoint: wsEndpoint, sessionId });

    // Create connection
    this.connection = new Connection({
      endpoint: wsEndpoint,
      maxReconnectAttempts: this.config.maxReconnectAttempts,
      baseReconnectDelay: this.config.baseReconnectDelay,
      maxReconnectDelay: this.config.maxReconnectDelay,
      logger: this.logger.createChild('Connection'),
    });

    // Forward connection events
    this.setupConnectionEvents();
  }

  /**
   * Whether the agent has completed initialization.
   * Becomes `true` after the init pipeline completes (e.g. after the `initialized` event).
   *
   * @returns `true` if initialized, `false` otherwise
   *
   * @example
   * ```typescript
   * if (agent.getIsInitialized()) {
   *   await agent.connect();
   * } else {
   *   agent.once('initialized', () => agent.connect());
   * }
   * ```
   */
  getIsInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get current connection state.
   * 
   * @returns The current connection state
   * @throws Error if agent is not initialized
   * 
   * @example
   * ```typescript
   * const state = agent.getState();
   * if (state === ConnectionState.CONNECTED) {
   *   console.log("Ready to send messages");
   * }
   * ```
   * 
   * @see {@link ConnectionState} for available states
   */
  getState(): ConnectionState {
    if (!this.connection) {
      const error = new Error('Connection not initialized. Call initialize() first.');
      this.logger.error('Failed to get connection state', error, { agentId: this.resolvedAgentId });
      throw error;
    }
    return this.connection.getState();
  }

  /**
   * Check if the agent is currently connected.
   * 
   * @returns `true` if connected, `false` otherwise
   * 
   * @example
   * ```typescript
   * if (agent.isConnected()) {
   *   await agent.send("Hello!");
   * } else {
   *   console.log("Waiting for connection...");
   * }
   * ```
   */
  isConnected(): boolean {
    return this.connection?.isConnected() ?? false;
  }

  /**
   * Connect to the agent endpoint.
   *
   * Establishes a WebSocket connection to the AI Agent server. Must call {@link initialize} first.
   *
   * For Contact Center agents, the connection object is created lazily on this call (session fetch
   * uses the resolved agent ID, including Flow B after agent selection).
   *
   * @throws Error if agent is not initialized
   *
   * @example
   * ```typescript
   * await agent.initialize();
   * await agent.connect();
   * console.log("Connected!");
   * ```
   */
  async connect(): Promise<void> {
    this.logger.debug('connect() called', {
      agentId: this.resolvedAgentId,
      instanceId: (this as any)._instanceId,
      isInitialized: this.isInitialized,
      hasConnection: !!this.connection,
    });

    if (!this.isInitialized) {
      const error = new Error('Agent not initialized. Call initialize() first.');
      this.logger.error('Failed to connect: agent not initialized', error, {
        agentId: this.resolvedAgentId,
        isInitialized: this.isInitialized,
      });
      throw error;
    }

    // Lazy connection creation: if no connection exists (CC flow or PKCE redirect),
    // get token, fetch session, create connection
    if (!this.connection) {
      const accessToken = await this.authService.getToken();
      if (!accessToken) {
        const error = new Error('Connection not initialized. Ensure initialize() completed successfully and authentication completed.');
        this.logger.error('Failed to connect: no access token', error, {
          agentId: this.resolvedAgentId,
          isInitialized: this.isInitialized,
          hasConnection: false,
        });
        throw error;
      }
      this.logger.debug('Lazily creating connection', { agentId: this.resolvedAgentId });
      this.sessionId = await this.getSessionId(accessToken);
      await this.createConnection(this.sessionId);
    }

    this.logger.info('Connecting to agent', { agentId: this.resolvedAgentId });
    await this.connection!.connect();
  }

  /**
   * Disconnect from the agent endpoint.
   * 
   * By default, sends a graceful disconnect message before closing the connection.
   * Use `skipGracefulDisconnect: true` for immediate disconnection.
   * 
   * @param options - Disconnect options
   * @param options.skipGracefulDisconnect - If true, skip sending graceful disconnect message
   * 
   * @example Graceful disconnect
   * ```typescript
   * await agent.disconnect();
   * ```
   * 
   * @example Immediate disconnect
   * ```typescript
   * await agent.disconnect({ skipGracefulDisconnect: true });
   * ```
   */
  async disconnect(options?: { skipGracefulDisconnect?: boolean }): Promise<void> {
    if (!this.connection) {
      this.logger.debug('Connection not initialized, skipping disconnect', { agentId: this.resolvedAgentId });
      return; // Already disconnected or not initialized
    }

    // Send graceful disconnect message if connected and not skipped
    if (this.connection.isConnected() && !options?.skipGracefulDisconnect) {
      try {
        this.logger.debug('Sending graceful disconnect message', { agentId: this.resolvedAgentId });
        const gracefulDisconnectMessage = createGracefulDisconnectMessage();
        await this.send(gracefulDisconnectMessage);
        // Give a small delay to ensure the message is sent before disconnecting
        await this.delay(100);
      } catch (error) {
        // Log error but continue with disconnect
        const err = error instanceof Error ? error : new Error(String(error));
        this.logger.warn('Failed to send graceful disconnect message, continuing with disconnect', {
          error: err,
          agentId: this.resolvedAgentId
        });
      }
    }

    this.logger.info('Disconnecting from agent', { agentId: this.resolvedAgentId });
    this.connection.disconnect();
  }

  /**
   * Select a portal (CC flow). Call when portalsAvailable event is emitted and user has chosen.
   *
   * @param portal - The selected portal
   * @throws Error if portal initializer is not active
   *
   * @example
   * ```typescript
   * agent.on('portalsAvailable', (e) => {
   *   const portal = showPortalPicker(e.payload.portals);
   *   agent.selectPortal(portal);
   * });
   * ```
   */
  selectPortal(portal: Portal): void {
    if (!this.portalInitializer) {
      throw new Error('selectPortal can only be called during portal initialization flow');
    }
    this.portalInitializer.onPortalSelected(portal);
  }

  /**
   * Select an agent (Flow B only — `initParams.isDefaultAgent === "true"`).
   * Call when `agentsAvailable` is emitted and the user has chosen.
   *
   * @param agent - The selected agent
   * @throws Error if portal initializer is not active
   *
   * @example
   * ```typescript
   * agent.on('agentsAvailable', (e) => {
   *   const selected = showAgentPicker(e.payload.agents);
   *   agent.selectAgent(selected);
   * });
   * ```
   */
  selectAgent(agent: AgentListItem): void {
    if (!this.portalInitializer) {
      throw new Error('selectAgent can only be called during portal initialization flow');
    }
    this.portalInitializer.onAgentSelected(agent);
  }

  /**
   * Select a user profile (CC flow). Call when profilesAvailable event is emitted and user has chosen.
   *
   * @param profile - The selected profile
   * @throws Error if portal initializer is not active
   *
   * @example
   * ```typescript
   * agent.on('profilesAvailable', (e) => {
   *   const profile = showProfilePicker(e.payload.profiles);
   *   agent.selectUserProfile(profile);
   * });
   * ```
   */
  selectUserProfile(profile: UserProfile): void {
    if (!this.portalInitializer) {
      throw new Error('selectUserProfile can only be called during portal initialization flow');
    }
    this.portalInitializer.onProfileSelected(profile);
  }

  /**
   * Get the stored initialization parameters from config.
   *
   * @returns The init params object (empty object if none provided)
   *
   * @example
   * ```typescript
   * const initParams = agent.getInitParams();
   * const userId = initParams.userid;
   * ```
   */
  getInitParams(): Record<string, string> {
    return { ...this.initParams };
  }

  /**
   * Restart the CC widget initialization pipeline from scratch.
   *
   * This method tears down the current initialization state and re-runs the
   * full pipeline (portal selection → agent selection → profile selection),
   * allowing the consumer to make new selections. After completion, the
   * `initialized` event fires again and the consumer should call `connect()`.
   *
   * **What it does:**
   * 1. Checks `completedPortalPipeline`: if false (non-CC agent), delegates to `restartConnection()` and returns
   * 2. Destroys the current `PortalInitializer` instance (rejects any pending gating promises)
   * 3. Disconnects the current WebSocket connection (if any) and clears session, queue, transcript
   * 4. Resets `resolvedAgentId` to `config.id` and `isInitialized` to false
   * 5. Re-obtains an auth token and calls `onAuthComplete` to restart the pipeline (or direct flow)
   *
   * **Important:** For agents that completed the CC initialization pipeline
   * (portal → agent → profile selection), this re-runs the full pipeline.
   * For agents that did not complete it (e.g. direct flow from the start, or
   * contact-center agents that fell back to direct flow because they have no
   * portals), this method delegates to `restartConnection()` so the consumer
   * can call it for any restart without branching. The consumer must
   * re-register or still have active event listeners for `portalsAvailable`,
   * `agentsAvailable`, `profilesAvailable`, and `initialized` before calling
   * this method (CC pipeline path only).
   *
   * @throws Error if authentication token cannot be obtained (CC path) or for restart (direct path)
   *
   * @example
   * ```typescript
   * // User wants to switch portals — restart the pipeline
   * agent.on('portalsAvailable', (e) => {
   *   showPortalPicker(e.payload.portals, (p) => agent.selectPortal(p));
   * });
   *
   * agent.on('initialized', async () => {
   *   await agent.connect();
   * });
   *
   * await agent.restartPortalInitializer();
   * ```
   */
  async restartPortalInitializer(): Promise<void> {
    if (!this.completedPortalPipeline) {
      this.logger.debug('restartPortalInitializer: agent did not complete portal pipeline, delegating to restartConnection', {
        agentId: this.config.id,
      });
      await this.restartConnection();
      return;
    }

    if (this.portalInitializer) {
      this.portalInitializer.destroy();
      this.portalInitializer = undefined;
    }

    // Clear profile cache so the restarted pipeline fetches fresh data
    if (this.lastSelectedPortal?.id != null) {
      this.contextCacheAdapter.delete(this.getPipelineProfilesCacheKey(this.lastSelectedPortal.id));
    }

    if (this.connection) {
      await this.disconnect();
    }

    this.connection = undefined;
    this.sessionId = undefined;
    this.clearQueue();
    this.clearTranscript();
    if (this.initParams.platform === "test") {
      this.clearCallTranscript();
    }
    this.resolvedAgentId = this.config.id;
    this.isInitialized = false;

    const accessToken = await this.authService.getToken();
    if (!accessToken) {
      const error = new Error('Failed to get access token for restart');
      this.logger.error('restartPortalInitializer: no access token', error, { agentId: this.config.id });
      throw error;
    }
    await this.onAuthComplete(accessToken);
  }

  /**
   * @deprecated Use {@link restartPortalInitializer} instead.
   */
  async restartCcWidgetInitializer(): Promise<void> {
    return this.restartPortalInitializer();
  }

  /**
   * Update the active user profile after initialization.
   *
   * Use this when the consumer wants to switch profiles without re-running the
   * full portal/agent selection pipeline. This method:
   * 1. Persists the new profile selection via the `selectUserProfile` API
   *    (if the profile is not already the last-used profile)
   * 2. Disconnects the current WebSocket connection (if any)
   * 3. Clears the message queue and transcript
   * 4. Fetches a new session ID and reconnects
   * 5. Emits `initialized` with the updated profile in the payload
   *
   * This is the equivalent of the cc-widget's profile dropdown behavior:
   * change the profile → restart session → re-send user context.
   *
   * **Important:** This method is only valid after the CC initialization
   * pipeline has completed. Calling it on a non-CC agent or before
   * initialization throws an error.
   *
   * @param profile - The new user profile to activate
   * @throws Error if agent is not initialized
   * @throws Error if agent did not go through the CC initialization flow
   * @throws Error if no portal is currently selected
   *
   * @example
   * ```typescript
   * // User picks a different profile from a dropdown
   * const profiles = cachedProfiles; // from the profilesAvailable event
   * agent.on("initialized", async () => {
   *   await agent.connect();
   * });
   * await agent.updateUserProfile(profiles[2]);
   * ```
   */
  async updateUserProfile(profile: UserProfile): Promise<void> {
    if (!this.isInitialized) {
      const error = new Error('updateUserProfile can only be called after initialization');
      this.logger.error('updateUserProfile: agent not initialized', error, { agentId: this.config.id });
      throw error;
    }
    if (!this.completedPortalPipeline) {
      const error = new Error('updateUserProfile can only be called on agents that used the portal initialization flow');
      this.logger.error('updateUserProfile: not a portal-configured agent', error, { agentId: this.config.id });
      throw error;
    }
    if (!this.lastSelectedPortal) {
      const error = new Error('updateUserProfile requires a selected portal');
      this.logger.error('updateUserProfile: no portal selected', error, { agentId: this.config.id });
      throw error;
    }

    if (profile.id !== 'none' && !profile.isLastUsedInPortal && this.apiHelper) {
      try {
        await this.apiHelper.selectUserProfile({
          portalId: this.lastSelectedPortal.id,
          profileId: profile.id,
        });
      } catch (err) {
        this.logger.warn('Failed to persist profile selection in updateUserProfile', {
          error: err instanceof Error ? err : new Error(String(err)),
          agentId: this.config.id,
        });
      }
    }

    await this.restartConnection();

    const payload: AgentEventPayloadMap['initialized'] = {
      portal: this.lastSelectedPortal,
      profile,
      availableProfiles: this.cachedProfiles,
      agent: this.agentDetails ?? { agentId: this.resolvedAgentId, name: 'Unknown' },
    };
    this.emit('initialized', this.createAgentEventResponse('initialized', payload));
  }

  /**
   * Restart the connection with a fresh session.
   * 
   * This method:
   * 1. Gracefully disconnects from the current session
   * 2. Clears all queued messages and transcript
   * 3. Obtains a new session ID (or uses provided one)
   * 4. Reconnects to the new session
   * 5. Sends any stored context to the new session
   * 
   * **Note:** All queued messages will be lost during restart.
   * 
   * @param options - Optional restart options
   * @param options.sessionId - Optional session ID to use for restart. If provided, skips fetching from network.
   * @throws Error if agent is not initialized
   * 
   * @example
   * ```typescript
   * // Start a fresh conversation (fetches new sessionId)
   * await agent.restartConnection();
   * 
   * // Restart with a specific sessionId
   * await agent.restartConnection({ sessionId: 'existing-session-id' });
   * 
   * // Context is automatically restored
   * await agent.send("Hello again!");
   * ```
   */
  async restartConnection(options?: { sessionId?: string | number }): Promise<void> {
    // Validate that agent is initialized
    if (!this.isInitialized) {
      const error = new Error('Agent not initialized. Call initialize() first.');
      this.logger.error('Failed to restart connection: agent not initialized', error, { agentId: this.resolvedAgentId });
      throw error;
    }

    if (!this.apiHelper) {
      const error = new Error('API helper not initialized. Call initialize() first.');
      this.logger.error('Failed to restart connection: API helper not initialized', error, { agentId: this.resolvedAgentId });
      throw error;
    }

    try {
      this.logger.info('Restarting connection', { agentId: this.resolvedAgentId, sessionId: this.sessionId });

      // Step 1: Gracefully disconnect from current session
      if (this.connection) {
        await this.disconnect();
      }

      // Step 2: Clear all queued messages and transcript - previous messages will be lost
      this.clearQueue();
      this.clearTranscript();
      this.logger.debug('Message queue and transcript cleared', { agentId: this.resolvedAgentId });

      // Step 3: Get new sessionId
      let newSessionId: string | number;
      
      if (options?.sessionId !== undefined) {
        // Use provided sessionId
        newSessionId = options.sessionId;
        this.logger.debug('Using provided sessionId for restart', {
          agentId: this.resolvedAgentId,
          providedSessionId: newSessionId
        });
      } else {
        // Fetch new sessionId from API (ignore config sessionId for restart)
        const accessToken = await this.authService.getToken();
        if (!accessToken) {
          const error = new Error('Failed to get access token for restart');
          this.logger.error('Failed to restart connection: access token not available', error, { agentId: this.resolvedAgentId });
          throw error;
        }

        newSessionId = await this.apiHelper?.getAiAgentSession({
          agentId: this.resolvedAgentId,
          authToken: accessToken,
        });

        if (!newSessionId) {
          const error = new Error('Failed to get new sessionId for restart');
          this.logger.error('Failed to restart connection: new sessionId not obtained', error, { agentId: this.resolvedAgentId });
          throw error;
        }
      }

      this.logger.debug('New sessionId obtained', {
        agentId: this.resolvedAgentId,
        oldSessionId: this.sessionId,
        newSessionId
      });

      // Step 5: Clean up existing connection
      // Set connection to undefined to allow createConnection to create a new one
      this.connection = undefined;

      // Step 6: Update sessionId
      this.sessionId = newSessionId;

      // Step 7: Create new connection with new sessionId
      await this.createConnection(String(newSessionId));

      // Step 8: Connect to the new session
      await this.connect();

      // Step 9: Send stored context immediately after reconnection
      await this.sendStoredContext();

      this.logger.info('Connection restarted successfully', {
        agentId: this.resolvedAgentId,
        newSessionId
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Failed to restart connection', err, { agentId: this.resolvedAgentId });
      this.emit('error', this.createAgentEventResponse('error', {
        error: err,
      }));
      throw err;
    }
  }

  /**
   * Normalize input data to a Message instance
   * @private
   */
  private normalizeToMessage(
    data: any,
    options?: { id?: string; from?: string; to?: string }
  ): Message {
    // Already a Message instance
    if (data instanceof Message) {
      // Update from/to if provided in options
      if (options?.from !== undefined || options?.to !== undefined) {
        return data.clone({
          from: options?.from ?? data.from,
          to: options?.to ?? data.to,
        });
      }
      return data;
    } else if (typeof data === 'string') {
      // String input - create customer message
      return new Message(PERSONA.CUSTOMER, ROLE.HUMAN, data, {
        messageId: options?.id,
        from: options?.from,
        to: options?.to,
      });
    } else if (data && typeof data === 'object') {
      // Object input - extract message properties
      return new Message(
        data.persona || PERSONA.CUSTOMER,
        data.role || ROLE.HUMAN,
        data.content,
        {
          messageId: options?.id || data.messageId,
          messageData: data.messageData,
          from: options?.from || data.from,
          to: options?.to || data.to,
        }
      );
    } else {
      throw new MessageError('Invalid message data: must be a Message instance, string, or object');
    }
  }

  /**
   * Send a message to the agent
   * Messages are queued if offline and automatically sent when connected
   * Context messages are automatically stored in cache for use on reconnection
   * @param data - Message data (can be a Message instance, plain object, or string)
   * @param options - Optional message options
   * @param options.id - Optional message ID
   * @param options.from - Optional sender identifier (agent ID, customer ID, etc.)
   * @param options.to - Optional recipient identifier (agent ID, etc.)
   * @returns Message ID
   */
  async send(data: any, options?: { id?: string; from?: string; to?: string }): Promise<string> {
    // Check if this is a context message and store the context before normalizing
    if (this.isContextMessage(data)) {
      const context = this.extractContextFromMessage(data);
      if (context) {
        this.storeContext(context);
      }
    }

    let message = this.normalizeToMessage(data, options);

    // Assign default from/to values before validation
    if (!message.from || !message.to) {
      message = message.clone({
        from: message.from || 'customer',
        to: message.to || await this.getAgentName(),
      });
    }

    // Validate message
    message.validate();

    // Serialize message for transmission
    const payload = message.toPayloadString();
    this.logger.debug('Sending message', {
      messageId: message.messageId,
      from: message.from,
      to: message.to,
      payload
    });
    const messageId = message.messageId || options?.id || this.generateMessageId();

    // Store message in transcript before sending
    this.transcript.add(message, 'sent', this.sessionId, this.resolvedAgentId);

    // Emit transcript update event
    this.emit('transcriptUpdate', {
      type: 'transcriptUpdate',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      agentId: this.resolvedAgentId,
      payload: {
        entry: {
          message,
          direction: 'sent',
          timestamp: message.timestamp || Date.now(),
          sessionId: this.sessionId,
          agentId: this.resolvedAgentId,
        },
      },
    });

    // If connection exists and is connected, try to send immediately
    if (this.connection?.isConnected()) {
      try {
        await this.connection.send(payload);
        this.logger.debug('Message sent successfully', { messageId });
        return messageId;
      } catch (error) {
        // If send fails, queue the message
        if (error instanceof ConnectionError) {
          this.logger.warn('Failed to send message, queueing', { messageId, error: error.message });
          return this.queueMessage(JSON.parse(payload), messageId);
        }
        this.logger.error('Failed to send message', error instanceof Error ? error : new Error(String(error)), { messageId });
        throw error;
      }
    }

    // Queue the message if not connected or connection not initialized
    this.logger.debug('Connection not available, queueing message', { messageId, queueSize: this.messageQueue.size() });
    return this.queueMessage(payload, messageId);
  }

  /**
   * Get the current queue size
   */
  getQueueSize(): number {
    return this.messageQueue.size();
  }

  /**
   * Clear the message queue
   */
  clearQueue(): void {
    this.messageQueue.clear();
  }

  /**
   * Get transcript entries
   * @param options - Optional filtering options
   * @returns Array of transcript entries with Message objects
   */
  getTranscript(options?: TranscriptOptions): TranscriptEntry[] {
    return this.transcript.getEntries(options);
  }

  /**
   * Get transcript entries as plain objects (JSON-serializable)
   * @param options - Optional filtering options
   * @returns Array of plain objects representing transcript entries
   */
  getTranscriptAsJSON(options?: TranscriptOptions): any[] {
    return this.transcript.getEntriesAsJSON(options);
  }

  /**
   * Get the number of entries in the transcript
   * @returns Number of transcript entries
   */
  getTranscriptSize(): number {
    return this.transcript.size();
  }

  /**
   * Clear all transcript entries
   */
  clearTranscript(): void {
    this.transcript.clear();
  }

  /**
   * Get the call transcript — the live customer-agent conversation from the
   * telephony platform (Genesys, Amazon Connect, etc.), pushed by the platform
   * connector via the HookContract.
   *
   * This is distinct from {@link getTranscript}, which returns the AI Agent
   * chat transcript (WebSocket messages).
   *
   * @returns A shallow copy of the call transcript entries
   */
  getCallTranscript(): CallTranscriptEntry[] {
    return [...this.callTranscript];
  }

  /**
   * Get the caller information set by the platform connector via
   * HookContract.setCallerInfo(). Available after the platform connector
   * has initialized (typically before the `initialized` event fires).
   *
   * @returns The caller info object, or null if not yet set
   */
  getCallerInfo(): CallerInfo | null {
    return this.callerInfo;
  }

  /**
   * Returns the authenticated user's or customer's details fetched after authentication.
   * Available after the `initialized` event fires. Returns null if details could not be fetched.
   */
  getUserDetails(): UserDetails | null {
    return this.userDetails;
  }

  getConversationId(): string | null {
    return this.conversationId;
  }

  /**
   * Clear all call transcript entries.
   */
  clearCallTranscript(): void {
    this.callTranscript = [];
  }

  /**
   * Get the context cache key for this agent
   * @returns The cache key for storing context
   */
  private getContextCacheKey(): string {
    return `${CONTEXT_CACHE_KEY_PREFIX}${this.resolvedAgentId}`;
  }

  /**
   * Cache key for persisted profile list (pipeline restart).
   * Includes portalId so switching portals doesn't serve stale profiles.
   */
  private getPipelineProfilesCacheKey(portalId?: string | number): string {
    const suffix = portalId != null
      ? `${this.resolvedAgentId}_${portalId}`
      : this.resolvedAgentId;
    return `${PIPELINE_PROFILES_CACHE_KEY_PREFIX}${suffix}`;
  }

  /**
   * Check if a message is a context message
   * @param data - The message data to check
   * @returns True if this is a context message
   */
  private isContextMessage(data: any): boolean {
    if (data instanceof Message) {
      return data.persona === PERSONA.SYSTEM && data.role === ROLE.CONTEXT;
    }
    if (data && typeof data === 'object') {
      return data.persona === PERSONA.SYSTEM && data.role === ROLE.CONTEXT;
    }
    return false;
  }

  /**
   * Extract context data from a context message
   * @param data - The message data to extract context from
   * @returns The context object or null if not a context message
   */
  private extractContextFromMessage(data: any): object | null {
    if (data instanceof Message) {
      return data.messageData?.context || null;
    }
    if (data && typeof data === 'object') {
      return data.messageData?.context || null;
    }
    return null;
  }

  /**
   * Store context in cache
   * @param context - The context object to store
   */
  private storeContext(context: object): void {
    const cacheKey = this.getContextCacheKey();
    this.contextCacheAdapter.set(cacheKey, {
      value: context,
      timestamp: Date.now(),
    });
      this.logger.debug('Context stored in cache', { agentId: this.resolvedAgentId, context });
  }

  /**
   * Get the stored context for this agent
   * Returns the context object that was previously sent via a context message
   * @returns The stored context object or null if no context is stored
   */
  getContext(): object | null {
    const cacheKey = this.getContextCacheKey();
    const entry = this.contextCacheAdapter.get<object>(cacheKey);
    if (!entry) {
      return null;
    }
    return entry.value;
  }

  /**
   * Remove the stored context for this agent
   * Clears any previously stored context from the cache
   */
  removeContext(): void {
    const cacheKey = this.getContextCacheKey();
    this.contextCacheAdapter.delete(cacheKey);
    this.logger.debug('Context removed from cache', { agentId: this.resolvedAgentId });
  }

  /**
   * Set context for this agent
   * Stores the context in cache and optionally sends it to the agent immediately
   * @param context - The context object to set
   * @param options - Optional settings
   * @param options.sendImmediately - If true, sends the context to the agent right away (default: false)
   * @returns Promise that resolves when context is set (and sent if sendImmediately is true)
   * 
   * @example Set context without sending
   * ```typescript
   * agent.setContext({ userId: "123", plan: "premium" });
   * ```
   * 
   * @example Set and send context immediately
   * ```typescript
   * await agent.setContext({ userId: "123", plan: "premium" }, { sendImmediately: true });
   * ```
   */
  async setContext(context: object, options?: { sendImmediately?: boolean }): Promise<void> {
    this.storeContext(context);
    this.logger.info('Context set', { agentId: this.resolvedAgentId, context });

    if (options?.sendImmediately) {
      const contextMessage = createContextMessage({ context });
      await this.send(contextMessage);
      this.logger.debug('Context sent immediately after setContext', { agentId: this.resolvedAgentId });
    }
  }

  /**
   * Reset (clear) the context for this agent
   * Removes any stored context from the cache
   * This is an alias for removeContext() with additional logging
   * 
   * @example
   * ```typescript
   * agent.resetContext();
   * ```
   */
  resetContext(): void {
    this.removeContext();
    this.logger.info('Context reset', { agentId: this.resolvedAgentId });
  }

  /**
   * Send stored context to the agent
   * This is called internally after reconnection to restore context
   * @returns Promise that resolves when context is sent (or immediately if no context)
   */
  private async sendStoredContext(): Promise<void> {
    const context = this.getContext();
    if (!context) {
      this.logger.debug('No stored context to send', { agentId: this.resolvedAgentId });
      return;
    }

    try {
      this.logger.debug('Sending stored context after reconnection', { agentId: this.resolvedAgentId, context });
      const contextMessage = createContextMessage({ context });
      await this.send(contextMessage);
      this.logger.info('Stored context sent successfully', { agentId: this.resolvedAgentId });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Failed to send stored context', err, { agentId: this.resolvedAgentId });
      // Don't throw - allow the connection to continue even if context send fails
    }
  }

  /**
   * Setup connection event forwarding
   */
  private setupConnectionEvents(): void {
    if (!this.connection) {
      return;
    }

    this.connection.on('connected', async (event) => {
      this.logger.info('Connection established', { sessionId: this.sessionId, agentId: this.resolvedAgentId });

      // Send token immediately if agent requires authentication
      await this.sendAuthTokenIfRequired();

      this.emit('connected', this.createAgentEventResponse('connected', {}, {
        timestamp: event.timestamp,
      }));
      // Flush queue when connected
      this.flushQueue();
    });

    this.connection.on('message', async (event) => {
      try {
        // Parse incoming message
        let sessionContext = {
          agentId: this.resolvedAgentId,
          sessionId: this.sessionId,
          customerName: "customer",
          agentName: this.agentDetails?.agentProfileDetails?.name,
        };
        const message = Message.fromJSON(event.data, sessionContext);
        this.logger.debug('Message received', {
          messageId: message.messageId,
          persona: message.persona,
          role: message.role
        });

        // Store message in transcript
        this.transcript.add(message, 'received', this.sessionId, this.resolvedAgentId);

        // Emit transcript update event
        this.emit('transcriptUpdate', {
          type: 'transcriptUpdate',
          timestamp: Date.now(),
          sessionId: this.sessionId,
          agentId: this.resolvedAgentId,
          payload: {
            entry: {
              message,
              direction: 'received',
              timestamp: message.timestamp || Date.now(),
              sessionId: this.sessionId,
              agentId: this.resolvedAgentId,
            },
          },
        });

        // Process message through handler chain
        const result = await this.messageProcessor.process(message);

        // Emit generic message event
        this.emit('message', this.createAgentEventResponse('message', {
          data: message,
        }));

        // Emit typed events based on handler result
        if (result) {
          if (result.type === 'agent_message') {
            this.logger.debug('Agent message processed', {
              messageId: message.messageId,
              from: result.from?.name
            });
            // Extract payload from result, excluding timestamp, sessionId, agentId
            const { timestamp, sessionId, agentId, ...payload } = result;
            this.emit('agentMessage', this.createAgentEventResponse('agentMessage',
              payload as AgentEventPayloadMap['agentMessage'],
              {
                sessionId: this.sessionId ?? sessionId,
                agentId: this.resolvedAgentId ?? agentId,
              }
            ));
          } else if (result.type === 'error_message') {
            // Create error object with message details
            const errorMessage = message.content || 'Error message received';
            const error = new Error(errorMessage);

            this.logger.error('Error message received', error, {
              messageId: message.messageId,
              errorCode: message.messageData?.error_code,
              content: message.content
            });

            // Emit errorMessage event
            this.emit('errorMessage', this.createAgentEventResponse('errorMessage', {
              message,
              error,
            }));

            // Optionally close connection on error (similar to reference implementation)
            // Consumers can handle connection closure in the errorMessage event handler if needed
            this.logger.debug('Error message event emitted, connection may need to be closed by consumer');
          } else if (result.type === 'heartbeat_processed') {
            this.logger.debug('Heartbeat processed', { messageId: message.messageId });
            // Extract payload from result, excluding timestamp, sessionId, agentId
            const { timestamp, sessionId, agentId, ...payload } = result;
            this.emit('heartbeat', this.createAgentEventResponse('heartbeat',
              payload as AgentEventPayloadMap['heartbeat'],
              {
                sessionId: this.sessionId ?? sessionId,
                agentId: this.resolvedAgentId ?? agentId,
              }
            ));
          } else if (result.type === 'token_refresh_required') {
            // Emit tokenExpiring event when transport layer requests token refresh
            this.logger.debug('Token refresh required by transport layer', { messageId: message.messageId });
            this.emit('tokenExpiring', this.createAgentEventResponse('tokenExpiring', {
              reason: 'transport_request',
            }));
          }
        }
      } catch (error) {
        // If message parsing fails, emit error but still emit raw message event
        const err = error instanceof Error ? error : new Error(String(error));
        this.logger.error('Failed to process message', err, { rawData: event.data });
        this.emit('error', this.createAgentEventResponse('error', {
          error: err,
        }));
        this.emit('message', this.createAgentEventResponse('message', {
          data: event.data,
        }));
      }
    });

    this.connection.on('error', (event) => {
      this.logger.error('Connection error', event.error, {
        sessionId: this.sessionId,
        agentId: this.resolvedAgentId
      });
      this.emit('error', this.createAgentEventResponse('error', {
        error: event.error,
      }, {
        timestamp: event.timestamp,
      }));
    });

    this.connection.on('closed', (event) => {
      this.logger.info('Connection closed', {
        code: event.code,
        reason: event.reason,
        sessionId: this.sessionId,
        agentId: this.resolvedAgentId
      });
      this.emit('closed', this.createAgentEventResponse('closed', {
        code: event.code,
        reason: event.reason,
      }, {
        timestamp: event.timestamp,
      }));
    });

    this.connection.on('stateChanged', (event) => {
      this.logger.debug('Connection state changed', {
        previousState: event.previousState,
        newState: event.state,
        sessionId: this.sessionId,
        agentId: this.resolvedAgentId
      });
      this.emit('stateChanged', this.createAgentEventResponse('stateChanged', {
        state: event.state,
        previousState: event.previousState,
      }));
    });
  }

  /**
   * Send authentication token to agent if authentication is required
   * This is called immediately after connection is established
   */
  private async sendAuthTokenIfRequired(): Promise<void> {
    // Check if agent requires authentication (isAuthenticated flag in agent details)
    const isAuthenticationRequired = this.agentDetails?.isAuthenticated;

    if (!isAuthenticationRequired) {
      this.logger.debug('Authentication not required, skipping token send', { agentId: this.resolvedAgentId });
      return;
    }

    try {
      // Get the current access token
      const authToken = await this.authService.getToken();

      if (!authToken) {
        this.logger.warn('Authentication required but no token available', { agentId: this.resolvedAgentId });
        return;
      }

      // Create and send the token message
      const tokenMessage = createTokenMessage({ token: authToken });
      const payload = JSON.stringify(tokenMessage);

      if (this.connection?.isConnected()) {
        await this.connection.send(payload);
        this.logger.debug('Authentication token sent to agent', { agentId: this.resolvedAgentId });
      } else {
        this.logger.warn('Cannot send auth token: connection not available', { agentId: this.resolvedAgentId });
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Failed to send authentication token', err, { agentId: this.resolvedAgentId });
      // Don't throw - allow connection to continue even if token send fails
    }
  }

  /**
   * Queue a message for later sending
   */
  private queueMessage(data: any, id?: string): string {
    try {
      const messageId = this.messageQueue.enqueue(data, id);
      this.logger.debug('Message queued', { messageId, queueSize: this.messageQueue.size() });
      return messageId;
    } catch (error) {
      const err = new MessageError(
        'Failed to queue message',
        error instanceof Error ? error : new Error(String(error))
      );
      this.logger.error('Failed to queue message', err, { messageId: id });
      throw err;
    }
  }

  /**
   * Flush queued messages when connected
   */
  private async flushQueue(): Promise<void> {
    if (this.isFlushingQueue || !this.connection?.isConnected()) {
      return;
    }

    this.isFlushingQueue = true;
    let flushedCount = 0;
    const queueSize = this.messageQueue.size();

    if (queueSize > 0) {
      this.logger.debug('Flushing message queue', { queueSize });
    }

    try {
      while (!this.messageQueue.isEmpty() && this.connection?.isConnected()) {
        const message = this.messageQueue.peek();
        if (!message) {
          break;
        }

        try {
          await this.connection.send(message.data);
          this.messageQueue.dequeue();
          flushedCount++;
          // Small delay between messages to avoid overwhelming the connection
          await this.delay(5);
        } catch (error) {
          // If send fails, mark as attempted
          const shouldRetry = this.messageQueue.markAttempted(message.id);
          if (!shouldRetry) {
            // Max attempts reached, remove from queue
            this.messageQueue.remove(message.id);
            const err = new MessageError(
              `Failed to send queued message after max attempts: ${message.id}`,
              error instanceof Error ? error : new Error(String(error))
            );
            this.logger.error('Failed to send queued message after max attempts', err, { messageId: message.id });
            this.emit('error', this.createAgentEventResponse('error', {
              error: err,
            }));
          } else {
            // Wait a bit before retrying
            this.logger.debug('Retrying queued message', { messageId: message.id });
            await this.delay(100);
          }
        }
      }

      if (flushedCount > 0) {
        this.logger.info('Message queue flushed', { count: flushedCount });
        this.emit('queueFlushed', this.createAgentEventResponse('queueFlushed', {
          count: flushedCount,
        }));
      }
    } finally {
      this.isFlushingQueue = false;
    }
  }

  /**
   * Create an AgentEvent object with automatic timestamp, sessionId, and agentId
   * @param type - The event type
   * @param payload - The event-specific payload data
   * @param options - Optional overrides for timestamp, sessionId, or agentId
   * @returns A properly formatted AgentEvent object
   */
  private createAgentEventResponse<T extends AgentEventType>(
    type: T,
    payload: AgentEventPayloadMap[T],
    options?: {
      timestamp?: number;
      sessionId?: string | number;
      agentId?: string | number;
    }
  ): AgentEvent<T> {
    return {
      type,
      timestamp: options?.timestamp ?? Date.now(),
      sessionId: options?.sessionId ?? this.sessionId,
      agentId: options?.agentId ?? this.resolvedAgentId,
      payload,
    };
  }

  /**
   * Generate a unique message ID
   */
  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get the message processor instance
   * Allows adding custom handlers
   */
  getMessageProcessor(): MessageProcessor {
    return this.messageProcessor;
  }

  /**
   * Get the current access token from the authentication strategy
   * Returns the access token that the agent is currently using for authentication
   * @returns Promise resolving to the access token string, or null if no token is available
   * 
   * @example
   * ```typescript
   * const token = await agent.getAccessToken();
   * if (token) {
   *   // Use the token for external API calls
   *   fetch('https://api.example.com/data', {
   *     headers: { Authorization: `Bearer ${token}` }
   *   });
   * }
   * ```
   */
  async getAccessToken(): Promise<string | null> {
    this.logger.debug('Getting access token', { agentId: this.resolvedAgentId });
    try {
      const token = await this.authService.getToken();
      if (token) {
        this.logger.debug('Access token retrieved', { agentId: this.resolvedAgentId, tokenLength: token.length });
      } else {
        this.logger.debug('No access token available', { agentId: this.resolvedAgentId });
      }
      return token;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Failed to get access token', err, { agentId: this.resolvedAgentId });
      throw error;
    }
  }

  /**
   * Update the access token at runtime
   * Use this method when you receive a tokenExpiring event to provide a new token
   * @param token - The new access token
   * @throws Error if the authentication strategy doesn't support token updates
   * 
   * @example
   * ```typescript
   * agent.on('tokenExpiring', async (event) => {
   *   const newToken = await fetchNewTokenFromServer();
   *   await agent.updateAccessToken(newToken);
   * });
   * ```
   */
  async updateAccessToken(token: string): Promise<void> {
    this.logger.debug('Updating access token', { agentId: this.resolvedAgentId });
    await this.authService.updateToken(token);
    this.logger.info('Access token updated successfully', { agentId: this.resolvedAgentId });
  }

  /**
   * Set or update the session ID at runtime
   * Updates the sessionId property, which will be used for future connections and logging.
   * 
   * **Note:** If the agent is currently connected, changing the sessionId will not automatically
   * switch the connection to the new session. You should either:
   * - Disconnect and reconnect with the new sessionId
   * - Use `restartConnection({ sessionId: newSessionId })` to restart with the new session
   * 
   * @param sessionId - The new session ID to set
   * 
   * @example
   * ```typescript
   * // Update sessionId after initialization
   * agent.setSessionId('new-session-id');
   * 
   * // If connected, restart with the new sessionId
   * if (agent.isConnected()) {
   *   await agent.restartConnection({ sessionId: 'new-session-id' });
   * }
   * ```
   */
  setSessionId(sessionId: string | number): void {
    const oldSessionId = this.sessionId;
    this.sessionId = sessionId;
    
    this.logger.info('SessionId updated', {
      agentId: this.resolvedAgentId,
      oldSessionId,
      newSessionId: sessionId,
      isConnected: this.isConnected()
    });

    // Warn if connected - changing sessionId while connected won't affect the current connection
    if (this.isConnected()) {
      this.logger.warn('SessionId updated while connected. Current connection still uses old sessionId. Consider using restartConnection() to switch to the new session.', {
        agentId: this.resolvedAgentId,
        currentSessionId: oldSessionId,
        newSessionId: sessionId
      });
    }
  }
}

