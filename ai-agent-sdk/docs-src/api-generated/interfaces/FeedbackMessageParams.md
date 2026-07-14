[@egain/ai-agent-sdk API Reference - v0.1.3](../README.md) / FeedbackMessageParams

# Interface: FeedbackMessageParams

Parameters for creating a feedback message

## Hierarchy

- `BaseMessageParams`

  ↳ **`FeedbackMessageParams`**

## Table of contents

### Properties

- [messageId](FeedbackMessageParams.md#messageid)
- [from](FeedbackMessageParams.md#from)
- [to](FeedbackMessageParams.md#to)
- [rating](FeedbackMessageParams.md#rating)
- [answerMessageId](FeedbackMessageParams.md#answermessageid)

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

### rating

• **rating**: ``"up"`` \| ``"down"``

The feedback rating - "up" for positive, "down" for negative

#### Defined in

[core/message/MessageTypes.ts:39](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/MessageTypes.ts#L39)

___

### answerMessageId

• **answerMessageId**: `string`

ID of the message being rated

#### Defined in

[core/message/MessageTypes.ts:43](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/message/MessageTypes.ts#L43)
