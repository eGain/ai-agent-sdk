[@egain/ai-agent-sdk API Reference - v0.1.0](../README.md) / GetMaskingPatternsOptions

# Interface: GetMaskingPatternsOptions

## Table of contents

### Properties

- [departmentId](GetMaskingPatternsOptions.md#departmentid)
- [channel](GetMaskingPatternsOptions.md#channel)
- [authToken](GetMaskingPatternsOptions.md#authtoken)

## Properties

### departmentId

• **departmentId**: `string`

Department ID

#### Defined in

[core/api/ApiHelper.ts:176](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L176)

___

### channel

• `Optional` **channel**: `string`

Channel name (e.g., "chat")

**`Default`**

```ts
"chat"
```

#### Defined in

[core/api/ApiHelper.ts:182](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L182)

___

### authToken

• `Optional` **authToken**: `string`

Authentication token (required if `ApiHelper` was constructed without `getToken`)

#### Defined in

[core/api/ApiHelper.ts:187](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L187)
