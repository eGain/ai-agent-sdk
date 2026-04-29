[@eGainDev/ai-agent-sdk API Reference - v0.0.13](../README.md) / MessageHandlerResult

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

[core/message/types.ts:75](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L75)

___

### messageId

• `Optional` **messageId**: `string` \| `number`

#### Defined in

[core/message/types.ts:76](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L76)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[core/message/types.ts:77](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L77)

___

### sessionId

• `Optional` **sessionId**: `string` \| `number`

#### Defined in

[core/message/types.ts:78](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L78)

___

### agentId

• `Optional` **agentId**: `string` \| `number`

#### Defined in

[core/message/types.ts:79](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L79)

___

### from

• **from**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `isAi` | `boolean` |

#### Defined in

[core/message/types.ts:80](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L80)

___

### to

• **to**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `isAi` | `boolean` |

#### Defined in

[core/message/types.ts:84](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L84)

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

[core/message/types.ts:88](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L88)

___

### isEscalation

• `Optional` **isEscalation**: `boolean`

#### Defined in

[core/message/types.ts:102](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L102)
