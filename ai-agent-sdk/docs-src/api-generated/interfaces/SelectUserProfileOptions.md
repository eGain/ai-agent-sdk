[@egain/ai-agent-sdk API Reference - v0.2.2-beta.1](../README.md) / SelectUserProfileOptions

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

[core/api/ApiHelper.ts:279](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L279)

___

### profileId

• **profileId**: `string` \| `number`

User profile ID to select

#### Defined in

[core/api/ApiHelper.ts:284](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L284)

___

### authToken

• `Optional` **authToken**: `string`

Authentication token (required if `ApiHelper` was constructed without `getToken`)

#### Defined in

[core/api/ApiHelper.ts:289](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L289)
