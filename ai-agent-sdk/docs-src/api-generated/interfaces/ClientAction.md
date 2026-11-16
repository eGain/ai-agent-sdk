[@egain/ai-agent-sdk API Reference - v0.5.0](../README.md) / ClientAction

# Interface: ClientAction\<P\>

An action as the host sees it, on the `clientAction` event.

## Type parameters

| Name | Type |
| :------ | :------ |
| `P` | `unknown` |

## Table of contents

### Properties

- [actionId](ClientAction.md#actionid)
- [type](ClientAction.md#type)
- [interaction](ClientAction.md#interaction)
- [awaitsResult](ClientAction.md#awaitsresult)
- [expiresAt](ClientAction.md#expiresat)
- [payload](ClientAction.md#payload)
- [lifecycle](ClientAction.md#lifecycle)

## Properties

### actionId

• **actionId**: `string`

#### Defined in

[core/client-actions/types.ts:100](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L100)

___

### type

• **type**: `string`

#### Defined in

[core/client-actions/types.ts:101](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L101)

___

### interaction

• **interaction**: [`ClientActionInteraction`](../README.md#clientactioninteraction)

#### Defined in

[core/client-actions/types.ts:102](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L102)

___

### awaitsResult

• **awaitsResult**: `boolean`

#### Defined in

[core/client-actions/types.ts:103](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L103)

___

### expiresAt

• `Optional` **expiresAt**: `number`

#### Defined in

[core/client-actions/types.ts:104](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L104)

___

### payload

• **payload**: `P`

The payload as the handler parsed it.

#### Defined in

[core/client-actions/types.ts:106](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L106)

___

### lifecycle

• **lifecycle**: [`ClientActionLifecycle`](../README.md#clientactionlifecycle)

#### Defined in

[core/client-actions/types.ts:107](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L107)
