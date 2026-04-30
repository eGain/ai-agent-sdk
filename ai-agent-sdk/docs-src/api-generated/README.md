@eGainDev/ai-agent-sdk API Reference

# @eGainDev/ai-agent-sdk API Reference - v0.0.14

# @eGainDev/ai-agent-sdk

TypeScript-first SDK for eGain's AI Agent platform.

## Features
- 🔌 WebSocket-based real-time communication
- 📬 Automatic message queuing when offline
- 🔐 Multiple authentication strategies
- 🎯 Type-safe events with full TypeScript support
- 📝 Built-in transcript management
- 🛡️ Comprehensive error handling

## Quick Start

```typescript
import { AiAgent } from "@eGainDev/ai-agent-sdk";

const agent = new AiAgent({
  id: "your-agent-id",
  endpoint: "https://your-endpoint.com",
  auth: { type: "pre-auth", accessToken: "your-access-token" },
  autoConnect: true
});

await agent.initialize();

agent.on("agentMessage", (event) => {
  console.log("Agent:", event.payload.message?.content);
});

await agent.send("Hello!");
```

## Table of contents

### Enumerations

- [ConnectionState](enums/ConnectionState.md)
- [LogLevel](enums/LogLevel.md)

### Core Classes

- [AiAgent](classes/AiAgent.md)

### Events Classes

- [EventEmitter](classes/EventEmitter.md)

### Other Classes

- [ApiHelper](classes/ApiHelper.md)
- [AnonymousAuthStrategy](classes/AnonymousAuthStrategy.md)
- [AuthenticationService](classes/AuthenticationService.md)
- [ClientCredentialsAuthStrategy](classes/ClientCredentialsAuthStrategy.md)
- [PKCEAuthStrategy](classes/PKCEAuthStrategy.md)
- [PreAuthStrategy](classes/PreAuthStrategy.md)
- [Connection](classes/Connection.md)
- [Transport](classes/Transport.md)
- [WebSocketTransport](classes/WebSocketTransport.md)
- [SDKError](classes/SDKError.md)
- [AuthError](classes/AuthError.md)
- [ConnectionError](classes/ConnectionError.md)
- [MessageError](classes/MessageError.md)
- [Logger](classes/Logger.md)
- [Message](classes/Message.md)
- [MessageProcessor](classes/MessageProcessor.md)
- [AgentMessageHandler](classes/AgentMessageHandler.md)
- [ChatHistoryHandler](classes/ChatHistoryHandler.md)
- [ErrorMessageHandler](classes/ErrorMessageHandler.md)
- [HeartbeatHandler](classes/HeartbeatHandler.md)
- [TokenRefreshHandler](classes/TokenRefreshHandler.md)

### Core Interfaces

- [AiAgentConfig](interfaces/AiAgentConfig.md)

### Other Interfaces

