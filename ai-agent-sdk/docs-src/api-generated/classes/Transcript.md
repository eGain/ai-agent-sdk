[@eGainDev/ai-agent-sdk API Reference - v0.0.14](../README.md) / Transcript

# Class: Transcript

Transcript storage class for managing conversation history.

The Transcript class provides a complete record of all messages
exchanged during a conversation. It supports filtering, JSON export,
and real-time updates.

**`Example`**

```typescript
const transcript = new Transcript();

// Add a message
transcript.add(message, 'sent', sessionId, agentId);

// Get all entries
const entries = transcript.getEntries();

// Get as JSON for storage
const json = transcript.getEntriesAsJSON();

// Get entry count
console.log(`${transcript.size()} messages`);

// Clear all entries
transcript.clear();
```

**`Example`**

```typescript
const transcript = new Transcript({
  enabled: true,
  excludeRoles: ['heartbeat'],  // Don't record heartbeats
});
```

**`Example`**

```typescript
// Get only agent responses
const agentResponses = transcript.getEntries({
  direction: 'received',
  persona: 'agent'
});

// Get messages from the last 5 minutes
const recentMessages = transcript.getEntries({
  fromTimestamp: Date.now() - 300000
});
```

## Table of contents

### Constructors

- [constructor](Transcript.md#constructor)

### Methods

- [add](Transcript.md#add)
- [getEntries](Transcript.md#getentries)
- [getEntriesAsJSON](Transcript.md#getentriesasjson)
- [size](Transcript.md#size)
- [clear](Transcript.md#clear)
- [updateConfig](Transcript.md#updateconfig)

## Constructors

### constructor

• **new Transcript**(`config?`): [`Transcript`](Transcript.md)

Create a new Transcript instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`TranscriptConfig`](../interfaces/TranscriptConfig.md) | Optional configuration for filtering |

#### Returns

[`Transcript`](Transcript.md)

#### Defined in

[core/message/Transcript.ts:279](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L279)

## Methods

### add

▸ **add**(`message`, `direction`, `sessionId?`, `agentId?`): `void`

Add a message to the transcript.

Messages are automatically filtered based on configuration.
If the transcript is disabled or the message matches an exclude filter,
it will not be recorded.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`Message`](Message.md) | The message to add |
| `direction` | ``"sent"`` \| ``"received"`` | Whether the message was 'sent' or 'received' |
| `sessionId?` | `string` \| `number` | Optional session ID for context |
| `agentId?` | `string` \| `number` | Optional agent ID for context |

#### Returns

`void`

**`Example`**

```typescript
transcript.add(
  new Message('customer', 'human', 'Hello!'),
  'sent',
  'session-123',
  'agent-456'
);
```

#### Defined in

[core/message/Transcript.ts:310](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L310)

___

### getEntries

▸ **getEntries**(`options?`): [`TranscriptEntry`](../interfaces/TranscriptEntry.md)[]

Get transcript entries, optionally filtered.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`TranscriptOptions`](../interfaces/TranscriptOptions.md) | Optional filtering options |

#### Returns

[`TranscriptEntry`](../interfaces/TranscriptEntry.md)[]

Array of transcript entries matching the filter

**`Example`**

```typescript
// Get all entries
const all = transcript.getEntries();

// Get only sent messages
const sent = transcript.getEntries({ direction: 'sent' });

// Get messages from last hour
const recent = transcript.getEntries({ 
  fromTimestamp: Date.now() - 3600000 
});
```

#### Defined in

[core/message/Transcript.ts:356](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L356)

___

### getEntriesAsJSON

▸ **getEntriesAsJSON**(`options?`): `any`[]

Get transcript entries as plain JSON-serializable objects.

Useful for storing transcripts in databases, sending to APIs,
or displaying in UI components.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`TranscriptOptions`](../interfaces/TranscriptOptions.md) | Optional filtering options |

#### Returns

`any`[]

Array of plain objects representing transcript entries

**`Example`**

```typescript
const json = transcript.getEntriesAsJSON();

// Each entry includes:
// {
//   messageId, persona, role, content, messageData,
//   timestamp, from, to, agentId, sessionId,
//   direction, entryTimestamp
// }

// Save to database
await db.saveTranscript(json);
```

#### Defined in

[core/message/Transcript.ts:411](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L411)

___

### size

▸ **size**(): `number`

Get the number of entries in the transcript.

#### Returns

`number`

Number of recorded messages

#### Defined in

[core/message/Transcript.ts:433](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L433)

___

### clear

▸ **clear**(): `void`

Clear all transcript entries.

This removes all recorded messages. Use with caution as
this action cannot be undone.

#### Returns

`void`

#### Defined in

[core/message/Transcript.ts:443](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L443)

___

### updateConfig

▸ **updateConfig**(`config`): `void`

Update transcript configuration at runtime.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Partial`\<[`TranscriptConfig`](../interfaces/TranscriptConfig.md)\> | New configuration options (partial update) |

#### Returns

`void`

**`Example`**

```typescript
// Disable transcript temporarily
transcript.updateConfig({ enabled: false });

// Re-enable with new exclusions
transcript.updateConfig({ 
  enabled: true, 
  excludeRoles: ['heartbeat', 'token'] 
});
```

#### Defined in

[core/message/Transcript.ts:496](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L496)
