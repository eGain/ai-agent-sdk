[@egain/ai-agent-sdk API Reference - v0.2.1](../README.md) / MessageError

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

[core/errors/SDKError.ts:44](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L44)

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
