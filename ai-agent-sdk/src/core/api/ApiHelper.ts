import {
    CacheAdapter,
    CacheStorageType,
    createCacheAdapter,
} from './CacheAdapter.js';

/**
 * Cache configuration options
 */
export interface CacheConfig {
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
     * @default 'egain_aiagent_cache_'
     */
    keyPrefix?: string;

    /**
     * Time-to-live in milliseconds
     * @default 300000 (5 minutes)
     */
    ttl?: number;

    /**
     * Custom cache adapter instance
     * When provided, this adapter will be used instead of the built-in adapters.
     * The SDK manages all caching logic (TTL, keys, invalidation) - the adapter
     * only provides the underlying storage mechanism with synchronous get/set.
     */
    adapter?: CacheAdapter;
}

/**
 * API Helper service for making eGain AI Agent API calls
 */
export interface ApiHelperConfig {
    /**
     * API domain/base URL
     */
    apiDomain: string;

    /**
     * Language code (e.g., "en-us", "da-dk")
     * @default "en-us"
     */
    language?: string;

    /**
     * Cache configuration options
     */
    cache?: CacheConfig;

    /**
     * When set, API methods may omit `authToken` in their options; the token is resolved via this provider.
     * If omitted, each call must pass `authToken` explicitly.
     */
    getToken?: () => Promise<string | null>;
}

export interface UserDetails {
    id?: string;
    name?: string;
    email?: string;
    [key: string]: unknown;
}

export interface GetUserDetailsOptions {
    /**
     * Authentication token (required if `ApiHelper` was constructed without `getToken`)
     */
    authToken?: string;
}

export interface GetCustomerDetailsOptions {
    /**
     * Authentication token (required if `ApiHelper` was constructed without `getToken`)
     */
    authToken?: string;
}

export interface GetAiAgentDetailsOptions {
    /**
     * Agent ID
     */
    agentId: string;

    /**
     * Authentication token
     */
    authToken?: string | null;
}

export interface GetAiAgentSessionOptions {
    /**
     * Agent ID
     */
    agentId: string;

    /**
     * Authentication token
     */
    authToken?: string | null;
}

export interface GetPortalDetailsOptions {
    /**
     * Portal ID
     */
    portalId: string;

    /**
     * Authentication token (required if `ApiHelper` was constructed without `getToken`)
     */
    authToken?: string;

    /**
     * Language code (optional)
     */
    language?: string;
}

export interface GetConnectedAppsOptions {
    /**
     * API domain
     */
    apiDomain?: string;

    /**
     * Tenant ID
     */
    tenantId: string;

    /**
     * Agent ID
     */
    agentId: string;
}

export interface GetPreviousTranscriptOptions {
    /**
     * API domain
     */
    apiDomain?: string;

    /**
     * Agent ID
     */
    agentId: string;

    /**
     * Session ID
     */
    sessionId: string;

    /**
     * Authentication token (required if `ApiHelper` was constructed without `getToken`)
     */
    authToken?: string;
}

export interface GetMaskingPatternsOptions {
    /**
     * Department ID
     */
    departmentId: string;

    /**
     * Channel name (e.g., "chat")
     * @default "chat"
     */
    channel?: string;

    /**
     * Authentication token (required if `ApiHelper` was constructed without `getToken`)
     */
    authToken?: string;
}

/**
 * Options for `ApiHelper.getMyPortals`.
 */
export interface GetMyPortalsOptions {
    /**
     * Authentication token (required if `ApiHelper` was constructed without `getToken`)
     */
    authToken?: string;

    /**
     * Language code (e.g., "en-us", "da-dk")
     * @default "en-us"
     */
    language?: string;

    /**
     * Optional user ID for cache keying
     */
    userId?: string;

    /**
     * Optional short URL template for filtering (from agent theme)
     */
    shortUrlTemplate?: string;
}

