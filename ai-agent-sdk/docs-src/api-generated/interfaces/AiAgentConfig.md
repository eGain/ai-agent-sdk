[@egain/ai-agent-sdk API Reference - v0.1.3](../README.md) / AiAgentConfig

# Interface: AiAgentConfig

Configuration options for creating an AiAgent instance.

**`Example`**

```typescript
const config: AiAgentConfig = {
  id: "123-456-789",
  endpoint: "https://api.egain.com",
  auth: { type: "pre-auth", accessToken: "your-access-token" },
  autoConnect: true,
  logLevel: LogLevel.DEBUG
};
```

## Table of contents

### Properties

- [id](AiAgentConfig.md#id)
- [endpoint](AiAgentConfig.md#endpoint)
- [auth](AiAgentConfig.md#auth)
- [autoConnect](AiAgentConfig.md#autoconnect)
- [maxQueueSize](AiAgentConfig.md#maxqueuesize)
- [maxReconnectAttempts](AiAgentConfig.md#maxreconnectattempts)
- [baseReconnectDelay](AiAgentConfig.md#basereconnectdelay)
- [maxReconnectDelay](AiAgentConfig.md#maxreconnectdelay)
- [logger](AiAgentConfig.md#logger)
- [logLevel](AiAgentConfig.md#loglevel)
- [enableLogging](AiAgentConfig.md#enablelogging)
- [transcriptConfig](AiAgentConfig.md#transcriptconfig)
- [cache](AiAgentConfig.md#cache)
- [scopes](AiAgentConfig.md#scopes)
- [sessionId](AiAgentConfig.md#sessionid)
- [initParams](AiAgentConfig.md#initparams)
- [platformScriptUrl](AiAgentConfig.md#platformscripturl)
- [authScheme](AiAgentConfig.md#authscheme)

## Properties

### id

• **id**: `string`

Agent ID

#### Defined in

[core/AiAgent.ts:46](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L46)

___

### endpoint

• **endpoint**: `string`

WebSocket endpoint URL

#### Defined in

[core/AiAgent.ts:51](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L51)

___

### auth

• `Optional` **auth**: [`AuthenticationInput`](../README.md#authenticationinput)

Authentication configuration (optional)
Can be:
- AuthenticationServiceConfig: Configuration object (e.g., { type: 'pre-auth', accessToken: '...' })
- AuthProvider: Custom auth provider implementing getToken()
- AuthStrategy: Full authentication strategy with lifecycle
- undefined: Falls back to anonymous authentication

#### Defined in

[core/AiAgent.ts:61](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L61)

___

### autoConnect

• `Optional` **autoConnect**: `boolean`

Automatically connect after initialize() completes

**`Default`**

```ts
false
```

#### Defined in

[core/AiAgent.ts:67](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L67)

___

### maxQueueSize

• `Optional` **maxQueueSize**: `number`

Maximum queue size

**`Default`**

```ts
1000
```

#### Defined in

[core/AiAgent.ts:73](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L73)

___

### maxReconnectAttempts

• `Optional` **maxReconnectAttempts**: `number`

Maximum reconnection attempts

**`Default`**

```ts
Infinity
```

#### Defined in

[core/AiAgent.ts:79](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L79)

___

### baseReconnectDelay

• `Optional` **baseReconnectDelay**: `number`

Base reconnection delay in milliseconds

**`Default`**

```ts
1000
```

#### Defined in

[core/AiAgent.ts:85](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L85)

___

### maxReconnectDelay

• `Optional` **maxReconnectDelay**: `number`

Maximum reconnection delay in milliseconds

**`Default`**

```ts
30000
```

#### Defined in

[core/AiAgent.ts:91](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L91)

___

### logger

• `Optional` **logger**: [`Logger`](../classes/Logger.md)

Logger instance (optional)
If not provided, a new logger instance will be created

**`Default`**

```ts
undefined (creates new instance)
```

#### Defined in

[core/AiAgent.ts:98](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L98)

___

### logLevel

• `Optional` **logLevel**: [`LogLevel`](../enums/LogLevel.md)

Logging level for the agent

**`Default`**

```ts
INFO
```

#### Defined in

[core/AiAgent.ts:104](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L104)

___

### enableLogging

• `Optional` **enableLogging**: `boolean`

Enable console output for logs

**`Default`**

```ts
true
```

#### Defined in

[core/AiAgent.ts:110](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L110)

___

### transcriptConfig

• `Optional` **transcriptConfig**: [`TranscriptConfig`](TranscriptConfig.md)

Transcript configuration (optional)
Controls whether and how messages are stored in the transcript

#### Defined in

[core/AiAgent.ts:116](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L116)

___

### cache

• `Optional` **cache**: [`CacheConfig`](CacheConfig.md)

Cache configuration for API calls (optional)
Controls caching of agent details, portal details, and other API responses

**`Default`**

```ts
{ enabled: true, storageType: 'session', ttl: 300000 }
```

#### Defined in

[core/AiAgent.ts:123](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L123)

___

### scopes

• `Optional` **scopes**: `string`[]

Custom OAuth scopes to request during authentication (optional)
If not provided, default scopes will be used:
- ["knowledge.portalmgr.manage", "core.aiservices.read"] for agents
- ["knowledge.portalmgr.manage", "core.aiservices.read", "core.customermgr.read"] for customers

You can provide additional scopes to extend the default ones, or replace them entirely.

**`Example`**

```typescript
// Add additional scopes
scopes: ["knowledge.portalmgr.manage", "core.aiservices.read", "custom.scope"]
```

#### Defined in

[core/AiAgent.ts:138](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L138)

___

### sessionId

• `Optional` **sessionId**: `string` \| `number`

Pre-provided session ID (optional)
If provided, the SDK will skip fetching sessionId from the network during initialization.
Useful when you already have a session ID from a previous session or external source.

**`Default`**

```ts
undefined (fetches from network)
```

**`Example`**

```typescript
// Use existing sessionId (skips network fetch)
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://api.egain.com",
  sessionId: "existing-session-id"
});
```

#### Defined in

[core/AiAgent.ts:157](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L157)

___

### initParams

• `Optional` **initParams**: `Record`\<`string`, `string`\>

Initialization parameters forwarded from the host application.
SDK consumers pass them explicitly so the SDK remains URL-agnostic.

The SDK uses specific well-known keys internally:
- `agentid` — when set and Flow A (`isDefaultAgent` is not `"true"`), portals are intersected with `agentDetails.portals` (cc-widget parity)
- `departmentId` — optional fallback in Flow B when `agentDetails.departmentId` is missing; prefer agent details from the default agent API (cc-widget parity)
- `portalIds` — comma-separated portal IDs; when set, skips `getMyPortals` and uses minimal portal objects
- `templateName` — alias for theme short URL template sent as `shortUrlTemplate` to portalmgr APIs
- `authType` — signals the authentication mode ("user" | "customer")
- `scopes` — comma-separated OAuth scopes to request; when non-empty after parsing, **overrides** `config.scopes` and default scopes for PKCE / token acquisition
- `userid` — user identifier for portal cache keying
- `isDefaultAgent` — when "true", enables Flow B (agent selection mode)

All other keys are stored and accessible via `agent.getInitParams()`
for use by the consuming application.

**`Example`**

```typescript
initParams: {
  agentid: "agent-123",
  userid: "user-456",
  authType: "user",
  isDefaultAgent: "true",
  scopes: "knowledge.portalmgr.manage,core.aiservices.read"
}
```

#### Defined in

[core/AiAgent.ts:187](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L187)

___

### platformScriptUrl

• `Optional` **platformScriptUrl**: `string`

Override URL for the platform connector script.
When provided, the SDK loads this URL instead of constructing one
from the platform name and deployment environment.
Useful for local development or custom connector deployments.

#### Defined in

[core/AiAgent.ts:195](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L195)

___

### authScheme

• `Optional` **authScheme**: ``"popup"`` \| ``"redirect"``

Authentication scheme for the PKCE flow.
- 'popup': Opens a popup window for login (default)
- 'redirect': Redirects the current page to the identity provider

Only applies when the SDK auto-builds PKCE config from deployment info.
Ignored when a full PKCEAuthConfig is supplied via `config.auth`.

**`Default`**

```ts
'popup'
```

#### Defined in

[core/AiAgent.ts:206](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L206)
