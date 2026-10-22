[@egain/ai-agent-sdk API Reference - v0.3.3](../README.md) / ApiHelperConfig

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

[core/api/ApiHelper.ts:54](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L54)

___

### language

• `Optional` **language**: `string`

Language code (e.g., "en-us", "da-dk")

**`Default`**

```ts
"en-us"
```

#### Defined in

[core/api/ApiHelper.ts:60](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L60)

___

### cache

• `Optional` **cache**: [`CacheConfig`](CacheConfig.md)

Cache configuration options

#### Defined in

[core/api/ApiHelper.ts:65](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L65)

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

[core/api/ApiHelper.ts:71](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L71)
