[@egain/ai-agent-sdk API Reference - v0.1.0](../README.md) / GetUserProfilesOptions

# Interface: GetUserProfilesOptions

Options for getUserProfiles API call.
Fetches user profiles for a portal.

## Table of contents

### Properties

- [portalId](GetUserProfilesOptions.md#portalid)
- [authToken](GetUserProfilesOptions.md#authtoken)

## Properties

### portalId

• **portalId**: `string` \| `number`

Portal ID

#### Defined in

[core/api/ApiHelper.ts:251](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L251)

___

### authToken

• `Optional` **authToken**: `string`

Authentication token (required if `ApiHelper` was constructed without `getToken`)

#### Defined in

[core/api/ApiHelper.ts:256](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L256)
