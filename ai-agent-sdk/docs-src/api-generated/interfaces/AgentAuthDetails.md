[@egain/ai-agent-sdk API Reference - v0.3.1](../README.md) / AgentAuthDetails

# Interface: AgentAuthDetails

Subset of the agent details response (`GET /core/aiservices/v4/aiagent/details/agent/{agentId}`)
that drives authentication. The full response is kept untyped; this names only the fields
the auth flow reads.

## Table of contents

### Properties

- [isAuthenticated](AgentAuthDetails.md#isauthenticated)
- [userType](AgentAuthDetails.md#usertype)
- [extraScopes](AgentAuthDetails.md#extrascopes)
- [clientAppId](AgentAuthDetails.md#clientappid)

## Properties

### isAuthenticated

• `Optional` **isAuthenticated**: `boolean`

Whether the agent requires an authenticated (PKCE) user.

#### Defined in

[core/types/AgentDetailsTypes.ts:8](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/types/AgentDetailsTypes.ts#L8)

___

### userType

• `Optional` **userType**: ``"agent"`` \| ``"customer"``

Which permission prefix and deployment client id apply.

#### Defined in

[core/types/AgentDetailsTypes.ts:10](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/types/AgentDetailsTypes.ts#L10)

___

### extraScopes

• `Optional` **extraScopes**: `string`[]

Unprefixed OAuth resource scopes configured on the agent (Settings → Advanced). Always appended
(deduplicated) to the scope list the SDK would otherwise use, for both the anonymous
client-credentials token and the PKCE token.

#### Defined in

[core/types/AgentDetailsTypes.ts:16](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/types/AgentDetailsTypes.ts#L16)

___

### clientAppId

• `Optional` **clientAppId**: ``null`` \| `string`

OAuth client app id configured on the agent (Settings → Advanced). Used as the PKCE/MSAL client id
with priority `initParams.egclientid` > `clientAppId` > deployment `intClientId` / `extClientId` /
`clientId`. Not used by the anonymous client-credentials token.

#### Defined in

[core/types/AgentDetailsTypes.ts:22](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/types/AgentDetailsTypes.ts#L22)
