[@egain/ai-agent-sdk API Reference - v0.2.2](../README.md) / ContextValidationHandler

# Class: ContextValidationHandler

Handles non-terminal system messages describing rejected context attributes.

## Hierarchy

- [`BaseMessageHandler`](BaseMessageHandler.md)

  ↳ **`ContextValidationHandler`**

## Table of contents

### Constructors

- [constructor](ContextValidationHandler.md#constructor)

### Methods

- [canHandle](ContextValidationHandler.md#canhandle)
- [handle](ContextValidationHandler.md#handle)

## Constructors

### constructor

• **new ContextValidationHandler**(): [`ContextValidationHandler`](ContextValidationHandler.md)

#### Returns

[`ContextValidationHandler`](ContextValidationHandler.md)

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

[core/message/handlers/ContextValidationHandler.ts:9](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/handlers/ContextValidationHandler.ts#L9)

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

[core/message/handlers/ContextValidationHandler.ts:13](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/handlers/ContextValidationHandler.ts#L13)
