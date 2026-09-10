[@egain/ai-agent-sdk API Reference - v0.2.3-beta.7](../README.md) / AgentEvents

# Interface: AgentEvents

Agent event map

## Table of contents

### Properties

- [connected](AgentEvents.md#connected)
- [message](AgentEvents.md#message)
- [agentMessage](AgentEvents.md#agentmessage)
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

### contextValidation

• **contextValidation**: [`AgentEvent`](AgentEvent.md)\<``"contextValidation"``\>

Emitted when some context attributes were rejected without terminating the session.

#### Defined in

[core/AiAgent.ts:351](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L351)

___

### errorMessage

• **errorMessage**: [`AgentEvent`](AgentEvent.md)\<``"errorMessage"``\>

Emitted when an error message is received

#### Defined in

[core/AiAgent.ts:356](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L356)

___

### error

• **error**: [`AgentEvent`](AgentEvent.md)\<``"error"``\>

Emitted when an error occurs

#### Defined in

[core/AiAgent.ts:361](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L361)

___

### closed

• **closed**: [`AgentEvent`](AgentEvent.md)\<``"closed"``\>

Emitted when connection is closed

#### Defined in

[core/AiAgent.ts:366](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L366)

___

### stateChanged

• **stateChanged**: [`AgentEvent`](AgentEvent.md)\<``"stateChanged"``\>

Emitted when connection state changes

#### Defined in

[core/AiAgent.ts:371](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L371)

___

### queueFlushed

• **queueFlushed**: [`AgentEvent`](AgentEvent.md)\<``"queueFlushed"``\>

Emitted when queue is flushed

#### Defined in

[core/AiAgent.ts:376](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L376)

___

### heartbeat

• **heartbeat**: [`AgentEvent`](AgentEvent.md)\<``"heartbeat"``\>

Emitted when a heartbeat message is received
Indicates the agent is processing/typing - UI can show a loader

#### Defined in

[core/AiAgent.ts:382](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L382)

___

### tokenExpiring

• **tokenExpiring**: [`AgentEvent`](AgentEvent.md)\<``"tokenExpiring"``\>

Emitted when the access token is about to expire or needs refresh
Triggered by JWT expiration detection (with 3-min buffer) or transport layer request

#### Defined in

[core/AiAgent.ts:388](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L388)

___

### transcriptUpdate

• **transcriptUpdate**: [`AgentEvent`](AgentEvent.md)\<``"transcriptUpdate"``\>

Emitted when the transcript is updated (message sent or received)
Contains the new transcript entry with message and direction

#### Defined in

[core/AiAgent.ts:394](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L394)

___

### callTranscriptUpdate

• **callTranscriptUpdate**: [`AgentEvent`](AgentEvent.md)\<``"callTranscriptUpdate"``\>

Emitted when the platform connector pushes a call transcript entry
via HookContract.addToTranscript(). Entries arrive incrementally during a call.

#### Defined in

[core/AiAgent.ts:400](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L400)

___

### callerInfoUpdate

• **callerInfoUpdate**: [`AgentEvent`](AgentEvent.md)\<``"callerInfoUpdate"``\>

Emitted when the platform connector sets caller information
via HookContract.setCallerInfo().

#### Defined in

[core/AiAgent.ts:406](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L406)

___

### conversationIdUpdate

• **conversationIdUpdate**: [`AgentEvent`](AgentEvent.md)\<``"conversationIdUpdate"``\>

Emitted when the platform connector sets the conversation/interaction ID
via HookContract.setConversationId().

#### Defined in

[core/AiAgent.ts:412](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L412)

___

### userContextUpdate

• **userContextUpdate**: [`AgentEvent`](AgentEvent.md)\<``"userContextUpdate"``\>

Emitted when the platform connector appends to user context
via HookContract.setUserContext(). Payload contains the merged context.

#### Defined in

[core/AiAgent.ts:418](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L418)

___

### filterTagsUpdate

• **filterTagsUpdate**: [`AgentEvent`](AgentEvent.md)\<``"filterTagsUpdate"``\>

Emitted when the platform connector sets filter tags
via HookContract.setUserFilterTags().

#### Defined in

[core/AiAgent.ts:424](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L424)

___

### initialized

• **initialized**: [`AgentEvent`](AgentEvent.md)\<``"initialized"``\>

Emitted when the pipeline (or direct flow) is fully complete.
Safe to call connect(). Consumer is responsible for calling connect() after this.
Payload is never empty in practice: always at least agent (agentId, name). When the CC pipeline
completed, also includes portal, optional portalDetails, optional agent, profile, availableProfiles, availablePortals.

#### Defined in

[core/AiAgent.ts:432](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L432)

___

### portalsAvailable

• **portalsAvailable**: [`AgentEvent`](AgentEvent.md)\<``"portalsAvailable"``\>

Emitted when multiple portals are available.
Consumer must call selectPortal(portal) to continue.

#### Defined in

[core/AiAgent.ts:438](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L438)

___

### agentsAvailable

• **agentsAvailable**: [`AgentEvent`](AgentEvent.md)\<``"agentsAvailable"``\>

Emitted when multiple agents are available (Flow B only).
Consumer must call selectAgent(agent) to continue.

#### Defined in

[core/AiAgent.ts:444](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L444)

___

### profilesAvailable

• **profilesAvailable**: [`AgentEvent`](AgentEvent.md)\<``"profilesAvailable"``\>

Emitted when multiple user profiles exist and neither last-used nor default profile is found.
Payload includes profiles and selectedPortal. Consumer must call selectUserProfile(profile) to continue.

#### Defined in

[core/AiAgent.ts:450](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L450)
