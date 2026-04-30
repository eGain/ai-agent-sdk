[@eGain/ai-agent-sdk API Reference - v0.0.14](../README.md) / Message

# Class: Message

Message class representing both incoming and outgoing messages

## Table of contents

### Constructors

- [constructor](Message.md#constructor)

### Properties

- [messageId](Message.md#messageid)
- [persona](Message.md#persona)
- [role](Message.md#role)
- [content](Message.md#content)
- [messageData](Message.md#messagedata)
- [timestamp](Message.md#timestamp)
- [from](Message.md#from)
- [to](Message.md#to)
- [agentId](Message.md#agentid)
- [sessionId](Message.md#sessionid)

### Methods

- [validate](Message.md#validate)
- [toPayloadString](Message.md#topayloadstring)
- [fromJSON](Message.md#fromjson)
- [isIncoming](Message.md#isincoming)
- [isOutgoing](Message.md#isoutgoing)
- [clone](Message.md#clone)

## Constructors

### constructor

• **new Message**(`persona`, `role`, `content?`, `options?`): [`Message`](Message.md)

Create a new Message instance

#### Parameters

| Name | Type |
| :------ | :------ |
| `persona` | [`Persona`](../README.md#persona-1) |
| `role` | [`Role`](../README.md#role-1) |
| `content?` | `string` |
| `options?` | `Object` |
| `options.messageId?` | `string` |
| `options.messageData?` | [`MessageData`](../interfaces/MessageData.md) |
| `options.timestamp?` | `number` |
| `options.from?` | `string` |
| `options.to?` | `string` |
| `options.agentId?` | `string` |
| `options.sessionId?` | `string` |

#### Returns

[`Message`](Message.md)

#### Defined in

[core/message/Message.ts:21](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L21)

## Properties

### messageId

• `Optional` `Readonly` **messageId**: `string`

#### Defined in

[core/message/Message.ts:7](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L7)

___

### persona

• `Readonly` **persona**: [`Persona`](../README.md#persona-1)

#### Defined in

[core/message/Message.ts:8](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L8)

___

### role

• `Readonly` **role**: [`Role`](../README.md#role-1)

#### Defined in

[core/message/Message.ts:9](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L9)

___

### content

• `Optional` `Readonly` **content**: `string`

#### Defined in

[core/message/Message.ts:10](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L10)

___

### messageData

• `Optional` `Readonly` **messageData**: [`MessageData`](../interfaces/MessageData.md)

#### Defined in

[core/message/Message.ts:11](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L11)

___

### timestamp

• `Readonly` **timestamp**: `number`

#### Defined in

[core/message/Message.ts:12](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L12)

___

### from

• `Optional` `Readonly` **from**: `string`

#### Defined in

[core/message/Message.ts:13](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L13)

___

### to

• `Optional` `Readonly` **to**: `string`

#### Defined in

[core/message/Message.ts:14](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L14)

___

### agentId

• `Optional` `Readonly` **agentId**: `any`

#### Defined in

[core/message/Message.ts:15](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L15)

___

### sessionId

• `Optional` `Readonly` **sessionId**: `any`

#### Defined in

[core/message/Message.ts:16](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L16)

## Methods

### validate

▸ **validate**(): `void`

Validate message structure

#### Returns

`void`

**`Throws`**

If message is invalid

#### Defined in

[core/message/Message.ts:51](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L51)

___

### toPayloadString

▸ **toPayloadString**(): `string`

Convert message to payload string (JSON) for transmission
Outgoing payload is configured here

#### Returns

`string`

JSON string

#### Defined in

[core/message/Message.ts:68](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L68)

___

### fromJSON

▸ **fromJSON**(`data`, `sessionContext`): [`Message`](Message.md)

Create a Message instance from JSON data (typically from WebSocket)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `sessionContext` | `SessionContext` |

#### Returns

[`Message`](Message.md)

#### Defined in

[core/message/Message.ts:91](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L91)

___

### isIncoming

▸ **isIncoming**(): `boolean`

Check if this is an incoming message
Incoming messages come from the server (agent, system, or metadata)
Can also be identified by the 'from' field if it's set to an agent ID

#### Returns

`boolean`

#### Defined in

[core/message/Message.ts:128](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L128)

___

### isOutgoing

▸ **isOutgoing**(): `boolean`

Check if this is an outgoing message
Outgoing messages are sent by the client (customer)
Can also be identified by the 'from' field if it's set to a customer/client ID

#### Returns

`boolean`

#### Defined in

[core/message/Message.ts:146](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L146)

___

### clone

▸ **clone**(`updates?`): [`Message`](Message.md)

Create a copy of this message with updated fields

#### Parameters

| Name | Type |
| :------ | :------ |
| `updates?` | `Partial`\<\{ `persona`: [`Persona`](../README.md#persona-1) ; `role`: [`Role`](../README.md#role-1) ; `content`: `string` ; `messageId`: `string` ; `messageData`: [`MessageData`](../interfaces/MessageData.md) ; `timestamp`: `number` ; `from`: `string` ; `to`: `string`  }\> |

#### Returns

[`Message`](Message.md)

#### Defined in

[core/message/Message.ts:164](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/Message.ts#L164)
