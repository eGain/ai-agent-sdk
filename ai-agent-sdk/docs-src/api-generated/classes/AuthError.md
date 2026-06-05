[@egain/ai-agent-sdk API Reference - v0.1.2](../README.md) / AuthError

# Class: AuthError

Authentication-related errors

## Hierarchy

- [`SDKError`](SDKError.md)

  ↳ **`AuthError`**

## Table of contents

### Constructors

- [constructor](AuthError.md#constructor)

### Properties

- [code](AuthError.md#code)
- [cause](AuthError.md#cause)

## Constructors

### constructor

• **new AuthError**(`message`, `cause?`): [`AuthError`](AuthError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `cause?` | `Error` |

#### Returns

[`AuthError`](AuthError.md)

#### Overrides

[SDKError](SDKError.md).[constructor](SDKError.md#constructor)

#### Defined in

[core/errors/SDKError.ts:20](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/errors/SDKError.ts#L20)

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
