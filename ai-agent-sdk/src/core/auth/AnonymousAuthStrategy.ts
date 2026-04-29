import { AuthStrategy, PostAuthenticationCallback, AuthStrategyInitializeOptions } from './AuthStrategy.js';
import {
    CacheAdapter,
    CacheStorageType,
    createCacheAdapter,
} from '../api/CacheAdapter.js';

/**
 * Cache configuration for AnonymousAuthStrategy
 */
export interface AnonymousAuthCacheConfig {
    /**
     * Whether caching is enabled
     * @default true
     */
    enabled?: boolean;

    /**
     * Storage type: 'local' (localStorage), 'session' (sessionStorage), or 'memory'
     * @default 'session'
     */
    storageType?: CacheStorageType;

    /**
     * Prefix for cache keys
     * @default 'egain_aiagent_auth_metadata_'
     */
    keyPrefix?: string;

    /**
     * Time-to-live in milliseconds
     * @default 300000 (5 minutes)
     */
    ttl?: number;
}

/**
 * Configuration for anonymous authentication strategy
 */
export interface AnonymousAuthConfig {
    /**
     * Cache configuration for metadata
     */
    cache?: AnonymousAuthCacheConfig;
}

/**
 * Default cache TTL (5 minutes)
 */
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/**
 * Default cache key prefix for metadata
 */
const DEFAULT_CACHE_KEY_PREFIX = 'egain_aiagent_auth_';

/**
 * Cache key suffix for anonymous token (will be combined with the key prefix)
 */
const ANONYMOUS_TOKEN_CACHE_KEY_SUFFIX = 'anonymous_token';

/**
 * Cached token entry with expiration
 */
interface CachedToken {
    accessToken: string;
    expiresAt: number; // Timestamp when token expires
}

/**
 * Anonymous authentication strategy
 * No authentication required - user remains anonymous
 */
export class AnonymousAuthStrategy implements AuthStrategy {

    #isInitialized: boolean = false;
    #isAuthenticated: boolean = false;
    #postAuthentication?: PostAuthenticationCallback;
    #deploymentInfo?: any;
    #scopes?: string[];
    
    // Cache related properties
    #cacheEnabled: boolean;
    #cacheAdapter: CacheAdapter | null;
    #cacheKeyPrefix: string;
    #cacheTtl: number;
    
    /**
     * Buffer time in milliseconds to refresh token before it expires
     * This prevents using a token that's about to expire
     */
    static readonly TOKEN_EXPIRY_BUFFER_MS = 60 * 1000; // 1 minute

