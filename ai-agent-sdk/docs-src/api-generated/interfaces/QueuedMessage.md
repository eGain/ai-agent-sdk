[@eGain/ai-agent-sdk API Reference - v0.1.0](../README.md) / QueuedMessage

# Interface: QueuedMessage

Queued message with metadata for retry handling.

Each queued message includes a unique ID for idempotency,
timestamp for ordering, and attempt counter for retry logic.

**`Example`**

```typescript
const queuedMessage: QueuedMessage = {
  id: "msg-123",
  data: { persona: "customer", content: "Hello" },
  timestamp: Date.now(),
  attempts: 0
};
```

## Table of contents

### Properties

- [id](QueuedMessage.md#id)
- [data](QueuedMessage.md#data)
- [timestamp](QueuedMessage.md#timestamp)
- [attempts](QueuedMessage.md#attempts)

## Properties

### id

• **id**: `string`

Unique message identifier for idempotency

#### Defined in

[core/queue/MessageQueue.ts:94](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/queue/MessageQueue.ts#L94)

___

### data

• **data**: `any`

The message payload to be sent

#### Defined in

[core/queue/MessageQueue.ts:96](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/queue/MessageQueue.ts#L96)

___

### timestamp

• **timestamp**: `number`

Timestamp when the message was queued

#### Defined in

[core/queue/MessageQueue.ts:98](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/queue/MessageQueue.ts#L98)

___

### attempts

• **attempts**: `number`

Number of send attempts made

#### Defined in

[core/queue/MessageQueue.ts:100](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/queue/MessageQueue.ts#L100)
