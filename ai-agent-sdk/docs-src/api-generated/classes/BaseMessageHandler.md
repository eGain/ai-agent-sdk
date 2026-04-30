[@eGain/ai-agent-sdk API Reference - v0.1.0](../README.md) / BaseMessageHandler

# Class: BaseMessageHandler

Base class for message handlers.

All custom message handlers must extend this class and implement
the `canHandle` and `handle` methods.

**`Example`**

```typescript
class LoggingHandler extends BaseMessageHandler {
  canHandle(message: Message): boolean {
    return true;  // Handle all messages
  }

  handle(message: Message): MessageHandlerResult {
    console.log(`[${message.persona}] ${message.content}`);
    return {
      type: 'logged',
      message,
      timestamp: Date.now()
    };
  }
}
```

**`Example`**

```typescript
class AsyncHandler extends BaseMessageHandler {
  canHandle(message: Message): boolean {
    return message.role === 'needs_processing';
  }

  async handle(message: Message): Promise<MessageHandlerResult> {
    const result = await processExternally(message);
    return {
      type: 'processed',
      message,
      data: result,
      timestamp: Date.now()
    };
  }
}
```

**`Example`**

```typescript
class SentimentHandler extends BaseMessageHandler {
  canHandle(message: Message): boolean {
    // Only handle agent messages with content
    return message.persona === 'agent' && !!message.content;
  }

  handle(message: Message): MessageHandlerResult {
    const sentiment = analyzeSentiment(message.content);
    return {
      type: 'sentiment_analyzed',
      message,
      sentiment,
      timestamp: Date.now()
    };
  }
}
```

## Hierarchy

- **`BaseMessageHandler`**

  ↳ [`AgentMessageHandler`](AgentMessageHandler.md)

  ↳ [`ChatHistoryHandler`](ChatHistoryHandler.md)

  ↳ [`TokenRefreshHandler`](TokenRefreshHandler.md)

  ↳ [`HeartbeatHandler`](HeartbeatHandler.md)

  ↳ [`ErrorMessageHandler`](ErrorMessageHandler.md)

## Table of contents

### Constructors

- [constructor](BaseMessageHandler.md#constructor)

### Methods

- [canHandle](BaseMessageHandler.md#canhandle)
- [handle](BaseMessageHandler.md#handle)

## Constructors

### constructor

• **new BaseMessageHandler**(): [`BaseMessageHandler`](BaseMessageHandler.md)

#### Returns

[`BaseMessageHandler`](BaseMessageHandler.md)

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

#### Defined in

[core/message/BaseMessageHandler.ts:175](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/BaseMessageHandler.ts#L175)

___

### handle

▸ **handle**(`message`): [`MessageHandlerResult`](../interfaces/MessageHandlerResult.md) \| `Promise`\<[`MessageHandlerResult`](../interfaces/MessageHandlerResult.md)\>

Process the message.

Called when `canHandle` returns `true`. Implement your message
processing logic here. Can be synchronous or asynchronous.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`Message`](Message.md) | The message to process |

#### Returns

[`MessageHandlerResult`](../interfaces/MessageHandlerResult.md) \| `Promise`\<[`MessageHandlerResult`](../interfaces/MessageHandlerResult.md)\>

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

#### Defined in

[core/message/BaseMessageHandler.ts:209](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/BaseMessageHandler.ts#L209)
