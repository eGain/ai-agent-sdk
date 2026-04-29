import { AuthStrategy, PostAuthenticationCallback, AuthStrategyInitializeOptions, AuthServiceInitializeOptions } from './AuthStrategy.js';
import { AuthProvider } from './AuthProvider.js';
import { AnonymousAuthStrategy, AnonymousAuthConfig, AnonymousAuthCacheConfig } from './AnonymousAuthStrategy.js';
import { PKCEAuthStrategy, PKCEAuthConfig } from './PKCEAuthStrategy.js';
import { PreAuthStrategy, TokenExpiringCallback } from './PreAuthStrategy.js';
import { ClientCredentialsAuthStrategy, ClientCredentialsAuthConfig } from './ClientCredentialsAuthStrategy.js';
import { AuthError } from '../errors/SDKError.js';
import { ApiHelper } from '../api/ApiHelper.js';
import { Logger } from '../logging/Logger.js';
import { globalLogger } from '../logging/globalLogger.js';
import { CacheStorageType } from '../api/CacheAdapter.js';

/**
 * Authentication types supported by the service
 */
export type AuthenticationType =
  | 'anonymous'
  | 'pkce'
  | 'pre-auth'
  | 'client-credentials';

/**
 * Anonymous authentication configuration
 */
export interface AnonymousAuthServiceConfig {
  type: 'anonymous';
  /**
   * Optional anonymous auth config
   */
  config?: AnonymousAuthConfig;
}

/**
 * PKCE authentication configuration
 */
export interface PKCEAuthServiceConfig {
  type: 'pkce';
  /**
   * PKCE configuration options
   */
  config: PKCEAuthConfig;
}

/**
 * Pre-auth authentication configuration
 */
export interface PreAuthServiceConfig {
  type: 'pre-auth';
  /**
   * Access token to use directly
   */
  accessToken: string;
  /**
   * Optional token refresh function
   * If provided, will be called when token needs to be refreshed
   */
  refreshTokenFn?: () => Promise<string>;
}

/**
 * Client credentials authentication configuration
 */
export interface ClientCredentialsAuthServiceConfig {
  type: 'client-credentials';
  /**
   * Client credentials configuration options
   */
  config: ClientCredentialsAuthConfig;
}

/**
 * Union type of all authentication service configurations
 */
export type AuthenticationServiceConfig =
  | AnonymousAuthServiceConfig
  | PKCEAuthServiceConfig
  | PreAuthServiceConfig
  | ClientCredentialsAuthServiceConfig;

/**
 * Input types that AuthenticationService can accept
 * - AuthenticationServiceConfig: Configuration object for automatic strategy selection
 * - AuthProvider: Custom auth provider implementing getToken()
 * - AuthStrategy: Full authentication strategy with lifecycle
 * - undefined: Falls back to anonymous authentication
 */
export type AuthenticationInput =
  | AuthenticationServiceConfig
  | AuthProvider
  | AuthStrategy
  | undefined;

/**
 * AuthenticationService - Centralized authentication management
 * 
 * This service provides a unified interface for authentication by:
 * - Accepting various input types (config objects, AuthProvider, AuthStrategy)
 * - Selecting the appropriate strategy based on input
 * - Implementing the AuthStrategy interface for seamless integration
 * - Providing a single point for authentication logic
 * 
 * @example
 * ```typescript
 * // Using pre-auth with a token
 * const authService = new AuthenticationService({
 *   type: 'pre-auth',
 *   accessToken: 'your-api-key'
 * });
 * 
 * // Using pre-auth with token refresh
 * const authService = new AuthenticationService({
 *   type: 'pre-auth',
 *   accessToken: 'your-jwt-token',
 *   refreshTokenFn: async () => await fetchNewToken()
 * });
 * 
 * // Using PKCE config
 * const authService = new AuthenticationService({
 *   type: 'pkce',
 *   config: {
 *     authorizationUrl: 'https://auth.example.com/authorize',
 *     tokenUrl: 'https://auth.example.com/token',
 *     clientId: 'your-client-id',
 *     redirectUri: 'https://your-app.com/callback'
 *   }
 * });
 * 
 * // No auth (anonymous)
 * const authService = new AuthenticationService();
 * 
 * // Use with AiAgent
 * const agent = new AiAgent({
 *   id: 'agent-id',
 *   endpoint: 'wss://...',
 *   auth: { type: 'pre-auth', accessToken: 'your-token' }
 * });
 * ```
 */
