[@eGainDev/ai-agent-sdk API Reference - v0.0.14](../README.md) / AgentMessageHandler

# Class: AgentMessageHandler

Handler for agent messages (main chat responses)
Processes agent messages and extracts follow-up options, escalation data, sources, and reasoning

## Hierarchy

- [`BaseMessageHandler`](BaseMessageHandler.md)

  ↳ **`AgentMessageHandler`**

## Table of contents

### Constructors

- [constructor](AgentMessageHandler.md#constructor)

### Methods

- [canHandle](AgentMessageHandler.md#canhandle)
- [handle](AgentMessageHandler.md#handle)

## Constructors

### constructor

• **new AgentMessageHandler**(): [`AgentMessageHandler`](AgentMessageHandler.md)

#### Returns

[`AgentMessageHandler`](AgentMessageHandler.md)

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

[core/message/handlers/AgentMessageHandler.ts:11](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/handlers/AgentMessageHandler.ts#L11)

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

[core/message/handlers/AgentMessageHandler.ts:15](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/handlers/AgentMessageHandler.ts#L15)
