[@egain/ai-agent-sdk API Reference - v0.1.0](../README.md) / CacheAdapter

# Interface: CacheAdapter

Cache adapter interface for implementing custom storage backends.

Implement this interface to create custom cache adapters for Redis, 
IndexedDB, or other storage systems.

**`Example`**

```typescript
class CustomCacheAdapter implements CacheAdapter {
  private store = new Map<string, string>();
  
  get<T>(key: string): CacheEntry<T> | null {
    const data = this.store.get(key);
    return data ? JSON.parse(data) : null;
  }
  
  set<T>(key: string, entry: CacheEntry<T>): void {
    this.store.set(key, JSON.stringify(entry));
  }
  
  delete(key: string): void {
    this.store.delete(key);
  }
  
  clear(prefix?: string): void {
    if (prefix) {
      for (const key of this.store.keys()) {
        if (key.startsWith(prefix)) this.store.delete(key);
      }
    } else {
      this.store.clear();
    }
  }
  
  keys(prefix?: string): string[] {
    const allKeys = Array.from(this.store.keys());
    return prefix ? allKeys.filter(k => k.startsWith(prefix)) : allKeys;
  }
}
```

## Implemented by

- [`MemoryCacheAdapter`](../classes/MemoryCacheAdapter.md)
- [`StorageCacheAdapter`](../classes/StorageCacheAdapter.md)

## Table of contents

### Methods

- [get](CacheAdapter.md#get)
- [set](CacheAdapter.md#set)
- [delete](CacheAdapter.md#delete)
- [clear](CacheAdapter.md#clear)
- [keys](CacheAdapter.md#keys)

## Methods

### get

▸ **get**\<`T`\>(`key`): ``null`` \| [`CacheEntry`](CacheEntry.md)\<`T`\>

Get a value from the cache

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The cache key |

#### Returns

``null`` \| [`CacheEntry`](CacheEntry.md)\<`T`\>

The cached entry or null if not found

#### Defined in

[core/api/CacheAdapter.ts:166](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/CacheAdapter.ts#L166)

___

### set

▸ **set**\<`T`\>(`key`, `entry`): `void`

Set a value in the cache

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The cache key |
| `entry` | [`CacheEntry`](CacheEntry.md)\<`T`\> | The cache entry with value and timestamp |

#### Returns

`void`

#### Defined in

[core/api/CacheAdapter.ts:173](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/CacheAdapter.ts#L173)

___

### delete

▸ **delete**(`key`): `void`

Delete a value from the cache

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The cache key |

#### Returns

`void`

#### Defined in

[core/api/CacheAdapter.ts:179](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/CacheAdapter.ts#L179)

___

### clear

▸ **clear**(`prefix?`): `void`

Clear all values from the cache

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix?` | `string` | Optional prefix to only clear keys starting with this prefix |

#### Returns

`void`

#### Defined in

[core/api/CacheAdapter.ts:185](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/CacheAdapter.ts#L185)

___

### keys

▸ **keys**(`prefix?`): `string`[]

Get all keys in the cache

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prefix?` | `string` | Optional prefix to filter keys |

#### Returns

`string`[]

Array of matching cache keys

#### Defined in

[core/api/CacheAdapter.ts:192](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/CacheAdapter.ts#L192)
