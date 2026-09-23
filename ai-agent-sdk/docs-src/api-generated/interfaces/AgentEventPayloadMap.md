[@egain/ai-agent-sdk API Reference - v0.2.5](../README.md) / AgentEventPayloadMap

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

[core/AiAgent.ts:264](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L264)

___

### message

• **message**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Defined in

[core/AiAgent.ts:265](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L265)

___

### agentMessage

• **agentMessage**: `Omit`\<[`MessageHandlerResult`](MessageHandlerResult.md), ``"sessionId"`` \| ``"timestamp"`` \| ``"agentId"``\>

#### Defined in

[core/AiAgent.ts:266](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L266)

___

### contextValidation

• **contextValidation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `message` | [`Message`](../classes/Message.md) |
| `issues` | [`ContextValidationIssue`](ContextValidationIssue.md)[] |

#### Defined in

[core/AiAgent.ts:267](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L267)

___

### errorMessage

• **errorMessage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `message` | [`Message`](../classes/Message.md) |
| `error` | `Error` |

#### Defined in

[core/AiAgent.ts:271](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L271)

___

### error

• **error**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | `Error` |

#### Defined in

[core/AiAgent.ts:272](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L272)

___

### closed

• **closed**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code?` | `number` |
| `reason?` | `string` |

#### Defined in

[core/AiAgent.ts:273](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L273)

___

### stateChanged

• **stateChanged**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `state` | [`ConnectionState`](../enums/ConnectionState.md) |
| `previousState` | [`ConnectionState`](../enums/ConnectionState.md) |

#### Defined in

[core/AiAgent.ts:274](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L274)

___

### queueFlushed

• **queueFlushed**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `count` | `number` |

#### Defined in

[core/AiAgent.ts:275](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L275)

___

### heartbeat

• **heartbeat**: `Omit`\<[`MessageHandlerResult`](MessageHandlerResult.md), ``"sessionId"`` \| ``"timestamp"`` \| ``"agentId"``\>

#### Defined in

[core/AiAgent.ts:276](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L276)

___

### tokenExpiring

• **tokenExpiring**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `reason` | ``"expiring"`` \| ``"transport_request"`` |
| `expiresAt?` | `number` |

#### Defined in

[core/AiAgent.ts:277](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L277)

___

### transcriptUpdate

• **transcriptUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `entry` | [`TranscriptEntry`](TranscriptEntry.md) |

#### Defined in

[core/AiAgent.ts:278](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L278)

___

### callTranscriptUpdate

• **callTranscriptUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `entry` | [`CallTranscriptEntry`](CallTranscriptEntry.md) |

#### Defined in

[core/AiAgent.ts:279](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L279)

___

### callerInfoUpdate

• **callerInfoUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `callerInfo` | [`CallerInfo`](CallerInfo.md) |

#### Defined in

[core/AiAgent.ts:280](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L280)

___

### conversationIdUpdate

• **conversationIdUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `conversationId` | `string` |

#### Defined in

[core/AiAgent.ts:281](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L281)

___

### userContextUpdate

• **userContextUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `userContext` | `Record`\<`string`, `unknown`\> |

#### Defined in

[core/AiAgent.ts:282](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L282)

___

### filterTagsUpdate

• **filterTagsUpdate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filterTags` | `Record`\<`string`, `string`[]\> |

#### Defined in

[core/AiAgent.ts:283](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L283)

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

[core/AiAgent.ts:285](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L285)

___

### portalsAvailable

• **portalsAvailable**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `portals` | [`Portal`](Portal.md)[] |

#### Defined in

[core/AiAgent.ts:293](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L293)

___

### agentsAvailable

• **agentsAvailable**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `agents` | [`AgentListItem`](AgentListItem.md)[] |

#### Defined in

[core/AiAgent.ts:294](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L294)

___

### profilesAvailable

• **profilesAvailable**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `profiles` | [`UserProfile`](UserProfile.md)[] |
| `selectedPortal` | [`Portal`](Portal.md) |

#### Defined in

[core/AiAgent.ts:295](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L295)
