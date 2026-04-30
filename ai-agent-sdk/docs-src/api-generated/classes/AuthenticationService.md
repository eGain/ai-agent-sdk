[@eGainDev/ai-agent-sdk API Reference - v0.0.14](../README.md) / AuthenticationService

# Class: AuthenticationService

Base interface for authentication strategies
All authentication strategies must implement this interface

## Implements

- [`AuthStrategy`](../interfaces/AuthStrategy.md)

## Table of contents

### Constructors

- [constructor](AuthenticationService.md#constructor)

### Methods

- [initialize](AuthenticationService.md#initialize)
- [getDomain](AuthenticationService.md#getdomain)
- [authenticate](AuthenticationService.md#authenticate)
- [getToken](AuthenticationService.md#gettoken)
- [cleanup](AuthenticationService.md#cleanup)
- [getAuthenticationType](AuthenticationService.md#getauthenticationtype)
- [getIsInitialized](AuthenticationService.md#getisinitialized)
- [getStrategy](AuthenticationService.md#getstrategy)
- [isAnonymousStrategy](AuthenticationService.md#isanonymousstrategy)
- [isPKCEStrategy](AuthenticationService.md#ispkcestrategy)
- [updateToken](AuthenticationService.md#updatetoken)
- [setTokenExpiringCallback](AuthenticationService.md#settokenexpiringcallback)
- [switchStrategyTo](AuthenticationService.md#switchstrategyto)

## Constructors

### constructor

• **new AuthenticationService**(`input?`, `logger?`, `cacheConfig?`): [`AuthenticationService`](AuthenticationService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input?` | [`AuthenticationInput`](../README.md#authenticationinput) |
| `logger?` | [`Logger`](Logger.md) |
| `cacheConfig?` | `AuthServiceCacheConfig` |

#### Returns

[`AuthenticationService`](AuthenticationService.md)

#### Defined in

[core/auth/AuthenticationService.ts:159](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L159)

## Methods

### initialize

▸ **initialize**(`options?`): `Promise`\<`void`\>

Initialize the authentication service
Delegates to the selected strategy

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `AuthServiceInitializeOptions` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[initialize](../interfaces/AuthStrategy.md#initialize)

#### Defined in

[core/auth/AuthenticationService.ts:309](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L309)

___

### getDomain

▸ **getDomain**(): `string`

Get the domain for authentication

#### Returns

`string`

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[getDomain](../interfaces/AuthStrategy.md#getdomain)

#### Defined in

[core/auth/AuthenticationService.ts:365](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L365)

___

### authenticate

▸ **authenticate**(): `Promise`\<`void`\>

Authenticate using the selected strategy

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[authenticate](../interfaces/AuthStrategy.md#authenticate)

#### Defined in

[core/auth/AuthenticationService.ts:372](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L372)

___

### getToken

▸ **getToken**(): `Promise`\<``null`` \| `string`\>

Get the authentication token from the selected strategy

#### Returns

`Promise`\<``null`` \| `string`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[getToken](../interfaces/AuthStrategy.md#gettoken)

#### Defined in

[core/auth/AuthenticationService.ts:387](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L387)

___

### cleanup

▸ **cleanup**(): `Promise`\<`void`\>

Cleanup resources from the selected strategy

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[cleanup](../interfaces/AuthStrategy.md#cleanup)

#### Defined in

[core/auth/AuthenticationService.ts:401](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L401)

___

### getAuthenticationType

▸ **getAuthenticationType**(): [`AuthenticationType`](../README.md#authenticationtype)

Get the current authentication type

#### Returns

[`AuthenticationType`](../README.md#authenticationtype)

#### Defined in

[core/auth/AuthenticationService.ts:413](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L413)

___

### getIsInitialized

▸ **getIsInitialized**(): `boolean`

Check if the service is initialized

#### Returns

`boolean`

#### Defined in

[core/auth/AuthenticationService.ts:420](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L420)

___

### getStrategy

▸ **getStrategy**(): [`AuthStrategy`](../interfaces/AuthStrategy.md)

Get the underlying strategy (for advanced use cases)

#### Returns

[`AuthStrategy`](../interfaces/AuthStrategy.md)

The underlying AuthStrategy instance

#### Defined in

[core/auth/AuthenticationService.ts:428](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L428)

___

### isAnonymousStrategy

▸ **isAnonymousStrategy**(): `boolean`

Check if the current strategy is anonymous

#### Returns

`boolean`

True if the current strategy is anonymous, false otherwise

#### Defined in

[core/auth/AuthenticationService.ts:436](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L436)

___

### isPKCEStrategy

▸ **isPKCEStrategy**(): `boolean`

Check if the current strategy is PKCE

#### Returns

`boolean`

True if the current strategy is PKCE, false otherwise

#### Defined in

[core/auth/AuthenticationService.ts:444](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L444)

___

### updateToken

▸ **updateToken**(`token`): `Promise`\<`void`\>

Update the access token at runtime
Only supported for PreAuthStrategy

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `string` | The new access token |

#### Returns

`Promise`\<`void`\>

**`Throws`**

AuthError if the underlying strategy doesn't support token updates

#### Defined in

[core/auth/AuthenticationService.ts:454](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L454)

___

### setTokenExpiringCallback

▸ **setTokenExpiringCallback**(`callback`): `void`

Set the callback to be called when token is about to expire
Only supported for PreAuthStrategy

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`TokenExpiringCallback`](../README.md#tokenexpiringcallback) | Function to call when token is expiring, receives expiresAt timestamp |

#### Returns

`void`

#### Defined in

[core/auth/AuthenticationService.ts:475](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L475)

___

### switchStrategyTo

▸ **switchStrategyTo**(`pkceConfig`, `postAuthentication?`): `Promise`\<`boolean`\>

Switch from anonymous strategy to PKCE strategy
Only switches if the current strategy is anonymous, otherwise keeps the same strategy

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pkceConfig` | [`PKCEAuthConfig`](../interfaces/PKCEAuthConfig.md) | PKCE configuration options |
| `postAuthentication?` | [`PostAuthenticationCallback`](../README.md#postauthenticationcallback) | - |

#### Returns

`Promise`\<`boolean`\>

True if strategy was switched, false if it was already PKCE or not anonymous

#### Defined in

[core/auth/AuthenticationService.ts:496](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L496)