/**
 * Options for getAgentsByPortal API call.
 * Fetches AI agents available in a portal.
 */
export interface GetAgentsByPortalOptions {
    /**
     * Department ID (from portal.department.id)
     */
    departmentId: string | number;

    /**
     * Portal ID
     */
    portalId: string | number;

    /**
     * Agent type filter
     * @default "contact-center"
     */
    agentType?: string;

    /**
     * Authentication token (required if `ApiHelper` was constructed without `getToken`)
     */
    authToken?: string;
}

/**
 * Options for getUserProfiles API call.
 * Fetches user profiles for a portal.
 */
export interface GetUserProfilesOptions {
    /**
     * Portal ID
     */
    portalId: string | number;

    /**
     * Authentication token (required if `ApiHelper` was constructed without `getToken`)
     */
    authToken?: string;
}

/**
 * Options for selectUserProfile API call.
 * Sets the selected user profile for a portal.
 */
export interface SelectUserProfileOptions {
    /**
     * Portal ID
     */
    portalId: string | number;

    /**
     * User profile ID to select
     */
    profileId: string | number;

    /**
     * Authentication token (required if `ApiHelper` was constructed without `getToken`)
     */
    authToken?: string;
}

/**
 * Valid Accept-Language header values for v12 onwards
 */
const VALID_ACCEPT_LANGUAGES_HEADER_FOR_V12_ONWARDS: Record<string, boolean> = {
    'da-dk': true,
    'de-de': true,
    'en-us': true,
    'es-es': true,
    'fr-ca': true,
    'fr-fr': true,
    'it-it': true,
    'ja-jp': true,
    'ko-kr': true,
    'nl-nl': true,
    'pt-br': true,
    'pt-pt': true,
    'ru-ru': true,
    'sv-se': true,
    'zh-cn': true,
};

/**
 * Language mapping for special cases
 */
const LANGUAGE_MAPPING: Record<string, string> = {
    'da-DA': 'da-dk',
    'ja-JA': 'ja-jp',
    'ko-KO': 'ko-kr',
};

/**
 * Default cache TTL (5 minutes)
 */
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/**
 * Default cache key prefix
 */
const DEFAULT_CACHE_PREFIX = 'egain_aiagent_cache_';

/**
 * API Helper class for making eGain AI Agent API calls
 */
export class ApiHelper {
    private apiDomain: string;
    private language: string;
    private cacheEnabled: boolean;
    private cacheAdapter: CacheAdapter | null;
    private cacheKeyPrefix: string;
    private cacheTtl: number;
    private readonly tokenProvider?: () => Promise<string | null>;

    // Static cache adapter for getDeploymentInfo (uses session storage)
    private static staticCacheAdapter: CacheAdapter | null = null;
    private static staticCacheTtl = DEFAULT_CACHE_TTL;
    private static staticCachePrefix = 'egain_aiagent_static_';

    /**
     * Gets or creates the static cache adapter for deployment info
     */
    private static getStaticCacheAdapter(): CacheAdapter | null {
        if (!ApiHelper.staticCacheAdapter) {
            ApiHelper.staticCacheAdapter = createCacheAdapter('session');
        }
        return ApiHelper.staticCacheAdapter;
    }

    /**
     * Sets a custom static cache adapter for deployment info caching.
     * Call this before any AiAgent.initialize() calls to use a custom adapter
     * for caching deployment information.
     * @param adapter - Custom CacheAdapter implementation
     */
    static setStaticCacheAdapter(adapter: CacheAdapter): void {
        ApiHelper.staticCacheAdapter = adapter;
    }

