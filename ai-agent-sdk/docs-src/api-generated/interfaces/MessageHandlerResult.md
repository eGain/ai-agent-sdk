[@eGain/ai-agent-sdk API Reference - v0.0.14](../README.md) / MessageHandlerResult

# Interface: MessageHandlerResult

Result returned by message handlers

## Indexable

▪ [key: `string`]: `any`

## Table of contents

### Properties

- [type](MessageHandlerResult.md#type)
- [messageId](MessageHandlerResult.md#messageid)
- [timestamp](MessageHandlerResult.md#timestamp)
- [sessionId](MessageHandlerResult.md#sessionid)
- [agentId](MessageHandlerResult.md#agentid)
- [from](MessageHandlerResult.md#from)
- [to](MessageHandlerResult.md#to)
- [message](MessageHandlerResult.md#message)
- [isEscalation](MessageHandlerResult.md#isescalation)

## Properties

### type

• **type**: `string`

#### Defined in

[core/message/types.ts:78](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L78)

___

### messageId

• `Optional` **messageId**: `string` \| `number`

#### Defined in

[core/message/types.ts:79](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L79)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[core/message/types.ts:80](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L80)

___

### sessionId

• `Optional` **sessionId**: `string` \| `number`

#### Defined in

[core/message/types.ts:81](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L81)

___

### agentId

• `Optional` **agentId**: `string` \| `number`

#### Defined in

[core/message/types.ts:82](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L82)

___

### from

• **from**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `isAi` | `boolean` |

#### Defined in

[core/message/types.ts:83](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L83)

___

### to

• **to**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `isAi` | `boolean` |

#### Defined in

[core/message/types.ts:87](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L87)

___

### message

• **message**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `persona` | `string` |
| `role` | `string` |
| `content?` | `string` |
| `raw` | `any` |
| `escalationType?` | ``null`` \| `string` |
| `escalationData?` | `any` |
| `sources?` | `any`[] |
| `reasoning?` | `string` |
| `showReasoning?` | `boolean` |
| `showFeedback?` | `boolean` |
| `showOptions?` | `boolean` |

#### Defined in

[core/message/types.ts:91](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L91)

___

### isEscalation

• `Optional` **isEscalation**: `boolean`

#### Defined in

[core/message/types.ts:105](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L105)
