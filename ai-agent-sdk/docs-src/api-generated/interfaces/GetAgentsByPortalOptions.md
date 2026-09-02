[@egain/ai-agent-sdk API Reference - v0.2.3-beta.3](../README.md) / GetAgentsByPortalOptions

# Interface: GetAgentsByPortalOptions

Options for getAgentsByPortal API call.
Fetches AI agents available in a portal.

## Table of contents

### Properties

- [departmentId](GetAgentsByPortalOptions.md#departmentid)
- [portalId](GetAgentsByPortalOptions.md#portalid)
- [agentType](GetAgentsByPortalOptions.md#agenttype)
- [authToken](GetAgentsByPortalOptions.md#authtoken)

## Properties

### departmentId

• **departmentId**: `string` \| `number`

Department ID (from portal.department.id)

#### Defined in

[core/api/ApiHelper.ts:236](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L236)

___

### portalId

• **portalId**: `string` \| `number`

Portal ID

#### Defined in

[core/api/ApiHelper.ts:241](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L241)

___

### agentType

• `Optional` **agentType**: `string`

Agent type filter

**`Default`**

```ts
"contact-center"
```

#### Defined in

[core/api/ApiHelper.ts:247](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L247)

___

### authToken

• `Optional` **authToken**: `string`

Authentication token (required if `ApiHelper` was constructed without `getToken`)

#### Defined in

[core/api/ApiHelper.ts:252](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L252)
