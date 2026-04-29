# Caching

The SDK provides built-in caching for API responses and context data to reduce network calls and improve performance.

## Overview

Caching is automatically enabled by default and uses the appropriate storage backend based on the environment:
- **Browser**: Uses `sessionStorage` (or `localStorage` if configured)
- **Node.js**: Uses in-memory storage

## Quick Start

Caching works out of the box with sensible defaults:

```typescript
import { AiAgent } from "@eGainDev/ai-agent-sdk";

const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com"
  // Caching is enabled by default
});

await agent.initialize();
```

## Configuration

Customize caching behavior via the `cache` option:

```typescript
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  cache: {
    enabled: true,           // Enable/disable caching
    storageType: "session",  // "session" | "local" | "memory"
    ttl: 300000              // Cache TTL in milliseconds (5 minutes)
  }
});
```

## Storage Types

| Type | Description | Persistence | Use Case |
|------|-------------|-------------|----------|
| `session` | Browser sessionStorage | Tab lifetime | Most apps (default) |
| `local` | Browser localStorage | Permanent | Persistent sessions |
| `memory` | In-memory Map | Process lifetime | Server-side / sensitive data |

```typescript
// Session storage (default) - cleared when tab closes
cache: { storageType: "session" }

// Local storage - persists across browser sessions
cache: { storageType: "local" }

// Memory - cleared when process ends
cache: { storageType: "memory" }
```

## What Gets Cached

The SDK automatically caches:

| Data | Description | Default TTL |
|------|-------------|-------------|
| Deployment Info | API domain configuration | 5 minutes |
| Agent Details | Agent profile and settings | 5 minutes |
| Context Data | User context for reconnection | Session |
| Anonymous Auth Tokens | For session continuity | Token expiry |

## Disabling Cache

```typescript
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  cache: {
    enabled: false  // Disable all caching
  }
});
```

## Custom Cache Adapter

Implement your own cache adapter for custom storage backends (Redis, IndexedDB, etc.):

```typescript
import { CacheAdapter, CacheEntry, AiAgent } from "@eGainDev/ai-agent-sdk";

class RedisCacheAdapter implements CacheAdapter {
  private redis: RedisClient;

  constructor(redis: RedisClient) {
    this.redis = redis;
  }

  get<T>(key: string): CacheEntry<T> | null {
    const data = this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  set<T>(key: string, entry: CacheEntry<T>): void {
    this.redis.set(key, JSON.stringify(entry));
  }

  delete(key: string): void {
    this.redis.del(key);
  }

  clear(prefix?: string): void {
    if (prefix) {
      const keys = this.redis.keys(`${prefix}*`);
      keys.forEach(key => this.redis.del(key));
    } else {
      this.redis.flushAll();
    }
  }

  keys(prefix?: string): string[] {
    return this.redis.keys(prefix ? `${prefix}*` : "*");
  }
}

// Use custom adapter
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  cache: {
    adapter: new RedisCacheAdapter(redisClient)
  }
});
```

## IndexedDB Adapter Example

```typescript
class IndexedDBCacheAdapter implements CacheAdapter {
  private dbName = "ai-agent-cache";
  private storeName = "cache";

  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(this.storeName);
      };
    });
  }

  get<T>(key: string): CacheEntry<T> | null {
    // Implementation using IndexedDB
    // Note: IndexedDB is async, so you may need to adapt
    return null;
  }

  set<T>(key: string, entry: CacheEntry<T>): void {
    // Store in IndexedDB
  }

  delete(key: string): void {
    // Delete from IndexedDB
  }

  clear(prefix?: string): void {
    // Clear from IndexedDB
  }

  keys(prefix?: string): string[] {
    // Get keys from IndexedDB
    return [];
  }
}
```

## Built-in Adapters

The SDK provides two built-in adapters:

### MemoryCacheAdapter

```typescript
import { MemoryCacheAdapter } from "@eGainDev/ai-agent-sdk";

const cache = new MemoryCacheAdapter();

// Store a value
cache.set("user:123", { 
  value: { name: "John" }, 
  timestamp: Date.now() 
});

// Retrieve the value
const entry = cache.get<{ name: string }>("user:123");
console.log(entry?.value.name); // "John"

// Clear with prefix
cache.clear("user:");
```

### StorageCacheAdapter

```typescript
import { StorageCacheAdapter } from "@eGainDev/ai-agent-sdk";

// Session storage (cleared on tab close)
const sessionCache = new StorageCacheAdapter("session");

// Local storage (persistent)
const localCache = new StorageCacheAdapter("local");
```

## Cache Factory

Use the factory function for automatic environment detection:

```typescript
import { createCacheAdapter } from "@eGainDev/ai-agent-sdk";

// Auto-detect best adapter
const cache = createCacheAdapter();

// Force specific type
const memoryCache = createCacheAdapter("memory");
const sessionCache = createCacheAdapter("session");
const localCache = createCacheAdapter("local");
```

## Best Practices

### 1. Use Session Storage for Most Apps

```typescript
// Default - good for most use cases
cache: { storageType: "session" }
```

### 2. Use Memory for Sensitive Data

```typescript
// Sensitive data never persisted to disk
cache: { storageType: "memory" }
```

### 3. Use Local Storage for Persistent Sessions

```typescript
// User can close browser and resume later
cache: { storageType: "local" }
```

### 4. Set Appropriate TTL

```typescript
// Short TTL for frequently changing data
cache: { ttl: 60000 }  // 1 minute

// Longer TTL for stable data
cache: { ttl: 3600000 }  // 1 hour
```

## API Reference

- [CacheAdapter Interface](/api-generated/interfaces/CacheAdapter)
- [CacheConfig Interface](/api-generated/interfaces/CacheConfig)
- [MemoryCacheAdapter](/api-generated/classes/MemoryCacheAdapter)
- [StorageCacheAdapter](/api-generated/classes/StorageCacheAdapter)
