[@egain/ai-agent-sdk API Reference - v0.2.1](../README.md) / ConnectionError

# Class: ConnectionError

Connection-related errors

## Hierarchy

- [`SDKError`](SDKError.md)

  ↳ **`ConnectionError`**

## Table of contents

### Constructors

- [constructor](ConnectionError.md#constructor)

### Properties

- [code](ConnectionError.md#code)
- [cause](ConnectionError.md#cause)

## Constructors

### constructor

• **new ConnectionError**(`message`, `cause?`): [`ConnectionError`](ConnectionError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `cause?` | `Error` |

#### Returns

[`ConnectionError`](ConnectionError.md)

#### Overrides

[SDKError](SDKError.md).[constructor](SDKError.md#constructor)

#### Defined in

[core/errors/SDKError.ts:33](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L33)

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
