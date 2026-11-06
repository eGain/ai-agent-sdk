[@egain/ai-agent-sdk API Reference - v0.4.2](../README.md) / PkceUserAuthHandlerOptions

# Interface: PkceUserAuthHandlerOptions

## Table of contents

### Properties

- [oidcClient](PkceUserAuthHandlerOptions.md#oidcclient)

## Properties

### oidcClient

• `Optional` **oidcClient**: [`OidcClientConstructor`](../README.md#oidcclientconstructor)

The `OidcClient` constructor to use. Defaults to the SDK's own `oidc-client-ts`; a host that
already loads the library can hand in its copy instead.

#### Defined in

[core/client-actions/pkce/PkceUserAuthHandler.ts:34](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/pkce/PkceUserAuthHandler.ts#L34)
