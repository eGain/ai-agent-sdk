[@egain/ai-agent-sdk API Reference - v0.1.3](../README.md) / EscalationMessageParams

# Interface: EscalationMessageParams

Parameters for creating an escalation event message

## Hierarchy

- `BaseMessageParams`

  ↳ **`EscalationMessageParams`**

## Table of contents

### Properties

- [messageId](EscalationMessageParams.md#messageid)
- [from](EscalationMessageParams.md#from)
- [to](EscalationMessageParams.md#to)
- [escalationEvent](EscalationMessageParams.md#escalationevent)

## Properties

### messageId

• `Optional` **messageId**: `string`

#### Inherited from

BaseMessageParams.messageId

#### Defined in

[core/message/MessageTypes.ts:7](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/MessageTypes.ts#L7)

___

### from

• `Optional` **from**: `string`

#### Inherited from

BaseMessageParams.from

#### Defined in

[core/message/MessageTypes.ts:8](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/MessageTypes.ts#L8)

___

### to

• `Optional` **to**: `string`

#### Inherited from

BaseMessageParams.to

#### Defined in

[core/message/MessageTypes.ts:9](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/MessageTypes.ts#L9)

___

### escalationEvent

• **escalationEvent**: `any`

The escalation event data

#### Defined in

[core/message/MessageTypes.ts:29](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/MessageTypes.ts#L29)
