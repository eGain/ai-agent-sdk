[@egain/ai-agent-sdk API Reference - v0.5.0](../README.md) / ClientActionContext

# Interface: ClientActionContext

Handed to a handler for one run of one action.

## Table of contents

### Properties

- [actionId](ClientActionContext.md#actionid)
- [expiresAt](ClientActionContext.md#expiresat)
- [signal](ClientActionContext.md#signal)

### Methods

- [progress](ClientActionContext.md#progress)

## Properties

### actionId

• **actionId**: `string`

#### Defined in

[core/client-actions/types.ts:66](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L66)

___

### expiresAt

• `Optional` **expiresAt**: `number`

Epoch milliseconds after which the action is no longer wanted, if the server set one.

#### Defined in

[core/client-actions/types.ts:68](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L68)

___

### signal

• **signal**: `AbortSignal`

Aborted when the action is cancelled, superseded or expires; a handler stops on it.

#### Defined in

[core/client-actions/types.ts:70](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L70)

## Methods

### progress

▸ **progress**(`detail`): `void`

Report a type-specific step (`refreshing`, `prompting`, ...) to whatever renders the action.

#### Parameters

| Name | Type |
| :------ | :------ |
| `detail` | `string` |

#### Returns

`void`

#### Defined in

[core/client-actions/types.ts:72](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L72)
