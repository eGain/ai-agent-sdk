[@egain/ai-agent-sdk API Reference - v0.1.1](../README.md) / ApiHelper

# Class: ApiHelper

API Helper class for making eGain AI Agent API calls

## Table of contents

### Constructors

- [constructor](ApiHelper.md#constructor)

### Methods

- [setStaticCacheAdapter](ApiHelper.md#setstaticcacheadapter)
- [getAiAgentDetails](ApiHelper.md#getaiagentdetails)
- [getAiAgentSession](ApiHelper.md#getaiagentsession)
- [getPortalDetails](ApiHelper.md#getportaldetails)
- [getConnectedApps](ApiHelper.md#getconnectedapps)
- [getPreviousTranscript](ApiHelper.md#getprevioustranscript)
- [getMaskingPatterns](ApiHelper.md#getmaskingpatterns)
- [getMyPortals](ApiHelper.md#getmyportals)
- [getAgentsByPortal](ApiHelper.md#getagentsbyportal)
- [getUserProfiles](ApiHelper.md#getuserprofiles)
- [selectUserProfile](ApiHelper.md#selectuserprofile)
- [clearCache](ApiHelper.md#clearcache)
- [invalidateCache](ApiHelper.md#invalidatecache)
- [getUserDetails](ApiHelper.md#getuserdetails)
- [getCustomerDetails](ApiHelper.md#getcustomerdetails)
- [getDeploymentInfo](ApiHelper.md#getdeploymentinfo)
- [clearDeploymentInfoCache](ApiHelper.md#cleardeploymentinfocache)

## Constructors

### constructor

• **new ApiHelper**(`config`): [`ApiHelper`](ApiHelper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`ApiHelperConfig`](../interfaces/ApiHelperConfig.md) |

#### Returns

[`ApiHelper`](ApiHelper.md)

#### Defined in

[core/api/ApiHelper.ts:357](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L357)

## Methods

### setStaticCacheAdapter

▸ **setStaticCacheAdapter**(`adapter`): `void`

Sets a custom static cache adapter for deployment info caching.
Call this before any AiAgent.initialize() calls to use a custom adapter
for caching deployment information.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `adapter` | [`CacheAdapter`](../interfaces/CacheAdapter.md) | Custom CacheAdapter implementation |

#### Returns

`void`

#### Defined in

[core/api/ApiHelper.ts:353](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L353)

___

### getAiAgentDetails

▸ **getAiAgentDetails**(`options`): `Promise`\<`any`\>

Gets the AI Agent details

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`GetAiAgentDetailsOptions`](../interfaces/GetAiAgentDetailsOptions.md) | The options for the API call |

#### Returns

`Promise`\<`any`\>

The AI Agent details

#### Defined in

[core/api/ApiHelper.ts:503](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L503)

___

### getAiAgentSession

▸ **getAiAgentSession**(`options`): `Promise`\<`string`\>

Gets the AI Agent session

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`GetAiAgentSessionOptions`](../interfaces/GetAiAgentSessionOptions.md) | The options for the API call |

#### Returns

`Promise`\<`string`\>

The AI Agent session ID

#### Defined in

[core/api/ApiHelper.ts:541](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L541)

___

### getPortalDetails

▸ **getPortalDetails**(`options`): `Promise`\<`any`\>

Gets the portal details

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`GetPortalDetailsOptions`](../interfaces/GetPortalDetailsOptions.md) | The options for the API call |

#### Returns

`Promise`\<`any`\>

The portal details

#### Defined in

[core/api/ApiHelper.ts:568](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L568)

___

### getConnectedApps

▸ **getConnectedApps**(`options`): `Promise`\<`any`\>

Gets the connected apps

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`GetConnectedAppsOptions`](../interfaces/GetConnectedAppsOptions.md) | The options for the API call |

#### Returns

`Promise`\<`any`\>

The connected apps

#### Defined in

[core/api/ApiHelper.ts:615](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L615)

___

### getPreviousTranscript

▸ **getPreviousTranscript**(`options`): `Promise`\<`any`[]\>

Gets the previous transcript

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`GetPreviousTranscriptOptions`](../interfaces/GetPreviousTranscriptOptions.md) | The options for the API call |

#### Returns

`Promise`\<`any`[]\>

The previous transcript messages

#### Defined in

[core/api/ApiHelper.ts:654](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L654)

___

### getMaskingPatterns

▸ **getMaskingPatterns**(`options`): `Promise`\<`any`\>

Gets the masking patterns for a department and channel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`GetMaskingPatternsOptions`](../interfaces/GetMaskingPatternsOptions.md) | The options for the API call |

#### Returns

`Promise`\<`any`\>

The masking patterns response

**`Throws`**

If the API request fails

#### Defined in

[core/api/ApiHelper.ts:685](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L685)

___

### getMyPortals

▸ **getMyPortals**(`options`): `Promise`\<`any`[]\>

Gets portals for the authenticated user via `GET .../knowledge/portalmgr/v3/myportals` (paginated).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`GetMyPortalsOptions`](../interfaces/GetMyPortalsOptions.md) | Options for the API call |

#### Returns

`Promise`\<`any`[]\>

Promise resolving to array of Portal objects

**`Throws`**

Error if the API request fails

**`Example`**

```typescript
const portals = await apiHelper.getMyPortals({
  authToken: token,
  language: 'en-us',
  userId: 'user-123'
});
```

#### Defined in

[core/api/ApiHelper.ts:742](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L742)

___

### getAgentsByPortal

▸ **getAgentsByPortal**(`options`): `Promise`\<`any`[]\>

Gets AI agents by portal and department.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`GetAgentsByPortalOptions`](../interfaces/GetAgentsByPortalOptions.md) | Options for the API call |

#### Returns

`Promise`\<`any`[]\>

Promise resolving to array of agent list items

**`Throws`**

Error if the API request fails

**`Example`**

```typescript
const agents = await apiHelper.getAgentsByPortal({
  departmentId: department.id,
  portalId: portal.id,
  agentType: 'contact-center',
  authToken: token
});
```

#### Defined in

[core/api/ApiHelper.ts:851](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L851)

___

### getUserProfiles

▸ **getUserProfiles**(`options`): `Promise`\<`any`[]\>

Gets user profiles for a portal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`GetUserProfilesOptions`](../interfaces/GetUserProfilesOptions.md) | Options for the API call |

#### Returns

`Promise`\<`any`[]\>

Promise resolving to array of UserProfile objects

**`Throws`**

Error if the API request fails

**`Example`**

```typescript
const profiles = await apiHelper.getUserProfiles({
  portalId: portal.id,
  authToken: token
});
```

#### Defined in

[core/api/ApiHelper.ts:904](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L904)

___

### selectUserProfile

▸ **selectUserProfile**(`options`): `Promise`\<`void`\>

Selects a user profile for a portal.
Persists the selection on the server.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`SelectUserProfileOptions`](../interfaces/SelectUserProfileOptions.md) | Options for the API call |

#### Returns

`Promise`\<`void`\>

Promise resolving when selection is complete

**`Throws`**

Error if the API request fails

**`Example`**

```typescript
await apiHelper.selectUserProfile({
  portalId: portal.id,
  profileId: profile.id,
  authToken: token
});
```

#### Defined in

[core/api/ApiHelper.ts:960](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L960)

___

### clearCache

▸ **clearCache**(): `void`

Clears all cached entries for this ApiHelper instance

#### Returns

`void`

#### Defined in

[core/api/ApiHelper.ts:985](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L985)

___

### invalidateCache

▸ **invalidateCache**(`pattern?`): `void`

Invalidates cached entries matching a specific pattern or method name

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pattern?` | `string` | Optional pattern to match (e.g., 'getAiAgentDetails', 'getPortalDetails') If not provided, clears all cache entries for this instance |

#### Returns

`void`

#### Defined in

[core/api/ApiHelper.ts:996](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L996)

___

### getUserDetails

▸ **getUserDetails**(`options`): `Promise`\<``null`` \| [`UserDetails`](../interfaces/UserDetails.md)\>

Fetches the authenticated user's details (for agent/user auth type).
Returns null on failure so that initialization is not blocked.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`GetUserDetailsOptions`](../interfaces/GetUserDetailsOptions.md) |

#### Returns

`Promise`\<``null`` \| [`UserDetails`](../interfaces/UserDetails.md)\>

#### Defined in

[core/api/ApiHelper.ts:1019](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1019)

___

### getCustomerDetails

▸ **getCustomerDetails**(`options`): `Promise`\<``null`` \| [`UserDetails`](../interfaces/UserDetails.md)\>

Fetches the authenticated customer's details (for customer auth type).
Returns null on failure so that initialization is not blocked.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`GetCustomerDetailsOptions`](../interfaces/GetCustomerDetailsOptions.md) |

#### Returns

`Promise`\<``null`` \| [`UserDetails`](../interfaces/UserDetails.md)\>

#### Defined in

[core/api/ApiHelper.ts:1050](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1050)

___

### getDeploymentInfo

▸ **getDeploymentInfo**(`domain`): `Promise`\<`any`\>

Gets the deployment information for a given domain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `domain` | `string` | The domain to get the deployment information for |

#### Returns

`Promise`\<`any`\>

The deployment information

#### Defined in

[core/api/ApiHelper.ts:1082](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1082)

___

### clearDeploymentInfoCache

▸ **clearDeploymentInfoCache**(): `void`

Clears the static deployment info cache

#### Returns

`void`

#### Defined in

[core/api/ApiHelper.ts:1122](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1122)
