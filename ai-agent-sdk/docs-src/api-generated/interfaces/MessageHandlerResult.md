[@egain/ai-agent-sdk API Reference - v0.6.0](../README.md) / MessageHandlerResult

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

[core/message/types.ts:102](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L102)

___

### messageId

• `Optional` **messageId**: `string` \| `number`

#### Defined in

[core/message/types.ts:103](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L103)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[core/message/types.ts:104](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L104)

___

### sessionId

• `Optional` **sessionId**: `string` \| `number`

#### Defined in

[core/message/types.ts:105](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L105)

___

### agentId

• `Optional` **agentId**: `string` \| `number`

#### Defined in

[core/message/types.ts:106](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L106)

___

### from

• **from**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `isAi` | `boolean` |

#### Defined in

[core/message/types.ts:107](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L107)

___

### to

• **to**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `isAi` | `boolean` |

#### Defined in

[core/message/types.ts:111](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L111)

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

[core/message/types.ts:115](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L115)

___

### isEscalation

• `Optional` **isEscalation**: `boolean`

#### Defined in

[core/message/types.ts:129](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L129)
