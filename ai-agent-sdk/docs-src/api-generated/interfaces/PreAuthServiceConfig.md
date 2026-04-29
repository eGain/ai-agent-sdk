[@eGainDev/ai-agent-sdk API Reference - v0.0.13](../README.md) / PreAuthServiceConfig

# Interface: PreAuthServiceConfig

Pre-auth authentication configuration

## Table of contents

### Properties

- [type](PreAuthServiceConfig.md#type)
- [accessToken](PreAuthServiceConfig.md#accesstoken)
- [refreshTokenFn](PreAuthServiceConfig.md#refreshtokenfn)

## Properties

### type

• **type**: ``"pre-auth"``

#### Defined in

[core/auth/AuthenticationService.ts:48](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L48)

___

### accessToken

• **accessToken**: `string`

Access token to use directly

#### Defined in

[core/auth/AuthenticationService.ts:52](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L52)

___

### refreshTokenFn

• `Optional` **refreshTokenFn**: () => `Promise`\<`string`\>

Optional token refresh function
If provided, will be called when token needs to be refreshed

#### Type declaration

▸ (): `Promise`\<`string`\>

##### Returns

`Promise`\<`string`\>

#### Defined in

[core/auth/AuthenticationService.ts:57](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L57)
