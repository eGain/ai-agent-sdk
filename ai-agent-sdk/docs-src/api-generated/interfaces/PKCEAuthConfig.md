[@egain/ai-agent-sdk API Reference - v0.1.2](../README.md) / PKCEAuthConfig

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

[core/auth/PKCEAuthStrategy.ts:12](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L12)

___

### tokenUrl

• `Optional` **tokenUrl**: `string`

Token endpoint URL (not used directly by MSAL, but kept for compatibility)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:17](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L17)

___

### clientId

• **clientId**: `string`

Client ID

#### Defined in

[core/auth/PKCEAuthStrategy.ts:22](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L22)

___

### redirectUri

• **redirectUri**: `string`

Redirect URI for OAuth callback

#### Defined in

[core/auth/PKCEAuthStrategy.ts:27](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L27)

___

### scopes

• `Optional` **scopes**: `string`[]

Optional scopes to request

#### Defined in

[core/auth/PKCEAuthStrategy.ts:32](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L32)

___

### authScheme

• `Optional` **authScheme**: ``"popup"`` \| ``"redirect"``

Authentication scheme: 'popup' or 'redirect'

**`Default`**

```ts
'redirect'
```

#### Defined in

[core/auth/PKCEAuthStrategy.ts:38](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L38)

___

### cacheLocation

• `Optional` **cacheLocation**: ``"localStorage"`` \| ``"sessionStorage"``

Cache location: 'localStorage' or 'sessionStorage'

**`Default`**

```ts
'sessionStorage'
```

#### Defined in

[core/auth/PKCEAuthStrategy.ts:44](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L44)

___

### knownAuthorities

• **knownAuthorities**: `string`[]

Known authorities

#### Defined in

[core/auth/PKCEAuthStrategy.ts:49](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L49)

___

### authorityMetadata

• `Optional` **authorityMetadata**: `string`

Authority metadata

#### Defined in

[core/auth/PKCEAuthStrategy.ts:54](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L54)

___

### nextRoute

• `Optional` **nextRoute**: `string`

Next route to navigate to after authentication (used as state parameter)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:59](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L59)

___

### localLogin

• `Optional` **localLogin**: `boolean`

When true, forces local account login instead of federated SSO.

#### Defined in

[core/auth/PKCEAuthStrategy.ts:64](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L64)
