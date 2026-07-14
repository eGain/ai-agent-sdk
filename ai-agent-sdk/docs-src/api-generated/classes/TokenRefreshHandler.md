[@egain/ai-agent-sdk API Reference - v0.1.3](../README.md) / TokenRefreshHandler

# Class: TokenRefreshHandler

Handler for stale or expired token messages
Processes metadata messages indicating token refresh is required

## Hierarchy

- [`BaseMessageHandler`](BaseMessageHandler.md)

  ↳ **`TokenRefreshHandler`**

## Table of contents

### Constructors

- [constructor](TokenRefreshHandler.md#constructor)

### Methods

- [canHandle](TokenRefreshHandler.md#canhandle)
- [handle](TokenRefreshHandler.md#handle)

## Constructors

### constructor

• **new TokenRefreshHandler**(`options?`): [`TokenRefreshHandler`](TokenRefreshHandler.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`TokenRefreshHandlerOptions`](../interfaces/TokenRefreshHandlerOptions.md) |

#### Returns

[`TokenRefreshHandler`](TokenRefreshHandler.md)

#### Overrides

[BaseMessageHandler](BaseMessageHandler.md).[constructor](BaseMessageHandler.md#constructor)

#### Defined in

[core/message/handlers/TokenRefreshHandler.ts:31](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/handlers/TokenRefreshHandler.ts#L31)

## Methods

### canHandle

▸ **canHandle**(`message`): `boolean`

Check if this handler can process the given message.

This method is called for each incoming message. Return `true`
if this handler should process the message, `false` otherwise.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`Message`](Message.md) | The incoming message to check |

#### Returns

`boolean`

`true` if this handler can process the message

**`Example`**

```typescript
canHandle(message: Message): boolean {
  // Handle only customer messages
  return message.persona === 'customer';
}
```

#### Overrides

[BaseMessageHandler](BaseMessageHandler.md).[canHandle](BaseMessageHandler.md#canhandle)

#### Defined in

[core/message/handlers/TokenRefreshHandler.ts:37](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/handlers/TokenRefreshHandler.ts#L37)

___

### handle

▸ **handle**(`message`): `Promise`\<[`MessageHandlerResult`](../interfaces/MessageHandlerResult.md)\>

Process the message.

Called when `canHandle` returns `true`. Implement your message
processing logic here. Can be synchronous or asynchronous.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`Message`](Message.md) | The message to process |

#### Returns

`Promise`\<[`MessageHandlerResult`](../interfaces/MessageHandlerResult.md)\>

Handler result or Promise resolving to result

**`Example`**

```typescript
handle(message: Message): MessageHandlerResult {
  return {
    type: 'processed',
    message,
    timestamp: Date.now()
  };
}
```

**`Example`**

```typescript
async handle(message: Message): Promise<MessageHandlerResult> {
  await saveToDatabase(message);
  return {
    type: 'saved',
    message,
    timestamp: Date.now()
  };
}
```

#### Overrides

[BaseMessageHandler](BaseMessageHandler.md).[handle](BaseMessageHandler.md#handle)

#### Defined in

[core/message/handlers/TokenRefreshHandler.ts:54](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/handlers/TokenRefreshHandler.ts#L54)
