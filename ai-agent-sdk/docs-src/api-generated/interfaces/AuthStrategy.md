[@eGain/ai-agent-sdk API Reference - v0.0.14](../README.md) / AuthStrategy

# Interface: AuthStrategy

Base interface for authentication strategies
All authentication strategies must implement this interface

## Hierarchy

- [`AuthProvider`](AuthProvider.md)

  ↳ **`AuthStrategy`**

## Implemented by

- [`AnonymousAuthStrategy`](../classes/AnonymousAuthStrategy.md)
- [`AuthenticationService`](../classes/AuthenticationService.md)
- [`ClientCredentialsAuthStrategy`](../classes/ClientCredentialsAuthStrategy.md)
- [`PKCEAuthStrategy`](../classes/PKCEAuthStrategy.md)
- [`PreAuthStrategy`](../classes/PreAuthStrategy.md)

## Table of contents

### Methods

- [getToken](AuthStrategy.md#gettoken)
- [initialize](AuthStrategy.md#initialize)
- [authenticate](AuthStrategy.md#authenticate)
- [cleanup](AuthStrategy.md#cleanup)
- [getDomain](AuthStrategy.md#getdomain)

## Methods

### getToken

▸ **getToken**(): `Promise`\<``null`` \| `string`\>

Get an authentication token
This method may be called multiple times, so implementations should
handle token refresh if needed

#### Returns

`Promise`\<``null`` \| `string`\>

#### Inherited from

[AuthProvider](AuthProvider.md).[getToken](AuthProvider.md#gettoken)

#### Defined in

[core/auth/AuthProvider.ts:11](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthProvider.ts#L11)

___

### initialize

▸ **initialize**(`options?`): `Promise`\<`void`\>

Initialize the authentication strategy
This method sets up the strategy but does not perform authentication
Called when the strategy is set on the agent

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`AuthStrategyInitializeOptions`](AuthStrategyInitializeOptions.md) | Initialize options including postAuthentication callback |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/auth/AuthStrategy.ts:65](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthStrategy.ts#L65)

___

### authenticate

▸ **authenticate**(): `Promise`\<`void`\>

Authenticate the user
This method performs the actual authentication flow
The postAuthentication callback registered during initialize() will be called after authentication completes

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/auth/AuthStrategy.ts:72](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthStrategy.ts#L72)

___

### cleanup

▸ **cleanup**(): `Promise`\<`void`\>

Cleanup resources when the strategy is no longer needed

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/auth/AuthStrategy.ts:77](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthStrategy.ts#L77)

___

### getDomain

▸ **getDomain**(): `string`

Get the domain for authentication

#### Returns

`string`

#### Defined in

[core/auth/AuthStrategy.ts:82](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthStrategy.ts#L82)
