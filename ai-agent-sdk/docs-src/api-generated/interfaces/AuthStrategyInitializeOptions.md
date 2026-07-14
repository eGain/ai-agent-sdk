[@egain/ai-agent-sdk API Reference - v0.1.3](../README.md) / AuthStrategyInitializeOptions

# Interface: AuthStrategyInitializeOptions

Options for initializing an authentication strategy

## Table of contents

### Properties

- [deploymentInfo](AuthStrategyInitializeOptions.md#deploymentinfo)
- [scopes](AuthStrategyInitializeOptions.md#scopes)
- [postAuthentication](AuthStrategyInitializeOptions.md#postauthentication)

## Properties

### deploymentInfo

• **deploymentInfo**: `any`

The deployment information for the authentication strategy

#### Defined in

[core/auth/AuthStrategy.ts:42](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthStrategy.ts#L42)

___

### scopes

• `Optional` **scopes**: `string`[]

The scopes for the authentication strategy

#### Defined in

[core/auth/AuthStrategy.ts:46](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthStrategy.ts#L46)

___

### postAuthentication

• `Optional` **postAuthentication**: [`PostAuthenticationCallback`](../README.md#postauthenticationcallback)

Callback to be called after authentication completes

#### Defined in

[core/auth/AuthStrategy.ts:50](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/AuthStrategy.ts#L50)
