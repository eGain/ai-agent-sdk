[@eGain/ai-agent-sdk API Reference - v0.1.0](../README.md) / GetAgentsByPortalOptions

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

[core/api/ApiHelper.ts:224](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L224)

___

### portalId

• **portalId**: `string` \| `number`

Portal ID

#### Defined in

[core/api/ApiHelper.ts:229](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L229)

___

### agentType

• `Optional` **agentType**: `string`

Agent type filter

**`Default`**

```ts
"contact-center"
```

#### Defined in

[core/api/ApiHelper.ts:235](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L235)

___

### authToken

• `Optional` **authToken**: `string`

Authentication token (required if `ApiHelper` was constructed without `getToken`)

#### Defined in

[core/api/ApiHelper.ts:240](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L240)
