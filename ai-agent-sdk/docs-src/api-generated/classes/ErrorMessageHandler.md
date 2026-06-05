[@egain/ai-agent-sdk API Reference - v0.1.2](../README.md) / ErrorMessageHandler

# Class: ErrorMessageHandler

Handler for error messages
Processes metadata error messages indicating an error occurred

## Hierarchy

- [`BaseMessageHandler`](BaseMessageHandler.md)

  ↳ **`ErrorMessageHandler`**

## Table of contents

### Constructors

- [constructor](ErrorMessageHandler.md#constructor)

### Methods

- [canHandle](ErrorMessageHandler.md#canhandle)
- [handle](ErrorMessageHandler.md#handle)

## Constructors

### constructor

• **new ErrorMessageHandler**(): [`ErrorMessageHandler`](ErrorMessageHandler.md)

#### Returns

[`ErrorMessageHandler`](ErrorMessageHandler.md)

#### Inherited from

[BaseMessageHandler](BaseMessageHandler.md).[constructor](BaseMessageHandler.md#constructor)

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

[core/message/handlers/ErrorMessageHandler.ts:11](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/handlers/ErrorMessageHandler.ts#L11)

___

### handle

▸ **handle**(`message`): [`MessageHandlerResult`](../interfaces/MessageHandlerResult.md)

Process the message.

Called when `canHandle` returns `true`. Implement your message
processing logic here. Can be synchronous or asynchronous.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`Message`](Message.md) | The message to process |

#### Returns

[`MessageHandlerResult`](../interfaces/MessageHandlerResult.md)

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

[core/message/handlers/ErrorMessageHandler.ts:18](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/handlers/ErrorMessageHandler.ts#L18)
