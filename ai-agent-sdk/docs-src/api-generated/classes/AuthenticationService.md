[@egain/ai-agent-sdk API Reference - v0.3.0](../README.md) / AuthenticationService

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
- [logout](AuthenticationService.md#logout)
- [cleanup](AuthenticationService.md#cleanup)
- [getAuthenticationType](AuthenticationService.md#getauthenticationtype)
- [getIsInitialized](AuthenticationService.md#getisinitialized)
- [getStrategy](AuthenticationService.md#getstrategy)
- [isAnonymousStrategy](AuthenticationService.md#isanonymousstrategy)
- [isPKCEStrategy](AuthenticationService.md#ispkcestrategy)
- [updateToken](AuthenticationService.md#updatetoken)
- [setTokenExpiringCallback](AuthenticationService.md#settokenexpiringcallback)
- [updateScopes](AuthenticationService.md#updatescopes)
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

[core/auth/AuthenticationService.ts:161](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L161)

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

[core/auth/AuthenticationService.ts:311](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L311)

___

### getDomain

▸ **getDomain**(): `string`

Get the domain for authentication

#### Returns

`string`

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[getDomain](../interfaces/AuthStrategy.md#getdomain)

#### Defined in

[core/auth/AuthenticationService.ts:359](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L359)

___

### authenticate

▸ **authenticate**(): `Promise`\<`void`\>

Authenticate using the selected strategy

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[authenticate](../interfaces/AuthStrategy.md#authenticate)

#### Defined in

[core/auth/AuthenticationService.ts:366](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L366)

___

### getToken

▸ **getToken**(): `Promise`\<``null`` \| `string`\>

Get the authentication token from the selected strategy

#### Returns

`Promise`\<``null`` \| `string`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[getToken](../interfaces/AuthStrategy.md#gettoken)

#### Defined in

[core/auth/AuthenticationService.ts:381](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L381)

___

### getCachedToken

▸ **getCachedToken**(): ``null`` \| `string`

Return the last token from [getToken](AuthenticationService.md#gettoken) without refreshing.
Used by platform connectors that expect a sync token (cc-widget parity).

#### Returns

``null`` \| `string`

#### Defined in

[core/auth/AuthenticationService.ts:397](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L397)

___

### logout

▸ **logout**(): `Promise`\<`void`\>

Log out via the underlying strategy when it supports it (PKCE/MSAL).
Always clears the cached access token. No-op on the IdP when the strategy
has no `logout()` (anonymous, pre-auth, client-credentials).

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[logout](../interfaces/AuthStrategy.md#logout)

#### Defined in

[core/auth/AuthenticationService.ts:406](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L406)

___

### cleanup

▸ **cleanup**(): `Promise`\<`void`\>

Cleanup resources from the selected strategy

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[cleanup](../interfaces/AuthStrategy.md#cleanup)

#### Defined in

[core/auth/AuthenticationService.ts:416](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L416)

___

### getAuthenticationType

▸ **getAuthenticationType**(): [`AuthenticationType`](../README.md#authenticationtype)

Get the current authentication type

#### Returns

[`AuthenticationType`](../README.md#authenticationtype)

#### Defined in

[core/auth/AuthenticationService.ts:429](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L429)

___

### getIsInitialized

▸ **getIsInitialized**(): `boolean`

Check if the service is initialized

#### Returns

`boolean`

#### Defined in

[core/auth/AuthenticationService.ts:436](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L436)

___

### getStrategy

▸ **getStrategy**(): [`AuthStrategy`](../interfaces/AuthStrategy.md)

Get the underlying strategy (for advanced use cases)

#### Returns

[`AuthStrategy`](../interfaces/AuthStrategy.md)

The underlying AuthStrategy instance

#### Defined in

[core/auth/AuthenticationService.ts:444](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L444)

___

### isAnonymousStrategy

▸ **isAnonymousStrategy**(): `boolean`

Check if the current strategy is anonymous

#### Returns

`boolean`

True if the current strategy is anonymous, false otherwise

#### Defined in

[core/auth/AuthenticationService.ts:452](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L452)

___

### isPKCEStrategy

▸ **isPKCEStrategy**(): `boolean`

Check if the current strategy is PKCE

#### Returns

`boolean`

True if the current strategy is PKCE, false otherwise

#### Defined in

[core/auth/AuthenticationService.ts:460](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L460)

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

[core/auth/AuthenticationService.ts:470](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L470)

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

[core/auth/AuthenticationService.ts:491](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L491)

___

### updateScopes

▸ **updateScopes**(`scopes`, `deploymentInfo?`): `Promise`\<`void`\>

Replace the scopes the current strategy will use for its next token request, without
re-running initialization. Used once agent details reveal per-agent `extraScopes` for an
agent that stays on the anonymous strategy. Strategies that do not implement `updateScopes`
(PKCE, pre-auth) are left untouched.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scopes` | `string`[] | Unprefixed resource scopes |
| `deploymentInfo?` | `any` | Optional refreshed deployment info |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[updateScopes](../interfaces/AuthStrategy.md#updatescopes)

#### Defined in

[core/auth/AuthenticationService.ts:514](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L514)

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

[core/auth/AuthenticationService.ts:530](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L530)
