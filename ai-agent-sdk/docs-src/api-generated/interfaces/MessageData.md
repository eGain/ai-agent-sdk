[@eGain/ai-agent-sdk API Reference - v0.0.14](../README.md) / MessageData

# Interface: MessageData

Message data structure

## Indexable

▪ [key: `string`]: `any`

## Table of contents

### Properties

- [error\_code](MessageData.md#error_code)
- [chat\_history](MessageData.md#chat_history)
- [options](MessageData.md#options)
- [escalation](MessageData.md#escalation)
- [escalationData](MessageData.md#escalationdata)
- [sources](MessageData.md#sources)
- [reasoning](MessageData.md#reasoning)
- [context](MessageData.md#context)
- [feedback](MessageData.md#feedback)
- [escalationEvent](MessageData.md#escalationevent)
- [token](MessageData.md#token)
- [workflowType](MessageData.md#workflowtype)
- [workflowNodeType](MessageData.md#workflownodetype)
- [inputType](MessageData.md#inputtype)

## Properties

### error\_code

• `Optional` **error\_code**: `string`

#### Defined in

[core/message/types.ts:48](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L48)

___

### chat\_history

• `Optional` **chat\_history**: `any`[]

#### Defined in

[core/message/types.ts:49](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L49)

___

### options

• `Optional` **options**: `string`[]

#### Defined in

[core/message/types.ts:50](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L50)

___

### escalation

• `Optional` **escalation**: `boolean`

#### Defined in

[core/message/types.ts:51](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L51)

___

### escalationData

• `Optional` **escalationData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `live?` | `boolean` |
| `phone?` | `boolean` |
| `phoneNumber?` | `string` |
| `sms?` | `boolean` |
| `smsNumber?` | `string` |
| `email?` | `boolean` |

#### Defined in

[core/message/types.ts:52](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L52)

___

### sources

• `Optional` **sources**: `any`[]

#### Defined in

[core/message/types.ts:60](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L60)

___

### reasoning

• `Optional` **reasoning**: `string`

#### Defined in

[core/message/types.ts:61](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L61)

___

### context

• `Optional` **context**: `object`

#### Defined in

[core/message/types.ts:62](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L62)

___

### feedback

• `Optional` **feedback**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `rating` | `any` |
| `answerMessageId` | `string` |

#### Defined in

[core/message/types.ts:63](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L63)

___

### escalationEvent

• `Optional` **escalationEvent**: `any`

#### Defined in

[core/message/types.ts:67](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L67)

___

### token

• `Optional` **token**: `string`

#### Defined in

[core/message/types.ts:68](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L68)

___

### workflowType

• `Optional` **workflowType**: ``null`` \| ``"preChatWorkflow"`` \| ``"escalationWorkflow"`` \| ``"agentWorkflow"``

#### Defined in

[core/message/types.ts:69](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L69)

___

### workflowNodeType

• `Optional` **workflowNodeType**: ``null`` \| `string`

#### Defined in

[core/message/types.ts:70](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L70)

___

### inputType

• `Optional` **inputType**: ``null`` \| `string`

#### Defined in

[core/message/types.ts:71](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L71)
