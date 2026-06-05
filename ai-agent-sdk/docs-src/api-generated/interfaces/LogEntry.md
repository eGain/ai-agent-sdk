[@egain/ai-agent-sdk API Reference - v0.1.2](../README.md) / LogEntry

# Interface: LogEntry

Log entry structure emitted by the logger

## Table of contents

### Properties

- [level](LogEntry.md#level)
- [message](LogEntry.md#message)
- [timestamp](LogEntry.md#timestamp)
- [context](LogEntry.md#context)
- [error](LogEntry.md#error)
- [agentId](LogEntry.md#agentid)
- [sessionId](LogEntry.md#sessionid)
- [loggerName](LogEntry.md#loggername)

## Properties

### level

• **level**: [`LogLevel`](../enums/LogLevel.md)

Log level

#### Defined in

[core/logging/types.ts:10](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/types.ts#L10)

___

### message

• **message**: `string`

Log message

#### Defined in

[core/logging/types.ts:15](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/types.ts#L15)

___

### timestamp

• **timestamp**: `number`

Timestamp when the log was created (milliseconds since epoch)

#### Defined in

[core/logging/types.ts:20](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/types.ts#L20)

___

### context

• `Optional` **context**: `Record`\<`string`, `any`\>

Optional context/metadata

#### Defined in

[core/logging/types.ts:25](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/types.ts#L25)

___

### error

• `Optional` **error**: `Error`

Optional error object (for ERROR and FATAL levels)

#### Defined in

[core/logging/types.ts:30](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/types.ts#L30)

___

### agentId

• `Optional` **agentId**: `string` \| `number`

Optional agent identifier

#### Defined in

[core/logging/types.ts:35](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/types.ts#L35)

___

### sessionId

• `Optional` **sessionId**: `string` \| `number`

Optional session identifier

#### Defined in

[core/logging/types.ts:40](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/types.ts#L40)

___

### loggerName

• `Optional` **loggerName**: `string`

Optional logger name for identification

#### Defined in

[core/logging/types.ts:45](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/types.ts#L45)
