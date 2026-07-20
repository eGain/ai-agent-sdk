[@egain/ai-agent-sdk API Reference - v0.1.4](../README.md) / AuthenticationService

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
- [getCachedToken](AuthenticationService.md#getcachedtoken)
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

[core/auth/AuthenticationService.ts:160](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L160)

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

[core/auth/AuthenticationService.ts:310](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L310)

___

### getDomain

▸ **getDomain**(): `string`

Get the domain for authentication

#### Returns

`string`

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[getDomain](../interfaces/AuthStrategy.md#getdomain)

#### Defined in

[core/auth/AuthenticationService.ts:366](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L366)

___

### authenticate

▸ **authenticate**(): `Promise`\<`void`\>

Authenticate using the selected strategy

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[authenticate](../interfaces/AuthStrategy.md#authenticate)

#### Defined in

[core/auth/AuthenticationService.ts:373](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L373)

___

### getToken

▸ **getToken**(): `Promise`\<``null`` \| `string`\>

Get the authentication token from the selected strategy

#### Returns

`Promise`\<``null`` \| `string`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[getToken](../interfaces/AuthStrategy.md#gettoken)

#### Defined in

[core/auth/AuthenticationService.ts:388](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L388)

___

### getCachedToken

▸ **getCachedToken**(): ``null`` \| `string`

Return the last token from [getToken](AuthenticationService.md#gettoken) without refreshing.
Used by platform connectors that expect a sync token (cc-widget parity).

#### Returns

``null`` \| `string`

#### Defined in

[core/auth/AuthenticationService.ts:404](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L404)

___

### cleanup

▸ **cleanup**(): `Promise`\<`void`\>

Cleanup resources from the selected strategy

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[cleanup](../interfaces/AuthStrategy.md#cleanup)

#### Defined in

[core/auth/AuthenticationService.ts:411](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L411)

___

### getAuthenticationType

▸ **getAuthenticationType**(): [`AuthenticationType`](../README.md#authenticationtype)

Get the current authentication type

#### Returns

[`AuthenticationType`](../README.md#authenticationtype)

#### Defined in

[core/auth/AuthenticationService.ts:424](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L424)

___

### getIsInitialized

▸ **getIsInitialized**(): `boolean`

Check if the service is initialized

#### Returns

`boolean`

#### Defined in

[core/auth/AuthenticationService.ts:431](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L431)

___

### getStrategy

▸ **getStrategy**(): [`AuthStrategy`](../interfaces/AuthStrategy.md)

Get the underlying strategy (for advanced use cases)

#### Returns

[`AuthStrategy`](../interfaces/AuthStrategy.md)

The underlying AuthStrategy instance

#### Defined in

[core/auth/AuthenticationService.ts:439](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L439)

___

### isAnonymousStrategy

▸ **isAnonymousStrategy**(): `boolean`

Check if the current strategy is anonymous

#### Returns

`boolean`

True if the current strategy is anonymous, false otherwise

#### Defined in

[core/auth/AuthenticationService.ts:447](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L447)

___

### isPKCEStrategy

▸ **isPKCEStrategy**(): `boolean`

Check if the current strategy is PKCE

#### Returns

`boolean`

True if the current strategy is PKCE, false otherwise

#### Defined in

[core/auth/AuthenticationService.ts:455](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L455)

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

[core/auth/AuthenticationService.ts:465](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L465)

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

[core/auth/AuthenticationService.ts:486](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L486)

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

[core/auth/AuthenticationService.ts:507](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L507)
