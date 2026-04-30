[@eGain/ai-agent-sdk API Reference - v0.0.14](../README.md) / ClientCredentialsAuthStrategy

# Class: ClientCredentialsAuthStrategy

Client credentials authentication strategy for server-side applications
Implements OAuth 2.0 client credentials flow

## Implements

- [`AuthStrategy`](../interfaces/AuthStrategy.md)

## Table of contents

### Constructors

- [constructor](ClientCredentialsAuthStrategy.md#constructor)

### Methods

- [initialize](ClientCredentialsAuthStrategy.md#initialize)
- [authenticate](ClientCredentialsAuthStrategy.md#authenticate)
- [isAuthenticated](ClientCredentialsAuthStrategy.md#isauthenticated)
- [getToken](ClientCredentialsAuthStrategy.md#gettoken)
- [cleanup](ClientCredentialsAuthStrategy.md#cleanup)

## Constructors

### constructor

• **new ClientCredentialsAuthStrategy**(`config`): [`ClientCredentialsAuthStrategy`](ClientCredentialsAuthStrategy.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`ClientCredentialsAuthConfig`](../interfaces/ClientCredentialsAuthConfig.md) |

#### Returns

[`ClientCredentialsAuthStrategy`](ClientCredentialsAuthStrategy.md)

#### Defined in

[core/auth/ClientCredentialsAuthStrategy.ts:39](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/ClientCredentialsAuthStrategy.ts#L39)

## Methods

### initialize

▸ **initialize**(`options?`): `Promise`\<`void`\>

Initialize the client credentials authentication strategy

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`AuthStrategyInitializeOptions`](../interfaces/AuthStrategyInitializeOptions.md) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[initialize](../interfaces/AuthStrategy.md#initialize)

#### Defined in

[core/auth/ClientCredentialsAuthStrategy.ts:44](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/ClientCredentialsAuthStrategy.ts#L44)

___

### authenticate

▸ **authenticate**(): `Promise`\<`void`\>

Authenticate using client credentials flow

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[authenticate](../interfaces/AuthStrategy.md#authenticate)

#### Defined in

[core/auth/ClientCredentialsAuthStrategy.ts:55](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/ClientCredentialsAuthStrategy.ts#L55)

___

### isAuthenticated

▸ **isAuthenticated**(): `boolean`

Check if the user is currently authenticated

#### Returns

`boolean`

#### Defined in

[core/auth/ClientCredentialsAuthStrategy.ts:71](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/ClientCredentialsAuthStrategy.ts#L71)

___

### getToken

▸ **getToken**(): `Promise`\<`string`\>

Get authentication token using client credentials flow

#### Returns

`Promise`\<`string`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[getToken](../interfaces/AuthStrategy.md#gettoken)

#### Defined in

[core/auth/ClientCredentialsAuthStrategy.ts:80](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/ClientCredentialsAuthStrategy.ts#L80)

___

### cleanup

▸ **cleanup**(): `Promise`\<`void`\>

Cleanup resources

#### Returns

`Promise`\<`void`\>

#### Implementation of

[AuthStrategy](../interfaces/AuthStrategy.md).[cleanup](../interfaces/AuthStrategy.md#cleanup)

#### Defined in

[core/auth/ClientCredentialsAuthStrategy.ts:111](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/ClientCredentialsAuthStrategy.ts#L111)
