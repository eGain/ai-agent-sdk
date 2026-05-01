[@egain/ai-agent-sdk API Reference - v0.1.0](../README.md) / AgentMessageParams

# Interface: AgentMessageParams

Parameters for creating a normal customer/agent message

## Hierarchy

- `BaseMessageParams`

  ↳ **`AgentMessageParams`**

## Table of contents

### Properties

- [messageId](AgentMessageParams.md#messageid)
- [from](AgentMessageParams.md#from)
- [to](AgentMessageParams.md#to)
- [content](AgentMessageParams.md#content)
- [persona](AgentMessageParams.md#persona)
- [role](AgentMessageParams.md#role)

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

### content

• **content**: `string`

Message content

#### Defined in

[core/message/MessageTypes.ts:53](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/MessageTypes.ts#L53)

___

### persona

• `Optional` **persona**: `string`

Persona (defaults to "customer")

#### Defined in

[core/message/MessageTypes.ts:57](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/MessageTypes.ts#L57)

___

### role

• `Optional` **role**: `string`

Role (defaults to "human")

#### Defined in

[core/message/MessageTypes.ts:61](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/MessageTypes.ts#L61)
