[@egain/ai-agent-sdk API Reference - v0.3.0](../README.md) / PreAuthServiceConfig

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

[core/auth/AuthenticationService.ts:49](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L49)

___

### accessToken

• **accessToken**: `string`

Access token to use directly

#### Defined in

[core/auth/AuthenticationService.ts:53](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L53)

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

[core/auth/AuthenticationService.ts:58](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L58)
