[@eGainDev/ai-agent-sdk API Reference - v0.0.14](../README.md) / HookContract

# Interface: HookContract

Bidirectional contract between the SDK and a platform connector script.

Read-only getters return live state (not stale snapshots) because the
implementation closes over the `AiAgent` instance.

## Table of contents

### Properties

- [getTranscript](HookContract.md#gettranscript)
- [getInitParams](HookContract.md#getinitparams)
- [getAgentDetails](HookContract.md#getagentdetails)
- [getMsalAccessToken](HookContract.md#getmsalaccesstoken)
- [getDeploymentInfo](HookContract.md#getdeploymentinfo)
- [getPlatformType](HookContract.md#getplatformtype)
- [getEnvironment](HookContract.md#getenvironment)
- [getUserId](HookContract.md#getuserid)
- [getUserContext](HookContract.md#getusercontext)
- [getConversationId](HookContract.md#getconversationid)
- [getAuthScopes](HookContract.md#getauthscopes)
- [getTenantId](HookContract.md#gettenantid)
- [getSelectedPortal](HookContract.md#getselectedportal)
- [getCallerInfo](HookContract.md#getcallerinfo)
- [addToTranscript](HookContract.md#addtotranscript)
- [setCallerInfo](HookContract.md#setcallerinfo)
- [setPlatformAuthenticated](HookContract.md#setplatformauthenticated)
- [setPlatformToken](HookContract.md#setplatformtoken)
- [setConversationId](HookContract.md#setconversationid)
- [setUserContext](HookContract.md#setusercontext)
- [setUserFilterTags](HookContract.md#setuserfiltertags)
- [subscribeToAgentWidgetActions](HookContract.md#subscribetoagentwidgetactions)
- [onUserMessage](HookContract.md#onusermessage)
- [onSourceClick](HookContract.md#onsourceclick)
- [onIntentConfirm](HookContract.md#onintentconfirm)

## Properties

### getTranscript

• **getTranscript**: () => [`CallTranscriptEntry`](CallTranscriptEntry.md)[]

Returns the current call transcript entries (telephony conversation, not AI chat).

#### Type declaration

▸ (): [`CallTranscriptEntry`](CallTranscriptEntry.md)[]

##### Returns

[`CallTranscriptEntry`](CallTranscriptEntry.md)[]

#### Defined in

[core/platform/HookContract.ts:49](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L49)

___

### getInitParams

• **getInitParams**: () => `Record`\<`string`, `string`\>

Returns a shallow copy of the initialization parameters.

#### Type declaration

▸ (): `Record`\<`string`, `string`\>

##### Returns

`Record`\<`string`, `string`\>

#### Defined in

[core/platform/HookContract.ts:52](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L52)

___

### getAgentDetails

• **getAgentDetails**: () => `any`

Returns the agent details object.

#### Type declaration

▸ (): `any`

##### Returns

`any`

#### Defined in

[core/platform/HookContract.ts:55](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L55)

___

### getMsalAccessToken

• **getMsalAccessToken**: () => `Promise`\<``null`` \| `string`\>

Returns the current MSAL/auth access token.

#### Type declaration

▸ (): `Promise`\<``null`` \| `string`\>

##### Returns

`Promise`\<``null`` \| `string`\>

#### Defined in

[core/platform/HookContract.ts:58](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L58)

___

### getDeploymentInfo

• **getDeploymentInfo**: () => `any`

Returns the deployment info object.

#### Type declaration

▸ (): `any`

##### Returns

`any`

#### Defined in

[core/platform/HookContract.ts:61](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L61)

___

### getPlatformType

• **getPlatformType**: () => ``null`` \| `string`

Returns the platform type string (e.g. "genesys").

#### Type declaration

▸ (): ``null`` \| `string`

##### Returns

``null`` \| `string`

#### Defined in

[core/platform/HookContract.ts:64](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L64)

___

### getEnvironment

• **getEnvironment**: () => `string`

Returns the deployment environment ("dev" | "qa" | "prod").

#### Type declaration

▸ (): `string`

##### Returns

`string`

#### Defined in

[core/platform/HookContract.ts:67](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L67)

___

### getUserId

• **getUserId**: () => ``null`` \| `string`

Returns the user ID from init params.

#### Type declaration

▸ (): ``null`` \| `string`

##### Returns

``null`` \| `string`

#### Defined in

[core/platform/HookContract.ts:70](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L70)

___

### getUserContext

• **getUserContext**: () => ``null`` \| `Record`\<`string`, `unknown`\>

Returns the user context object.

#### Type declaration

▸ (): ``null`` \| `Record`\<`string`, `unknown`\>

##### Returns

``null`` \| `Record`\<`string`, `unknown`\>

#### Defined in

[core/platform/HookContract.ts:73](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L73)

___

### getConversationId

• **getConversationId**: () => ``null`` \| `string`

Returns the conversation ID set by the connector.

#### Type declaration

▸ (): ``null`` \| `string`

##### Returns

``null`` \| `string`

#### Defined in

[core/platform/HookContract.ts:76](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L76)

___

### getAuthScopes

• **getAuthScopes**: () => `string`[]

Returns effective OAuth resource scopes for the auth flow: after the platform connector runs,
the merged list in `config.scopes` wins; otherwise non-empty `initParams.scopes` (comma-separated)
overrides `config.scopes`, then defaults (including `core.customermgr.read` for customer when
neither query nor config supplies scopes).

#### Type declaration

▸ (): `string`[]

##### Returns

`string`[]

#### Defined in

[core/platform/HookContract.ts:84](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L84)

___

### getTenantId

• **getTenantId**: () => ``null`` \| `string`

Returns the tenant ID from deployment info.

#### Type declaration

▸ (): ``null`` \| `string`

##### Returns

``null`` \| `string`

#### Defined in

[core/platform/HookContract.ts:87](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L87)

___

### getSelectedPortal

• **getSelectedPortal**: () => ``null`` \| [`Portal`](Portal.md)

Returns the currently selected portal, or null before selection.

#### Type declaration

▸ (): ``null`` \| [`Portal`](Portal.md)

##### Returns

``null`` \| [`Portal`](Portal.md)

#### Defined in

[core/platform/HookContract.ts:90](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L90)

___

### getCallerInfo

• **getCallerInfo**: () => ``null`` \| [`CallerInfo`](CallerInfo.md)

Returns the caller info set by the connector.

#### Type declaration

▸ (): ``null`` \| [`CallerInfo`](CallerInfo.md)

##### Returns

``null`` \| [`CallerInfo`](CallerInfo.md)

#### Defined in

[core/platform/HookContract.ts:93](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L93)

___

### addToTranscript

• **addToTranscript**: (`entry`: \{ `sender`: `string` ; `content`: `string` ; `timestamp?`: `Date`  }) => `void`

Add an entry to the call transcript (telephony conversation, not AI chat).

#### Type declaration

▸ (`entry`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `entry` | `Object` |
| `entry.sender` | `string` |
| `entry.content` | `string` |
| `entry.timestamp?` | `Date` |

##### Returns

`void`

#### Defined in

[core/platform/HookContract.ts:98](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L98)

___

### setCallerInfo

• **setCallerInfo**: (`callerInfo`: [`CallerInfo`](CallerInfo.md)) => `void`

Set caller information (e.g. from CTI integration).

#### Type declaration

▸ (`callerInfo`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `callerInfo` | [`CallerInfo`](CallerInfo.md) |

##### Returns

`void`

#### Defined in

[core/platform/HookContract.ts:101](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L101)

___

### setPlatformAuthenticated

• **setPlatformAuthenticated**: (`value`: `boolean`) => `void`

Mark the platform as authenticated.

#### Type declaration

▸ (`value`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

##### Returns

`void`

#### Defined in

[core/platform/HookContract.ts:104](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L104)

___

### setPlatformToken

• **setPlatformToken**: (`token`: `string`) => `void`

Store a secondary platform-specific token.

#### Type declaration

▸ (`token`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `string` |

##### Returns

`void`

#### Defined in

[core/platform/HookContract.ts:107](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L107)

___

### setConversationId

• **setConversationId**: (`id`: `string`) => `void`

Set the conversation/interaction ID.

#### Type declaration

▸ (`id`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

##### Returns

`void`

#### Defined in

[core/platform/HookContract.ts:110](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L110)

___

### setUserContext

• **setUserContext**: (`userContext`: `Record`\<`string`, `unknown`\>) => `void`

Append to the user context (merge, not overwrite).

#### Type declaration

▸ (`userContext`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `userContext` | `Record`\<`string`, `unknown`\> |

##### Returns

`void`

#### Defined in

[core/platform/HookContract.ts:113](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L113)

___

### setUserFilterTags

• **setUserFilterTags**: (`filterTags`: `Record`\<`string`, `string`[]\>) => `void`

Set filter tags for portal content filtering.

#### Type declaration

▸ (`filterTags`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `filterTags` | `Record`\<`string`, `string`[]\> |

##### Returns

`void`

#### Defined in

[core/platform/HookContract.ts:116](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L116)

___

### subscribeToAgentWidgetActions

• **subscribeToAgentWidgetActions**: (`callback`: (`action`: `string`, `data`: `unknown`) => `void`) => () => `void`

Subscribe to agent widget actions. Returns an unsubscribe function.

#### Type declaration

▸ (`callback`): () => `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`action`: `string`, `data`: `unknown`) => `void` |

##### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[core/platform/HookContract.ts:121](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L121)

___

### onUserMessage

• **onUserMessage**: (`message`: `string`) => `void`

Forward a user message through the SDK's send pipeline.

#### Type declaration

▸ (`message`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

##### Returns

`void`

#### Defined in

[core/platform/HookContract.ts:126](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L126)

___

### onSourceClick

• **onSourceClick**: (`source`: \{ `[key: string]`: `unknown`; `id`: `string` ; `title`: `string` ; `url?`: `string`  }) => `void`

Handle a source click from the connector.

#### Type declaration

▸ (`source`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `Object` |
| `source.id` | `string` |
| `source.title` | `string` |
| `source.url?` | `string` |

##### Returns

`void`

#### Defined in

[core/platform/HookContract.ts:129](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L129)

___

### onIntentConfirm

• **onIntentConfirm**: (`intent`: \{ `[key: string]`: `unknown`; `id`: `string` ; `intent`: `string` ; `confidence`: `number`  }) => `void`

Handle an intent confirmation from the connector.

#### Type declaration

▸ (`intent`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `intent` | `Object` |
| `intent.id` | `string` |
| `intent.intent` | `string` |
| `intent.confidence` | `number` |

##### Returns

`void`

#### Defined in

[core/platform/HookContract.ts:132](https://github.com/eGain/ai-agent-sdk/blob/main/ai-agent-sdk/src/core/platform/HookContract.ts#L132)