    constructor(config: ApiHelperConfig) {
        this.apiDomain =
            config.apiDomain.indexOf('http') !== 0
                ? 'https://' + config.apiDomain
                : config.apiDomain;
        this.language = config.language || 'en-us';

        // Initialize cache settings
        const cacheConfig = config.cache || {};
        this.cacheEnabled = cacheConfig.enabled !== false;
        this.cacheKeyPrefix = cacheConfig.keyPrefix || DEFAULT_CACHE_PREFIX;
        this.cacheTtl = cacheConfig.ttl || DEFAULT_CACHE_TTL;

        // Create cache adapter if caching is enabled
        // Use custom adapter if provided, otherwise fall back to built-in adapters
        if (this.cacheEnabled) {
            this.cacheAdapter = cacheConfig.adapter ?? createCacheAdapter(
                cacheConfig.storageType || 'session'
            );
        } else {
            this.cacheAdapter = null;
        }

        this.tokenProvider = config.getToken;
    }

    /**
     * Resolves the bearer/access token from explicit options or from {@link ApiHelperConfig.getToken}.
     */
    private async resolveAuthToken(explicit?: string | null): Promise<string> {
        if (explicit != null && String(explicit).trim() !== '') {
            return String(explicit);
        }
        if (this.tokenProvider) {
            const t = await this.tokenProvider();
            if (t != null && String(t).trim() !== '') {
                return t;
            }
        }
        throw new Error(
            'Authentication token is required: pass authToken in options or configure ApiHelper with getToken()'
        );
    }

    /**
     * Gets the language for the API call
     * @returns {string} The language
     */
    private getLanguage(): string {
        if (this.language) {
            // Check for special mappings
            if (LANGUAGE_MAPPING[this.language]) {
                return LANGUAGE_MAPPING[this.language];
            }

            // Convert locale format (e.g., "en-US" -> "en-us")
            const localeArr = this.language.split('-');
            if (localeArr && localeArr.length > 1) {
                return (
                    localeArr[0].toLowerCase() + '-' + localeArr[1].toLowerCase()
                );
            }

            return this.language;
        }

        return 'en-us';
    }

    /**
     * Gets the Accept-Language header value for v12 onwards
     * @returns {string} The Accept-Language header value
     */
    private getAcceptLanguageHeader(): string {
        let language = this.language;
        language =
            language && typeof language === 'string'
                ? language.toLowerCase()
                : 'en-us';
        language = VALID_ACCEPT_LANGUAGES_HEADER_FOR_V12_ONWARDS[language]
            ? language
            : 'en-us';
        return language;
    }

    /**
     * Generates a unique cache key for a method and its parameters
     * @param method - The method name
     * @param params - The parameters object
     * @returns The cache key
     */
    private getCacheKey(method: string, params: Record<string, unknown>): string {
        const sortedParams = Object.keys(params)
            .sort()
            .map((key) => `${key}=${params[key]}`)
            .join('&');
        return `${this.cacheKeyPrefix}${method}:${sortedParams}`;
    }

    /**
     * Gets a value from the cache if it exists and hasn't expired
     * @param key - The cache key
     * @returns The cached value or null if not found/expired
     */
    private getFromCache<T>(key: string): T | null {
        if (!this.cacheEnabled || !this.cacheAdapter) {
            return null;
        }

        const entry = this.cacheAdapter.get<T>(key);
        if (!entry) {
            return null;
        }

        // Check if entry has expired
        const now = Date.now();
        if (now - entry.timestamp > this.cacheTtl) {
            // Entry expired, remove it
            this.cacheAdapter.delete(key);
            return null;
        }

        return entry.value;
    }

    /**
     * Sets a value in the cache with the current timestamp
     * @param key - The cache key
     * @param value - The value to cache
     */
    private setInCache<T>(key: string, value: T): void {
        if (!this.cacheEnabled || !this.cacheAdapter) {
            return;
        }

        this.cacheAdapter.set(key, {
            value,
            timestamp: Date.now(),
        });
    }

