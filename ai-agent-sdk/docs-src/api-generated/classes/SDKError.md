[@egain/ai-agent-sdk API Reference - v0.1.2](../README.md) / SDKError

# Class: SDKError

Base error class for all SDK errors

## Hierarchy

- `Error`

  ↳ **`SDKError`**

  ↳↳ [`AuthError`](AuthError.md)

  ↳↳ [`ConnectionError`](ConnectionError.md)

  ↳↳ [`MessageError`](MessageError.md)

## Table of contents

### Constructors

- [constructor](SDKError.md#constructor)

### Properties

- [code](SDKError.md#code)
- [cause](SDKError.md#cause)

## Constructors

### constructor

• **new SDKError**(`message`, `code?`, `cause?`): [`SDKError`](SDKError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `code?` | `string` |
| `cause?` | `Error` |

#### Returns

[`SDKError`](SDKError.md)

#### Overrides

Error.constructor

#### Defined in

[core/errors/SDKError.ts:5](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L5)

## Properties

### code

• `Optional` `Readonly` **code**: `string`

#### Defined in

[core/errors/SDKError.ts:7](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L7)

___

### cause

• `Optional` `Readonly` **cause**: `Error`

#### Defined in

[core/errors/SDKError.ts:8](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L8)
