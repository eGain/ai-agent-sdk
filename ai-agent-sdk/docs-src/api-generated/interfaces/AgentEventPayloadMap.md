[@egain/ai-agent-sdk API Reference - v0.2.2](../README.md) / AgentEventPayloadMap

# Interface: AgentEventPayloadMap

Payload map for agent events

## Table of contents

### Properties

- [connected](AgentEventPayloadMap.md#connected)
- [message](AgentEventPayloadMap.md#message)
- [agentMessage](AgentEventPayloadMap.md#agentmessage)
- [contextValidation](AgentEventPayloadMap.md#contextvalidation)
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

[core/AiAgent.ts:255](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L255)

___

### message

• **message**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Defined in

[core/AiAgent.ts:256](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L256)

___

### agentMessage

• **agentMessage**: `Omit`\<[`MessageHandlerResult`](MessageHandlerResult.md), ``"sessionId"`` \| ``"timestamp"`` \| ``"agentId"``\>

#### Defined in

[core/AiAgent.ts:257](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L257)

___

### contextValidation

• **contextValidation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `message` | [`Message`](../classes/Message.md) |
| `issues` | [`ContextValidationIssue`](ContextValidationIssue.md)[] |

#### Defined in

[core/AiAgent.ts:258](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L258)

___

### errorMessage

• **errorMessage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `message` | [`Message`](../classes/Message.md) |
| `error` | `Error` |

#### Defined in

[core/AiAgent.ts:262](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L262)

___

### error

• **error**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | `Error` |

#### Defined in

[core/AiAgent.ts:263](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L263)

___

### closed

• **closed**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code?` | `number` |
| `reason?` | `string` |

#### Defined in

[core/AiAgent.ts:264](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L264)

___

### stateChanged

• **stateChanged**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `state` | [`ConnectionState`](../enums/ConnectionState.md) |
| `previousState` | [`ConnectionState`](../enums/ConnectionState.md) |

#### Defined in

[core/AiAgent.ts:265](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L265)

___

### queueFlushed

• **queueFlushed**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `count` | `number` |

#### Defined in

[core/AiAgent.ts:266](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L266)

___

### heartbeat

• **heartbeat**: `Omit`\<[`MessageHandlerResult`](MessageHandlerResult.md), ``"sessionId"`` \| ``"timestamp"`` \| ``"agentId"``\>

#### Defined in

[core/AiAgent.ts:267](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L267)

___

### tokenExpiring

• **tokenExpiring**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `reason` | ``"expiring"`` \| ``"transport_request"`` |
| `expiresAt?` | `number` |

#### Defined in

[core/AiAgent.ts:268](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L268)

___

### transcriptUpdate

• **transcriptUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `entry` | [`TranscriptEntry`](TranscriptEntry.md) |

#### Defined in

[core/AiAgent.ts:269](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L269)

___

### callTranscriptUpdate

• **callTranscriptUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `entry` | [`CallTranscriptEntry`](CallTranscriptEntry.md) |

#### Defined in

[core/AiAgent.ts:270](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L270)

___

### callerInfoUpdate

• **callerInfoUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `callerInfo` | [`CallerInfo`](CallerInfo.md) |

#### Defined in

[core/AiAgent.ts:271](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L271)

___

### conversationIdUpdate

• **conversationIdUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `conversationId` | `string` |

#### Defined in

[core/AiAgent.ts:272](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L272)

___

### userContextUpdate

• **userContextUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `userContext` | `Record`\<`string`, `unknown`\> |

#### Defined in

[core/AiAgent.ts:273](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L273)

___

### filterTagsUpdate

• **filterTagsUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterTags` | `Record`\<`string`, `string`[]\> |

#### Defined in

[core/AiAgent.ts:274](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L274)

___

### initialized

• **initialized**: `Object`

Always includes at least agent (agentId, name). When CC pipeline completes: portal, portalDetails?, agent?, profile, availableProfiles, availablePortals.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `portal?` | [`Portal`](Portal.md) |
| `portalDetails?` | `any` |
| `agent?` | [`AgentListItem`](AgentListItem.md) \| `Record`\<`string`, `unknown`\> |
| `profile?` | [`UserProfile`](UserProfile.md) |
| `availableProfiles?` | [`UserProfile`](UserProfile.md)[] |
| `availablePortals?` | [`Portal`](Portal.md)[] |

#### Defined in

[core/AiAgent.ts:276](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L276)

___

### portalsAvailable

• **portalsAvailable**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `portals` | [`Portal`](Portal.md)[] |

#### Defined in

[core/AiAgent.ts:284](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L284)

___

### agentsAvailable

• **agentsAvailable**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `agents` | [`AgentListItem`](AgentListItem.md)[] |

#### Defined in

[core/AiAgent.ts:285](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L285)

___

### profilesAvailable

• **profilesAvailable**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `profiles` | [`UserProfile`](UserProfile.md)[] |
| `selectedPortal` | [`Portal`](Portal.md) |

#### Defined in

[core/AiAgent.ts:286](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L286)
