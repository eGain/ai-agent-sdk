[@eGainDev/ai-agent-sdk API Reference - v0.0.13](../README.md) / AiAgent

# Class: AiAgent

Main class for interacting with the eGain AI Agent platform.

The AiAgent class provides:
- WebSocket connection management with automatic reconnection
- Message queuing when offline
- Event-driven communication
- Transcript management
- Context persistence

**Initialization flows**

After authentication, one of two paths runs:

- **Direct flow** (non–contact-center agents): fetches session, creates the WebSocket connection,
  emits `initialized`. With [AiAgentConfig.autoConnect](../interfaces/AiAgentConfig.md#autoconnect), `connect()` runs automatically.
- **Contact Center (CC) flow** (contact-center agents, per API `agentType` / authenticated agents
  with legacy empty type): runs a REST-only portal → (optional agent) → profile pipeline, then
  emits `initialized`. The WebSocket is created when you call `connect()` (or automatically if
  `autoConnect` is true after the pipeline completes).

**Flow A (specific agent)** — Use the target agent ID in [AiAgentConfig.id](../interfaces/AiAgentConfig.md#id). CC pipeline:
portal selection → profile selection.

**Flow B (default agent / agent selection)** — Set `initParams: { isDefaultAgent: "true" }`.
CC pipeline: portal → agent → profile. The selected agent becomes the chat identity
(`resolvedAgentId`); subsequent session and chat use that ID, not the bootstrap `config.id`.

When the CC pipeline has multiple options at a step, it emits `portalsAvailable`,
`agentsAvailable`, or `profilesAvailable`. Call [AiAgent.selectPortal](AiAgent.md#selectportal),
[AiAgent.selectAgent](AiAgent.md#selectagent), or [AiAgent.selectUserProfile](AiAgent.md#selectuserprofile) to continue. After the
`initialized` event, call [AiAgent.connect](AiAgent.md#connect) unless `autoConnect` already connected you.

**`Example`**

```typescript
import { AiAgent } from "@eGainDev/ai-agent-sdk";

const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://api.egain.com",
  auth: { type: "pre-auth", accessToken: "your-access-token" },
  autoConnect: true,
});

agent.on("agentMessage", (event) => {
  console.log("Agent:", event.payload.message?.content);
});

await agent.initialize();
await agent.send("Hello!");
```

**`Example`**

```typescript
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://api.egain.com",
  auth: { type: "pkce", config: { ... } },
  initParams: { userid: "user-123" },
});

agent.on("portalsAvailable", (e) => agent.selectPortal(e.payload.portals[0]));
agent.on("agentsAvailable", (e) => agent.selectAgent(e.payload.agents[0]));
agent.on("profilesAvailable", (e) => agent.selectUserProfile(e.payload.profiles[0]));
agent.on("initialized", async () => {
  await agent.connect();
});
await agent.initialize();
```

**`Example`**

```typescript
import { AiAgent, createContextMessage } from "@eGainDev/ai-agent-sdk";

await agent.send(createContextMessage({
  context: { userId: "123", accountType: "premium" },
}));
```

**`See`**

 - [AiAgentConfig](../interfaces/AiAgentConfig.md) for configuration options
 - [AgentEvents](../interfaces/AgentEvents.md) for available events

## Hierarchy

- [`EventEmitter`](EventEmitter.md)\<[`AgentEvents`](../interfaces/AgentEvents.md)\>

  ↳ **`AiAgent`**

## Table of contents

### Constructors

- [constructor](AiAgent.md#constructor)

### Properties

- [logger](AiAgent.md#logger)

### Methods

- [initialize](AiAgent.md#initialize)
- [getAgentDetails](AiAgent.md#getagentdetails)
- [getDeploymentInfo](AiAgent.md#getdeploymentinfo)
- [getIsInitialized](AiAgent.md#getisinitialized)
- [getState](AiAgent.md#getstate)
- [isConnected](AiAgent.md#isconnected)
- [connect](AiAgent.md#connect)
- [disconnect](AiAgent.md#disconnect)
- [selectPortal](AiAgent.md#selectportal)
- [selectAgent](AiAgent.md#selectagent)
- [selectUserProfile](AiAgent.md#selectuserprofile)
- [getInitParams](AiAgent.md#getinitparams)
- [restartPortalInitializer](AiAgent.md#restartportalinitializer)
- [restartCcWidgetInitializer](AiAgent.md#restartccwidgetinitializer)
- [updateUserProfile](AiAgent.md#updateuserprofile)
- [restartConnection](AiAgent.md#restartconnection)
- [send](AiAgent.md#send)
- [getQueueSize](AiAgent.md#getqueuesize)
- [clearQueue](AiAgent.md#clearqueue)
- [getTranscript](AiAgent.md#gettranscript)
- [getTranscriptAsJSON](AiAgent.md#gettranscriptasjson)
- [getTranscriptSize](AiAgent.md#gettranscriptsize)
- [clearTranscript](AiAgent.md#cleartranscript)
- [getCallTranscript](AiAgent.md#getcalltranscript)
- [getCallerInfo](AiAgent.md#getcallerinfo)
- [getUserDetails](AiAgent.md#getuserdetails)
- [getConversationId](AiAgent.md#getconversationid)
- [clearCallTranscript](AiAgent.md#clearcalltranscript)
- [getContext](AiAgent.md#getcontext)
- [removeContext](AiAgent.md#removecontext)
- [setContext](AiAgent.md#setcontext)
- [resetContext](AiAgent.md#resetcontext)
- [getMessageProcessor](AiAgent.md#getmessageprocessor)
- [getAccessToken](AiAgent.md#getaccesstoken)
- [updateAccessToken](AiAgent.md#updateaccesstoken)
- [setSessionId](AiAgent.md#setsessionid)
- [on](AiAgent.md#on)
- [once](AiAgent.md#once)
- [off](AiAgent.md#off)
- [removeAllListeners](AiAgent.md#removealllisteners)
- [listenerCount](AiAgent.md#listenercount)

## Constructors

### constructor

• **new AiAgent**(`config`): [`AiAgent`](AiAgent.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`AiAgentConfig`](../interfaces/AiAgentConfig.md) |

#### Returns

[`AiAgent`](AiAgent.md)

#### Overrides

[EventEmitter](EventEmitter.md).[constructor](EventEmitter.md#constructor)

#### Defined in

[core/AiAgent.ts:549](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L549)

## Properties

### logger

• **logger**: [`Logger`](Logger.md)

#### Defined in

[core/AiAgent.ts:523](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L523)

## Methods

### initialize

▸ **initialize**(): `Promise`\<`void`\>

Initialize the agent. Must be called after construction and awaited before use.

Authenticates (falls back to [AnonymousAuthStrategy](AnonymousAuthStrategy.md) if no auth is configured), then:

- **Direct flow:** fetches session, creates the WebSocket connection, emits `initialized`.
  With `autoConnect`, opens the WebSocket automatically.
- **Contact Center flow:** runs portal / agent / profile selection over REST only (no WebSocket
  yet). May emit `portalsAvailable`, `agentsAvailable`, or `profilesAvailable` — call the
  corresponding `select*` method. Then emits `initialized`. Call [AiAgent.connect](AiAgent.md#connect)
  afterward (or rely on `autoConnect` after the pipeline completes).

#### Returns

`Promise`\<`void`\>

**`Example`**

```typescript
const agent = new AiAgent({ id: 'agent-id', endpoint: 'https://...' });
await agent.initialize();
// Direct flow: often already connected if autoConnect. CC flow: connect after `initialized`.
await agent.connect();
```

#### Defined in

[core/AiAgent.ts:727](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L727)

___

### getAgentDetails

▸ **getAgentDetails**(): `Promise`\<`any`\>

Get the agent details
Returns cached agent details if available, otherwise fetches from network.
If called before initialize(), performs minimal initialization to fetch agent details only
(gets deployment info, fetches anonymous token, fetches agent details - without getting session ID or creating connection).

#### Returns

`Promise`\<`any`\>

Promise resolving to the agent details

#### Defined in

[core/AiAgent.ts:1184](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1184)

___

### getDeploymentInfo

▸ **getDeploymentInfo**(): `Promise`\<`any`\>

Get the deployment information
Returns cached deployment info if available, otherwise fetches from network.
Does not require initialization - only needs the endpoint URL.

#### Returns

`Promise`\<`any`\>

Promise resolving to the deployment information

#### Defined in

[core/AiAgent.ts:1233](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1233)

___

### getIsInitialized

▸ **getIsInitialized**(): `boolean`

Whether the agent has completed initialization.
Becomes `true` after the init pipeline completes (e.g. after the `initialized` event).

#### Returns

`boolean`

`true` if initialized, `false` otherwise

**`Example`**

```typescript
if (agent.getIsInitialized()) {
  await agent.connect();
} else {
  agent.once('initialized', () => agent.connect());
}
```

#### Defined in

[core/AiAgent.ts:1339](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1339)

___

### getState

▸ **getState**(): [`ConnectionState`](../enums/ConnectionState.md)

Get current connection state.

#### Returns

[`ConnectionState`](../enums/ConnectionState.md)

The current connection state

**`Throws`**

Error if agent is not initialized

**`Example`**

```typescript
const state = agent.getState();
if (state === ConnectionState.CONNECTED) {
  console.log("Ready to send messages");
}
```

**`See`**

[ConnectionState](../enums/ConnectionState.md) for available states

#### Defined in

[core/AiAgent.ts:1359](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1359)

___

### isConnected

▸ **isConnected**(): `boolean`

Check if the agent is currently connected.

#### Returns

`boolean`

`true` if connected, `false` otherwise

**`Example`**

```typescript
if (agent.isConnected()) {
  await agent.send("Hello!");
} else {
  console.log("Waiting for connection...");
}
```

#### Defined in

[core/AiAgent.ts:1382](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1382)

___

### connect

▸ **connect**(): `Promise`\<`void`\>

Connect to the agent endpoint.

Establishes a WebSocket connection to the AI Agent server. Must call [initialize](AiAgent.md#initialize) first.

For Contact Center agents, the connection object is created lazily on this call (session fetch
uses the resolved agent ID, including Flow B after agent selection).

#### Returns

`Promise`\<`void`\>

**`Throws`**

Error if agent is not initialized

**`Example`**

```typescript
await agent.initialize();
await agent.connect();
console.log("Connected!");
```

#### Defined in

[core/AiAgent.ts:1403](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1403)

___

### disconnect

▸ **disconnect**(`options?`): `Promise`\<`void`\>

Disconnect from the agent endpoint.

By default, sends a graceful disconnect message before closing the connection.
Use `skipGracefulDisconnect: true` for immediate disconnection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `Object` | Disconnect options |
| `options.skipGracefulDisconnect?` | `boolean` | If true, skip sending graceful disconnect message |

#### Returns

`Promise`\<`void`\>

**`Example`**

```typescript
await agent.disconnect();
```

**`Example`**

```typescript
await agent.disconnect({ skipGracefulDisconnect: true });
```

#### Defined in

[core/AiAgent.ts:1461](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1461)

___

### selectPortal

▸ **selectPortal**(`portal`): `void`

Select a portal (CC flow). Call when portalsAvailable event is emitted and user has chosen.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `portal` | [`Portal`](../interfaces/Portal.md) | The selected portal |

#### Returns

`void`

**`Throws`**

Error if portal initializer is not active

**`Example`**

```typescript
agent.on('portalsAvailable', (e) => {
  const portal = showPortalPicker(e.payload.portals);
  agent.selectPortal(portal);
});
```

#### Defined in

[core/AiAgent.ts:1503](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1503)

___

### selectAgent

▸ **selectAgent**(`agent`): `void`

Select an agent (Flow B only — `initParams.isDefaultAgent === "true"`).
Call when `agentsAvailable` is emitted and the user has chosen.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `agent` | [`AgentListItem`](../interfaces/AgentListItem.md) | The selected agent |

#### Returns

`void`

**`Throws`**

Error if portal initializer is not active

**`Example`**

```typescript
agent.on('agentsAvailable', (e) => {
  const selected = showAgentPicker(e.payload.agents);
  agent.selectAgent(selected);
});
```

#### Defined in

[core/AiAgent.ts:1525](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1525)

___

### selectUserProfile

▸ **selectUserProfile**(`profile`): `void`

Select a user profile (CC flow). Call when profilesAvailable event is emitted and user has chosen.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profile` | [`UserProfile`](../interfaces/UserProfile.md) | The selected profile |

#### Returns

`void`

**`Throws`**

Error if portal initializer is not active

**`Example`**

```typescript
agent.on('profilesAvailable', (e) => {
  const profile = showProfilePicker(e.payload.profiles);
  agent.selectUserProfile(profile);
});
```

#### Defined in

[core/AiAgent.ts:1546](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1546)

___

### getInitParams

▸ **getInitParams**(): `Record`\<`string`, `string`\>

Get the stored initialization parameters from config.

#### Returns

`Record`\<`string`, `string`\>

The init params object (empty object if none provided)

**`Example`**

```typescript
const initParams = agent.getInitParams();
const userId = initParams.userid;
```

#### Defined in

[core/AiAgent.ts:1564](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1564)

___

### restartPortalInitializer

▸ **restartPortalInitializer**(): `Promise`\<`void`\>

Restart the CC widget initialization pipeline from scratch.

This method tears down the current initialization state and re-runs the
full pipeline (portal selection → agent selection → profile selection),
allowing the consumer to make new selections. After completion, the
`initialized` event fires again and the consumer should call `connect()`.

**What it does:**
1. Checks `completedPortalPipeline`: if false (non-CC agent), delegates to `restartConnection()` and returns
2. Destroys the current `PortalInitializer` instance (rejects any pending gating promises)
3. Disconnects the current WebSocket connection (if any) and clears session, queue, transcript
4. Resets `resolvedAgentId` to `config.id` and `isInitialized` to false
5. Re-obtains an auth token and calls `onAuthComplete` to restart the pipeline (or direct flow)

**Important:** For agents that completed the CC initialization pipeline
(portal → agent → profile selection), this re-runs the full pipeline.
For agents that did not complete it (e.g. direct flow from the start, or
contact-center agents that fell back to direct flow because they have no
portals), this method delegates to `restartConnection()` so the consumer
can call it for any restart without branching. The consumer must
re-register or still have active event listeners for `portalsAvailable`,
`agentsAvailable`, `profilesAvailable`, and `initialized` before calling
this method (CC pipeline path only).

#### Returns

`Promise`\<`void`\>

**`Throws`**

Error if authentication token cannot be obtained (CC path) or for restart (direct path)

**`Example`**

```typescript
// User wants to switch portals — restart the pipeline
agent.on('portalsAvailable', (e) => {
  showPortalPicker(e.payload.portals, (p) => agent.selectPortal(p));
});

agent.on('initialized', async () => {
  await agent.connect();
});

await agent.restartPortalInitializer();
```

#### Defined in

[core/AiAgent.ts:1609](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1609)

___

### restartCcWidgetInitializer

▸ **restartCcWidgetInitializer**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

**`Deprecated`**

Use [restartPortalInitializer](AiAgent.md#restartportalinitializer) instead.

#### Defined in

[core/AiAgent.ts:1654](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1654)

___

### updateUserProfile

▸ **updateUserProfile**(`profile`): `Promise`\<`void`\>

Update the active user profile after initialization.

Use this when the consumer wants to switch profiles without re-running the
full portal/agent selection pipeline. This method:
1. Persists the new profile selection via the `selectUserProfile` API
   (if the profile is not already the last-used profile)
2. Disconnects the current WebSocket connection (if any)
3. Clears the message queue and transcript
4. Fetches a new session ID and reconnects
5. Emits `initialized` with the updated profile in the payload

This is the equivalent of the cc-widget's profile dropdown behavior:
change the profile → restart session → re-send user context.

**Important:** This method is only valid after the CC initialization
pipeline has completed. Calling it on a non-CC agent or before
initialization throws an error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profile` | [`UserProfile`](../interfaces/UserProfile.md) | The new user profile to activate |

#### Returns

`Promise`\<`void`\>

**`Throws`**

Error if agent is not initialized

**`Throws`**

Error if agent did not go through the CC initialization flow

**`Throws`**

Error if no portal is currently selected

**`Example`**

```typescript
// User picks a different profile from a dropdown
const profiles = cachedProfiles; // from the profilesAvailable event
agent.on("initialized", async () => {
  await agent.connect();
});
await agent.updateUserProfile(profiles[2]);
```

#### Defined in

[core/AiAgent.ts:1692](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1692)

___

### restartConnection

▸ **restartConnection**(`options?`): `Promise`\<`void`\>

Restart the connection with a fresh session.

This method:
1. Gracefully disconnects from the current session
2. Clears all queued messages and transcript
3. Obtains a new session ID (or uses provided one)
4. Reconnects to the new session
5. Sends any stored context to the new session

**Note:** All queued messages will be lost during restart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `Object` | Optional restart options |
| `options.sessionId?` | `string` \| `number` | Optional session ID to use for restart. If provided, skips fetching from network. |

#### Returns

`Promise`\<`void`\>

**`Throws`**

Error if agent is not initialized

**`Example`**

```typescript
// Start a fresh conversation (fetches new sessionId)
await agent.restartConnection();

// Restart with a specific sessionId
await agent.restartConnection({ sessionId: 'existing-session-id' });

// Context is automatically restored
await agent.send("Hello again!");
```

#### Defined in

[core/AiAgent.ts:1762](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1762)

___

### send

▸ **send**(`data`, `options?`): `Promise`\<`string`\>

Send a message to the agent
Messages are queued if offline and automatically sent when connected
Context messages are automatically stored in cache for use on reconnection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` | Message data (can be a Message instance, plain object, or string) |
| `options?` | `Object` | Optional message options |
| `options.id?` | `string` | Optional message ID |
| `options.from?` | `string` | Optional sender identifier (agent ID, customer ID, etc.) |
| `options.to?` | `string` | Optional recipient identifier (agent ID, etc.) |

#### Returns

`Promise`\<`string`\>

Message ID

#### Defined in

[core/AiAgent.ts:1910](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1910)

___

### getQueueSize

▸ **getQueueSize**(): `number`

Get the current queue size

#### Returns

`number`

#### Defined in

[core/AiAgent.ts:1987](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1987)

___

### clearQueue

▸ **clearQueue**(): `void`

Clear the message queue

#### Returns

`void`

#### Defined in

[core/AiAgent.ts:1994](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L1994)

___

### getTranscript

▸ **getTranscript**(`options?`): [`TranscriptEntry`](../interfaces/TranscriptEntry.md)[]

Get transcript entries

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`TranscriptOptions`](../interfaces/TranscriptOptions.md) | Optional filtering options |

#### Returns

[`TranscriptEntry`](../interfaces/TranscriptEntry.md)[]

Array of transcript entries with Message objects

#### Defined in

[core/AiAgent.ts:2003](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2003)

___

### getTranscriptAsJSON

▸ **getTranscriptAsJSON**(`options?`): `any`[]

Get transcript entries as plain objects (JSON-serializable)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`TranscriptOptions`](../interfaces/TranscriptOptions.md) | Optional filtering options |

#### Returns

`any`[]

Array of plain objects representing transcript entries

#### Defined in

[core/AiAgent.ts:2012](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2012)

___

### getTranscriptSize

▸ **getTranscriptSize**(): `number`

Get the number of entries in the transcript

#### Returns

`number`

Number of transcript entries

#### Defined in

[core/AiAgent.ts:2020](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2020)

___

### clearTranscript

▸ **clearTranscript**(): `void`

Clear all transcript entries

#### Returns

`void`

#### Defined in

[core/AiAgent.ts:2027](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2027)

___

### getCallTranscript

▸ **getCallTranscript**(): [`CallTranscriptEntry`](../interfaces/CallTranscriptEntry.md)[]

Get the call transcript — the live customer-agent conversation from the
telephony platform (Genesys, Amazon Connect, etc.), pushed by the platform
connector via the HookContract.

This is distinct from [getTranscript](AiAgent.md#gettranscript), which returns the AI Agent
chat transcript (WebSocket messages).

#### Returns

[`CallTranscriptEntry`](../interfaces/CallTranscriptEntry.md)[]

A shallow copy of the call transcript entries

#### Defined in

[core/AiAgent.ts:2041](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2041)

___

### getCallerInfo

▸ **getCallerInfo**(): ``null`` \| [`CallerInfo`](../interfaces/CallerInfo.md)

Get the caller information set by the platform connector via
HookContract.setCallerInfo(). Available after the platform connector
has initialized (typically before the `initialized` event fires).

#### Returns

``null`` \| [`CallerInfo`](../interfaces/CallerInfo.md)

The caller info object, or null if not yet set

#### Defined in

[core/AiAgent.ts:2052](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2052)

___

### getUserDetails

▸ **getUserDetails**(): ``null`` \| [`UserDetails`](../interfaces/UserDetails.md)

Returns the authenticated user's or customer's details fetched after authentication.
Available after the `initialized` event fires. Returns null if details could not be fetched.

#### Returns

``null`` \| [`UserDetails`](../interfaces/UserDetails.md)

#### Defined in

[core/AiAgent.ts:2060](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2060)

___

### getConversationId

▸ **getConversationId**(): ``null`` \| `string`

#### Returns

``null`` \| `string`

#### Defined in

[core/AiAgent.ts:2064](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2064)

___

### clearCallTranscript

▸ **clearCallTranscript**(): `void`

Clear all call transcript entries.

#### Returns

`void`

#### Defined in

[core/AiAgent.ts:2071](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2071)

___

### getContext

▸ **getContext**(): ``null`` \| `object`

Get the stored context for this agent
Returns the context object that was previously sent via a context message

#### Returns

``null`` \| `object`

The stored context object or null if no context is stored

#### Defined in

[core/AiAgent.ts:2142](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2142)

___

### removeContext

▸ **removeContext**(): `void`

Remove the stored context for this agent
Clears any previously stored context from the cache

#### Returns

`void`

#### Defined in

[core/AiAgent.ts:2155](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2155)

___

### setContext

▸ **setContext**(`context`, `options?`): `Promise`\<`void`\>

Set context for this agent
Stores the context in cache and optionally sends it to the agent immediately

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `object` | The context object to set |
| `options?` | `Object` | Optional settings |
| `options.sendImmediately?` | `boolean` | If true, sends the context to the agent right away (default: false) |

#### Returns

`Promise`\<`void`\>

Promise that resolves when context is set (and sent if sendImmediately is true)

**`Example`**

```typescript
agent.setContext({ userId: "123", plan: "premium" });
```

**`Example`**

```typescript
await agent.setContext({ userId: "123", plan: "premium" }, { sendImmediately: true });
```

#### Defined in

[core/AiAgent.ts:2179](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2179)

___

### resetContext

▸ **resetContext**(): `void`

Reset (clear) the context for this agent
Removes any stored context from the cache
This is an alias for removeContext() with additional logging

#### Returns

`void`

**`Example`**

```typescript
agent.resetContext();
```

#### Defined in

[core/AiAgent.ts:2200](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2200)

___

### getMessageProcessor

▸ **getMessageProcessor**(): [`MessageProcessor`](MessageProcessor.md)

Get the message processor instance
Allows adding custom handlers

#### Returns

[`MessageProcessor`](MessageProcessor.md)

#### Defined in

[core/AiAgent.ts:2565](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2565)

___

### getAccessToken

▸ **getAccessToken**(): `Promise`\<``null`` \| `string`\>

Get the current access token from the authentication strategy
Returns the access token that the agent is currently using for authentication

#### Returns

`Promise`\<``null`` \| `string`\>

Promise resolving to the access token string, or null if no token is available

**`Example`**

```typescript
const token = await agent.getAccessToken();
if (token) {
  // Use the token for external API calls
  fetch('https://api.example.com/data', {
    headers: { Authorization: `Bearer ${token}` }
  });
}
```

#### Defined in

[core/AiAgent.ts:2585](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2585)

___

### updateAccessToken

▸ **updateAccessToken**(`token`): `Promise`\<`void`\>

Update the access token at runtime
Use this method when you receive a tokenExpiring event to provide a new token

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `string` | The new access token |

#### Returns

`Promise`\<`void`\>

**`Throws`**

Error if the authentication strategy doesn't support token updates

**`Example`**

```typescript
agent.on('tokenExpiring', async (event) => {
  const newToken = await fetchNewTokenFromServer();
  await agent.updateAccessToken(newToken);
});
```

#### Defined in

[core/AiAgent.ts:2616](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2616)

___

### setSessionId

▸ **setSessionId**(`sessionId`): `void`

Set or update the session ID at runtime
Updates the sessionId property, which will be used for future connections and logging.

**Note:** If the agent is currently connected, changing the sessionId will not automatically
switch the connection to the new session. You should either:
- Disconnect and reconnect with the new sessionId
- Use `restartConnection({ sessionId: newSessionId })` to restart with the new session

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sessionId` | `string` \| `number` | The new session ID to set |

#### Returns

`void`

**`Example`**

```typescript
// Update sessionId after initialization
agent.setSessionId('new-session-id');

// If connected, restart with the new sessionId
if (agent.isConnected()) {
  await agent.restartConnection({ sessionId: 'new-session-id' });
}
```

#### Defined in

[core/AiAgent.ts:2644](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/AiAgent.ts#L2644)

___

### on

▸ **on**\<`K`\>(`event`, `handler`): `this`

Register an event handler.

The handler will be called every time the event is emitted.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`AgentEvents`](../interfaces/AgentEvents.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name to listen for |
| `handler` | `EventHandler`\<[`AgentEvents`](../interfaces/AgentEvents.md)[`K`]\> | The function to call when the event is emitted |

#### Returns

`this`

`this` for method chaining

**`Example`**

```typescript
agent.on("message", (event) => {
  console.log("Received:", event.payload);
});
```

#### Inherited from

[EventEmitter](EventEmitter.md).[on](EventEmitter.md#on)

#### Defined in

[core/events/EventEmitter.ts:64](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/events/EventEmitter.ts#L64)

___

### once

▸ **once**\<`K`\>(`event`, `handler`): `this`

Register a one-time event handler.

The handler will be called only once, then automatically removed.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`AgentEvents`](../interfaces/AgentEvents.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name to listen for |
| `handler` | `EventHandler`\<[`AgentEvents`](../interfaces/AgentEvents.md)[`K`]\> | The function to call when the event is emitted |

#### Returns

`this`

`this` for method chaining

**`Example`**

```typescript
agent.once("connected", () => {
  console.log("First connection established!");
});
```

#### Inherited from

[EventEmitter](EventEmitter.md).[once](EventEmitter.md#once)

#### Defined in

[core/events/EventEmitter.ts:88](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/events/EventEmitter.ts#L88)

___

### off

▸ **off**\<`K`\>(`event`, `handler?`): `this`

Remove an event handler.

If no handler is specified, removes all handlers for the event.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`AgentEvents`](../interfaces/AgentEvents.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name |
| `handler?` | `EventHandler`\<[`AgentEvents`](../interfaces/AgentEvents.md)[`K`]\> | The specific handler to remove (optional) |

#### Returns

`this`

`this` for method chaining

**`Example`**

```typescript
const handler = (event) => console.log(event);
agent.on("message", handler);
agent.off("message", handler);
```

**`Example`**

```typescript
agent.off("message");
```

#### Inherited from

[EventEmitter](EventEmitter.md).[off](EventEmitter.md#off)

#### Defined in

[core/events/EventEmitter.ts:117](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/events/EventEmitter.ts#L117)

___

### removeAllListeners

▸ **removeAllListeners**\<`K`\>(`event?`): `this`

Remove all event handlers

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`AgentEvents`](../interfaces/AgentEvents.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `K` |

#### Returns

`this`

#### Inherited from

[EventEmitter](EventEmitter.md).[removeAllListeners](EventEmitter.md#removealllisteners)

#### Defined in

[core/events/EventEmitter.ts:180](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/events/EventEmitter.ts#L180)

___

### listenerCount

▸ **listenerCount**\<`K`\>(`event`): `number`

Get the number of listeners for an event

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`AgentEvents`](../interfaces/AgentEvents.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `K` |

#### Returns

`number`

#### Inherited from

[EventEmitter](EventEmitter.md).[listenerCount](EventEmitter.md#listenercount)

#### Defined in

[core/events/EventEmitter.ts:194](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/events/EventEmitter.ts#L194)
