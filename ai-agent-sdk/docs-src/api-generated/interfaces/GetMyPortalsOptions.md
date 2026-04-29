[@eGainDev/ai-agent-sdk API Reference - v0.0.13](../README.md) / GetMyPortalsOptions

# Interface: GetMyPortalsOptions

Options for `ApiHelper.getMyPortals`.

## Table of contents

### Properties

- [authToken](GetMyPortalsOptions.md#authtoken)
- [language](GetMyPortalsOptions.md#language)
- [userId](GetMyPortalsOptions.md#userid)
- [shortUrlTemplate](GetMyPortalsOptions.md#shorturltemplate)

## Properties

### authToken

• `Optional` **authToken**: `string`

Authentication token (required if `ApiHelper` was constructed without `getToken`)

#### Defined in

[core/api/ApiHelper.ts:197](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/ApiHelper.ts#L197)

___

### language

• `Optional` **language**: `string`

Language code (e.g., "en-us", "da-dk")

**`Default`**

```ts
"en-us"
```

#### Defined in

[core/api/ApiHelper.ts:203](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/ApiHelper.ts#L203)

___

### userId

• `Optional` **userId**: `string`

Optional user ID for cache keying

#### Defined in

[core/api/ApiHelper.ts:208](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/ApiHelper.ts#L208)

___

### shortUrlTemplate

• `Optional` **shortUrlTemplate**: `string`

Optional short URL template for filtering (from agent theme)

#### Defined in

[core/api/ApiHelper.ts:213](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/ApiHelper.ts#L213)
