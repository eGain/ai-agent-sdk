[@egain/ai-agent-sdk API Reference - v0.1.0](../README.md) / CacheConfig

# Interface: CacheConfig

Cache configuration options

## Table of contents

### Properties

- [enabled](CacheConfig.md#enabled)
- [storageType](CacheConfig.md#storagetype)
- [keyPrefix](CacheConfig.md#keyprefix)
- [ttl](CacheConfig.md#ttl)
- [adapter](CacheConfig.md#adapter)

## Properties

### enabled

• `Optional` **enabled**: `boolean`

Whether caching is enabled

**`Default`**

```ts
true
```

#### Defined in

[core/api/ApiHelper.ts:15](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L15)

___

### storageType

• `Optional` **storageType**: [`CacheStorageType`](../README.md#cachestoragetype)

Storage type: 'local' (localStorage), 'session' (sessionStorage), or 'memory'

**`Default`**

```ts
'session'
```

#### Defined in

[core/api/ApiHelper.ts:21](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L21)

___

### keyPrefix

• `Optional` **keyPrefix**: `string`

Prefix for cache keys

**`Default`**

```ts
'egain_aiagent_cache_'
```

#### Defined in

[core/api/ApiHelper.ts:27](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L27)

___

### ttl

• `Optional` **ttl**: `number`

Time-to-live in milliseconds

**`Default`**

```ts
300000 (5 minutes)
```

#### Defined in

[core/api/ApiHelper.ts:33](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L33)

___

### adapter

• `Optional` **adapter**: [`CacheAdapter`](CacheAdapter.md)

Custom cache adapter instance
When provided, this adapter will be used instead of the built-in adapters.
The SDK manages all caching logic (TTL, keys, invalidation) - the adapter
only provides the underlying storage mechanism with synchronous get/set.

#### Defined in

[core/api/ApiHelper.ts:41](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L41)
