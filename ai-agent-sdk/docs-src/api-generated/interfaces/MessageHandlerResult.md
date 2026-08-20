[@egain/ai-agent-sdk API Reference - v0.2.2-beta.1](../README.md) / MessageHandlerResult

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

[core/message/types.ts:89](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L89)

___

### messageId

• `Optional` **messageId**: `string` \| `number`

#### Defined in

[core/message/types.ts:90](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L90)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[core/message/types.ts:91](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L91)

___

### sessionId

• `Optional` **sessionId**: `string` \| `number`

#### Defined in

[core/message/types.ts:92](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L92)

___

### agentId

• `Optional` **agentId**: `string` \| `number`

#### Defined in

[core/message/types.ts:93](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L93)

___

### from

• **from**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `isAi` | `boolean` |

#### Defined in

[core/message/types.ts:94](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L94)

___

### to

• **to**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `isAi` | `boolean` |

#### Defined in

[core/message/types.ts:98](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L98)

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

[core/message/types.ts:102](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L102)

___

### isEscalation

• `Optional` **isEscalation**: `boolean`

#### Defined in

[core/message/types.ts:116](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L116)
