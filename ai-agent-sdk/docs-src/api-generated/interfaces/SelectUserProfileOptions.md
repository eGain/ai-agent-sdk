[@eGainDev/ai-agent-sdk API Reference - v0.0.14](../README.md) / SelectUserProfileOptions

# Interface: SelectUserProfileOptions

Options for selectUserProfile API call.
Sets the selected user profile for a portal.

## Table of contents

### Properties

- [portalId](SelectUserProfileOptions.md#portalid)
- [profileId](SelectUserProfileOptions.md#profileid)
- [authToken](SelectUserProfileOptions.md#authtoken)

## Properties

### portalId

• **portalId**: `string` \| `number`

Portal ID

#### Defined in

[core/api/ApiHelper.ts:267](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/api/ApiHelper.ts#L267)

___

### profileId

• **profileId**: `string` \| `number`

User profile ID to select

#### Defined in

[core/api/ApiHelper.ts:272](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/api/ApiHelper.ts#L272)

___

### authToken

• `Optional` **authToken**: `string`

Authentication token (required if `ApiHelper` was constructed without `getToken`)

#### Defined in

[core/api/ApiHelper.ts:277](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/api/ApiHelper.ts#L277)
