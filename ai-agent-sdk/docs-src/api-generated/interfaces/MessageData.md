[@egain/ai-agent-sdk API Reference - v0.4.2](../README.md) / MessageData

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
- [clientAction](MessageData.md#clientaction)
- [reasoning](MessageData.md#reasoning)
- [context](MessageData.md#context)
- [feedback](MessageData.md#feedback)
- [escalationEvent](MessageData.md#escalationevent)
- [token](MessageData.md#token)
- [workflowType](MessageData.md#workflowtype)
- [workflowNodeType](MessageData.md#workflownodetype)
- [inputType](MessageData.md#inputtype)
- [inputTimezone](MessageData.md#inputtimezone)

## Properties

### error\_code

• `Optional` **error\_code**: `string`

#### Defined in

[core/message/types.ts:62](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L62)

___

### contextValidationErrors

• `Optional` **contextValidationErrors**: [`ContextValidationIssue`](ContextValidationIssue.md)[]

#### Defined in

[core/message/types.ts:63](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L63)

___

### chat\_history

• `Optional` **chat\_history**: `any`[]

#### Defined in

[core/message/types.ts:64](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L64)

___

### options

• `Optional` **options**: `string`[]

#### Defined in

[core/message/types.ts:65](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L65)

___

### escalation

• `Optional` **escalation**: `boolean`

#### Defined in

[core/message/types.ts:66](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L66)

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

[core/message/types.ts:67](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L67)

___

### sources

• `Optional` **sources**: `any`[]

#### Defined in

[core/message/types.ts:77](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L77)

___

### clientAction

• `Optional` **clientAction**: `ClientActionEnvelope`

Present on a `client action` agent message: something the server asks the browser to do,
such as having the person sign in so a paused tool can act as them.

#### Defined in

[core/message/types.ts:82](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L82)

___

### reasoning

• `Optional` **reasoning**: `string`

#### Defined in

[core/message/types.ts:83](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L83)

___

### context

• `Optional` **context**: `object`

#### Defined in

[core/message/types.ts:84](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L84)

___

### feedback

• `Optional` **feedback**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `rating` | `any` |
| `answerMessageId` | `string` |

#### Defined in

[core/message/types.ts:85](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L85)

___

### escalationEvent

• `Optional` **escalationEvent**: `any`

#### Defined in

[core/message/types.ts:89](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L89)

___

### token

• `Optional` **token**: `string`

#### Defined in

[core/message/types.ts:90](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L90)

___

### workflowType

• `Optional` **workflowType**: ``null`` \| ``"preChatWorkflow"`` \| ``"escalationWorkflow"`` \| ``"agentWorkflow"``

#### Defined in

[core/message/types.ts:91](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L91)

___

### workflowNodeType

• `Optional` **workflowNodeType**: ``null`` \| `string`

#### Defined in

[core/message/types.ts:92](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L92)

___

### inputType

• `Optional` **inputType**: ``null`` \| `string`

#### Defined in

[core/message/types.ts:93](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L93)

___

### inputTimezone

• `Optional` **inputTimezone**: ``null`` \| `string`

Time-only inputs are submitted as local clocks in this IANA timezone.

#### Defined in

[core/message/types.ts:95](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/types.ts#L95)
