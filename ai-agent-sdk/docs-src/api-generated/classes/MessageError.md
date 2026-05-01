[@egain/ai-agent-sdk API Reference - v0.1.0](../README.md) / MessageError

# Class: MessageError

Message-related errors

## Hierarchy

- [`SDKError`](SDKError.md)

  ↳ **`MessageError`**

## Table of contents

### Constructors

- [constructor](MessageError.md#constructor)

### Properties

- [code](MessageError.md#code)
- [cause](MessageError.md#cause)

## Constructors

### constructor

• **new MessageError**(`message`, `cause?`): [`MessageError`](MessageError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `cause?` | `Error` |

#### Returns

[`MessageError`](MessageError.md)

#### Overrides

[SDKError](SDKError.md).[constructor](SDKError.md#constructor)

#### Defined in

[core/errors/SDKError.ts:42](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L42)

## Properties

### code

• `Optional` `Readonly` **code**: `string`

#### Inherited from

[SDKError](SDKError.md).[code](SDKError.md#code)

#### Defined in

[core/errors/SDKError.ts:7](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L7)

___

### cause

• `Optional` `Readonly` **cause**: `Error`

#### Inherited from

[SDKError](SDKError.md).[cause](SDKError.md#cause)

#### Defined in

[core/errors/SDKError.ts:8](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L8)
