[@eGainDev/ai-agent-sdk API Reference - v0.0.14](../README.md) / MessageProcessor

# Class: MessageProcessor

MessageProcessor class that routes messages to appropriate handlers
Uses a handler registry pattern where handlers are checked in priority order

## Table of contents

### Constructors

- [constructor](MessageProcessor.md#constructor)

### Methods

- [process](MessageProcessor.md#process)
- [addHandler](MessageProcessor.md#addhandler)
- [removeHandler](MessageProcessor.md#removehandler)
- [getHandlers](MessageProcessor.md#gethandlers)
- [reset](MessageProcessor.md#reset)

## Constructors

### constructor

• **new MessageProcessor**(`logger?`): [`MessageProcessor`](MessageProcessor.md)

Create a new MessageProcessor instance
Registers default handlers

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger?` | [`Logger`](Logger.md) |

#### Returns

[`MessageProcessor`](MessageProcessor.md)

#### Defined in

[core/message/MessageProcessor.ts:24](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/MessageProcessor.ts#L24)

## Methods

### process

▸ **process**(`message`): `Promise`\<``null`` \| [`MessageHandlerResult`](../interfaces/MessageHandlerResult.md)\>

Process an incoming message
Routes the message to the first handler that can process it

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`Message`](Message.md) | The incoming message |

#### Returns

`Promise`\<``null`` \| [`MessageHandlerResult`](../interfaces/MessageHandlerResult.md)\>

Processing result or null if no handler matched

#### Defined in

[core/message/MessageProcessor.ts:53](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/MessageProcessor.ts#L53)

___

### addHandler

▸ **addHandler**(`handler`, `priority?`): `void`

Add a custom handler

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handler` | [`BaseMessageHandler`](BaseMessageHandler.md) | Handler instance |
| `priority?` | `number` | Position to insert (lower = higher priority, default: end of list) |

#### Returns

`void`

#### Defined in

[core/message/MessageProcessor.ts:92](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/MessageProcessor.ts#L92)

___

### removeHandler

▸ **removeHandler**(`handler`): `void`

Remove a handler

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handler` | [`BaseMessageHandler`](BaseMessageHandler.md) | Handler instance to remove |

#### Returns

`void`

#### Defined in

[core/message/MessageProcessor.ts:113](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/MessageProcessor.ts#L113)

___

### getHandlers

▸ **getHandlers**(): [`BaseMessageHandler`](BaseMessageHandler.md)[]

Get all registered handlers

#### Returns

[`BaseMessageHandler`](BaseMessageHandler.md)[]

Array of registered handlers

#### Defined in

[core/message/MessageProcessor.ts:125](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/MessageProcessor.ts#L125)

___

### reset

▸ **reset**(): `void`

Clear all handlers and re-register defaults

#### Returns

`void`

#### Defined in

[core/message/MessageProcessor.ts:132](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/MessageProcessor.ts#L132)
