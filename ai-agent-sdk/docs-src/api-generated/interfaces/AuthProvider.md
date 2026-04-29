[@eGainDev/ai-agent-sdk API Reference - v0.0.13](../README.md) / AuthProvider

# Interface: AuthProvider

Authentication provider interface
Implement this interface to provide custom authentication mechanisms

## Hierarchy

- **`AuthProvider`**

  ↳ [`AuthStrategy`](AuthStrategy.md)

## Table of contents

### Methods

- [getToken](AuthProvider.md#gettoken)

## Methods

### getToken

▸ **getToken**(): `Promise`\<``null`` \| `string`\>

Get an authentication token
This method may be called multiple times, so implementations should
handle token refresh if needed

#### Returns

`Promise`\<``null`` \| `string`\>

#### Defined in

[core/auth/AuthProvider.ts:11](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthProvider.ts#L11)
