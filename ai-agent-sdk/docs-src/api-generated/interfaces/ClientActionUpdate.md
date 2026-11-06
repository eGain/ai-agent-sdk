[@egain/ai-agent-sdk API Reference - v0.4.2](../README.md) / ClientActionUpdate

# Interface: ClientActionUpdate

A change in an action's state, on the `clientActionUpdate` event.

## Table of contents

### Properties

- [actionId](ClientActionUpdate.md#actionid)
- [type](ClientActionUpdate.md#type)
- [lifecycle](ClientActionUpdate.md#lifecycle)
- [status](ClientActionUpdate.md#status)
- [reason](ClientActionUpdate.md#reason)
- [progress](ClientActionUpdate.md#progress)

## Properties

### actionId

• **actionId**: `string`

#### Defined in

[core/client-actions/types.ts:112](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L112)

___

### type

• **type**: `string`

#### Defined in

[core/client-actions/types.ts:113](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L113)

___

### lifecycle

• **lifecycle**: [`ClientActionLifecycle`](../README.md#clientactionlifecycle)

#### Defined in

[core/client-actions/types.ts:114](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L114)

___

### status

• `Optional` **status**: [`ClientActionStatus`](../README.md#clientactionstatus)

Set once the action has ended.

#### Defined in

[core/client-actions/types.ts:116](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L116)

___

### reason

• `Optional` **reason**: `string`

#### Defined in

[core/client-actions/types.ts:117](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L117)

___

### progress

• `Optional` **progress**: `string`

The handler's latest step, while it is in progress.

#### Defined in

[core/client-actions/types.ts:119](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/types.ts#L119)
