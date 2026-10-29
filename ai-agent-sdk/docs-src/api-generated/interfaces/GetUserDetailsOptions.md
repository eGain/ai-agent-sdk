[@egain/ai-agent-sdk API Reference - v0.4.0](../README.md) / GetUserDetailsOptions

# Interface: GetUserDetailsOptions

## Table of contents

### Properties

- [authToken](GetUserDetailsOptions.md#authtoken)
- [deploymentVersion](GetUserDetailsOptions.md#deploymentversion)

## Properties

### authToken

• `Optional` **authToken**: `string`

Authentication token (required if `ApiHelper` was constructed without `getToken`)

#### Defined in

[core/api/ApiHelper.ts:85](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L85)

___

### deploymentVersion

• `Optional` **deploymentVersion**: `string`

`deploymentInfo.version` — when >= 21.24.1.0, requests `emailAddress`

#### Defined in

[core/api/ApiHelper.ts:87](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L87)