- [AgentEventPayloadMap](interfaces/AgentEventPayloadMap.md)
- [AgentEvent](interfaces/AgentEvent.md)
- [AgentEvents](interfaces/AgentEvents.md)
- [CacheConfig](interfaces/CacheConfig.md)
- [ApiHelperConfig](interfaces/ApiHelperConfig.md)
- [UserDetails](interfaces/UserDetails.md)
- [GetUserDetailsOptions](interfaces/GetUserDetailsOptions.md)
- [GetCustomerDetailsOptions](interfaces/GetCustomerDetailsOptions.md)
- [GetAiAgentDetailsOptions](interfaces/GetAiAgentDetailsOptions.md)
- [GetAiAgentSessionOptions](interfaces/GetAiAgentSessionOptions.md)
- [GetPortalDetailsOptions](interfaces/GetPortalDetailsOptions.md)
- [GetConnectedAppsOptions](interfaces/GetConnectedAppsOptions.md)
- [GetPreviousTranscriptOptions](interfaces/GetPreviousTranscriptOptions.md)
- [GetMaskingPatternsOptions](interfaces/GetMaskingPatternsOptions.md)
- [GetMyPortalsOptions](interfaces/GetMyPortalsOptions.md)
- [GetAgentsByPortalOptions](interfaces/GetAgentsByPortalOptions.md)
- [GetUserProfilesOptions](interfaces/GetUserProfilesOptions.md)
- [SelectUserProfileOptions](interfaces/SelectUserProfileOptions.md)
- [AnonymousAuthCacheConfig](interfaces/AnonymousAuthCacheConfig.md)
- [AnonymousAuthConfig](interfaces/AnonymousAuthConfig.md)
- [AuthProvider](interfaces/AuthProvider.md)
- [AuthStrategyInitializeOptions](interfaces/AuthStrategyInitializeOptions.md)
- [AuthStrategy](interfaces/AuthStrategy.md)
- [AnonymousAuthServiceConfig](interfaces/AnonymousAuthServiceConfig.md)
- [PKCEAuthServiceConfig](interfaces/PKCEAuthServiceConfig.md)
- [PreAuthServiceConfig](interfaces/PreAuthServiceConfig.md)
- [ClientCredentialsAuthServiceConfig](interfaces/ClientCredentialsAuthServiceConfig.md)
- [ClientCredentialsAuthConfig](interfaces/ClientCredentialsAuthConfig.md)
- [PKCEAuthConfig](interfaces/PKCEAuthConfig.md)
- [PreAuthConfig](interfaces/PreAuthConfig.md)
- [ConnectionEvents](interfaces/ConnectionEvents.md)
- [ConnectionConfig](interfaces/ConnectionConfig.md)
- [TransportEvents](interfaces/TransportEvents.md)
- [TransportConfig](interfaces/TransportConfig.md)
- [WebSocketTransportConfig](interfaces/WebSocketTransportConfig.md)
- [LoggerConfig](interfaces/LoggerConfig.md)
- [LogEntry](interfaces/LogEntry.md)
- [LoggerEvents](interfaces/LoggerEvents.md)
- [ContextMessageParams](interfaces/ContextMessageParams.md)
- [EscalationMessageParams](interfaces/EscalationMessageParams.md)
- [FeedbackMessageParams](interfaces/FeedbackMessageParams.md)
- [AgentMessageParams](interfaces/AgentMessageParams.md)
- [GracefulDisconnectParams](interfaces/GracefulDisconnectParams.md)
- [MessageObject](interfaces/MessageObject.md)
- [TokenMessageParams](interfaces/TokenMessageParams.md)
- [TokenRefreshHandlerOptions](interfaces/TokenRefreshHandlerOptions.md)
- [MessageData](interfaces/MessageData.md)
- [MessageHandlerResult](interfaces/MessageHandlerResult.md)
- [CallTranscriptEntry](interfaces/CallTranscriptEntry.md)
- [CallerInfo](interfaces/CallerInfo.md)
- [HookContract](interfaces/HookContract.md)
- [PlatformComponentService](interfaces/PlatformComponentService.md)
- [Portal](interfaces/Portal.md)
- [UserProfile](interfaces/UserProfile.md)
- [AgentListItem](interfaces/AgentListItem.md)

### Type Aliases

