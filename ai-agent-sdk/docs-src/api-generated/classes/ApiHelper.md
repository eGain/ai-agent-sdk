[@egain/ai-agent-sdk API Reference - v0.2.5](../README.md) / ApiHelper

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

[core/api/ApiHelper.ts:358](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L358)

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

[core/api/ApiHelper.ts:354](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L354)

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

[core/api/ApiHelper.ts:387](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L387)

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

[core/api/ApiHelper.ts:511](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L511)

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

[core/api/ApiHelper.ts:549](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L549)

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

[core/api/ApiHelper.ts:594](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L594)

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

[core/api/ApiHelper.ts:641](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L641)

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

[core/api/ApiHelper.ts:680](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L680)

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

[core/api/ApiHelper.ts:711](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L711)

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

[core/api/ApiHelper.ts:768](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L768)

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

[core/api/ApiHelper.ts:809](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L809)

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

[core/api/ApiHelper.ts:922](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L922)

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

[core/api/ApiHelper.ts:975](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L975)

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

[core/api/ApiHelper.ts:1031](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1031)

___

### clearCache

▸ **clearCache**(): `void`

Clears all cached entries for this ApiHelper instance

#### Returns

`void`

#### Defined in

[core/api/ApiHelper.ts:1058](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1058)

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

[core/api/ApiHelper.ts:1069](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1069)

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

[core/api/ApiHelper.ts:1092](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1092)

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

[core/api/ApiHelper.ts:1123](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1123)

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

[core/api/ApiHelper.ts:1155](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1155)

___

### clearDeploymentInfoCache

▸ **clearDeploymentInfoCache**(): `void`

Clears the static deployment info cache

#### Returns

`void`

#### Defined in

[core/api/ApiHelper.ts:1195](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/ApiHelper.ts#L1195)
