[@egain/ai-agent-sdk API Reference - v0.2.2](../README.md) / MessageData

# Interface: MessageData

Message data structure

## Indexable

▪ [key: `string`]: `any`

## Table of contents

### Properties

- [error\_code](MessageData.md#error_code)
- [contextValidationErrors](MessageData.md#contextvalidationerrors)
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

[core/message/types.ts:56](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L56)

___

### contextValidationErrors

• `Optional` **contextValidationErrors**: [`ContextValidationIssue`](ContextValidationIssue.md)[]

#### Defined in

[core/message/types.ts:57](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L57)

___

### chat\_history

• `Optional` **chat\_history**: `any`[]

#### Defined in

[core/message/types.ts:58](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L58)

___

### options

• `Optional` **options**: `string`[]

#### Defined in

[core/message/types.ts:59](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L59)

___

### escalation

• `Optional` **escalation**: `boolean`

#### Defined in

[core/message/types.ts:60](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L60)

___

### escalationData

• `Optional` **escalationData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `live?` | `boolean` |
| `liveDomain?` | `string` |
| `entrypointUrl?` | `string` |
| `phone?` | `boolean` |
| `phoneNumber?` | `string` |
| `sms?` | `boolean` |
| `smsNumber?` | `string` |
| `email?` | `boolean` |

#### Defined in

[core/message/types.ts:61](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L61)

___

### sources

• `Optional` **sources**: `any`[]

#### Defined in

[core/message/types.ts:71](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L71)

___

### reasoning

• `Optional` **reasoning**: `string`

#### Defined in

[core/message/types.ts:72](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L72)

___

### context

• `Optional` **context**: `object`

#### Defined in

[core/message/types.ts:73](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L73)

___

### feedback

• `Optional` **feedback**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `rating` | `any` |
| `answerMessageId` | `string` |

#### Defined in

[core/message/types.ts:74](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L74)

___

### escalationEvent

• `Optional` **escalationEvent**: `any`

#### Defined in

[core/message/types.ts:78](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L78)

___

### token

• `Optional` **token**: `string`

#### Defined in

[core/message/types.ts:79](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L79)

___

### workflowType

• `Optional` **workflowType**: ``null`` \| ``"preChatWorkflow"`` \| ``"escalationWorkflow"`` \| ``"agentWorkflow"``

#### Defined in

[core/message/types.ts:80](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L80)

___

### workflowNodeType

• `Optional` **workflowNodeType**: ``null`` \| `string`

#### Defined in

[core/message/types.ts:81](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L81)

___

### inputType

• `Optional` **inputType**: ``null`` \| `string`

#### Defined in

[core/message/types.ts:82](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L82)