- [AgentEventType](README.md#agenteventtype)
- [PostAuthenticationCallback](README.md#postauthenticationcallback)
- [AuthenticationType](README.md#authenticationtype)
- [AuthenticationServiceConfig](README.md#authenticationserviceconfig)
- [AuthenticationInput](README.md#authenticationinput)
- [TokenExpiringCallback](README.md#tokenexpiringcallback)
- [Persona](README.md#persona-1)
- [Role](README.md#role-1)

### Variables

- [globalLogger](README.md#globallogger)
- [PERSONA](README.md#persona)
- [ROLE](README.md#role)
- [ERROR\_CODES](README.md#error_codes)

### Functions

- [getLevelName](README.md#getlevelname)
- [getLevelValue](README.md#getlevelvalue)
- [isLevelEnabled](README.md#islevelenabled)
- [createContextMessage](README.md#createcontextmessage)
- [createEscalationMessage](README.md#createescalationmessage)
- [createFeedbackMessage](README.md#createfeedbackmessage)
- [createAgentMessage](README.md#createagentmessage)
- [createGracefulDisconnectMessage](README.md#creategracefuldisconnectmessage)
- [createTokenMessage](README.md#createtokenmessage)

### Features Caching

- [CacheEntry](interfaces/CacheEntry.md)
- [CacheAdapter](interfaces/CacheAdapter.md)
- [MemoryCacheAdapter](classes/MemoryCacheAdapter.md)
- [StorageCacheAdapter](classes/StorageCacheAdapter.md)
- [CacheStorageType](README.md#cachestoragetype)
- [createCacheAdapter](README.md#createcacheadapter)

### Advanced CustomHandlers

- [BaseMessageHandler](classes/BaseMessageHandler.md)

### Features MessageQueue

- [QueuedMessage](interfaces/QueuedMessage.md)
- [MessageQueue](classes/MessageQueue.md)

### Features Transcript

- [TranscriptEntry](interfaces/TranscriptEntry.md)
- [TranscriptConfig](interfaces/TranscriptConfig.md)
- [TranscriptOptions](interfaces/TranscriptOptions.md)
- [Transcript](classes/Transcript.md)

## Type Aliases

### AgentEventType

Ƭ **AgentEventType**: ``"connected"`` \| ``"message"`` \| ``"agentMessage"`` \| ``"errorMessage"`` \| ``"error"`` \| ``"closed"`` \| ``"stateChanged"`` \| ``"queueFlushed"`` \| ``"heartbeat"`` \| ``"tokenExpiring"`` \| ``"transcriptUpdate"`` \| ``"callTranscriptUpdate"`` \| ``"callerInfoUpdate"`` \| ``"conversationIdUpdate"`` \| ``"userContextUpdate"`` \| ``"filterTagsUpdate"`` \| ``"initialized"`` \| ``"portalsAvailable"`` \| ``"agentsAvailable"`` \| ``"profilesAvailable"``

Agent event type identifiers

#### Defined in

[core/AiAgent.ts:212](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L212)

___

### PostAuthenticationCallback

Ƭ **PostAuthenticationCallback**: (`result`: `any`) => `void` \| `Promise`\<`void`\>

Callback function called after authentication is complete
This is called after authenticate() completes successfully

#### Type declaration

▸ (`result`): `void` \| `Promise`\<`void`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `result` | `any` | The authentication result (e.g., token, auth data) of any type |

##### Returns

`void` \| `Promise`\<`void`\>

#### Defined in

[core/auth/AuthStrategy.ts:8](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthStrategy.ts#L8)

___

### AuthenticationType

Ƭ **AuthenticationType**: ``"anonymous"`` \| ``"pkce"`` \| ``"pre-auth"`` \| ``"client-credentials"``

Authentication types supported by the service

#### Defined in

[core/auth/AuthenticationService.ts:16](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L16)

___

### AuthenticationServiceConfig

Ƭ **AuthenticationServiceConfig**: [`AnonymousAuthServiceConfig`](interfaces/AnonymousAuthServiceConfig.md) \| [`PKCEAuthServiceConfig`](interfaces/PKCEAuthServiceConfig.md) \| [`PreAuthServiceConfig`](interfaces/PreAuthServiceConfig.md) \| [`ClientCredentialsAuthServiceConfig`](interfaces/ClientCredentialsAuthServiceConfig.md)

Union type of all authentication service configurations

#### Defined in

[core/auth/AuthenticationService.ts:74](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L74)

___

### AuthenticationInput

Ƭ **AuthenticationInput**: [`AuthenticationServiceConfig`](README.md#authenticationserviceconfig) \| [`AuthProvider`](interfaces/AuthProvider.md) \| [`AuthStrategy`](interfaces/AuthStrategy.md) \| `undefined`

Input types that AuthenticationService can accept
- AuthenticationServiceConfig: Configuration object for automatic strategy selection
- AuthProvider: Custom auth provider implementing getToken()
- AuthStrategy: Full authentication strategy with lifecycle
- undefined: Falls back to anonymous authentication

#### Defined in

[core/auth/AuthenticationService.ts:87](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/AuthenticationService.ts#L87)

___

### TokenExpiringCallback

Ƭ **TokenExpiringCallback**: (`expiresAt`: `number`) => `void`

Callback type for token expiring notification

#### Type declaration

▸ (`expiresAt`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `expiresAt` | `number` |

##### Returns

`void`

#### Defined in

[core/auth/PreAuthStrategy.ts:6](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/auth/PreAuthStrategy.ts#L6)

___

### Persona

Ƭ **Persona**: typeof [`PERSONA`](README.md#persona)[keyof typeof [`PERSONA`](README.md#persona)]

Type definitions for persona values

#### Defined in

[core/message/types.ts:36](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L36)

___

### Role

Ƭ **Role**: typeof [`ROLE`](README.md#role)[keyof typeof [`ROLE`](README.md#role)]

Type definitions for role values

#### Defined in

[core/message/types.ts:41](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L41)

## Variables

### globalLogger

• `Const` **globalLogger**: [`Logger`](classes/Logger.md)

Global logger instance for application-wide logging
Default level: INFO
Default console output: enabled

#### Defined in

[core/logging/globalLogger.ts:9](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/logging/globalLogger.ts#L9)

___

### PERSONA

• `Const` **PERSONA**: `Readonly`\<\{ `METADATA`: ``"metadata"`` = "metadata"; `SYSTEM`: ``"system"`` = "system"; `AGENT`: ``"agent"`` = "agent"; `CUSTOMER`: ``"customer"`` = "customer" }\>

Message type constants

#### Defined in

[core/message/types.ts:4](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L4)

___

### ROLE

• `Const` **ROLE**: `Readonly`\<\{ `STALE_TOKEN`: ``"stale_token"`` = "stale\_token"; `EXPIRED_TOKEN`: ``"expired_token"`` = "expired\_token"; `TOKEN`: ``"token"`` = "token"; `CHAT_HISTORY`: ``"chat history"`` = "chat history"; `ERROR`: ``"error"`` = "error"; `HEARTBEAT`: ``"heartbeat"`` = "heartbeat"; `FOLLOW_UP_QUESTION`: ``"follow up question agent"`` = "follow up question agent"; `CUSTOMER_SUPPORT`: ``"customer support agent"`` = "customer support agent"; `CONTEXT`: ``"context"`` = "context"; `GRACEFUL_DISCONNECT`: ``"graceful disconnect"`` = "graceful disconnect"; `ESCALATION`: ``"escalation"`` = "escalation"; `FEEDBACK`: ``"feedback"`` = "feedback"; `HUMAN`: ``"human"`` = "human" }\>

#### Defined in

[core/message/types.ts:11](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L11)

___

### ERROR\_CODES

• `Const` **ERROR\_CODES**: `Readonly`\<\{ `STALE_TOKEN`: ``"401-012"`` = "401-012"; `UNAUTHORIZED_PREFIX`: ``"401"`` = "401"; `FORBIDDEN_PREFIX`: ``"403"`` = "403" }\>

#### Defined in

[core/message/types.ts:27](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/types.ts#L27)

## Functions

### getLevelName

▸ **getLevelName**(`level`): `string`

Get the string name of a log level

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `level` | [`LogLevel`](enums/LogLevel.md) | The log level |

#### Returns

`string`

The string name of the level

#### Defined in

[core/logging/LogLevel.ts:19](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/logging/LogLevel.ts#L19)

___

### getLevelValue

▸ **getLevelValue**(`level`): `number`

Get the numeric value of a log level

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `level` | [`LogLevel`](enums/LogLevel.md) | The log level |

#### Returns

`number`

The numeric value

#### Defined in

[core/logging/LogLevel.ts:28](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/logging/LogLevel.ts#L28)

___

### isLevelEnabled

▸ **isLevelEnabled**(`level`, `threshold`): `boolean`

Check if a log level is enabled based on the current threshold
A level is enabled if it is greater than or equal to the threshold

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `level` | [`LogLevel`](enums/LogLevel.md) | The log level to check |
| `threshold` | [`LogLevel`](enums/LogLevel.md) | The minimum log level threshold |

#### Returns

`boolean`

True if the level should be logged

#### Defined in

[core/logging/LogLevel.ts:39](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/logging/LogLevel.ts#L39)

___

### createContextMessage

▸ **createContextMessage**(`params`): [`MessageObject`](interfaces/MessageObject.md)

Create a context message object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`ContextMessageParams`](interfaces/ContextMessageParams.md) | Context message parameters |

#### Returns

[`MessageObject`](interfaces/MessageObject.md)

Message object compatible with AiAgent.send()

#### Defined in

[core/message/MessageTypes.ts:90](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/MessageTypes.ts#L90)

___

### createEscalationMessage

▸ **createEscalationMessage**(`params`): [`MessageObject`](interfaces/MessageObject.md)

Create an escalation event message object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`EscalationMessageParams`](interfaces/EscalationMessageParams.md) | Escalation message parameters |

#### Returns

[`MessageObject`](interfaces/MessageObject.md)

Message object compatible with AiAgent.send()

#### Defined in

[core/message/MessageTypes.ts:109](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/MessageTypes.ts#L109)

___

### createFeedbackMessage

▸ **createFeedbackMessage**(`params`): [`MessageObject`](interfaces/MessageObject.md)

Create a feedback message object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`FeedbackMessageParams`](interfaces/FeedbackMessageParams.md) | Feedback message parameters |

#### Returns

[`MessageObject`](interfaces/MessageObject.md)

Message object compatible with AiAgent.send()

#### Defined in

[core/message/MessageTypes.ts:128](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/MessageTypes.ts#L128)

___

### createAgentMessage

▸ **createAgentMessage**(`params`): [`MessageObject`](interfaces/MessageObject.md)

Create a normal customer/agent message object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AgentMessageParams`](interfaces/AgentMessageParams.md) | Agent message parameters |

#### Returns

[`MessageObject`](interfaces/MessageObject.md)

Message object compatible with AiAgent.send()

#### Defined in

[core/message/MessageTypes.ts:149](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/MessageTypes.ts#L149)

___

### createGracefulDisconnectMessage

▸ **createGracefulDisconnectMessage**(`params?`): [`MessageObject`](interfaces/MessageObject.md)

Create a graceful disconnect message object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params?` | [`GracefulDisconnectParams`](interfaces/GracefulDisconnectParams.md) | Optional graceful disconnect parameters |

#### Returns

[`MessageObject`](interfaces/MessageObject.md)

Message object compatible with AiAgent.send()

#### Defined in

[core/message/MessageTypes.ts:165](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/MessageTypes.ts#L165)

___

### createTokenMessage

▸ **createTokenMessage**(`params`): [`MessageObject`](interfaces/MessageObject.md)

Create a token message object for authentication
Used to send authentication token to the agent after connection is established

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`TokenMessageParams`](interfaces/TokenMessageParams.md) | Token message parameters |

#### Returns

[`MessageObject`](interfaces/MessageObject.md)

Message object compatible with AiAgent.send()

#### Defined in

[core/message/MessageTypes.ts:191](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/message/MessageTypes.ts#L191)

## Features Caching

• **CacheEntry**\<`T`\>: `Object`

Cache entry with timestamp for TTL support.

**`Example`**

```typescript
const entry: CacheEntry<UserData> = {
  value: { userId: "123", name: "John" },
  timestamp: Date.now()
};
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[core/api/CacheAdapter.ts:109](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/CacheAdapter.ts#L109)

• **CacheAdapter**: `Object`

Cache adapter interface for implementing custom storage backends.

Implement this interface to create custom cache adapters for Redis, 
IndexedDB, or other storage systems.

**`Example`**

```typescript
class CustomCacheAdapter implements CacheAdapter {
  private store = new Map<string, string>();
  
  get<T>(key: string): CacheEntry<T> | null {
    const data = this.store.get(key);
    return data ? JSON.parse(data) : null;
  }
  
  set<T>(key: string, entry: CacheEntry<T>): void {
    this.store.set(key, JSON.stringify(entry));
  }
  
  delete(key: string): void {
    this.store.delete(key);
  }
  
  clear(prefix?: string): void {
    if (prefix) {
      for (const key of this.store.keys()) {
        if (key.startsWith(prefix)) this.store.delete(key);
      }
    } else {
      this.store.clear();
    }
  }
  
  keys(prefix?: string): string[] {
    const allKeys = Array.from(this.store.keys());
    return prefix ? allKeys.filter(k => k.startsWith(prefix)) : allKeys;
  }
}
```

#### Defined in

[core/api/CacheAdapter.ts:160](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/CacheAdapter.ts#L160)

• **MemoryCacheAdapter**: `Object`

In-memory cache adapter for Node.js environments.

Uses a JavaScript Map for storage. Data persists only for the lifetime
of the process. Suitable for server-side applications and testing.

**`Example`**

```typescript
const cache = new MemoryCacheAdapter();

// Store a value
cache.set('user:123', { 
  value: { name: 'John' }, 
  timestamp: Date.now() 
});

// Retrieve the value
const entry = cache.get<{ name: string }>('user:123');
console.log(entry?.value.name); // "John"
```

#### Defined in

[core/api/CacheAdapter.ts:219](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/CacheAdapter.ts#L219)

• **StorageCacheAdapter**: `Object`

Browser storage cache adapter using localStorage or sessionStorage.

Automatically serializes values to JSON for storage. Falls back gracefully
if storage is unavailable or full.

**`Example`**

```typescript
// Use sessionStorage (cleared when tab closes)
const sessionCache = new StorageCacheAdapter('session');

// Use localStorage (persistent)
const localCache = new StorageCacheAdapter('local');

// Store data
sessionCache.set('config', { 
  value: { theme: 'dark' }, 
  timestamp: Date.now() 
});
```

#### Defined in

[core/api/CacheAdapter.ts:283](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/CacheAdapter.ts#L283)

### CacheStorageType

Ƭ **CacheStorageType**: ``"local"`` \| ``"session"`` \| ``"memory"``

Cache storage type options.

- `local`: Browser localStorage (persistent across sessions)
- `session`: Browser sessionStorage (cleared when tab closes)
- `memory`: In-memory storage (cleared when process ends)

#### Defined in

[core/api/CacheAdapter.ts:367](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/CacheAdapter.ts#L367)

___

### createCacheAdapter

▸ **createCacheAdapter**(`storageType?`): [`CacheAdapter`](interfaces/CacheAdapter.md)

Factory function to create the appropriate cache adapter based on environment.

Automatically detects the environment and creates the best available adapter:
- In browsers: Creates StorageCacheAdapter (with fallback to memory if storage unavailable)
- In Node.js: Creates MemoryCacheAdapter

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `storageType` | [`CacheStorageType`](README.md#cachestoragetype) | `'session'` | The preferred storage type |

#### Returns

[`CacheAdapter`](interfaces/CacheAdapter.md)

The appropriate cache adapter for the environment

**`Example`**

```typescript
// Auto-detect best adapter
const cache = createCacheAdapter();

// Force memory adapter
const memoryCache = createCacheAdapter('memory');

// Use localStorage in browser
const persistentCache = createCacheAdapter('local');
```

#### Defined in

[core/api/CacheAdapter.ts:394](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/api/CacheAdapter.ts#L394)
