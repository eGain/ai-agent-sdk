[@eGainDev/ai-agent-sdk API Reference - v0.0.14](../README.md) / MessageQueue

# Class: MessageQueue

FIFO message queue with idempotency and retry support.

The MessageQueue class manages outgoing messages when the connection
is unavailable. Messages are stored in order and sent when the
connection is restored.

**`Example`**

```typescript
const queue = new MessageQueue(1000, 3);  // max 1000 messages, 3 retries

// Add a message
const id = queue.enqueue({ text: "Hello" });

// Check queue status
console.log(`Queue size: ${queue.size()}`);
console.log(`Is empty: ${queue.isEmpty()}`);

// Process messages
while (!queue.isEmpty()) {
  const message = queue.peek();
  try {
    await sendToServer(message.data);
    queue.dequeue();  // Remove on success
  } catch (error) {
    const shouldRetry = queue.markAttempted(message.id);
    if (!shouldRetry) {
      queue.remove(message.id);  // Max retries exceeded
    }
  }
}
```

**`Example`**

```typescript
// Use custom ID for idempotency
const messageId = queue.enqueue(data, "custom-id-123");

// Later, you can remove by ID
queue.remove("custom-id-123");
```

## Table of contents

### Constructors

- [constructor](MessageQueue.md#constructor)

### Methods

- [enqueue](MessageQueue.md#enqueue)
- [peek](MessageQueue.md#peek)
- [dequeue](MessageQueue.md#dequeue)
- [markAttempted](MessageQueue.md#markattempted)
- [remove](MessageQueue.md#remove)
- [size](MessageQueue.md#size)
- [isEmpty](MessageQueue.md#isempty)
- [clear](MessageQueue.md#clear)
- [getAll](MessageQueue.md#getall)

## Constructors

### constructor

• **new MessageQueue**(`maxSize?`, `maxAttempts?`): [`MessageQueue`](MessageQueue.md)

Create a new MessageQueue

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `maxSize` | `number` | `1000` | Maximum number of messages to queue (default: 1000) |
| `maxAttempts` | `number` | `3` | Maximum send attempts per message (default: 3) |

#### Returns

[`MessageQueue`](MessageQueue.md)

#### Defined in

[core/queue/MessageQueue.ts:158](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/queue/MessageQueue.ts#L158)

## Methods

### enqueue

▸ **enqueue**(`data`, `id?`): `string`

Add a message to the queue.

Messages are added to the end of the queue (FIFO order).
If the queue is full, a MessageError is thrown.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` | The message data to queue |
| `id?` | `string` | Optional custom message ID (auto-generated if not provided) |

#### Returns

`string`

The message ID

**`Throws`**

MessageError if queue is full

**`Example`**

```typescript
// Auto-generated ID
const id1 = queue.enqueue({ text: "Hello" });

// Custom ID for tracking
const id2 = queue.enqueue({ text: "World" }, "my-message-id");
```

#### Defined in

[core/queue/MessageQueue.ts:183](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/queue/MessageQueue.ts#L183)

___

### peek

▸ **peek**(): ``null`` \| [`QueuedMessage`](../interfaces/QueuedMessage.md)

Get the next message without removing it.

Use this to inspect the next message before deciding
whether to process and remove it.

#### Returns

``null`` \| [`QueuedMessage`](../interfaces/QueuedMessage.md)

The next message or null if queue is empty

**`Example`**

```typescript
const next = queue.peek();
if (next) {
  console.log(`Next message: ${next.id}`);
}
```

#### Defined in

[core/queue/MessageQueue.ts:216](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/queue/MessageQueue.ts#L216)

___

### dequeue

▸ **dequeue**(): ``null`` \| [`QueuedMessage`](../interfaces/QueuedMessage.md)

Remove and return the next message from the queue.

Call this after successfully processing a message.

#### Returns

``null`` \| [`QueuedMessage`](../interfaces/QueuedMessage.md)

The removed message or null if queue is empty

**`Example`**

```typescript
const message = queue.dequeue();
if (message) {
  await processMessage(message.data);
}
```

#### Defined in

[core/queue/MessageQueue.ts:235](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/queue/MessageQueue.ts#L235)

___

### markAttempted

▸ **markAttempted**(`id`): `boolean`

Mark a message as attempted and check if retry is allowed.

Call this when a send attempt fails. Returns true if the
message should be retried, false if max attempts exceeded.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The message ID to mark |

#### Returns

`boolean`

True if retry is allowed, false if max attempts reached

**`Example`**

```typescript
try {
  await sendMessage(message.data);
  queue.dequeue();
} catch (error) {
  const shouldRetry = queue.markAttempted(message.id);
  if (!shouldRetry) {
    queue.remove(message.id);
    console.error(`Message ${message.id} failed permanently`);
  }
}
```

#### Defined in

[core/queue/MessageQueue.ts:262](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/queue/MessageQueue.ts#L262)

___

### remove

▸ **remove**(`id`): `boolean`

Remove a message by ID.

Use this to remove a message that failed permanently
or is no longer needed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The message ID to remove |

#### Returns

`boolean`

True if message was found and removed

**`Example`**

```typescript
const removed = queue.remove("message-id");
console.log(removed ? "Removed" : "Not found");
```

#### Defined in

[core/queue/MessageQueue.ts:286](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/queue/MessageQueue.ts#L286)

___

### size

▸ **size**(): `number`

Get the current number of messages in the queue.

#### Returns

`number`

Number of queued messages

#### Defined in

[core/queue/MessageQueue.ts:299](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/queue/MessageQueue.ts#L299)

___

### isEmpty

▸ **isEmpty**(): `boolean`

Check if the queue is empty.

#### Returns

`boolean`

True if no messages are queued

#### Defined in

[core/queue/MessageQueue.ts:307](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/queue/MessageQueue.ts#L307)

___

### clear

▸ **clear**(): `void`

Remove all messages from the queue.

Use with caution - all queued messages will be lost.

#### Returns

`void`

#### Defined in

[core/queue/MessageQueue.ts:316](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/queue/MessageQueue.ts#L316)

___

### getAll

▸ **getAll**(): readonly [`QueuedMessage`](../interfaces/QueuedMessage.md)[]

Get all messages in the queue (for debugging).

Returns a read-only copy of the queue contents.

#### Returns

readonly [`QueuedMessage`](../interfaces/QueuedMessage.md)[]

Array of all queued messages

#### Defined in

[core/queue/MessageQueue.ts:327](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/queue/MessageQueue.ts#L327)
