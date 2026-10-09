[@egain/ai-agent-sdk API Reference - v0.3.0](../README.md) / PKCEAuthConfig

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

[core/auth/PKCEAuthStrategy.ts:27](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L27)

___

### tokenUrl

• `Optional` **tokenUrl**: `string`

Token endpoint URL (not used directly by MSAL, but kept for compatibility)

#### Defined in

[core/auth/PKCEAuthStrategy.ts:32](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L32)

___

### clientId

• **clientId**: `string`

Client ID

#### Defined in

[core/auth/PKCEAuthStrategy.ts:37](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L37)

___

### redirectUri

• **redirectUri**: `string`

Redirect URI for OAuth callback

#### Defined in

[core/auth/PKCEAuthStrategy.ts:42](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L42)

___

### scopes

• `Optional` **scopes**: `string`[]

Optional scopes to request

#### Defined in

[core/auth/PKCEAuthStrategy.ts:47](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L47)

___

### authScheme

• `Optional` **authScheme**: ``"popup"`` \| ``"redirect"``

Authentication scheme: 'popup' or 'redirect'. Login and logout use the same scheme.

**`Default`**

```ts
'redirect'
```

#### Defined in

[core/auth/PKCEAuthStrategy.ts:53](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L53)

___

### cacheLocation

• `Optional` **cacheLocation**: ``"localStorage"`` \| ``"sessionStorage"``

Cache location: 'localStorage' or 'sessionStorage'

**`Default`**

```ts
'sessionStorage'
```

#### Defined in

[core/auth/PKCEAuthStrategy.ts:59](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L59)

___

### knownAuthorities

• **knownAuthorities**: `string`[]

Known authorities

#### Defined in

[core/auth/PKCEAuthStrategy.ts:64](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L64)

___

### authorityMetadata

• `Optional` **authorityMetadata**: `string`

Authority metadata

#### Defined in

[core/auth/PKCEAuthStrategy.ts:69](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L69)

___

### nextRoute

• `Optional` **nextRoute**: `string`

Return URL after redirect login or logout (OAuth `state`). Hash is stripped
before it is sent. Popup omits `state` so `auth-redirect.html` does not bounce
the popup to the app. Redirect logout uses this, else `window.location.href`.

#### Defined in

[core/auth/PKCEAuthStrategy.ts:76](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L76)

___

### localLogin

• `Optional` **localLogin**: `boolean`

When true, forces local account login instead of federated SSO.

#### Defined in

[core/auth/PKCEAuthStrategy.ts:81](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/auth/PKCEAuthStrategy.ts#L81)
