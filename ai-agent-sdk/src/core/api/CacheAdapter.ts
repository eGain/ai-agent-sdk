/**
 * # Caching
 * 
 * The SDK provides built-in caching for API responses and context data to reduce 
 * network calls and improve performance.
 * 
 * ## Overview
 * 
 * Caching is automatically enabled by default and uses the appropriate storage 
 * backend based on the environment:
 * - **Browser**: Uses `sessionStorage` (or `localStorage` if configured)
 * - **Node.js**: Uses in-memory storage
 * 
 * ## Quick Start
 * 
 * Caching works out of the box with sensible defaults:
 * 
 * ```typescript
 * const agent = new AiAgent({
 *   id: "agent-id",
 *   endpoint: "https://your-endpoint.com"
 *   // Caching is enabled by default
 * });
 * ```
 * 
 * ## Configuration
 * 
 * Customize caching behavior via the `cache` option:
 * 
 * ```typescript
 * const agent = new AiAgent({
 *   id: "agent-id",
 *   endpoint: "https://your-endpoint.com",
 *   cache: {
 *     enabled: true,           // Enable/disable caching
 *     storageType: 'session',  // 'session' | 'local' | 'memory'
 *     ttl: 300000              // Cache TTL in milliseconds (5 minutes)
 *   }
 * });
 * ```
 * 
 * ## Storage Types
 * 
 * | Type | Description | Persistence |
 * |------|-------------|-------------|
 * | `session` | Browser sessionStorage | Tab lifetime |
 * | `local` | Browser localStorage | Permanent |
 * | `memory` | In-memory Map | Process lifetime |
 * 
 * ## Custom Cache Adapter
 * 
 * Implement your own cache adapter for custom storage backends (Redis, IndexedDB, etc.):
 * 
 * ```typescript
 * import { CacheAdapter, CacheEntry } from "@eGain/ai-agent-sdk";
 * 
 * class RedisCacheAdapter implements CacheAdapter {
 *   get<T>(key: string): CacheEntry<T> | null {
 *     // Fetch from Redis
 *   }
 *   set<T>(key: string, entry: CacheEntry<T>): void {
 *     // Store in Redis
 *   }
 *   delete(key: string): void {
 *     // Delete from Redis
 *   }
 *   clear(prefix?: string): void {
 *     // Clear keys from Redis
 *   }
 *   keys(prefix?: string): string[] {
 *     // List keys from Redis
 *   }
 * }
 * 
 * const agent = new AiAgent({
 *   id: "agent-id",
 *   endpoint: "https://your-endpoint.com",
 *   cache: {
 *     adapter: new RedisCacheAdapter()
 *   }
 * });
 * ```
 * 
 * ## What Gets Cached
 * 
 * - **Deployment Info**: API domain configuration
 * - **Agent Details**: Agent profile and settings
 * - **Context Data**: User context for reconnection
 * - **Anonymous Auth Tokens**: For session continuity
 * 
 * @module Caching
 * @category Features
 */

/**
 * Cache entry with timestamp for TTL support.
 * 
 * @example
 * ```typescript
 * const entry: CacheEntry<UserData> = {
 *   value: { userId: "123", name: "John" },
 *   timestamp: Date.now()
 * };
 * ```
 * 
 * @category Features
 * @group Caching
 */
export interface CacheEntry<T> {
    /** The cached value */
    value: T;
    /** Timestamp when the entry was created (ms since epoch) */
    timestamp: number;
}

/**
 * Cache adapter interface for implementing custom storage backends.
 * 
 * Implement this interface to create custom cache adapters for Redis, 
 * IndexedDB, or other storage systems.
 * 
 * @example
 * ```typescript
 * class CustomCacheAdapter implements CacheAdapter {
 *   private store = new Map<string, string>();
 *   
 *   get<T>(key: string): CacheEntry<T> | null {
 *     const data = this.store.get(key);
 *     return data ? JSON.parse(data) : null;
 *   }
 *   
 *   set<T>(key: string, entry: CacheEntry<T>): void {
 *     this.store.set(key, JSON.stringify(entry));
 *   }
 *   
 *   delete(key: string): void {
 *     this.store.delete(key);
 *   }
 *   
 *   clear(prefix?: string): void {
 *     if (prefix) {
 *       for (const key of this.store.keys()) {
 *         if (key.startsWith(prefix)) this.store.delete(key);
 *       }
 *     } else {
 *       this.store.clear();
 *     }
 *   }
 *   
 *   keys(prefix?: string): string[] {
 *     const allKeys = Array.from(this.store.keys());
 *     return prefix ? allKeys.filter(k => k.startsWith(prefix)) : allKeys;
 *   }
 * }
 * ```
 * 
 * @category Features
 * @group Caching
 */
export interface CacheAdapter {
    /**
     * Get a value from the cache
     * @param key - The cache key
     * @returns The cached entry or null if not found
     */
    get<T>(key: string): CacheEntry<T> | null;

    /**
     * Set a value in the cache
     * @param key - The cache key
     * @param entry - The cache entry with value and timestamp
     */
    set<T>(key: string, entry: CacheEntry<T>): void;

    /**
     * Delete a value from the cache
     * @param key - The cache key
     */
    delete(key: string): void;

    /**
     * Clear all values from the cache
     * @param prefix - Optional prefix to only clear keys starting with this prefix
     */
    clear(prefix?: string): void;

    /**
     * Get all keys in the cache
     * @param prefix - Optional prefix to filter keys
     * @returns Array of matching cache keys
     */
    keys(prefix?: string): string[];
}