/**
 * Cache configuration options for AuthenticationService
 * Used to configure caching for AnonymousAuthStrategy
 */
export interface AuthServiceCacheConfig {
  enabled?: boolean;
  storageType?: CacheStorageType;
  keyPrefix?: string;
  ttl?: number;
}

export class AuthenticationService implements AuthStrategy {
  private strategy: AuthStrategy;
  private postAuthentication?: PostAuthenticationCallback;
  private isInitialized: boolean = false;
  private readonly authenticationType: AuthenticationType;
  private domain?: string;
  private logger: Logger;
  private cacheConfig?: AuthServiceCacheConfig;

  constructor(private readonly input?: AuthenticationInput, logger?: Logger, cacheConfig?: AuthServiceCacheConfig) {
    this.logger = logger ?? globalLogger;
    this.cacheConfig = cacheConfig;
    const resolved = this.resolveInput(input);
    this.strategy = resolved.strategy;
    this.authenticationType = resolved.type;
    this.logger.debug('AuthenticationService created', { authenticationType: this.authenticationType });
  }

  /**
   * Resolve the input to an authentication strategy
   * Handles all input types: config objects, AuthProvider, AuthStrategy, or undefined
   */
  private resolveInput(input?: AuthenticationInput): { strategy: AuthStrategy; type: AuthenticationType } {
    // No input - default to anonymous with cache config
    if (!input) {
      return {
        strategy: new AnonymousAuthStrategy(this.cacheConfig ? { cache: this.cacheConfig } : undefined),
        type: 'anonymous'
      };
    }

    // AuthenticationServiceConfig - select strategy based on type
    if (this.isAuthenticationServiceConfig(input)) {
      return {
        strategy: this.selectStrategy(input),
        type: input.type
      };
    }

    // AuthStrategy - use directly
    if (this.isAuthStrategy(input)) {
      return {
        strategy: input,
        type: 'pre-auth' // Default type for direct strategy
      };
    }

    // AuthProvider - wrap in a strategy
    if (this.isAuthProvider(input)) {
      return {
        strategy: this.wrapAuthProvider(input),
        type: 'pre-auth'
      };
    }

    throw new AuthError('Invalid authentication input provided');
  }

  /**
   * Type guard to check if input is an AuthenticationServiceConfig
   */
  private isAuthenticationServiceConfig(input: AuthenticationInput): input is AuthenticationServiceConfig {
    return (
      typeof input === 'object' &&
      input !== null &&
      'type' in input &&
      typeof (input as AuthenticationServiceConfig).type === 'string'
    );
  }

  /**
   * Type guard to check if input is an AuthStrategy
   */
  private isAuthStrategy(input: AuthenticationInput): input is AuthStrategy {
    return (
      typeof input === 'object' &&
      input !== null &&
      'initialize' in input &&
      typeof (input as AuthStrategy).initialize === 'function' &&
      'authenticate' in input &&
      typeof (input as AuthStrategy).authenticate === 'function'
    );
  }

  /**
   * Type guard to check if input is an AuthProvider
   */
  private isAuthProvider(input: AuthenticationInput): input is AuthProvider {
    return (
      typeof input === 'object' &&
      input !== null &&
      'getToken' in input &&
      typeof (input as AuthProvider).getToken === 'function' &&
      !('initialize' in input) // Not an AuthStrategy
    );
  }

  /**
   * Wrap an AuthProvider in an AuthStrategy
   */
  private wrapAuthProvider(provider: AuthProvider): AuthStrategy {
    let postAuth: PostAuthenticationCallback | undefined;
    let deploymentInfo: any;

    return {
      initialize: async (options?: AuthStrategyInitializeOptions) => {
        postAuth = options?.postAuthentication;
        deploymentInfo = options?.deploymentInfo;
      },
      authenticate: async () => {
        const token = await provider.getToken();
        if (postAuth) {
          await postAuth(token);
        }
      },
      getToken: () => provider.getToken(),
      cleanup: async () => {
        // No cleanup needed for simple providers
      }
    };
  }

