[@egain/ai-agent-sdk API Reference - v0.6.0](../README.md) / ApiHelper

# Class: ApiHelper

API Helper class for making eGain AI Agent API calls

## Table of contents

### Constructors

- [constructor](ApiHelper.md#constructor)

### Methods

- [setStaticCacheAdapter](ApiHelper.md#setstaticcacheadapter)
- [setLanguage](ApiHelper.md#setlanguage)
- [getAiAgentDetails](ApiHelper.md#getaiagentdetails)
- [getAiAgentSession](ApiHelper.md#getaiagentsession)
- [getPortalDetails](ApiHelper.md#getportaldetails)
- [getConnectedApps](ApiHelper.md#getconnectedapps)
- [getPreviousTranscript](ApiHelper.md#getprevioustranscript)
- [getMaskingPatterns](ApiHelper.md#getmaskingpatterns)
- [getMyPortals](ApiHelper.md#getmyportals)
- [getPortals](ApiHelper.md#getportals)
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

[core/api/ApiHelper.ts:363](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L363)

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

[core/api/ApiHelper.ts:359](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L359)

___

### setLanguage

▸ **setLanguage**(`language`): `void`

Updates the default language for API calls (e.g. after agent details are loaded).

#### Parameters

| Name | Type |
| :------ | :------ |
| `language` | `string` |

#### Returns

`void`

#### Defined in

[core/api/ApiHelper.ts:392](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L392)

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

[core/api/ApiHelper.ts:516](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L516)

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

[core/api/ApiHelper.ts:554](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L554)

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

[core/api/ApiHelper.ts:606](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L606)

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

[core/api/ApiHelper.ts:653](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L653)

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

[core/api/ApiHelper.ts:692](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L692)

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

[core/api/ApiHelper.ts:723](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L723)

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
  userId: 'user-123'
});
```

#### Defined in

[core/api/ApiHelper.ts:780](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L780)

___

### getPortals

▸ **getPortals**(`options`): `Promise`\<`any`[]\>

Gets all portals in the partition/department via `GET .../knowledge/portalmgr/v3/portals` (paginated).
Used for customer and anonymous customer portal lists (Get All Portals API).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`GetPortalsOptions`](../interfaces/GetPortalsOptions.md) | Options for the API call |

#### Returns

`Promise`\<`any`[]\>

Promise resolving to array of Portal objects

**`Throws`**

Error if the API request fails

**`Example`**

```typescript
const portals = await apiHelper.getPortals({
  authToken: token,
  departmentId: 12,
});
```

#### Defined in

[core/api/ApiHelper.ts:821](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L821)

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

[core/api/ApiHelper.ts:934](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L934)

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

[core/api/ApiHelper.ts:987](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L987)

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

[core/api/ApiHelper.ts:1043](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1043)

___

### clearCache

▸ **clearCache**(): `void`

Clears all cached entries for this ApiHelper instance

#### Returns

`void`

#### Defined in

[core/api/ApiHelper.ts:1070](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1070)

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

[core/api/ApiHelper.ts:1081](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1081)

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

[core/api/ApiHelper.ts:1104](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1104)

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

[core/api/ApiHelper.ts:1138](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1138)

___

### getDeploymentInfo

▸ **getDeploymentInfo**(`domain`, `cache?`): `Promise`\<`any`\>

Gets the deployment information for a given domain

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `domain` | `string` | The domain to get the deployment information for |
| `cache?` | `Pick`\<[`CacheConfig`](../interfaces/CacheConfig.md), ``"enabled"``\> | - |

#### Returns

`Promise`\<`any`\>

The deployment information

#### Defined in

[core/api/ApiHelper.ts:1170](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1170)

___

### clearDeploymentInfoCache

▸ **clearDeploymentInfoCache**(): `void`

Clears the static deployment info cache

#### Returns

`void`

#### Defined in

[core/api/ApiHelper.ts:1210](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1210)
