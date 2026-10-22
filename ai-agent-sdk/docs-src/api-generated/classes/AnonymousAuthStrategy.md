[@egain/ai-agent-sdk API Reference - v0.3.3](../README.md) / AnonymousAuthStrategy

# Class: AnonymousAuthStrategy

Anonymous authentication strategy
No authentication required - user remains anonymous

## Implements

- [`AuthStrategy`](../interfaces/AuthStrategy.md)

## Table of contents

### Constructors

- [constructor](AnonymousAuthStrategy.md#constructor)

### Properties

- [TOKEN\_EXPIRY\_BUFFER\_MS](AnonymousAuthStrategy.md#token_expiry_buffer_ms)

### Methods

- [initialize](AnonymousAuthStrategy.md#initialize)
- [updateScopes](AnonymousAuthStrategy.md#updatescopes)
- [clearMetadataCache](AnonymousAuthStrategy.md#clearmetadatacache)
- [authenticate](AnonymousAuthStrategy.md#authenticate)
- [isAuthenticated](AnonymousAuthStrategy.md#isauthenticated)
- [getToken](AnonymousAuthStrategy.md#gettoken)
- [clearTokenCache](AnonymousAuthStrategy.md#cleartokencache)
- [cleanup](AnonymousAuthStrategy.md#cleanup)
- [getDeploymentInfo](AnonymousAuthStrategy.md#getdeploymentinfo)

## Constructors

### constructor

• **new AnonymousAuthStrategy**(`config?`): [`AnonymousAuthStrategy`](AnonymousAuthStrategy.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`AnonymousAuthConfig`](../interfaces/AnonymousAuthConfig.md) |

#### Returns

[`AnonymousAuthStrategy`](AnonymousAuthStrategy.md)

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:95](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L95)

## Properties

### TOKEN\_EXPIRY\_BUFFER\_MS

▪ `Static` `Readonly` **TOKEN\_EXPIRY\_BUFFER\_MS**: `number` = `ACCESS_TOKEN_REFRESH_BUFFER_MS`

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:93](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L93)

## Methods

### initialize

▸ **initialize**(`options?`): `Promise`\<`void`\>

Initialize the anonymous authentication strategy

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`AuthStrategyInitializeOptions`](../interfaces/AuthStrategyInitializeOptions.md) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[initialize](../interfaces/AuthStrategy.md#initialize)

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:115](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L115)

___

### updateScopes

▸ **updateScopes**(`scopes`, `deploymentInfo?`): `Promise`\<`void`\>

Replace the scopes used for the next token request, e.g. once agent details reveal
per-agent `extraScopes`. The token cache key carries a fingerprint of the scope list, so a
token cached for a different scope set is not reused and a token cached for the same set
(in any order) is.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scopes` | `string`[] | Unprefixed resource scopes; the permission prefix is applied at request time |
| `deploymentInfo?` | `any` | Optional refreshed deployment info |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[updateScopes](../interfaces/AuthStrategy.md#updatescopes)

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:130](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L130)

___

### clearMetadataCache

▸ **clearMetadataCache**(): `void`

Clears all cached metadata entries

#### Returns

`void`

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:207](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L207)

___

### authenticate

▸ **authenticate**(): `Promise`\<`void`\>

Authenticate the anonymous user

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[authenticate](../interfaces/AuthStrategy.md#authenticate)

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:244](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L244)

___

### isAuthenticated

▸ **isAuthenticated**(): `boolean`

Check if the user is currently authenticated

#### Returns

`boolean`

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[isAuthenticated](../interfaces/AuthStrategy.md#isauthenticated)

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:257](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L257)

___

### getToken

▸ **getToken**(): `Promise`\<``null`` \| `string`\>

Get authentication token for anonymous user
Returns cached token if valid, otherwise fetches a new one
Token is cached with TTL based on expires_in from the token response

#### Returns

`Promise`\<``null`` \| `string`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[getToken](../interfaces/AuthStrategy.md#gettoken)

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:309](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L309)

___

### clearTokenCache

▸ **clearTokenCache**(): `void`

Clear the cached token for the current scope set
Forces a new token to be fetched on next getToken() call. Tokens cached for other scope
sets are left alone (they expire on their own); [clearMetadataCache](AnonymousAuthStrategy.md#clearmetadatacache) clears the
whole prefix, token entries included.

#### Returns

`void`

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:387](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L387)

___

### cleanup

▸ **cleanup**(): `Promise`\<`void`\>

Cleanup resources.

Intentionally a no-op: token and metadata live in sessionStorage so a later
widget remount (or a new AnonymousAuthStrategy after anonymous→PKCE switch)
can reuse them instead of calling the anonymous token API again.
Call [clearTokenCache](AnonymousAuthStrategy.md#cleartokencache) / [clearMetadataCache](AnonymousAuthStrategy.md#clearmetadatacache) to force a refresh.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[cleanup](../interfaces/AuthStrategy.md#cleanup)

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:401](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L401)

___

### getDeploymentInfo

▸ **getDeploymentInfo**(`domain`): `Promise`\<`any`\>

Get deployment information a given domain

#### Parameters

| Name | Type |
| :------ | :------ |
| `domain` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:409](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L409)