  /**
   * Select the appropriate authentication strategy based on configuration
   */
  private selectStrategy(config: AuthenticationServiceConfig): AuthStrategy {
    switch (config.type) {
      case 'anonymous': {
        // Merge cache config from service if not already provided in anonymous config
        const anonymousConfig = config.config || {};
        if (this.cacheConfig && !anonymousConfig.cache) {
          anonymousConfig.cache = this.cacheConfig;
        }
        return new AnonymousAuthStrategy(anonymousConfig);
      }

      case 'pkce':
        return new PKCEAuthStrategy(config.config);

      case 'pre-auth':
        return new PreAuthStrategy({
          accessToken: config.accessToken,
          refreshTokenFn: config.refreshTokenFn
        });

      case 'client-credentials':
        return new ClientCredentialsAuthStrategy(config.config);

      default:
        // TypeScript exhaustiveness check
        const exhaustiveCheck: never = config;
        throw new AuthError(`Unsupported authentication type: ${(exhaustiveCheck as any).type}`);
    }
  }

  /**
   * Initialize the authentication service
   * Delegates to the selected strategy
   */
  async initialize(options?: AuthServiceInitializeOptions): Promise<void> {
    // Update postAuthentication callback even if already initialized
    // This allows setting the callback after early initialization (e.g., for fetching agent details)
    if (options?.postAuthentication) {
      this.postAuthentication = options.postAuthentication;
    }

    if (this.isInitialized) {
      // If already initialized, still update the strategy's postAuthentication callback if provided
      // This fixes the regression where postAuthentication wasn't set after early initialization
      if (options?.postAuthentication) {
        this.logger.debug('AuthenticationService already initialized, updating postAuthentication callback', { 
          authenticationType: this.authenticationType,
          hasPostAuthentication: !!options.postAuthentication
        });
        // Update the strategy's postAuthentication callback
        await this.strategy.initialize({ 
          deploymentInfo: options?.deploymentInfo,
          scopes: options?.scopes,
          postAuthentication: options.postAuthentication 
        });
        this.logger.debug('Strategy postAuthentication callback updated', { authenticationType: this.authenticationType });
      } else {
        this.logger.debug('AuthenticationService already initialized', { authenticationType: this.authenticationType });
      }
      return;
    }

    this.logger.debug('Initializing AuthenticationService', { authenticationType: this.authenticationType });
    
    // Build scopes: default scopes + core.customermgr.read for customer userType
    let scopes: string[];
    if (options?.scopes) {
      scopes = options.scopes;
    } else {
      scopes = ["knowledge.portalmgr.manage", "core.aiservices.read"];
      if (options?.userType === 'customer') {
        scopes.push("core.customermgr.read");
      }
    }

    const deploymentInfo = options?.deploymentInfo;
    // Use stored postAuthentication if no new one provided
    const postAuth = options?.postAuthentication ?? this.postAuthentication;
    await this.strategy.initialize({ 
      deploymentInfo, 
      scopes: scopes,
      postAuthentication: postAuth 
    });
    this.isInitialized = true;
    this.logger.info('AuthenticationService initialized', { authenticationType: this.authenticationType });
  }

  /**
   * Get the domain for authentication
   */
  getDomain(): string {
    return this.domain ?? '';
  }

  /**
   * Authenticate using the selected strategy
   */
  async authenticate(): Promise<void> {
    this.logger.debug('Authenticating', { authenticationType: this.authenticationType });
    try {
      await this.strategy.authenticate();
      this.logger.info('Authentication successful', { authenticationType: this.authenticationType });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Authentication failed', err, { authenticationType: this.authenticationType });
      throw error;
    }
  }

  /**
   * Get the authentication token from the selected strategy
   */
  async getToken(): Promise<string | null> {
    this.logger.debug('Getting authentication token', { authenticationType: this.authenticationType });
    const token = await this.strategy.getToken();
    if (token) {
      this.logger.debug('Token retrieved successfully', { authenticationType: this.authenticationType, tokenLength: token.length });
    } else {
      this.logger.warn('Token is null', { authenticationType: this.authenticationType });
    }
    return token;
  }

  /**
   * Cleanup resources from the selected strategy
   */
  async cleanup(): Promise<void> {
    this.logger.debug('Cleaning up AuthenticationService', { authenticationType: this.authenticationType });
    if (this.strategy.cleanup) {
      await this.strategy.cleanup();
    }
    this.isInitialized = false;
    this.logger.debug('AuthenticationService cleaned up', { authenticationType: this.authenticationType });
  }

