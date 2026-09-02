[@egain/ai-agent-sdk API Reference - v0.2.3-beta.3](../README.md) / GetMyPortalsOptions

# Interface: GetMyPortalsOptions

Options for `ApiHelper.getMyPortals`.

## Hierarchy

- **`GetMyPortalsOptions`**

  ↳ [`GetPortalsOptions`](GetPortalsOptions.md)

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

[core/api/ApiHelper.ts:202](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L202)

___

### language

• `Optional` **language**: `string`

Language code (e.g., "en-us", "da-dk")

**`Default`**

```ts
"en-us"
```

#### Defined in

[core/api/ApiHelper.ts:208](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L208)

___

### userId

• `Optional` **userId**: `string`

Optional user ID for cache keying

#### Defined in

[core/api/ApiHelper.ts:213](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L213)

___

### shortUrlTemplate

• `Optional` **shortUrlTemplate**: `string`

Optional short URL template for filtering (from agent theme)

#### Defined in

[core/api/ApiHelper.ts:218](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L218)
