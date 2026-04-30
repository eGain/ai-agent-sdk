[@eGain/ai-agent-sdk API Reference - v0.0.14](../README.md) / TranscriptEntry

# Interface: TranscriptEntry

Transcript entry containing a message with metadata.

Each entry represents a single message in the conversation
with direction and timing information.

**`Example`**

```typescript
const entry: TranscriptEntry = {
  message: message,
  direction: 'received',
  timestamp: Date.now(),
  sessionId: 'session-123',
  agentId: 'agent-456'
};
```

## Table of contents

### Properties

- [message](TranscriptEntry.md#message)
- [direction](TranscriptEntry.md#direction)
- [timestamp](TranscriptEntry.md#timestamp)
- [sessionId](TranscriptEntry.md#sessionid)
- [agentId](TranscriptEntry.md#agentid)

## Properties

### message

• **message**: [`Message`](../classes/Message.md)

The message object

#### Defined in

[core/message/Transcript.ts:114](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L114)

___

### direction

• **direction**: ``"sent"`` \| ``"received"``

Whether the message was sent or received

#### Defined in

[core/message/Transcript.ts:116](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L116)

___

### timestamp

• **timestamp**: `number`

Timestamp when the message was recorded

#### Defined in

[core/message/Transcript.ts:118](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L118)

___

### sessionId

• `Optional` **sessionId**: `string` \| `number`

Session ID associated with this message

#### Defined in

[core/message/Transcript.ts:120](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L120)

___

### agentId

• `Optional` **agentId**: `string` \| `number`

Agent ID associated with this message

#### Defined in

[core/message/Transcript.ts:122](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L122)
