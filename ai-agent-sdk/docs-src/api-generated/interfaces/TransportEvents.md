[@egain/ai-agent-sdk API Reference - v0.1.1](../README.md) / TransportEvents

# Interface: TransportEvents

Transport event map - events that any transport must emit

## Table of contents

### Properties

- [connected](TransportEvents.md#connected)
- [message](TransportEvents.md#message)
- [error](TransportEvents.md#error)
- [closed](TransportEvents.md#closed)

## Properties

### connected

• **connected**: `Object`

Emitted when transport connection is established

#### Type declaration

| Name | Type |
| :------ | :------ |
| `timestamp` | `number` |

#### Defined in

[core/connection/Transport.ts:12](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Transport.ts#L12)

___

### message

• **message**: `Object`

Emitted when a message is received

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `timestamp` | `number` |

#### Defined in

[core/connection/Transport.ts:17](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Transport.ts#L17)

___

### error

• **error**: `Object`

Emitted when an error occurs

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | `Error` |
| `timestamp` | `number` |

#### Defined in

[core/connection/Transport.ts:22](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Transport.ts#L22)

___

### closed

• **closed**: `Object`

Emitted when connection is closed

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code?` | `number` |
| `reason?` | `string` |
| `timestamp` | `number` |

#### Defined in

[core/connection/Transport.ts:27](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Transport.ts#L27)
