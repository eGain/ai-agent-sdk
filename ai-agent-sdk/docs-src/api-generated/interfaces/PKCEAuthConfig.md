[@egain/ai-agent-sdk API Reference - v0.2.3](../README.md) / PKCEAuthConfig

# Interface: PKCEAuthConfig

Configuration for PKCE authentication strategy

## Table of contents

### Properties

- [authorizationUrl](PKCEAuthConfig.md#authorizationurl)
- [tokenUrl](PKCEAuthConfig.md#tokenurl)
- [clientId](PKCEAuthConfig.md#clientid)
- [redirectUri](PKCEAuthConfig.md#redirecturi)
- [scopes](PKCEAuthConfig.md#scopes)
- [authScheme](PKCEAuthConfig.md#authscheme)
- [cacheLocation](PKCEAuthConfig.md#cachelocation)
- [knownAuthorities](PKCEAuthConfig.md#knownauthorities)
- [authorityMetadata](PKCEAuthConfig.md#authoritymetadata)
- [nextRoute](PKCEAuthConfig.md#nextroute)
- [localLogin](PKCEAuthConfig.md#locallogin)

## Properties

### authorizationUrl

• `Optional` **authorizationUrl**: `string`

Authorization server URL (authority)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:14](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L14)

___

### tokenUrl

• `Optional` **tokenUrl**: `string`

Token endpoint URL (not used directly by MSAL, but kept for compatibility)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:19](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L19)

___

### clientId

• **clientId**: `string`

Client ID

#### Defined in

[core/auth/PKCEAuthStrategy.ts:24](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L24)

___

### redirectUri

• **redirectUri**: `string`

Redirect URI for OAuth callback

#### Defined in

[core/auth/PKCEAuthStrategy.ts:29](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L29)

___

### scopes

• `Optional` **scopes**: `string`[]

Optional scopes to request

#### Defined in

[core/auth/PKCEAuthStrategy.ts:34](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L34)

___

### authScheme

• `Optional` **authScheme**: ``"popup"`` \| ``"redirect"``

Authentication scheme: 'popup' or 'redirect'

**`Default`**

```ts
'redirect'
```

#### Defined in

[core/auth/PKCEAuthStrategy.ts:40](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L40)

___

### cacheLocation

• `Optional` **cacheLocation**: ``"localStorage"`` \| ``"sessionStorage"``

Cache location: 'localStorage' or 'sessionStorage'

**`Default`**

```ts
'sessionStorage'
```

#### Defined in

[core/auth/PKCEAuthStrategy.ts:46](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L46)

___

### knownAuthorities

• **knownAuthorities**: `string`[]

Known authorities

#### Defined in

[core/auth/PKCEAuthStrategy.ts:51](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L51)

___

### authorityMetadata

• `Optional` **authorityMetadata**: `string`

Authority metadata

#### Defined in

[core/auth/PKCEAuthStrategy.ts:56](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L56)

___

### nextRoute

• `Optional` **nextRoute**: `string`

Next route to navigate to after authentication (used as state parameter)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:61](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L61)

___

### localLogin

• `Optional` **localLogin**: `boolean`

When true, forces local account login instead of federated SSO.

#### Defined in

[core/auth/PKCEAuthStrategy.ts:66](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L66)
