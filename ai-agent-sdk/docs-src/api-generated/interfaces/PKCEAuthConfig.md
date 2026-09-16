[@egain/ai-agent-sdk API Reference - v0.2.5-beta.0](../README.md) / PKCEAuthConfig

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

[core/auth/PKCEAuthStrategy.ts:18](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L18)

___

### tokenUrl

• `Optional` **tokenUrl**: `string`

Token endpoint URL (not used directly by MSAL, but kept for compatibility)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:23](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L23)

___

### clientId

• **clientId**: `string`

Client ID

#### Defined in

[core/auth/PKCEAuthStrategy.ts:28](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L28)

___

### redirectUri

• **redirectUri**: `string`

Redirect URI for OAuth callback

#### Defined in

[core/auth/PKCEAuthStrategy.ts:33](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L33)

___

### scopes

• `Optional` **scopes**: `string`[]

Optional scopes to request

#### Defined in

[core/auth/PKCEAuthStrategy.ts:38](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L38)

___

### authScheme

• `Optional` **authScheme**: ``"popup"`` \| ``"redirect"``

Authentication scheme: 'popup' or 'redirect'. Login and logout use the same scheme.

**`Default`**

```ts
'redirect'
```

#### Defined in

[core/auth/PKCEAuthStrategy.ts:44](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L44)

___

### cacheLocation

• `Optional` **cacheLocation**: ``"localStorage"`` \| ``"sessionStorage"``

Cache location: 'localStorage' or 'sessionStorage'

**`Default`**

```ts
'sessionStorage'
```

#### Defined in

[core/auth/PKCEAuthStrategy.ts:50](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L50)

___

### knownAuthorities

• **knownAuthorities**: `string`[]

Known authorities

#### Defined in

[core/auth/PKCEAuthStrategy.ts:55](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L55)

___

### authorityMetadata

• `Optional` **authorityMetadata**: `string`

Authority metadata

#### Defined in

[core/auth/PKCEAuthStrategy.ts:60](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L60)

___

### nextRoute

• `Optional` **nextRoute**: `string`

Return URL after redirect login or logout (OAuth `state`). Hash is stripped
before it is sent. Popup omits `state` so `auth-redirect.html` does not bounce
the popup to the app. Redirect logout uses this, else `window.location.href`.

#### Defined in

[core/auth/PKCEAuthStrategy.ts:67](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L67)

___

### localLogin

• `Optional` **localLogin**: `boolean`

When true, forces local account login instead of federated SSO.

#### Defined in

[core/auth/PKCEAuthStrategy.ts:72](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L72)
