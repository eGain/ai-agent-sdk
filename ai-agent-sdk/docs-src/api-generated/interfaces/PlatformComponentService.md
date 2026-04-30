[@eGain/ai-agent-sdk API Reference - v0.1.0](../README.md) / PlatformComponentService

# Interface: PlatformComponentService

Contract that platform connector scripts must implement.

All methods except `initPlatform` are optional — the SDK calls them
when present and silently skips them when absent.

## Table of contents

### Properties

- [initPlatform](PlatformComponentService.md#initplatform)
- [getPortalList](PlatformComponentService.md#getportallist)
- [getDefaultPortal](PlatformComponentService.md#getdefaultportal)
- [onPortalSelected](PlatformComponentService.md#onportalselected)
- [addCustomAuthScopes](PlatformComponentService.md#addcustomauthscopes)
- [loadCustomHook](PlatformComponentService.md#loadcustomhook)
- [setHookContract](PlatformComponentService.md#sethookcontract)

## Properties

### initPlatform

• **initPlatform**: (`hookContract`: [`HookContract`](HookContract.md)) => `Promise`\<`void`\>

Main connector initialization (e.g., connecting to Genesys/NICE). Called after authentication, before the CC pipeline starts.

#### Type declaration

▸ (`hookContract`): `Promise`\<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `hookContract` | [`HookContract`](HookContract.md) |

##### Returns

`Promise`\<`void`\>

#### Defined in

[core/platform/PlatformComponentService.ts:23](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/platform/PlatformComponentService.ts#L23)

___

### getPortalList

• `Optional` **getPortalList**: (`filteredPortals`: [`Portal`](Portal.md)[]) => [`Portal`](Portal.md)[] \| `Promise`\<[`Portal`](Portal.md)[]\>

Filter or reorder the portal list after fetching.

#### Type declaration

▸ (`filteredPortals`): [`Portal`](Portal.md)[] \| `Promise`\<[`Portal`](Portal.md)[]\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `filteredPortals` | [`Portal`](Portal.md)[] |

##### Returns

[`Portal`](Portal.md)[] \| `Promise`\<[`Portal`](Portal.md)[]\>

#### Defined in

[core/platform/PlatformComponentService.ts:26](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/platform/PlatformComponentService.ts#L26)

___

### getDefaultPortal

• `Optional` **getDefaultPortal**: (`portalList`: [`Portal`](Portal.md)[]) => ``null`` \| [`Portal`](Portal.md) \| `Promise`\<``null`` \| [`Portal`](Portal.md)\>

Auto-select a default portal. Receives the output of `getPortalList`. Return `null` to fall through to count-based logic.

#### Type declaration

▸ (`portalList`): ``null`` \| [`Portal`](Portal.md) \| `Promise`\<``null`` \| [`Portal`](Portal.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `portalList` | [`Portal`](Portal.md)[] |

##### Returns

``null`` \| [`Portal`](Portal.md) \| `Promise`\<``null`` \| [`Portal`](Portal.md)\>

#### Defined in

[core/platform/PlatformComponentService.ts:29](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/platform/PlatformComponentService.ts#L29)

___

### onPortalSelected

• `Optional` **onPortalSelected**: (`portal`: [`Portal`](Portal.md)) => `Record`\<`string`, `string`[]\> \| `Promise`\<`Record`\<`string`, `string`[]\>\>

Called after a portal is selected. Returns filter tags (`Record<string, string[]>`) stored via `setUserFilterTags`.

#### Type declaration

▸ (`portal`): `Record`\<`string`, `string`[]\> \| `Promise`\<`Record`\<`string`, `string`[]\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `portal` | [`Portal`](Portal.md) |

##### Returns

`Record`\<`string`, `string`[]\> \| `Promise`\<`Record`\<`string`, `string`[]\>\>

#### Defined in

[core/platform/PlatformComponentService.ts:32](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/platform/PlatformComponentService.ts#L32)

___

### addCustomAuthScopes

• `Optional` **addCustomAuthScopes**: (`scopes`: `string`[]) => `string`[] \| `Promise`\<`string`[]\>

Modify OAuth scopes before authentication. Returns the augmented scopes array.

#### Type declaration

▸ (`scopes`): `string`[] \| `Promise`\<`string`[]\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `scopes` | `string`[] |

##### Returns

`string`[] \| `Promise`\<`string`[]\>

#### Defined in

[core/platform/PlatformComponentService.ts:35](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/platform/PlatformComponentService.ts#L35)

___

### loadCustomHook

• `Optional` **loadCustomHook**: (`hookContract`: [`HookContract`](HookContract.md)) => `void`

Register custom hooks on the HookContract.

#### Type declaration

▸ (`hookContract`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `hookContract` | [`HookContract`](HookContract.md) |

##### Returns

`void`

#### Defined in

[core/platform/PlatformComponentService.ts:38](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/platform/PlatformComponentService.ts#L38)

___

### setHookContract

• `Optional` **setHookContract**: (`hookContract`: [`HookContract`](HookContract.md)) => `void`

Receive the HookContract for bidirectional communication with the SDK.

#### Type declaration

▸ (`hookContract`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `hookContract` | [`HookContract`](HookContract.md) |

##### Returns

`void`

#### Defined in

[core/platform/PlatformComponentService.ts:41](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/platform/PlatformComponentService.ts#L41)
