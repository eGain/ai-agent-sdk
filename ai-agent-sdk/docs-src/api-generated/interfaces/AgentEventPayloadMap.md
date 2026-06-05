[@egain/ai-agent-sdk API Reference - v0.1.2](../README.md) / AgentEventPayloadMap

# Interface: AgentEventPayloadMap

Payload map for agent events

## Table of contents

### Properties

- [connected](AgentEventPayloadMap.md#connected)
- [message](AgentEventPayloadMap.md#message)
- [agentMessage](AgentEventPayloadMap.md#agentmessage)
- [errorMessage](AgentEventPayloadMap.md#errormessage)
- [error](AgentEventPayloadMap.md#error)
- [closed](AgentEventPayloadMap.md#closed)
- [stateChanged](AgentEventPayloadMap.md#statechanged)
- [queueFlushed](AgentEventPayloadMap.md#queueflushed)
- [heartbeat](AgentEventPayloadMap.md#heartbeat)
- [tokenExpiring](AgentEventPayloadMap.md#tokenexpiring)
- [transcriptUpdate](AgentEventPayloadMap.md#transcriptupdate)
- [callTranscriptUpdate](AgentEventPayloadMap.md#calltranscriptupdate)
- [callerInfoUpdate](AgentEventPayloadMap.md#callerinfoupdate)
- [conversationIdUpdate](AgentEventPayloadMap.md#conversationidupdate)
- [userContextUpdate](AgentEventPayloadMap.md#usercontextupdate)
- [filterTagsUpdate](AgentEventPayloadMap.md#filtertagsupdate)
- [initialized](AgentEventPayloadMap.md#initialized)
- [portalsAvailable](AgentEventPayloadMap.md#portalsavailable)
- [agentsAvailable](AgentEventPayloadMap.md#agentsavailable)
- [profilesAvailable](AgentEventPayloadMap.md#profilesavailable)

## Properties

### connected

• **connected**: `Record`\<`string`, `never`\>

#### Defined in

[core/AiAgent.ts:238](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L238)

___

### message

• **message**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Defined in

[core/AiAgent.ts:239](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L239)

___

### agentMessage

• **agentMessage**: `Omit`\<[`MessageHandlerResult`](MessageHandlerResult.md), ``"sessionId"`` \| ``"timestamp"`` \| ``"agentId"``\>

#### Defined in

[core/AiAgent.ts:240](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L240)

___

### errorMessage

• **errorMessage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `message` | [`Message`](../classes/Message.md) |
| `error` | `Error` |

#### Defined in

[core/AiAgent.ts:241](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L241)

___

### error

• **error**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | `Error` |

#### Defined in

[core/AiAgent.ts:242](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L242)

___

### closed

• **closed**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code?` | `number` |
| `reason?` | `string` |

#### Defined in

[core/AiAgent.ts:243](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L243)

___

### stateChanged

• **stateChanged**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `state` | [`ConnectionState`](../enums/ConnectionState.md) |
| `previousState` | [`ConnectionState`](../enums/ConnectionState.md) |

#### Defined in

[core/AiAgent.ts:244](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L244)

___

### queueFlushed

• **queueFlushed**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `count` | `number` |

#### Defined in

[core/AiAgent.ts:245](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L245)

___

### heartbeat

• **heartbeat**: `Omit`\<[`MessageHandlerResult`](MessageHandlerResult.md), ``"sessionId"`` \| ``"timestamp"`` \| ``"agentId"``\>

#### Defined in

[core/AiAgent.ts:246](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L246)

___

### tokenExpiring

• **tokenExpiring**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `reason` | ``"expiring"`` \| ``"transport_request"`` |
| `expiresAt?` | `number` |

#### Defined in

[core/AiAgent.ts:247](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L247)

___

### transcriptUpdate

• **transcriptUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `entry` | [`TranscriptEntry`](TranscriptEntry.md) |

#### Defined in

[core/AiAgent.ts:248](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L248)

___

### callTranscriptUpdate

• **callTranscriptUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `entry` | [`CallTranscriptEntry`](CallTranscriptEntry.md) |

#### Defined in

[core/AiAgent.ts:249](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L249)

___

### callerInfoUpdate

• **callerInfoUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `callerInfo` | [`CallerInfo`](CallerInfo.md) |

#### Defined in

[core/AiAgent.ts:250](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L250)

___

### conversationIdUpdate

• **conversationIdUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `conversationId` | `string` |

#### Defined in

[core/AiAgent.ts:251](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L251)

___

### userContextUpdate

• **userContextUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `userContext` | `Record`\<`string`, `unknown`\> |

#### Defined in

[core/AiAgent.ts:252](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L252)

___

### filterTagsUpdate

• **filterTagsUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterTags` | `Record`\<`string`, `string`[]\> |

#### Defined in

[core/AiAgent.ts:253](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L253)

___

### initialized

• **initialized**: `Object`

Always includes at least agent (agentId, name). When CC pipeline completes: portal, portalDetails?, agent?, profile, availableProfiles, availablePortals.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `portal?` | [`Portal`](Portal.md) |
| `portalDetails?` | `any` |
| `agent?` | `Record`\<`string`, `unknown`\> \| [`AgentListItem`](AgentListItem.md) |
| `profile?` | [`UserProfile`](UserProfile.md) |
| `availableProfiles?` | [`UserProfile`](UserProfile.md)[] |
| `availablePortals?` | [`Portal`](Portal.md)[] |

#### Defined in

[core/AiAgent.ts:255](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L255)

___

### portalsAvailable

• **portalsAvailable**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `portals` | [`Portal`](Portal.md)[] |

#### Defined in

[core/AiAgent.ts:263](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L263)

___

### agentsAvailable

• **agentsAvailable**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `agents` | [`AgentListItem`](AgentListItem.md)[] |

#### Defined in

[core/AiAgent.ts:264](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L264)

___

### profilesAvailable

• **profilesAvailable**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `profiles` | [`UserProfile`](UserProfile.md)[] |
| `selectedPortal` | [`Portal`](Portal.md) |

#### Defined in

[core/AiAgent.ts:265](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L265)
