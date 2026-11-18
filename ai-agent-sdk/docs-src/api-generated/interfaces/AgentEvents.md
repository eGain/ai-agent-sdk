[@egain/ai-agent-sdk API Reference - v0.5.1](../README.md) / AgentEvents

# Interface: AgentEvents

Agent event map

## Table of contents

### Properties

- [connected](AgentEvents.md#connected)
- [message](AgentEvents.md#message)
- [agentMessage](AgentEvents.md#agentmessage)
- [clientAction](AgentEvents.md#clientaction)
- [clientActionUpdate](AgentEvents.md#clientactionupdate)
- [contextValidation](AgentEvents.md#contextvalidation)
- [errorMessage](AgentEvents.md#errormessage)
- [error](AgentEvents.md#error)
- [closed](AgentEvents.md#closed)
- [stateChanged](AgentEvents.md#statechanged)
- [queueFlushed](AgentEvents.md#queueflushed)
- [heartbeat](AgentEvents.md#heartbeat)
- [tokenExpiring](AgentEvents.md#tokenexpiring)
- [transcriptUpdate](AgentEvents.md#transcriptupdate)
- [callTranscriptUpdate](AgentEvents.md#calltranscriptupdate)
- [callerInfoUpdate](AgentEvents.md#callerinfoupdate)
- [conversationIdUpdate](AgentEvents.md#conversationidupdate)
- [userContextUpdate](AgentEvents.md#usercontextupdate)
- [filterTagsUpdate](AgentEvents.md#filtertagsupdate)
- [initialized](AgentEvents.md#initialized)
- [portalsAvailable](AgentEvents.md#portalsavailable)
- [agentsAvailable](AgentEvents.md#agentsavailable)
- [profilesAvailable](AgentEvents.md#profilesavailable)

## Properties

### connected

• **connected**: [`AgentEvent`](AgentEvent.md)\<``"connected"``\>

Emitted when connection is established

#### Defined in

[core/AiAgent.ts:336](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L336)

___

### message

• **message**: [`AgentEvent`](AgentEvent.md)\<``"message"``\>

Emitted when a message is received

#### Defined in

[core/AiAgent.ts:341](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L341)

___

### agentMessage

• **agentMessage**: [`AgentEvent`](AgentEvent.md)\<``"agentMessage"``\>

Emitted when an agent message is received

#### Defined in

[core/AiAgent.ts:346](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L346)

___

### clientAction

• **clientAction**: [`AgentEvent`](AgentEvent.md)\<``"clientAction"``\>

Emitted when the server asks the browser to do something, for a type a handler was
registered for (see [AiAgent.registerClientActionHandler](../classes/AiAgent.md#registerclientactionhandler)). A `user-gesture` action
waits for [AiAgent.performClientAction](../classes/AiAgent.md#performclientaction) -- called from a click -- or
[AiAgent.declineClientAction](../classes/AiAgent.md#declineclientaction); the SDK answers the server either way.

#### Defined in

[core/AiAgent.ts:354](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L354)

___

### clientActionUpdate

• **clientActionUpdate**: [`AgentEvent`](AgentEvent.md)\<``"clientActionUpdate"``\>

Emitted whenever a client action moves on: started, a handler step (`progress`), or ended
(`status`). The same lifecycle for every type, so one card can follow any action.

#### Defined in

[core/AiAgent.ts:360](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L360)

___

### contextValidation

• **contextValidation**: [`AgentEvent`](AgentEvent.md)\<``"contextValidation"``\>

Emitted when some context attributes were rejected without terminating the session.

#### Defined in

[core/AiAgent.ts:365](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L365)

___

### errorMessage

• **errorMessage**: [`AgentEvent`](AgentEvent.md)\<``"errorMessage"``\>

Emitted when an error message is received

#### Defined in

[core/AiAgent.ts:370](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L370)

___

### error

• **error**: [`AgentEvent`](AgentEvent.md)\<``"error"``\>

Emitted when an error occurs

#### Defined in

[core/AiAgent.ts:375](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L375)

___

### closed

• **closed**: [`AgentEvent`](AgentEvent.md)\<``"closed"``\>

Emitted when connection is closed

#### Defined in

[core/AiAgent.ts:380](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L380)

___

### stateChanged

• **stateChanged**: [`AgentEvent`](AgentEvent.md)\<``"stateChanged"``\>

Emitted when connection state changes

#### Defined in

[core/AiAgent.ts:385](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L385)

___

### queueFlushed

• **queueFlushed**: [`AgentEvent`](AgentEvent.md)\<``"queueFlushed"``\>

Emitted when queue is flushed

#### Defined in

[core/AiAgent.ts:390](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L390)

___

### heartbeat

• **heartbeat**: [`AgentEvent`](AgentEvent.md)\<``"heartbeat"``\>

Emitted when a heartbeat message is received
Indicates the agent is processing/typing - UI can show a loader

#### Defined in

[core/AiAgent.ts:396](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L396)

___

### tokenExpiring

• **tokenExpiring**: [`AgentEvent`](AgentEvent.md)\<``"tokenExpiring"``\>

Emitted when the access token is about to expire or needs refresh
Triggered by JWT expiration detection (with 5-min buffer) or transport layer request

#### Defined in

[core/AiAgent.ts:402](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L402)

___

### transcriptUpdate

• **transcriptUpdate**: [`AgentEvent`](AgentEvent.md)\<``"transcriptUpdate"``\>

Emitted when the transcript is updated (message sent or received)
Contains the new transcript entry with message and direction

#### Defined in

[core/AiAgent.ts:408](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L408)

___

### callTranscriptUpdate

• **callTranscriptUpdate**: [`AgentEvent`](AgentEvent.md)\<``"callTranscriptUpdate"``\>

Emitted when the call transcript changes after [AgentEvents.initialized](AgentEvents.md#initialized).
Payload is the full telephony transcript (masked when data masking is active).

#### Defined in

[core/AiAgent.ts:414](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L414)

___

### callerInfoUpdate

• **callerInfoUpdate**: [`AgentEvent`](AgentEvent.md)\<``"callerInfoUpdate"``\>

Emitted when the platform connector sets caller information
via HookContract.setCallerInfo().

#### Defined in

[core/AiAgent.ts:420](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L420)

___

### conversationIdUpdate

• **conversationIdUpdate**: [`AgentEvent`](AgentEvent.md)\<``"conversationIdUpdate"``\>

Emitted when the platform connector sets the conversation/interaction ID
via HookContract.setConversationId().

#### Defined in

[core/AiAgent.ts:426](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L426)

___

### userContextUpdate

• **userContextUpdate**: [`AgentEvent`](AgentEvent.md)\<``"userContextUpdate"``\>

Emitted when the platform connector appends to user context
via HookContract.setUserContext(). Payload contains the merged context.

#### Defined in

[core/AiAgent.ts:432](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L432)

___

### filterTagsUpdate

• **filterTagsUpdate**: [`AgentEvent`](AgentEvent.md)\<``"filterTagsUpdate"``\>

Emitted when the platform connector sets filter tags
via HookContract.setUserFilterTags().

#### Defined in

[core/AiAgent.ts:438](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L438)

___

### initialized

• **initialized**: [`AgentEvent`](AgentEvent.md)\<``"initialized"``\>

Emitted when the pipeline (or direct flow) is fully complete.
Safe to call connect(). Consumer is responsible for calling connect() after this.
Payload is never empty in practice: always at least agent (agentId, name). When the CC pipeline
completed, also includes portal, optional portalDetails, optional agent, profile, availableProfiles, availablePortals.

#### Defined in

[core/AiAgent.ts:446](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L446)

___

### portalsAvailable

• **portalsAvailable**: [`AgentEvent`](AgentEvent.md)\<``"portalsAvailable"``\>

Emitted when multiple portals are available.
Consumer must call selectPortal(portal) to continue.

#### Defined in

[core/AiAgent.ts:452](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L452)

___

### agentsAvailable

• **agentsAvailable**: [`AgentEvent`](AgentEvent.md)\<``"agentsAvailable"``\>

Emitted when multiple agents are available (Flow B only).
Consumer must call selectAgent(agent) to continue.

#### Defined in

[core/AiAgent.ts:458](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L458)

___

### profilesAvailable

• **profilesAvailable**: [`AgentEvent`](AgentEvent.md)\<``"profilesAvailable"``\>

Emitted when multiple user profiles exist and neither last-used nor default profile is found.
Payload includes profiles and selectedPortal. Consumer must call selectUserProfile(profile) to continue.

#### Defined in

[core/AiAgent.ts:464](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L464)