  /**
   * Get the current authentication type
   */
  getAuthenticationType(): AuthenticationType {
    return this.authenticationType;
  }

  /**
   * Check if the service is initialized
   */
  getIsInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get the underlying strategy (for advanced use cases)
   * @returns The underlying AuthStrategy instance
   */
  getStrategy(): AuthStrategy {
    return this.strategy;
  }

  /**
   * Check if the current strategy is anonymous
   * @returns True if the current strategy is anonymous, false otherwise
   */
  isAnonymousStrategy(): boolean {
    return this.authenticationType === 'anonymous';
  }

  /**
   * Check if the current strategy is PKCE
   * @returns True if the current strategy is PKCE, false otherwise
   */
  isPKCEStrategy(): boolean {
    return this.strategy instanceof PKCEAuthStrategy;
  }

  /**
   * Update the access token at runtime
   * Only supported for PreAuthStrategy
   * @param token - The new access token
   * @throws AuthError if the underlying strategy doesn't support token updates
   */
  async updateToken(token: string): Promise<void> {
    this.logger.debug('Updating token', { authenticationType: this.authenticationType });
    
    if (this.strategy instanceof PreAuthStrategy) {
      await this.strategy.updateToken(token);
      this.logger.info('Token updated successfully', { authenticationType: this.authenticationType });
    } else if ('updateToken' in this.strategy && typeof (this.strategy as any).updateToken === 'function') {
      // Support custom strategies that implement updateToken
      await (this.strategy as any).updateToken(token);
      this.logger.info('Token updated successfully', { authenticationType: this.authenticationType });
    } else {
      this.logger.warn('Token update not supported for this authentication type', { authenticationType: this.authenticationType });
      throw new AuthError(`Token update is not supported for authentication type: ${this.authenticationType}`);
    }
  }

  /**
   * Set the callback to be called when token is about to expire
   * Only supported for PreAuthStrategy
   * @param callback - Function to call when token is expiring, receives expiresAt timestamp
   */
  setTokenExpiringCallback(callback: TokenExpiringCallback): void {
    this.logger.debug('Setting token expiring callback', { authenticationType: this.authenticationType });
    
    if (this.strategy instanceof PreAuthStrategy) {
      this.strategy.setTokenExpiringCallback(callback);
      this.logger.debug('Token expiring callback set', { authenticationType: this.authenticationType });
    } else if ('setTokenExpiringCallback' in this.strategy && typeof (this.strategy as any).setTokenExpiringCallback === 'function') {
      // Support custom strategies that implement setTokenExpiringCallback
      (this.strategy as any).setTokenExpiringCallback(callback);
      this.logger.debug('Token expiring callback set', { authenticationType: this.authenticationType });
    } else {
      this.logger.debug('Token expiring callback not supported for this authentication type', { authenticationType: this.authenticationType });
    }
  }

  /**
   * Switch from anonymous strategy to PKCE strategy
   * Only switches if the current strategy is anonymous, otherwise keeps the same strategy
   * @param pkceConfig - PKCE configuration options
   * @returns True if strategy was switched, false if it was already PKCE or not anonymous
   */
  async switchStrategyTo(pkceConfig: PKCEAuthConfig, postAuthentication?: PostAuthenticationCallback): Promise<boolean> {
    // Only switch if current strategy is anonymous
    if (!this.isAnonymousStrategy()) {
      this.logger.debug('Current strategy is not anonymous, keeping existing strategy', { 
        currentType: this.authenticationType 
      });
      return false;
    }

    this.logger.info('Switching from anonymous to PKCE strategy');
    
    // Clean up existing anonymous strategy
    if (this.strategy.cleanup) {
      await this.strategy.cleanup();
    }

    // Create and set new PKCE strategy
    const pkceStrategy = new PKCEAuthStrategy(pkceConfig);
    this.strategy = pkceStrategy;
    
    // Update authentication type (using type assertion to update readonly field)
    (this as any).authenticationType = 'pkce';
    
    // Reset initialization flag since we're switching strategies
    this.isInitialized = false;
    
    // Store postAuthentication callback if provided
    if (postAuthentication) {
      this.postAuthentication = postAuthentication;
    }
    
    this.logger.info('Successfully switched to PKCE strategy');
    return true;
  }
}

