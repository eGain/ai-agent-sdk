[@egain/ai-agent-sdk API Reference - v0.2.2-beta.1](../README.md) / InitializationPipelineError

# Class: InitializationPipelineError

Thrown when the CC portal initialization pipeline fails.
Consumers should catch this type and branch on [pipelineCode](InitializationPipelineError.md#pipelinecode) (also on `error.code`).

## Hierarchy

- [`SDKError`](SDKError.md)

  ↳ **`InitializationPipelineError`**

## Table of contents

### Constructors

- [constructor](InitializationPipelineError.md#constructor)

### Properties

- [code](InitializationPipelineError.md#code)
- [cause](InitializationPipelineError.md#cause)
- [stage](InitializationPipelineError.md#stage)
- [portal](InitializationPipelineError.md#portal)
- [agent](InitializationPipelineError.md#agent)
- [pipelineCode](InitializationPipelineError.md#pipelinecode)

## Constructors

### constructor

• **new InitializationPipelineError**(`message`, `pipelineCode`, `causeOrOptions?`): [`InitializationPipelineError`](InitializationPipelineError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `pipelineCode` | [`InitializationPipelineErrorCode`](../README.md#initializationpipelineerrorcode-1) |
| `causeOrOptions?` | `Error` \| [`InitializationPipelineErrorOptions`](../README.md#initializationpipelineerroroptions) |

#### Returns

[`InitializationPipelineError`](InitializationPipelineError.md)

#### Overrides

[SDKError](SDKError.md).[constructor](SDKError.md#constructor)

#### Defined in

[core/errors/SDKError.ts:86](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L86)

## Properties

### code

• `Optional` `Readonly` **code**: `string`

#### Inherited from

[SDKError](SDKError.md).[code](SDKError.md#code)

#### Defined in

[core/errors/SDKError.ts:9](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L9)

___

### cause

• `Optional` `Readonly` **cause**: `Error`

#### Inherited from

[SDKError](SDKError.md).[cause](SDKError.md#cause)

#### Defined in

[core/errors/SDKError.ts:10](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L10)

___

### stage

• `Optional` `Readonly` **stage**: [`InitializationPipelineStage`](../README.md#initializationpipelinestage)

#### Defined in

[core/errors/SDKError.ts:82](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L82)

___

### portal

• `Optional` `Readonly` **portal**: [`Portal`](../interfaces/Portal.md)

#### Defined in

[core/errors/SDKError.ts:83](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L83)

___

### agent

• `Optional` `Readonly` **agent**: [`AgentListItem`](../interfaces/AgentListItem.md)

#### Defined in

[core/errors/SDKError.ts:84](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L84)

___

### pipelineCode

• `Readonly` **pipelineCode**: [`InitializationPipelineErrorCode`](../README.md#initializationpipelineerrorcode-1)

#### Defined in

[core/errors/SDKError.ts:88](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L88)
