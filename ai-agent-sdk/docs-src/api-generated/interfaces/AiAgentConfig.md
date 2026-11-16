[@egain/ai-agent-sdk API Reference - v0.5.0](../README.md) / AiAgentConfig

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
- [sessionId](AiAgentConfig.md#sessionid)
- [initParams](AiAgentConfig.md#initparams)
- [context](AiAgentConfig.md#context)
- [connector](AiAgentConfig.md#connector)
- [authScheme](AiAgentConfig.md#authscheme)

## Properties

### id

• **id**: `string`

Agent ID

#### Defined in

[core/AiAgent.ts:69](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L69)

___

### endpoint

• **endpoint**: `string`

WebSocket endpoint URL

#### Defined in

[core/AiAgent.ts:74](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L74)

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

[core/AiAgent.ts:84](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L84)

___

### autoConnect

• `Optional` **autoConnect**: `boolean`

Automatically connect after initialize() completes

**`Default`**

```ts
false
```

#### Defined in

[core/AiAgent.ts:90](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L90)

___

### maxQueueSize

• `Optional` **maxQueueSize**: `number`

Maximum queue size

**`Default`**

```ts
1000
```

#### Defined in

[core/AiAgent.ts:96](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L96)

___

### maxReconnectAttempts

• `Optional` **maxReconnectAttempts**: `number`

Maximum reconnection attempts

**`Default`**

```ts
Infinity
```

#### Defined in

[core/AiAgent.ts:102](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L102)

___

### baseReconnectDelay

• `Optional` **baseReconnectDelay**: `number`

Base reconnection delay in milliseconds

**`Default`**

```ts
1000
```

#### Defined in

[core/AiAgent.ts:108](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L108)

___

### maxReconnectDelay

• `Optional` **maxReconnectDelay**: `number`

Maximum reconnection delay in milliseconds

**`Default`**

```ts
30000
```

#### Defined in

[core/AiAgent.ts:114](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L114)

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

[core/AiAgent.ts:121](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L121)

___

### logLevel

• `Optional` **logLevel**: [`LogLevel`](../enums/LogLevel.md)

Logging level for the agent

**`Default`**

```ts
INFO
```

#### Defined in

[core/AiAgent.ts:127](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L127)

___

### enableLogging

• `Optional` **enableLogging**: `boolean`

Enable console output for logs

**`Default`**

```ts
true
```

#### Defined in

[core/AiAgent.ts:133](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L133)

___

### transcriptConfig

• `Optional` **transcriptConfig**: [`TranscriptConfig`](TranscriptConfig.md)

Transcript configuration (optional)
Controls whether and how messages are stored in the transcript

#### Defined in

[core/AiAgent.ts:139](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L139)

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

[core/AiAgent.ts:146](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L146)

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

[core/AiAgent.ts:165](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L165)

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
- `scopes` — comma-separated OAuth scopes to request, used exactly as given (no defaults, no agent `extraScopes`, no platform augmentation). A host-supplied PKCE config's own `scopes` take precedence over this.
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

[core/AiAgent.ts:195](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L195)

___

### context

• `Optional` **context**: `Record`\<`string`, `unknown`\>

Optional initialization context (merged with `initialize({ context })`).
Used for portal/profile auto-select during the portal pipeline and stored for chat reconnect.

#### Defined in

[core/AiAgent.ts:201](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L201)

___

### connector

• `Optional` **connector**: [`AiAgentConnectorConfig`](AiAgentConnectorConfig.md)

Platform connector script URL and environment label from the host (e.g. cc-widget).
When `connectorUrl` is omitted, the SDK loads from `https://apps.egain.services/` using
`initParams.platform` (with `test` mapped to the standalone connector path).

#### Defined in

[core/AiAgent.ts:208](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L208)

___

### authScheme

• `Optional` **authScheme**: ``"popup"`` \| ``"redirect"``

Authentication scheme for the PKCE flow (login and logout).
- 'popup': Opens a popup window for login / logout (default)
- 'redirect': Redirects the current page to the identity provider

Only applies when the SDK auto-builds PKCE config from deployment info.
Ignored when a full PKCEAuthConfig is supplied via `config.auth`.

**`Default`**

```ts
'popup'
```

#### Defined in

[core/AiAgent.ts:219](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L219)
