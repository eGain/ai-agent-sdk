[@egain/ai-agent-sdk API Reference - v0.2.2-beta.0](../README.md) / ApiHelper

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

[core/api/ApiHelper.ts:369](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L369)

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

[core/api/ApiHelper.ts:365](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L365)

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

[core/api/ApiHelper.ts:515](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L515)

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

[core/api/ApiHelper.ts:553](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L553)

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

[core/api/ApiHelper.ts:592](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L592)

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

[core/api/ApiHelper.ts:639](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L639)

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

[core/api/ApiHelper.ts:678](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L678)

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

[core/api/ApiHelper.ts:709](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L709)

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

[core/api/ApiHelper.ts:767](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L767)

___

### getPortals

▸ **getPortals**(`options`): `Promise`\<`any`[]\>

Gets all portals in the partition/department via `GET .../knowledge/portalmgr/v3/portals` (paginated).
Used for customer and anonymous customer portal lists (Get All Portals API).
Responses are not cached (portal lists are always fetched fresh).

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
  language: 'en-us',
  shortUrlTemplate: 'ombre',
});
```

#### Defined in

[core/api/ApiHelper.ts:810](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L810)

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

[core/api/ApiHelper.ts:911](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L911)

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

[core/api/ApiHelper.ts:964](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L964)

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

[core/api/ApiHelper.ts:1020](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1020)

___

### clearCache

▸ **clearCache**(): `void`

Clears all cached entries for this ApiHelper instance

#### Returns

`void`

#### Defined in

[core/api/ApiHelper.ts:1047](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1047)

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

[core/api/ApiHelper.ts:1058](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1058)

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

[core/api/ApiHelper.ts:1081](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1081)

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

[core/api/ApiHelper.ts:1112](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1112)

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

[core/api/ApiHelper.ts:1144](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1144)

___

### clearDeploymentInfoCache

▸ **clearDeploymentInfoCache**(): `void`

Clears the static deployment info cache

#### Returns

`void`

#### Defined in

[core/api/ApiHelper.ts:1184](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1184)
