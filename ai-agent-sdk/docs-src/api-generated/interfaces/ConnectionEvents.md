[@eGain/ai-agent-sdk API Reference - v0.0.14](../README.md) / ConnectionEvents

# Interface: ConnectionEvents

Connection event map

## Table of contents

### Properties

- [connected](ConnectionEvents.md#connected)
- [message](ConnectionEvents.md#message)
- [error](ConnectionEvents.md#error)
- [closed](ConnectionEvents.md#closed)
- [stateChanged](ConnectionEvents.md#statechanged)

## Properties

### connected

• **connected**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `timestamp` | `number` |

#### Defined in

[core/connection/Connection.ts:13](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L13)

___

### message

• **message**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `timestamp` | `number` |

#### Defined in

[core/connection/Connection.ts:14](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L14)

___

### error

• **error**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | `Error` |
| `timestamp` | `number` |

#### Defined in

[core/connection/Connection.ts:15](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L15)

___

### closed

• **closed**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code?` | `number` |
| `reason?` | `string` |
| `timestamp` | `number` |

#### Defined in

[core/connection/Connection.ts:16](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L16)

___

### stateChanged

• **stateChanged**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `state` | [`ConnectionState`](../enums/ConnectionState.md) |
| `previousState` | [`ConnectionState`](../enums/ConnectionState.md) |

#### Defined in

[core/connection/Connection.ts:17](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L17)
