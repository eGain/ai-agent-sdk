[@eGain/ai-agent-sdk API Reference - v0.0.14](../README.md) / AnonymousAuthStrategy

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

[core/auth/AnonymousAuthStrategy.ts:94](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L94)

## Properties

### TOKEN\_EXPIRY\_BUFFER\_MS

▪ `Static` `Readonly` **TOKEN\_EXPIRY\_BUFFER\_MS**: `number`

Buffer time in milliseconds to refresh token before it expires
This prevents using a token that's about to expire

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:92](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L92)

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

[core/auth/AnonymousAuthStrategy.ts:114](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L114)

___

### clearMetadataCache

▸ **clearMetadataCache**(): `void`

Clears all cached metadata entries

#### Returns

`void`

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:166](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L166)

___

### authenticate

▸ **authenticate**(): `Promise`\<`void`\>

Authenticate the anonymous user

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[authenticate](../interfaces/AuthStrategy.md#authenticate)

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:203](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L203)

___

### isAuthenticated

▸ **isAuthenticated**(): `boolean`

Check if the user is currently authenticated

#### Returns

`boolean`

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:216](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L216)

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

[core/auth/AnonymousAuthStrategy.ts:267](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L267)

___

### clearTokenCache

▸ **clearTokenCache**(): `void`

Clear the cached token
Forces a new token to be fetched on next getToken() call

#### Returns

`void`

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:338](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L338)

___

### cleanup

▸ **cleanup**(): `Promise`\<`void`\>

Cleanup resources

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[cleanup](../interfaces/AuthStrategy.md#cleanup)

#### Defined in

[core/auth/AnonymousAuthStrategy.ts:347](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L347)

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

[core/auth/AnonymousAuthStrategy.ts:357](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AnonymousAuthStrategy.ts#L357)
