[@eGainDev/ai-agent-sdk API Reference - v0.0.14](../README.md) / PreAuthStrategy

# Class: PreAuthStrategy

Pre-auth authentication strategy
Uses a pre-obtained access token without completing authentication flow

## Implements

- [`AuthStrategy`](../interfaces/AuthStrategy.md)

## Table of contents

### Constructors

- [constructor](PreAuthStrategy.md#constructor)

### Methods

- [setTokenExpiringCallback](PreAuthStrategy.md#settokenexpiringcallback)
- [initialize](PreAuthStrategy.md#initialize)
- [authenticate](PreAuthStrategy.md#authenticate)
- [isAuthenticated](PreAuthStrategy.md#isauthenticated)
- [getToken](PreAuthStrategy.md#gettoken)
- [updateToken](PreAuthStrategy.md#updatetoken)
- [refreshToken](PreAuthStrategy.md#refreshtoken)
- [cleanup](PreAuthStrategy.md#cleanup)

## Constructors

### constructor

• **new PreAuthStrategy**(`config`): [`PreAuthStrategy`](PreAuthStrategy.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`PreAuthConfig`](../interfaces/PreAuthConfig.md) |

#### Returns

[`PreAuthStrategy`](PreAuthStrategy.md)

#### Defined in

[core/auth/PreAuthStrategy.ts:57](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/PreAuthStrategy.ts#L57)

## Methods

### setTokenExpiringCallback

▸ **setTokenExpiringCallback**(`callback`): `void`

Set the callback to be called when token is about to expire

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`TokenExpiringCallback`](../README.md#tokenexpiringcallback) | Function to call when token is expiring |

#### Returns

`void`

#### Defined in

[core/auth/PreAuthStrategy.ts:162](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/PreAuthStrategy.ts#L162)

___

### initialize

▸ **initialize**(`options?`): `Promise`\<`void`\>

Initialize the pre-auth authentication strategy
Ensures the token is available and ready to use

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`AuthStrategyInitializeOptions`](../interfaces/AuthStrategyInitializeOptions.md) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[initialize](../interfaces/AuthStrategy.md#initialize)

#### Defined in

[core/auth/PreAuthStrategy.ts:174](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/PreAuthStrategy.ts#L174)

___

### authenticate

▸ **authenticate**(): `Promise`\<`void`\>

Authenticate using pre-auth token

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[authenticate](../interfaces/AuthStrategy.md#authenticate)

#### Defined in

[core/auth/PreAuthStrategy.ts:213](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/PreAuthStrategy.ts#L213)

___

### isAuthenticated

▸ **isAuthenticated**(): `boolean`

Check if the user is currently authenticated

#### Returns

`boolean`

#### Defined in

[core/auth/PreAuthStrategy.ts:234](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/PreAuthStrategy.ts#L234)

___

### getToken

▸ **getToken**(): `Promise`\<`string`\>

Get the access token
If refresh function is provided and token is expired, attempts to refresh

#### Returns

`Promise`\<`string`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[getToken](../interfaces/AuthStrategy.md#gettoken)

#### Defined in

[core/auth/PreAuthStrategy.ts:242](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/PreAuthStrategy.ts#L242)

___

### updateToken

▸ **updateToken**(`token`): `Promise`\<`void`\>

Update the access token
Cancels existing expiry timer and schedules new one based on new token
If authenticated, calls postAuthentication callback with the new token

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `string` | The new access token |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/auth/PreAuthStrategy.ts:252](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/PreAuthStrategy.ts#L252)

___

### refreshToken

▸ **refreshToken**(): `Promise`\<`string`\>

Refresh the token using the provided refresh function

#### Returns

`Promise`\<`string`\>

#### Defined in

[core/auth/PreAuthStrategy.ts:266](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/PreAuthStrategy.ts#L266)

___

### cleanup

▸ **cleanup**(): `Promise`\<`void`\>

Cleanup resources

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[cleanup](../interfaces/AuthStrategy.md#cleanup)

#### Defined in

[core/auth/PreAuthStrategy.ts:277](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/PreAuthStrategy.ts#L277)
