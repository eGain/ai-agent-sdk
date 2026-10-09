[@egain/ai-agent-sdk API Reference - v0.3.0](../README.md) / PKCEAuthStrategy

# Class: PKCEAuthStrategy

PKCE (Proof Key for Code Exchange) authentication strategy for browsers
Implements OAuth 2.0 PKCE flow for secure browser-based authentication using MSAL

## Implements

- [`AuthStrategy`](../interfaces/AuthStrategy.md)

## Table of contents

### Constructors

- [constructor](PKCEAuthStrategy.md#constructor)

### Methods

- [resolveClientId](PKCEAuthStrategy.md#resolveclientid)
- [buildConfigFromDeploymentInfo](PKCEAuthStrategy.md#buildconfigfromdeploymentinfo)
- [initialize](PKCEAuthStrategy.md#initialize)
- [authenticate](PKCEAuthStrategy.md#authenticate)
- [isAuthenticated](PKCEAuthStrategy.md#isauthenticated)
- [getToken](PKCEAuthStrategy.md#gettoken)
- [startAuthorizationFlow](PKCEAuthStrategy.md#startauthorizationflow)
- [handleCallback](PKCEAuthStrategy.md#handlecallback)
- [logout](PKCEAuthStrategy.md#logout)
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

[core/auth/PKCEAuthStrategy.ts:361](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L361)

## Methods

### resolveClientId

▸ **resolveClientId**(`deploymentInfo`, `agentDetails`, `egClientId?`): `Object`

Pick the MSAL client id for the PKCE flow. First non-empty source wins:
`egClientId` (from `initParams.egclientid`) > `agentDetails.clientAppId` (admin console,
Settings → Advanced) > deployment `intClientId` for agents / `extClientId` for customers >
deployment `clientId`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deploymentInfo` | `any` | Deployment information carrying `intClientId`, `extClientId`, `clientId` |
| `agentDetails` | `any` | Agent details carrying `userType` and optionally `clientAppId` |
| `egClientId?` | `string` | Optional override from init params |

#### Returns

`Object`

The selected client id and which source supplied it (for logging)

| Name | Type |
| :------ | :------ |
| `clientId` | `string` |
| `source` | [`ClientIdSource`](../README.md#clientidsource) |

#### Defined in

[core/auth/PKCEAuthStrategy.ts:99](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L99)

___

### buildConfigFromDeploymentInfo

▸ **buildConfigFromDeploymentInfo**(`deploymentInfo`, `agentDetails`, `endpoint`, `scopes`, `logger?`, `authScheme?`, `egClientId?`, `localLogin?`): `Promise`\<[`PKCEAuthConfig`](../interfaces/PKCEAuthConfig.md)\>

Build PKCE configuration from deployment info and agent details
This method fetches authentication metadata and constructs the PKCE config

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deploymentInfo` | `any` | Deployment information containing API domain, client IDs, tenant ID |
| `agentDetails` | `any` | Agent details containing userType and, when configured on the agent, `clientAppId` |
| `endpoint` | `string` | The endpoint URL used to fetch deployment info (used for nextRoute) |
| `scopes` | `string`[] | Scopes to request, already merged with the agent's `extraScopes` by AiAgent |
| `logger?` | [`Logger`](Logger.md) | Optional logger instance for logging |
| `authScheme?` | ``"popup"`` \| ``"redirect"`` | Authentication scheme: 'popup' or 'redirect' (defaults to 'popup') |
| `egClientId?` | `string` | Optional client ID override from initParams. Priority: `egClientId` > `agentDetails.clientAppId` > deployment `intClientId` (agent) / `extClientId` (customer) / `clientId` |
| `localLogin?` | `boolean` | When true, forces local account login instead of federated SSO |

#### Returns

`Promise`\<[`PKCEAuthConfig`](../interfaces/PKCEAuthConfig.md)\>

Promise resolving to PKCEAuthConfig

#### Defined in

[core/auth/PKCEAuthStrategy.ts:132](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L132)

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

[core/auth/PKCEAuthStrategy.ts:376](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L376)

___

### authenticate

▸ **authenticate**(): `Promise`\<`void`\>

Authenticate using PKCE flow

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[authenticate](../interfaces/AuthStrategy.md#authenticate)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:517](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L517)

___

### isAuthenticated

▸ **isAuthenticated**(): `boolean`

Check if the user is currently authenticated

#### Returns

`boolean`

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[isAuthenticated](../interfaces/AuthStrategy.md#isauthenticated)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:580](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L580)

___

### getToken

▸ **getToken**(): `Promise`\<`string`\>

Get authentication token using PKCE flow

#### Returns

`Promise`\<`string`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[getToken](../interfaces/AuthStrategy.md#gettoken)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:587](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L587)

___

### startAuthorizationFlow

▸ **startAuthorizationFlow**(): `Promise`\<`void`\>

Start the PKCE authorization flow
Redirects user to authorization server

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/auth/PKCEAuthStrategy.ts:659](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L659)

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

[core/auth/PKCEAuthStrategy.ts:667](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L667)

___

### logout

▸ **logout**(): `Promise`\<`void`\>

Log out via MSAL using the same scheme as login.
Popup omits `state` and uses `redirectUri?logout=true`. Redirect passes
hash-stripped `nextRoute` as `state` so `auth-redirect.html` can bounce back.
MSAL clears its own cache — do not call `clearCache` / `removeAccount` here.
If MSAL throws, navigate to the JWT `logout` claim, else `end_session_endpoint`.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[logout](../interfaces/AuthStrategy.md#logout)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:680](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L680)

___

### refreshToken

▸ **refreshToken**(): `Promise`\<`string`\>

Refresh the access token using refresh token

#### Returns

`Promise`\<`string`\>

#### Defined in

[core/auth/PKCEAuthStrategy.ts:761](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L761)

___

### cleanup

▸ **cleanup**(): `Promise`\<`void`\>

Cleanup resources

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[cleanup](../interfaces/AuthStrategy.md#cleanup)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:820](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L820)
