[@eGainDev/ai-agent-sdk API Reference - v0.0.14](../README.md) / ApiHelperConfig

# Interface: ApiHelperConfig

API Helper service for making eGain AI Agent API calls

## Table of contents

### Properties

- [apiDomain](ApiHelperConfig.md#apidomain)
- [language](ApiHelperConfig.md#language)
- [cache](ApiHelperConfig.md#cache)
- [getToken](ApiHelperConfig.md#gettoken)

## Properties

### apiDomain

• **apiDomain**: `string`

API domain/base URL

#### Defined in

[core/api/ApiHelper.ts:51](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/ApiHelper.ts#L51)

___

### language

• `Optional` **language**: `string`

Language code (e.g., "en-us", "da-dk")

**`Default`**

```ts
"en-us"
```

#### Defined in

[core/api/ApiHelper.ts:57](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/ApiHelper.ts#L57)

___

### cache

• `Optional` **cache**: [`CacheConfig`](CacheConfig.md)

Cache configuration options

#### Defined in

[core/api/ApiHelper.ts:62](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/ApiHelper.ts#L62)

___

### getToken

• `Optional` **getToken**: () => `Promise`\<``null`` \| `string`\>

When set, API methods may omit `authToken` in their options; the token is resolved via this provider.
If omitted, each call must pass `authToken` explicitly.

#### Type declaration

▸ (): `Promise`\<``null`` \| `string`\>

##### Returns

`Promise`\<``null`` \| `string`\>

#### Defined in

[core/api/ApiHelper.ts:68](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/ApiHelper.ts#L68)
