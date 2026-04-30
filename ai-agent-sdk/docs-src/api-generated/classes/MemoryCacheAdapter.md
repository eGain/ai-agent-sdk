[@eGainDev/ai-agent-sdk API Reference - v0.0.14](../README.md) / MemoryCacheAdapter

# Class: MemoryCacheAdapter

In-memory cache adapter for Node.js environments.

Uses a JavaScript Map for storage. Data persists only for the lifetime
of the process. Suitable for server-side applications and testing.

**`Example`**

```typescript
const cache = new MemoryCacheAdapter();

// Store a value
cache.set('user:123', { 
  value: { name: 'John' }, 
  timestamp: Date.now() 
});

// Retrieve the value
const entry = cache.get<{ name: string }>('user:123');
console.log(entry?.value.name); // "John"
```

## Implements

- [`CacheAdapter`](../interfaces/CacheAdapter.md)

## Table of contents

### Constructors

- [constructor](MemoryCacheAdapter.md#constructor)

### Methods

- [get](MemoryCacheAdapter.md#get)
- [set](MemoryCacheAdapter.md#set)
- [delete](MemoryCacheAdapter.md#delete)
- [clear](MemoryCacheAdapter.md#clear)
- [keys](MemoryCacheAdapter.md#keys)

## Constructors

### constructor

• **new MemoryCacheAdapter**(): [`MemoryCacheAdapter`](MemoryCacheAdapter.md)

#### Returns

[`MemoryCacheAdapter`](MemoryCacheAdapter.md)

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

[core/api/CacheAdapter.ts:222](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/CacheAdapter.ts#L222)

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

[core/api/CacheAdapter.ts:230](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/CacheAdapter.ts#L230)

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

[core/api/CacheAdapter.ts:234](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/CacheAdapter.ts#L234)

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

[core/api/CacheAdapter.ts:238](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/CacheAdapter.ts#L238)

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

[core/api/CacheAdapter.ts:250](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/CacheAdapter.ts#L250)
