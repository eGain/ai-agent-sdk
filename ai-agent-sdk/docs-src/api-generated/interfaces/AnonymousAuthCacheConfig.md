[@egain/ai-agent-sdk API Reference - v0.4.0](../README.md) / AnonymousAuthCacheConfig

# Interface: AnonymousAuthCacheConfig

Cache configuration for AnonymousAuthStrategy

## Table of contents

### Properties

- [enabled](AnonymousAuthCacheConfig.md#enabled)
- [storageType](AnonymousAuthCacheConfig.md#storagetype)
- [keyPrefix](AnonymousAuthCacheConfig.md#keyprefix)
- [ttl](AnonymousAuthCacheConfig.md#ttl)

## Properties

### enabled

• `Optional` **enabled**: `boolean`

Whether caching is enabled

**`Default`**

```ts
true
```

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:21](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L21)

___

### storageType

• `Optional` **storageType**: [`CacheStorageType`](../README.md#cachestoragetype)

Storage type: 'local' (localStorage), 'session' (sessionStorage), or 'memory'

**`Default`**

```ts
'session'
```

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:27](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L27)

___

### keyPrefix

• `Optional` **keyPrefix**: `string`

Prefix for cache keys

**`Default`**

```ts
'egain_aiagent_auth_metadata_'
```

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:33](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L33)

___

### ttl

• `Optional` **ttl**: `number`

Time-to-live in milliseconds

**`Default`**

```ts
300000 (5 minutes)
```

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:39](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L39)
