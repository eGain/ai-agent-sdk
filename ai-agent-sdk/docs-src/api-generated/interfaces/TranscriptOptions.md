[@eGainDev/ai-agent-sdk API Reference - v0.0.14](../README.md) / TranscriptOptions

# Interface: TranscriptOptions

Options for filtering transcript entries when retrieving.

**`Example`**

```typescript
// Get received messages from the last hour
const options: TranscriptOptions = {
  direction: 'received',
  fromTimestamp: Date.now() - 3600000
};
const entries = transcript.getEntries(options);
```

## Table of contents

### Properties

- [fromTimestamp](TranscriptOptions.md#fromtimestamp)
- [toTimestamp](TranscriptOptions.md#totimestamp)
- [direction](TranscriptOptions.md#direction)
- [persona](TranscriptOptions.md#persona)
- [role](TranscriptOptions.md#role)

## Properties

### fromTimestamp

• `Optional` **fromTimestamp**: `number`

Filter entries from this timestamp onwards (inclusive)

#### Defined in

[core/message/Transcript.ts:196](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L196)

___

### toTimestamp

• `Optional` **toTimestamp**: `number`

Filter entries up to this timestamp (inclusive)

#### Defined in

[core/message/Transcript.ts:201](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L201)

___

### direction

• `Optional` **direction**: ``"sent"`` \| ``"received"`` \| ``"both"``

Filter by direction: 'sent', 'received', or 'both'

#### Defined in

[core/message/Transcript.ts:206](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L206)

___

### persona

• `Optional` **persona**: [`Persona`](../README.md#persona-1)

Filter by message persona (e.g., 'agent', 'customer')

#### Defined in

[core/message/Transcript.ts:211](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L211)

___

### role

• `Optional` **role**: [`Role`](../README.md#role-1)

Filter by message role (e.g., 'human', 'context')

#### Defined in

[core/message/Transcript.ts:216](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/Transcript.ts#L216)
