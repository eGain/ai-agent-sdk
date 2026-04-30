[@eGain/ai-agent-sdk API Reference - v0.1.0](../README.md) / TranscriptConfig

# Interface: TranscriptConfig

Configuration for transcript storage and filtering.

Use this to control which messages are recorded in the transcript.

**`Example`**

```typescript
const config: TranscriptConfig = {
  enabled: true,
  excludeRoles: ['heartbeat', 'token'],
  excludePersonas: ['system']
};
```

## Table of contents

### Properties

- [enabled](TranscriptConfig.md#enabled)
- [includeMessageTypes](TranscriptConfig.md#includemessagetypes)
- [excludeRoles](TranscriptConfig.md#excluderoles)
- [excludePersonas](TranscriptConfig.md#excludepersonas)

## Properties

### enabled

• `Optional` **enabled**: `boolean`

Enable or disable transcript storage.
When disabled, no messages are recorded.

**`Default`**

```ts
true
```

#### Defined in

[core/message/Transcript.ts:148](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Transcript.ts#L148)

___

### includeMessageTypes

• `Optional` **includeMessageTypes**: `string`[]

Array of message types to include.
If specified, only these message types are recorded.
If not specified, all message types are included (subject to exclude filters).

**`Example`**

```ts
['agent_message', 'customer_message']
```

#### Defined in

[core/message/Transcript.ts:157](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Transcript.ts#L157)

___

### excludeRoles

• `Optional` **excludeRoles**: `string`[]

Array of roles to exclude from the transcript.
Messages with these roles will not be recorded.

**`Example`**

```ts
['heartbeat', 'token']
```

#### Defined in

[core/message/Transcript.ts:165](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Transcript.ts#L165)

___

### excludePersonas

• `Optional` **excludePersonas**: `string`[]

Array of personas to exclude from the transcript.
Messages from these personas will not be recorded.

**`Example`**

```ts
['system']
```

#### Defined in

[core/message/Transcript.ts:173](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Transcript.ts#L173)