/**
 * In-memory cache adapter for Node.js environments.
 * 
 * Uses a JavaScript Map for storage. Data persists only for the lifetime
 * of the process. Suitable for server-side applications and testing.
 * 
 * @example
 * ```typescript
 * const cache = new MemoryCacheAdapter();
 * 
 * // Store a value
 * cache.set('user:123', { 
 *   value: { name: 'John' }, 
 *   timestamp: Date.now() 
 * });
 * 
 * // Retrieve the value
 * const entry = cache.get<{ name: string }>('user:123');
 * console.log(entry?.value.name); // "John"
 * ```
 * 
 * @category Features
 * @group Caching
 */
export class MemoryCacheAdapter implements CacheAdapter {
    private cache: Map<string, CacheEntry<unknown>> = new Map();

    get<T>(key: string): CacheEntry<T> | null {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }
        return entry as CacheEntry<T>;
    }

    set<T>(key: string, entry: CacheEntry<T>): void {
        this.cache.set(key, entry);
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(prefix?: string): void {
        if (prefix) {
            for (const key of this.cache.keys()) {
                if (key.startsWith(prefix)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.clear();
        }
    }

    keys(prefix?: string): string[] {
        const allKeys = Array.from(this.cache.keys());
        if (prefix) {
            return allKeys.filter((key) => key.startsWith(prefix));
        }
        return allKeys;
    }
}

/**
 * Browser storage cache adapter using localStorage or sessionStorage.
 * 
 * Automatically serializes values to JSON for storage. Falls back gracefully
 * if storage is unavailable or full.
 * 
 * @example
 * ```typescript
 * // Use sessionStorage (cleared when tab closes)
 * const sessionCache = new StorageCacheAdapter('session');
 * 
 * // Use localStorage (persistent)
 * const localCache = new StorageCacheAdapter('local');
 * 
 * // Store data
 * sessionCache.set('config', { 
 *   value: { theme: 'dark' }, 
 *   timestamp: Date.now() 
 * });
 * ```
 * 
 * @category Features
 * @group Caching
 */
export class StorageCacheAdapter implements CacheAdapter {
    private storage: Storage;

    /**
     * Create a new StorageCacheAdapter
     * @param storageType - Use 'local' for localStorage, 'session' for sessionStorage
     * @throws Error if not in a browser environment
     */
    constructor(storageType: 'local' | 'session' = 'session') {
        if (typeof window === 'undefined') {
            throw new Error(
                'StorageCacheAdapter requires a browser environment'
            );
        }
        this.storage =
            storageType === 'local'
                ? window.localStorage
                : window.sessionStorage;
    }

    get<T>(key: string): CacheEntry<T> | null {
        try {
            const item = this.storage.getItem(key);
            if (!item) {
                return null;
            }
            return JSON.parse(item) as CacheEntry<T>;
        } catch {
            return null;
        }
    }

    set<T>(key: string, entry: CacheEntry<T>): void {
        try {
            this.storage.setItem(key, JSON.stringify(entry));
        } catch {
            // Storage might be full or disabled, silently fail
            console.warn(`Failed to cache entry for key: ${key}`);
        }
    }

    delete(key: string): void {
        this.storage.removeItem(key);
    }

    clear(prefix?: string): void {
        if (prefix) {
            const keysToDelete: string[] = [];
            for (let i = 0; i < this.storage.length; i++) {
                const key = this.storage.key(i);
                if (key && key.startsWith(prefix)) {
                    keysToDelete.push(key);
                }
            }
            keysToDelete.forEach((key) => this.storage.removeItem(key));
        } else {
            this.storage.clear();
        }
    }

    keys(prefix?: string): string[] {
        const allKeys: string[] = [];
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i);
            if (key) {
                if (!prefix || key.startsWith(prefix)) {
                    allKeys.push(key);
                }
            }
        }
        return allKeys;
    }
}

/**
 * Cache storage type options.
 * 
 * - `local`: Browser localStorage (persistent across sessions)
 * - `session`: Browser sessionStorage (cleared when tab closes)
 * - `memory`: In-memory storage (cleared when process ends)
 * 
 * @category Features
 * @group Caching
 */
export type CacheStorageType = 'local' | 'session' | 'memory';

/**
 * Factory function to create the appropriate cache adapter based on environment.
 * 
 * Automatically detects the environment and creates the best available adapter:
 * - In browsers: Creates StorageCacheAdapter (with fallback to memory if storage unavailable)
 * - In Node.js: Creates MemoryCacheAdapter
 * 
 * @param storageType - The preferred storage type
 * @returns The appropriate cache adapter for the environment
 * 
 * @example
 * ```typescript
 * // Auto-detect best adapter
 * const cache = createCacheAdapter();
 * 
 * // Force memory adapter
 * const memoryCache = createCacheAdapter('memory');
 * 
 * // Use localStorage in browser
 * const persistentCache = createCacheAdapter('local');
 * ```
 * 
 * @category Features
 * @group Caching
 */
export function createCacheAdapter(
    storageType: CacheStorageType = 'session'
): CacheAdapter {
    // If memory is explicitly requested, use memory adapter
    if (storageType === 'memory') {
        return new MemoryCacheAdapter();
    }

    // Check if we're in a browser environment
    const isBrowser =
        typeof window !== 'undefined' && typeof window.Storage !== 'undefined';

    if (isBrowser) {
        try {
            // Test if storage is available and working
            const testKey = '__cache_test__';
            const storage =
                storageType === 'local'
                    ? window.localStorage
                    : window.sessionStorage;
            storage.setItem(testKey, 'test');
            storage.removeItem(testKey);
            return new StorageCacheAdapter(storageType);
        } catch {
            // Storage not available, fall back to memory
            console.warn(
                'Browser storage not available, falling back to memory cache'
            );
            return new MemoryCacheAdapter();
        }
    }

    // Node.js environment - use memory adapter
    return new MemoryCacheAdapter();
}
