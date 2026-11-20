[@egain/ai-agent-sdk API Reference - v0.6.0](../README.md) / ClientActionHandler

# Interface: ClientActionHandler\<P\>

Carries out one action type.

Registering a handler is how a host opts in to a type. Without one, an action of that type is
answered `unsupported` at once, and the agent carries on without it.

## Type parameters

| Name | Type |
| :------ | :------ |
| `P` | `unknown` |

## Table of contents

### Properties

- [type](ClientActionHandler.md#type)
- [interaction](ClientActionHandler.md#interaction)

### Methods

- [parse](ClientActionHandler.md#parse)
- [tryWithoutUser](ClientActionHandler.md#trywithoutuser)
- [perform](ClientActionHandler.md#perform)

## Properties

### type

• `Readonly` **type**: `string`

#### Defined in

[core/client-actions/types.ts:82](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L82)

___

### interaction

• `Readonly` **interaction**: [`ClientActionInteraction`](../README.md#clientactioninteraction)

#### Defined in

[core/client-actions/types.ts:83](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L83)

## Methods

### parse

▸ **parse**(`payload`): ``null`` \| `P`

Validate the server's payload. `null` means it is unusable, and the action fails.

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `unknown` |

#### Returns

``null`` \| `P`

#### Defined in

[core/client-actions/types.ts:85](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L85)

___

### tryWithoutUser

▸ **tryWithoutUser**(`payload`, `context`): `Promise`\<``null`` \| [`ClientActionOutcome`](ClientActionOutcome.md)\>

Try to finish without the person, before a `user-gesture` action waits for a click -- a
cached sign-in, say. `null` means the person is needed after all.

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `P` |
| `context` | [`ClientActionContext`](ClientActionContext.md) |

#### Returns

`Promise`\<``null`` \| [`ClientActionOutcome`](ClientActionOutcome.md)\>

#### Defined in

[core/client-actions/types.ts:90](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L90)

___

### perform

▸ **perform**(`payload`, `context`): `Promise`\<[`ClientActionOutcome`](ClientActionOutcome.md)\>

Carry the action out. For a `user-gesture` handler this runs synchronously inside the click
that triggered it, up to its first `await`, so anything that needs the gesture comes first.

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `P` |
| `context` | [`ClientActionContext`](ClientActionContext.md) |

#### Returns

`Promise`\<[`ClientActionOutcome`](ClientActionOutcome.md)\>

#### Defined in

[core/client-actions/types.ts:95](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L95)