    /**
     * Gets the AI Agent details
     * @param {GetAiAgentDetailsOptions} options - The options for the API call
     * @returns {Promise<Object>} The AI Agent details
     */
    async getAiAgentDetails(
        options: GetAiAgentDetailsOptions
    ): Promise<any> {
        const { agentId, authToken } = options;
        const token = await this.resolveAuthToken(authToken);

        // Check cache first
        const cacheKey = this.getCacheKey('getAiAgentDetails', { agentId });
        const cached = this.getFromCache<any>(cacheKey);
        if (cached) {
            return cached;
        }

        const url = `${this.apiDomain}/core/aiservices/v4/aiagent/details/agent/${agentId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch AI Agent details: ${response.status} ${response.statusText}`
            );
        }

        const result = await response.json();

        // Cache the result
        this.setInCache(cacheKey, result);

        return result;
    }

    /**
     * Gets the AI Agent session
     * @param {GetAiAgentSessionOptions} options - The options for the API call
     * @returns {Promise<string>} The AI Agent session ID
     */
    async getAiAgentSession(
        options: GetAiAgentSessionOptions
    ): Promise<string> {
        const { agentId, authToken } = options;
        const token = await this.resolveAuthToken(authToken);

        const url = `${this.apiDomain}/core/aiservices/v4/aiagent/chat/agent/${agentId}/session`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch AI Agent session: ${response.status} ${response.statusText}`
            );
        }

        const sessionResponse = await response.json();
        return sessionResponse?.sessionId;
    }

    /**
     * Gets the portal details
     * @param {GetPortalDetailsOptions} options - The options for the API call
     * @returns {Promise<Object>} The portal details
     */
    async getPortalDetails(
        options: GetPortalDetailsOptions
    ): Promise<any> {
        const { portalId, authToken, language } = options;
        const token = await this.resolveAuthToken(authToken);
        const lang = language || this.getLanguage();

        // Check cache first
        const cacheKey = this.getCacheKey('getPortalDetails', {
            portalId,
            language: lang,
        });
        const cached = this.getFromCache<any>(cacheKey);
        if (cached) {
            return cached;
        }

        const portalDetailsURL = `${this.apiDomain}/knowledge/portalmgr/v3/internal/portals/${portalId}?$lang=${lang}`;

        const response = await fetch(portalDetailsURL, {
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Accept-Language': this.getAcceptLanguageHeader(),
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch portal details: ${response.status} ${response.statusText}`
            );
        }

        const portalDetails = await response.json();
        const result = portalDetails.portal?.[0];

        // Cache the result
        this.setInCache(cacheKey, result);

        return result;
    }

    /**
     * Gets the connected apps
     * @param {GetConnectedAppsOptions} options - The options for the API call
     * @returns {Promise<Object>} The connected apps
     */
    async getConnectedApps(
        options: GetConnectedAppsOptions
    ): Promise<any> {
        const { apiDomain, tenantId, agentId } = options;
        const baseUrl = apiDomain || this.apiDomain;

        // Check cache first
        const cacheKey = this.getCacheKey('getConnectedApps', {
            tenantId,
            agentId,
        });
        const cached = this.getFromCache<any>(cacheKey);
        if (cached) {
            return cached;
        }

        const url = `${baseUrl}/ai-agent-cc-connector/v1/tenants/${tenantId}/agents/${agentId}/apps`;

        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch connected apps: ${response.status} ${response.statusText}`
            );
        }

        const result = await response.json();

        // Cache the result
        this.setInCache(cacheKey, result);

        return result;
    }

    /**
     * Gets the previous transcript
     * @param {GetPreviousTranscriptOptions} options - The options for the API call
     * @returns {Promise<Array>} The previous transcript messages
     */
    async getPreviousTranscript(
        options: GetPreviousTranscriptOptions
    ): Promise<any[]> {
        const { apiDomain, agentId, sessionId, authToken } = options;
        const token = await this.resolveAuthToken(authToken);
        const baseUrl = apiDomain || this.apiDomain;
        // Dummy deptId, deptId is required in v2 api
        const deptId = '1000';
        const url = `${baseUrl}/core/aiservices/v4/aiagent/details/department/${deptId}/agent/${agentId}/conversations/sessions/${sessionId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch previous transcript: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        return data?.messages || [];
    }

    /**
     * Gets the masking patterns for a department and channel
     * @param {GetMaskingPatternsOptions} options - The options for the API call
     * @returns {Promise<Object>} The masking patterns response
     * @throws {Error} If the API request fails
     */
    async getMaskingPatterns(
        options: GetMaskingPatternsOptions
    ): Promise<any> {
        const { departmentId, channel = 'chat', authToken } = options;
        const token = await this.resolveAuthToken(authToken);

        // Check cache first
        const cacheKey = this.getCacheKey('getMaskingPatterns', {
            departmentId,
            channel,
        });
        const cached = this.getFromCache<any>(cacheKey);
        if (cached) {
            return cached;
        }

        const url = `${this.apiDomain}/core/securitymgr/v4/departments/${departmentId}/maskingpatterns/${channel}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Accept-Language': this.getAcceptLanguageHeader(),
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch masking patterns: ${response.status} ${response.statusText}`
            );
        }

        const result = await response.json();

        // Cache the result
        this.setInCache(cacheKey, result);

        return result;
    }

    /**
     * Gets portals for the authenticated user via `GET .../knowledge/portalmgr/v3/myportals` (paginated).
     *
     * @param options - Options for the API call
     * @returns Promise resolving to array of Portal objects
     * @throws Error if the API request fails
     *
     * @example
     * ```typescript
     * const portals = await apiHelper.getMyPortals({
     *   authToken: token,
     *   language: 'en-us',
     *   userId: 'user-123'
     * });
     * ```
     */
    async getMyPortals(options: GetMyPortalsOptions): Promise<any[]> {
        const { authToken, language, userId, shortUrlTemplate } = options;
        const token = await this.resolveAuthToken(authToken);
        const lang = language || this.getLanguage();

        const cacheParams: Record<string, unknown> = { lang, userId: userId ?? 'default' };
        if (shortUrlTemplate) cacheParams.shortUrlTemplate = shortUrlTemplate;

        const cacheKey = this.getCacheKey('getMyPortals', cacheParams);
        const cached = this.getFromCache<any[]>(cacheKey);
        if (cached) {
            return cached;
        }

        const allPortals = await this.fetchPortalmgrV3PortalPages({
            authToken: token,
            lang,
            shortUrlTemplate,
            pathSegment: 'myportals',
        });

        this.setInCache(cacheKey, allPortals);
        return allPortals;
    }

    /**
     * Paginated GET .../knowledge/portalmgr/v3/{myportals|portals}
     */
    private async fetchPortalmgrV3PortalPages(params: {
        authToken: string;
        lang: string;
        shortUrlTemplate?: string;
        pathSegment: 'myportals' | 'portals';
    }): Promise<any[]> {
        const { authToken, lang, shortUrlTemplate, pathSegment } = params;
        const baseUrl = `${this.apiDomain}/knowledge/portalmgr/v3/${pathSegment}`;

        const buildPageUrl = (pageNum: number, pagesize: string) => {
            const pageUrl = new URL(baseUrl);
            pageUrl.searchParams.append('$lang', lang);
            pageUrl.searchParams.append('$pagesize', pagesize);
            pageUrl.searchParams.append('$pagenum', String(pageNum));
            if (shortUrlTemplate?.trim()) {
                pageUrl.searchParams.append('shortUrlTemplate', shortUrlTemplate.trim());
            }
            return pageUrl;
        };

        const firstUrl = buildPageUrl(1, '75');
        const response = await fetch(firstUrl.toString(), {
            method: 'GET',
            headers: {
                'Accept-Language': this.getAcceptLanguageHeader(),
                Authorization: `Bearer ${authToken}`,
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch portals: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        let allPortals: any[] = data.portal || [];

        if (data.paginationInfo && data.paginationInfo.count > data.paginationInfo.pagesize) {
            const { count, pagesize } = data.paginationInfo;
            const totalPages = Math.ceil(count / pagesize);

            for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
                const pageUrl = buildPageUrl(pageNum, String(pagesize));
                const pageResponse = await fetch(pageUrl.toString(), {
                    method: 'GET',
                    headers: {
                        'Accept-Language': this.getAcceptLanguageHeader(),
                        Authorization: `Bearer ${authToken}`,
                        Accept: 'application/json',
                    },
                });

                if (pageResponse.ok) {
                    const pageData = await pageResponse.json();
                    allPortals = allPortals.concat(pageData.portal || []);
                }
            }
        }

        return allPortals;
    }

    /**
     * Gets AI agents by portal and department.
     *
     * @param options - Options for the API call
     * @returns Promise resolving to array of agent list items
     * @throws Error if the API request fails
     *
     * @example
     * ```typescript
     * const agents = await apiHelper.getAgentsByPortal({
     *   departmentId: department.id,
     *   portalId: portal.id,
     *   agentType: 'contact-center',
     *   authToken: token
     * });
     * ```
     */
    async getAgentsByPortal(options: GetAgentsByPortalOptions): Promise<any[]> {
        const { departmentId, portalId, agentType = 'contact-center', authToken } = options;
        const token = await this.resolveAuthToken(authToken);

        const cacheKey = this.getCacheKey('getAgentsByPortal', {
            departmentId,
            portalId,
            agentType,
        });
        const cached = this.getFromCache<any[]>(cacheKey);
        if (cached) {
            return cached;
        }

        const url = `${this.apiDomain}/core/aiservices/v4/aiagent/details/department/${departmentId}/portal/${portalId}?agentType=${agentType}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept-Language': this.getAcceptLanguageHeader(),
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch agents by portal: ${response.status} ${response.statusText}`
            );
        }

        const result = await response.json();
        const agentList = Array.isArray(result) ? result : [];

        this.setInCache(cacheKey, agentList);
        return agentList;
    }

    /**
     * Gets user profiles for a portal.
     *
     * @param options - Options for the API call
     * @returns Promise resolving to array of UserProfile objects
     * @throws Error if the API request fails
     *
     * @example
     * ```typescript
     * const profiles = await apiHelper.getUserProfiles({
     *   portalId: portal.id,
     *   authToken: token
     * });
     * ```
     */
    async getUserProfiles(options: GetUserProfilesOptions): Promise<any[]> {
        const { portalId, authToken } = options;
        const token = await this.resolveAuthToken(authToken);

        const cacheKey = this.getCacheKey('getUserProfiles', { portalId });
        const cached = this.getFromCache<any[]>(cacheKey);
        if (cached) {
            return cached;
        }

        const url = `${this.apiDomain}/knowledge/portalmgr/v3/portals/${portalId}/userprofiles`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Accept-Language': this.getAcceptLanguageHeader(),
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch user profiles: ${response.status} ${response.statusText}`
            );
        }

        if (response.status === 204) {
            this.setInCache(cacheKey, []);
            return [];
        }

        const data = await response.json();
        const profiles = data.profile || [];

        this.setInCache(cacheKey, profiles);
        return profiles;
    }

    /**
     * Selects a user profile for a portal.
     * Persists the selection on the server.
     *
     * @param options - Options for the API call
     * @returns Promise resolving when selection is complete
     * @throws Error if the API request fails
     *
     * @example
     * ```typescript
     * await apiHelper.selectUserProfile({
     *   portalId: portal.id,
     *   profileId: profile.id,
     *   authToken: token
     * });
     * ```
     */
    async selectUserProfile(options: SelectUserProfileOptions): Promise<void> {
        const { portalId, profileId, authToken } = options;
        const token = await this.resolveAuthToken(authToken);

        const url = `${this.apiDomain}/knowledge/portalmgr/v3/portals/${portalId}/userprofiles/${profileId}/select`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept-Language': this.getAcceptLanguageHeader(),
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to select user profile: ${response.status} ${response.statusText}`
            );
        }
    }

    /**
     * Clears all cached entries for this ApiHelper instance
     */
    clearCache(): void {
        if (this.cacheAdapter) {
            this.cacheAdapter.clear(this.cacheKeyPrefix);
        }
    }

    /**
     * Invalidates cached entries matching a specific pattern or method name
     * @param pattern - Optional pattern to match (e.g., 'getAiAgentDetails', 'getPortalDetails')
     *                  If not provided, clears all cache entries for this instance
     */
    invalidateCache(pattern?: string): void {
        if (!this.cacheAdapter) {
            return;
        }

        if (!pattern) {
            this.clearCache();
            return;
        }

        // Get all keys matching the pattern
        const keys = this.cacheAdapter.keys(this.cacheKeyPrefix);
        for (const key of keys) {
            if (key.includes(pattern)) {
                this.cacheAdapter.delete(key);
            }
        }
    }

    /**
     * Fetches the authenticated user's details (for agent/user auth type).
     * Returns null on failure so that initialization is not blocked.
     */
    async getUserDetails(options: GetUserDetailsOptions): Promise<UserDetails | null> {
        const { authToken } = options;
        const token = await this.resolveAuthToken(authToken);
        const url = `${this.apiDomain}/knowledge/portalmgr/v3/portals/user`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    "Accept-Language": this.getAcceptLanguageHeader(),
                },
            });

            if (!response.ok) {
                return null;
            }

            const data = (await response.json())?.user?.[0];
            return data ?? null;
        } catch {
            return null;
        }
    }

    /**
     * Fetches the authenticated customer's details (for customer auth type).
     * Returns null on failure so that initialization is not blocked.
     */
    async getCustomerDetails(options: GetCustomerDetailsOptions): Promise<UserDetails | null> {
        const { authToken } = options;
        const token = await this.resolveAuthToken(authToken);
        const url = `${this.apiDomain}/core/customermgr/v3/internal/customer?$attribute=all`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    "Accept-Language": this.getAcceptLanguageHeader(),
                },
            });

            if (!response.ok) {
                return null;
            }

            const data = (await response.json())?.customer?.[0];
            return data ?? null;
        } catch {
            return null;
        }
    }

    /**
     * Gets the deployment information for a given domain
     * @param {string} domain - The domain to get the deployment information for
     * @returns {Promise<Object>} The deployment information
     */
    static async getDeploymentInfo(domain: string): Promise<any> {
        const cacheAdapter = ApiHelper.getStaticCacheAdapter();
        const cacheKey = `${ApiHelper.staticCachePrefix}deployment-info-${domain}`;

        // Check session storage cache first
        if (cacheAdapter) {
            const cached = cacheAdapter.get<any>(cacheKey);
            if (cached) {
                const now = Date.now();
                if (now - cached.timestamp <= ApiHelper.staticCacheTtl) {
                    return cached.value;
                }
                // Entry expired, remove it
                cacheAdapter.delete(cacheKey);
            }
        }

        const url = `${domain}/system/deploymentInfo`;
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) {
            throw new Error(
                `Failed to fetch deployment info: ${response.status} ${response.statusText}`
            );
        }
        const result = await response.json();

        // Cache the result in session storage
        if (cacheAdapter) {
            cacheAdapter.set(cacheKey, {
                value: result,
                timestamp: Date.now(),
            });
        }

        return result;
    }

    /**
     * Clears the static deployment info cache
     */
    static clearDeploymentInfoCache(): void {
        const cacheAdapter = ApiHelper.getStaticCacheAdapter();
        if (cacheAdapter) {
            cacheAdapter.clear(ApiHelper.staticCachePrefix);
        }
    }
}

