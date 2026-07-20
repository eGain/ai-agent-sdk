[@egain/ai-agent-sdk API Reference - v0.1.4](../README.md) / TokenRefreshHandlerOptions

# Interface: TokenRefreshHandlerOptions

Options for TokenRefreshHandler

## Table of contents

### Properties

- [getAccessToken](TokenRefreshHandlerOptions.md#getaccesstoken)
- [sendToConnection](TokenRefreshHandlerOptions.md#sendtoconnection)

## Properties

### getAccessToken

• `Optional` **getAccessToken**: () => `Promise`\<`string`\>

Function to get a new access token

#### Type declaration

▸ (): `Promise`\<`string`\>

##### Returns

`Promise`\<`string`\>

#### Defined in

[core/message/handlers/TokenRefreshHandler.ts:14](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/handlers/TokenRefreshHandler.ts#L14)

___

### sendToConnection

• `Optional` **sendToConnection**: (`payload`: `any`) => `void` \| `Promise`\<`void`\>

Function to send a message to the connection

#### Type declaration

▸ (`payload`): `void` \| `Promise`\<`void`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `any` | The message payload to send |

##### Returns

`void` \| `Promise`\<`void`\>

#### Defined in

[core/message/handlers/TokenRefreshHandler.ts:20](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/handlers/TokenRefreshHandler.ts#L20)
