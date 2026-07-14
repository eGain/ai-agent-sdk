[@egain/ai-agent-sdk API Reference - v0.1.3](../README.md) / StorageCacheAdapter

# Class: StorageCacheAdapter

Browser storage cache adapter using localStorage or sessionStorage.

Automatically serializes values to JSON for storage. Falls back gracefully
if storage is unavailable or full.

**`Example`**

```typescript
// Use sessionStorage (cleared when tab closes)
const sessionCache = new StorageCacheAdapter('session');

// Use localStorage (persistent)
const localCache = new StorageCacheAdapter('local');

// Store data
sessionCache.set('config', { 
  value: { theme: 'dark' }, 
  timestamp: Date.now() 
});
```

## Implements

- [`CacheAdapter`](../interfaces/CacheAdapter.md)

## Table of contents

### Constructors

- [constructor](StorageCacheAdapter.md#constructor)

### Methods

- [get](StorageCacheAdapter.md#get)
- [set](StorageCacheAdapter.md#set)
- [delete](StorageCacheAdapter.md#delete)
- [clear](StorageCacheAdapter.md#clear)
- [keys](StorageCacheAdapter.md#keys)

## Constructors

### constructor

• **new StorageCacheAdapter**(`storageType?`): [`StorageCacheAdapter`](StorageCacheAdapter.md)

Create a new StorageCacheAdapter

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `storageType` | ``"local"`` \| ``"session"`` | `'session'` | Use 'local' for localStorage, 'session' for sessionStorage |

#### Returns

[`StorageCacheAdapter`](StorageCacheAdapter.md)

**`Throws`**

Error if not in a browser environment

#### Defined in

[core/api/CacheAdapter.ts:291](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/CacheAdapter.ts#L291)

## Methods

### get

▸ **get**\<`T`\>(`key`): ``null`` \| [`CacheEntry`](../interfaces/CacheEntry.md)\<`T`\>

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

``null`` \| [`CacheEntry`](../interfaces/CacheEntry.md)\<`T`\>

The cached entry or null if not found

#### Implementation of

[CacheAdapter](../interfaces/CacheAdapter.md).[get](../interfaces/CacheAdapter.md#get)

#### Defined in

[core/api/CacheAdapter.ts:303](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/CacheAdapter.ts#L303)

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
| `entry` | [`CacheEntry`](../interfaces/CacheEntry.md)\<`T`\> | The cache entry with value and timestamp |

#### Returns

`void`

#### Implementation of

[CacheAdapter](../interfaces/CacheAdapter.md).[set](../interfaces/CacheAdapter.md#set)

#### Defined in

[core/api/CacheAdapter.ts:315](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/CacheAdapter.ts#L315)

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

#### Implementation of

[CacheAdapter](../interfaces/CacheAdapter.md).[delete](../interfaces/CacheAdapter.md#delete)

#### Defined in

[core/api/CacheAdapter.ts:324](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/CacheAdapter.ts#L324)

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

#### Implementation of

[CacheAdapter](../interfaces/CacheAdapter.md).[clear](../interfaces/CacheAdapter.md#clear)

#### Defined in

[core/api/CacheAdapter.ts:328](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/CacheAdapter.ts#L328)

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

#### Implementation of

[CacheAdapter](../interfaces/CacheAdapter.md).[keys](../interfaces/CacheAdapter.md#keys)

#### Defined in

[core/api/CacheAdapter.ts:343](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/CacheAdapter.ts#L343)
