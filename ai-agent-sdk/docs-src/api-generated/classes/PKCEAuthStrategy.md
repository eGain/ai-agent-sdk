[@eGain/ai-agent-sdk API Reference - v0.0.14](../README.md) / PKCEAuthStrategy

# Class: PKCEAuthStrategy

PKCE (Proof Key for Code Exchange) authentication strategy for browsers
Implements OAuth 2.0 PKCE flow for secure browser-based authentication using MSAL

## Implements

- [`AuthStrategy`](../interfaces/AuthStrategy.md)

## Table of contents

### Constructors

- [constructor](PKCEAuthStrategy.md#constructor)

### Methods

- [buildConfigFromDeploymentInfo](PKCEAuthStrategy.md#buildconfigfromdeploymentinfo)
- [initialize](PKCEAuthStrategy.md#initialize)
- [authenticate](PKCEAuthStrategy.md#authenticate)
- [isAuthenticated](PKCEAuthStrategy.md#isauthenticated)
- [getToken](PKCEAuthStrategy.md#gettoken)
- [startAuthorizationFlow](PKCEAuthStrategy.md#startauthorizationflow)
- [handleCallback](PKCEAuthStrategy.md#handlecallback)
- [refreshToken](PKCEAuthStrategy.md#refreshtoken)
- [cleanup](PKCEAuthStrategy.md#cleanup)

## Constructors

### constructor

• **new PKCEAuthStrategy**(`config`): [`PKCEAuthStrategy`](PKCEAuthStrategy.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`PKCEAuthConfig`](../interfaces/PKCEAuthConfig.md) |

#### Returns

[`PKCEAuthStrategy`](PKCEAuthStrategy.md)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:236](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L236)

## Methods

### buildConfigFromDeploymentInfo

▸ **buildConfigFromDeploymentInfo**(`deploymentInfo`, `agentDetails`, `endpoint`, `scopes`, `logger?`, `authScheme?`, `egClientId?`, `localLogin?`): `Promise`\<[`PKCEAuthConfig`](../interfaces/PKCEAuthConfig.md)\>

Build PKCE configuration from deployment info and agent details
This method fetches authentication metadata and constructs the PKCE config

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deploymentInfo` | `any` | Deployment information containing API domain, client IDs, tenant ID |
| `agentDetails` | `any` | Agent details containing userType and other agent-specific information |
| `endpoint` | `string` | The endpoint URL used to fetch deployment info (used for nextRoute) |
| `scopes` | `string`[] | Scopes to request (passed from AuthenticationService) |
| `logger?` | [`Logger`](Logger.md) | Optional logger instance for logging |
| `authScheme?` | ``"popup"`` \| ``"redirect"`` | Authentication scheme: 'popup' or 'redirect' (defaults to 'popup') |
| `egClientId?` | `string` | Optional client ID override from initParams (takes priority over deployment client IDs) |
| `localLogin?` | `boolean` | When true, forces local account login instead of federated SSO |

#### Returns

`Promise`\<[`PKCEAuthConfig`](../interfaces/PKCEAuthConfig.md)\>

Promise resolving to PKCEAuthConfig

#### Defined in

[core/auth/PKCEAuthStrategy.ts:100](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L100)

___

### initialize

▸ **initialize**(`options?`): `Promise`\<`void`\>

Initialize the PKCE authentication strategy

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`AuthStrategyInitializeOptions`](../interfaces/AuthStrategyInitializeOptions.md) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[initialize](../interfaces/AuthStrategy.md#initialize)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:249](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L249)

___

### authenticate

▸ **authenticate**(): `Promise`\<`void`\>

Authenticate using PKCE flow

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[authenticate](../interfaces/AuthStrategy.md#authenticate)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:364](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L364)

___

### isAuthenticated

▸ **isAuthenticated**(): `boolean`

Check if the user is currently authenticated

#### Returns

`boolean`

#### Defined in

[core/auth/PKCEAuthStrategy.ts:447](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L447)

___

### getToken

▸ **getToken**(): `Promise`\<`string`\>

Get authentication token using PKCE flow

#### Returns

`Promise`\<`string`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[getToken](../interfaces/AuthStrategy.md#gettoken)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:454](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L454)

___

### startAuthorizationFlow

▸ **startAuthorizationFlow**(): `Promise`\<`void`\>

Start the PKCE authorization flow
Redirects user to authorization server

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/auth/PKCEAuthStrategy.ts:493](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L493)

___

### handleCallback

▸ **handleCallback**(`code`, `state`): `Promise`\<`void`\>

Handle the OAuth callback with authorization code
This is handled automatically by MSAL's handleRedirectPromise

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `state` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/auth/PKCEAuthStrategy.ts:501](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L501)

___

### refreshToken

▸ **refreshToken**(): `Promise`\<`string`\>

Refresh the access token using refresh token

#### Returns

`Promise`\<`string`\>

#### Defined in

[core/auth/PKCEAuthStrategy.ts:510](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L510)

___

### cleanup

▸ **cleanup**(): `Promise`\<`void`\>

Cleanup resources

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[cleanup](../interfaces/AuthStrategy.md#cleanup)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:534](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L534)
