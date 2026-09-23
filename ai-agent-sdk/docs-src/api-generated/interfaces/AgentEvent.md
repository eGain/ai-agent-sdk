[@egain/ai-agent-sdk API Reference - v0.2.5](../README.md) / AgentEvent

# Interface: AgentEvent\<T\>

Wrapped agent event structure

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AgentEventType`](../README.md#agenteventtype) = [`AgentEventType`](../README.md#agenteventtype) |

## Table of contents

### Properties

- [type](AgentEvent.md#type)
- [timestamp](AgentEvent.md#timestamp)
- [sessionId](AgentEvent.md#sessionid)
- [agentId](AgentEvent.md#agentid)
- [payload](AgentEvent.md#payload)

## Properties

### type

• **type**: `T`

Event type identifier

#### Defined in

[core/AiAgent.ts:305](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L305)

___

### timestamp

• **timestamp**: `number`

Timestamp when the event occurred (milliseconds since epoch)

#### Defined in

[core/AiAgent.ts:310](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L310)

___

### sessionId

• `Optional` **sessionId**: `string` \| `number`

Session ID associated with the event

#### Defined in

[core/AiAgent.ts:315](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L315)

___

### agentId

• `Optional` **agentId**: `string` \| `number`

Agent ID associated with the event

#### Defined in

[core/AiAgent.ts:320](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L320)

___

### payload

• **payload**: [`AgentEventPayloadMap`](AgentEventPayloadMap.md)[`T`]

Event-specific payload data
Type varies based on the event type

#### Defined in

[core/AiAgent.ts:326](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L326)
