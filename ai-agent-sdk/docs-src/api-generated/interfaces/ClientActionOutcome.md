[@egain/ai-agent-sdk API Reference - v0.6.0](../README.md) / ClientActionOutcome

# Interface: ClientActionOutcome

What a handler reports when an action ends.

## Table of contents

### Properties

- [status](ClientActionOutcome.md#status)
- [reason](ClientActionOutcome.md#reason)
- [data](ClientActionOutcome.md#data)

## Properties

### status

• **status**: [`ClientActionStatus`](../README.md#clientactionstatus)

#### Defined in

[core/client-actions/types.ts:57](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L57)

___

### reason

• `Optional` **reason**: `string`

Type-specific detail for anything but `completed` (`popup_blocked`, ...).

#### Defined in

[core/client-actions/types.ts:59](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L59)

___

### data

• `Optional` **data**: `Record`\<`string`, `unknown`\>

Type-specific data sent back on success.

#### Defined in

[core/client-actions/types.ts:61](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L61)
