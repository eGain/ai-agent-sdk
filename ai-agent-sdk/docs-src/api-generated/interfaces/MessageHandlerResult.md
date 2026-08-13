[@egain/ai-agent-sdk API Reference - v0.2.2-beta.0](../README.md) / MessageHandlerResult

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

[core/message/types.ts:87](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L87)

___

### messageId

• `Optional` **messageId**: `string` \| `number`

#### Defined in

[core/message/types.ts:88](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L88)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[core/message/types.ts:89](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L89)

___

### sessionId

• `Optional` **sessionId**: `string` \| `number`

#### Defined in

[core/message/types.ts:90](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L90)

___

### agentId

• `Optional` **agentId**: `string` \| `number`

#### Defined in

[core/message/types.ts:91](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L91)

___

### from

• **from**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `isAi` | `boolean` |

#### Defined in

[core/message/types.ts:92](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L92)

___

### to

• **to**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `isAi` | `boolean` |

#### Defined in

[core/message/types.ts:96](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L96)

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

[core/message/types.ts:100](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L100)

___

### isEscalation

• `Optional` **isEscalation**: `boolean`

#### Defined in

[core/message/types.ts:114](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L114)