    constructor(private readonly config?: AnonymousAuthConfig) {
        // Initialize cache settings
        const cacheConfig = config?.cache || {};
        this.#cacheEnabled = cacheConfig.enabled !== false;
        this.#cacheKeyPrefix = cacheConfig.keyPrefix || DEFAULT_CACHE_KEY_PREFIX;
        this.#cacheTtl = cacheConfig.ttl || DEFAULT_CACHE_TTL;

        // Create cache adapter if caching is enabled
        if (this.#cacheEnabled) {
            this.#cacheAdapter = createCacheAdapter(
                cacheConfig.storageType || 'session'
            );
        } else {
            this.#cacheAdapter = null;
        }
    }

    /**
     * Initialize the anonymous authentication strategy
     */
    async initialize(options?: AuthStrategyInitializeOptions): Promise<void> {
        this.#postAuthentication = options?.postAuthentication;
        this.#deploymentInfo = options?.deploymentInfo;
        this.#isInitialized = true;
        this.#scopes = options?.scopes || [];
    }

    /**
     * Gets a value from the cache if it exists and hasn't expired
     * @param key - The cache key
     * @returns The cached value or null if not found/expired
     */
    #getFromCache<T>(key: string): T | null {
        if (!this.#cacheEnabled || !this.#cacheAdapter) {
            return null;
        }

        const entry = this.#cacheAdapter.get<T>(key);
        if (!entry) {
            return null;
        }

        // Check if entry has expired
        const now = Date.now();
        if (now - entry.timestamp > this.#cacheTtl) {
            // Entry expired, remove it
            this.#cacheAdapter.delete(key);
            return null;
        }

        return entry.value;
    }

    /**
     * Sets a value in the cache with the current timestamp
     * @param key - The cache key
     * @param value - The value to cache
     */
    #setInCache<T>(key: string, value: T): void {
        if (!this.#cacheEnabled || !this.#cacheAdapter) {
            return;
        }

        this.#cacheAdapter.set(key, {
            value,
            timestamp: Date.now(),
        });
    }

    /**
     * Clears all cached metadata entries
     */
    clearMetadataCache(): void {
        if (this.#cacheAdapter) {
            this.#cacheAdapter.clear(this.#cacheKeyPrefix);
        }
    }

    private async getUserSpecificMetaData(userType: string, metaData: any, isAuthenticated: boolean): Promise<any> {
        let metaDataDetailURL;
        if ((userType === "agent" && metaData.intClientId)
            || (userType === "customer" && metaData.extClientId && isAuthenticated)) {
            metaDataDetailURL = "https://" + metaData.apiDomain + "/core/authmgr/v3/metadata/tenant/" + metaData.tenantId
        } else if (userType === "customer" && !isAuthenticated) {
            metaDataDetailURL = "https://" + metaData.apiDomain + "/core/authmgr/v3/metadata/deployment"
        }

        if (metaDataDetailURL) {
            // Check cache first
            const cacheKey = `${this.#cacheKeyPrefix}metadata:${userType}:${metaData.apiDomain}:${metaData.tenantId || 'deployment'}:${isAuthenticated}`;
            const cached = this.#getFromCache<any>(cacheKey);
            if (cached) {
                return cached;
            }

            // Fetch from API
            const metaDataDetailResponse = await fetch(metaDataDetailURL);
            const result = await metaDataDetailResponse.json();

            // Cache the result
            this.#setInCache(cacheKey, result);

            return result;
        }
    }

    /**
     * Authenticate the anonymous user
     */
    async authenticate(): Promise<void> {
        // TODO: Implement authentication logic
        this.#isAuthenticated = true;
        const token = await this.getToken();
        // Call postAuthentication callback after authentication completes
        if (this.#postAuthentication) {
            await this.#postAuthentication(token);
        }
    }

    /**
     * Check if the user is currently authenticated
     */
    isAuthenticated(): boolean {
        return this.#isAuthenticated;
    }

    /**
     * Get the full cache key for the anonymous token
     * Uses the same prefix as metadata cache for consistency
     * Includes tenantId to ensure tokens are tenant-specific
     */
    #getTokenCacheKey(): string {
        const tenantId = this.#deploymentInfo?.tenantId || 'tenantId';
        return `${this.#cacheKeyPrefix}${tenantId}:${ANONYMOUS_TOKEN_CACHE_KEY_SUFFIX}`;
    }

    /**
     * Get cached token from the cache adapter
     * @returns The cached token entry or null if not found/expired
     */
    #getCachedToken(): CachedToken | null {
        if (!this.#cacheEnabled || !this.#cacheAdapter) {
            return null;
        }

        const entry = this.#cacheAdapter.get<CachedToken>(this.#getTokenCacheKey());
        if (!entry) {
            return null;
        }

        return entry.value;
    }

    /**
     * Check if the cached token is still valid
     * @returns true if token exists and hasn't expired (with buffer)
     */
    #isTokenValid(): boolean {
        const cachedToken = this.#getCachedToken();
        if (!cachedToken) {
            return false;
        }
        
        const now = Date.now();
        // Check if token will expire within the buffer time
        return cachedToken.expiresAt - AnonymousAuthStrategy.TOKEN_EXPIRY_BUFFER_MS > now;
    }

    /**
     * Get authentication token for anonymous user
     * Returns cached token if valid, otherwise fetches a new one
     * Token is cached with TTL based on expires_in from the token response
     */
    async getToken(): Promise<string | null> {
        // Return cached token if still valid
        const cachedToken = this.#getCachedToken();
        if (this.#isTokenValid() && cachedToken) {
            return cachedToken.accessToken;
        }
        
        const metaData = await this.getUserSpecificMetaData("customer", this.#deploymentInfo, false);
        if (metaData) {
            const tenantId = this.#deploymentInfo?.tenantId;

            const anoymousTokenURL = metaData?.authenticationDetails?.oAuthAnonymousCustomer[0]?.accessTokenURL?.replace(
                "<DOMAIN_NAME>",
                tenantId
            );

            const scopePrefix = metaData?.authenticationDetails?.apiPermissionPrefix;
            const scopesRequired = (this.#scopes || []).map((scope) => scopePrefix + scope);
            let body = {
                client_id: "clientId",
                client_secret: "clientSecret",
                grant_type: "client_credentials",
                scope: scopesRequired.join(" ")
            };
            const encodedBody = Object.keys(body)
                .map((key) => {
                    return encodeURIComponent(key) + "=" + encodeURIComponent(body[key as keyof typeof body]);
                })
                .join("&");
            const options = {
                method: "POST",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    Accept: "application/json",
                },
                body: encodedBody,
            };

            const response = await fetch(anoymousTokenURL, options);
            const anonymousTokenObject = await response.json();
            
            if (anonymousTokenObject?.access_token) {
                // Cache the token with TTL from expires_in (in seconds)
                // Falls back to default cache TTL if expires_in is not provided
                const expiresInMs = anonymousTokenObject.expires_in 
                    ? anonymousTokenObject.expires_in * 1000 
                    : this.#cacheTtl;
                
                const tokenEntry: CachedToken = {
                    accessToken: anonymousTokenObject.access_token,
                    expiresAt: Date.now() + expiresInMs,
                };
                
                // Store in cache adapter using the same prefix as metadata
                if (this.#cacheEnabled && this.#cacheAdapter) {
                    this.#cacheAdapter.set(this.#getTokenCacheKey(), {
                        value: tokenEntry,
                        timestamp: Date.now(),
                    });
                }
                
                return anonymousTokenObject.access_token;
            }
        }
        return null;
    }
    
    /**
     * Clear the cached token
     * Forces a new token to be fetched on next getToken() call
     */
    clearTokenCache(): void {
        if (this.#cacheAdapter) {
            this.#cacheAdapter.delete(this.#getTokenCacheKey());
        }
    }

    /**
     * Cleanup resources
     */
    async cleanup(): Promise<void> {
        // Clear the token cache
        this.clearTokenCache();
        // Clear metadata cache
        this.clearMetadataCache();
    }

    /**
     * Get deployment information a given domain
     */
    async getDeploymentInfo(domain: string): Promise<any> {
        // TODO: Implement deployment information retrieval logic
        return {
            domainHint: domain,
            apiDomain: domain,
            nextRoute: domain,
            metaData: domain,
        };
    }
}

