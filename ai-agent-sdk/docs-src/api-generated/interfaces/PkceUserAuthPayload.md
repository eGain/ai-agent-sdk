[@egain/ai-agent-sdk API Reference - v0.5.0](../README.md) / PkceUserAuthPayload

# Interface: PkceUserAuthPayload

What a `pkce_user_auth` action asks the browser to do: run an OAuth 2.0 PKCE authorization
against the provider's endpoints. Every field is public -- a PKCE client has no secret.

## Table of contents

### Properties

- [credentialId](PkceUserAuthPayload.md#credentialid)
- [authorizationUrl](PkceUserAuthPayload.md#authorizationurl)
- [tokenUrl](PkceUserAuthPayload.md#tokenurl)
- [clientId](PkceUserAuthPayload.md#clientid)
- [redirectUri](PkceUserAuthPayload.md#redirecturi)
- [scopes](PkceUserAuthPayload.md#scopes)
- [serviceName](PkceUserAuthPayload.md#servicename)
- [toolPurpose](PkceUserAuthPayload.md#toolpurpose)

## Properties

### credentialId

• **credentialId**: `string`

#### Defined in

[core/client-actions/pkce/PkceUserAuthHandler.ts:16](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/pkce/PkceUserAuthHandler.ts#L16)

___

### authorizationUrl

• **authorizationUrl**: `string`

#### Defined in

[core/client-actions/pkce/PkceUserAuthHandler.ts:17](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/pkce/PkceUserAuthHandler.ts#L17)

___

### tokenUrl

• **tokenUrl**: `string`

#### Defined in

[core/client-actions/pkce/PkceUserAuthHandler.ts:18](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/pkce/PkceUserAuthHandler.ts#L18)

___

### clientId

• **clientId**: `string`

#### Defined in

[core/client-actions/pkce/PkceUserAuthHandler.ts:19](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/pkce/PkceUserAuthHandler.ts#L19)

___

### redirectUri

• **redirectUri**: `string`

#### Defined in

[core/client-actions/pkce/PkceUserAuthHandler.ts:20](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/pkce/PkceUserAuthHandler.ts#L20)

___

### scopes

• **scopes**: `string`

Space-separated, exactly as the provider expects them.

#### Defined in

[core/client-actions/pkce/PkceUserAuthHandler.ts:22](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/pkce/PkceUserAuthHandler.ts#L22)

___

### serviceName

• **serviceName**: `string`

Provider label for the card ("Connect to Acme"); may be empty.

#### Defined in

[core/client-actions/pkce/PkceUserAuthHandler.ts:24](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/pkce/PkceUserAuthHandler.ts#L24)

___

### toolPurpose

• **toolPurpose**: `string`

What the agent is trying to do, for the card ("so I can look up your booking").

#### Defined in

[core/client-actions/pkce/PkceUserAuthHandler.ts:26](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/client-actions/pkce/PkceUserAuthHandler.ts#L26)
