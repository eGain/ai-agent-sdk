[@egain/ai-agent-sdk API Reference - v0.1.1](../README.md) / PreAuthConfig

# Interface: PreAuthConfig

Configuration for pre-auth authentication strategy

## Table of contents

### Properties

- [accessToken](PreAuthConfig.md#accesstoken)
- [refreshTokenFn](PreAuthConfig.md#refreshtokenfn)
- [expiryBufferMs](PreAuthConfig.md#expirybufferms)

## Properties

### accessToken

• **accessToken**: `string`

Access token to use directly

#### Defined in

[core/auth/PreAuthStrategy.ts:20](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PreAuthStrategy.ts#L20)

___

### refreshTokenFn

• `Optional` **refreshTokenFn**: () => `Promise`\<`string`\>

Optional token refresh function
If provided, will be called when token needs to be refreshed

#### Type declaration

▸ (): `Promise`\<`string`\>

##### Returns

`Promise`\<`string`\>

#### Defined in

[core/auth/PreAuthStrategy.ts:26](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PreAuthStrategy.ts#L26)

___

### expiryBufferMs

• `Optional` **expiryBufferMs**: `number`

Buffer time in milliseconds before token expiry to trigger the expiring event

**`Default`**

```ts
180000 (3 minutes)
```

#### Defined in

[core/auth/PreAuthStrategy.ts:32](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PreAuthStrategy.ts#L32)
