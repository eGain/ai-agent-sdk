[@egain/ai-agent-sdk API Reference - v0.2.2-beta.1](../README.md) / GetPortalsOptions

# Interface: GetPortalsOptions

Options for `ApiHelper.getMyPortals`.

## Hierarchy

- [`GetMyPortalsOptions`](GetMyPortalsOptions.md)

  ↳ **`GetPortalsOptions`**

## Table of contents

### Properties

- [authToken](GetPortalsOptions.md#authtoken)
- [language](GetPortalsOptions.md#language)
- [userId](GetPortalsOptions.md#userid)
- [shortUrlTemplate](GetPortalsOptions.md#shorturltemplate)
- [departmentId](GetPortalsOptions.md#departmentid)

## Properties

### authToken

• `Optional` **authToken**: `string`

Authentication token (required if `ApiHelper` was constructed without `getToken`)

#### Inherited from

[GetMyPortalsOptions](GetMyPortalsOptions.md).[authToken](GetMyPortalsOptions.md#authtoken)

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

#### Inherited from

[GetMyPortalsOptions](GetMyPortalsOptions.md).[language](GetMyPortalsOptions.md#language)

#### Defined in

[core/api/ApiHelper.ts:208](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L208)

___

### userId

• `Optional` **userId**: `string`

Optional user ID for cache keying

#### Inherited from

[GetMyPortalsOptions](GetMyPortalsOptions.md).[userId](GetMyPortalsOptions.md#userid)

#### Defined in

[core/api/ApiHelper.ts:213](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L213)

___

### shortUrlTemplate

• `Optional` **shortUrlTemplate**: `string`

Optional short URL template for filtering (from agent theme)

#### Inherited from

[GetMyPortalsOptions](GetMyPortalsOptions.md).[shortUrlTemplate](GetMyPortalsOptions.md#shorturltemplate)

#### Defined in

[core/api/ApiHelper.ts:218](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L218)

___

### departmentId

• `Optional` **departmentId**: `string` \| `number`

Department ID (from portal.department.id)

#### Defined in

[core/api/ApiHelper.ts:225](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L225)
