# Platform connectors

Contact center integrations (e.g. Genesys, Amazon Connect) use a **platform connector script** that the SDK loads during initialization. The script registers a global **`PlatformComponentService`** implementation. The SDK builds a **`HookContract`** and passes it to the connector so telephony state and chat actions stay in sync.

::: tip Audience
`HookContract` and `PlatformComponentService` types are exported for **connector authors**. Typical SDK consumers only set `initParams.platform` / `platformScriptUrl` on `AiAgent` and handle [portal initialization](./portal-initialization.md) events.
:::

## Lifecycle

1. During `initialize()`, when `initParams.platform` is set and the agent is `contact-center`, the SDK resolves a connector script URL (from `initParams.platform` + environment, or `AiAgentConfig.platformScriptUrl`). This includes **`standalone`** and **`test`** (the latter maps to the standalone connector path).
2. The script is injected in the browser (`<script>`) or dynamically imported in Node.
3. The SDK expects `globalThis.PlatformComponentService` (or `window.PlatformComponentService`) to exist after load.
4. The SDK wires **`HookContract`** (via `setHookContract` / `loadCustomHook` as available) so the connector can augment auth scopes before login, then continues authentication and the portal initialization pipeline as needed.

Internal helpers (`PlatformScriptLoader`, `PortalInitializer`) are **not** exported from the package barrel; use the public types below when authoring connectors.

## `PlatformComponentService`

Implement this interface on the global object:

| Member | Required | Description |
|--------|----------|-------------|
| `initPlatform` | Yes | Main entry: receive `HookContract`, connect to the telephony platform |
| `getPortalList` | No | Filter or reorder portals after the SDK fetches them |
| `getDefaultPortal` | No | Suggest a default portal; return `null` to use SDK count-based logic |
| `onPortalSelected` | No | After portal selection; may return filter tags (`Record<string, string[]>`) |
| `addCustomAuthScopes` | No | Augment OAuth scopes before login |
| `loadCustomHook` | No | Attach custom behavior to the hook contract |
| `setHookContract` | No | Receive the same contract reference (optional duplicate of `initPlatform` arg) |

```typescript
import type { HookContract, PlatformComponentService } from "@egain/ai-agent-sdk";

const service: PlatformComponentService = {
  async initPlatform(hook: HookContract) {
    // e.g. subscribe to Genesys events, call hook.setConversationId(...)
  },
};

window.PlatformComponentService = service;
```

## `HookContract`

The SDK provides a live implementation of **`HookContract`**. Connectors use it to read agent/init state and push telephony data into the SDK.

### Read-only getters

Examples include: `getTranscript`, `getInitParams`, `getQueryParams` (legacy alias for `getInitParams`, for older connectors such as Genesys), `getAgentDetails`, `getMsalAccessToken`, `getAccessToken`, `getDeploymentInfo`, `getPlatformType`, `getEnvironment`, `getUserId`, `getUserContext`, `getConversationId`, `getAuthScopes`, `getTenantId`, `getSelectedPortal`, `getCallerInfo`.

::: tip Legacy connectors
Prefer **`getInitParams()`** in new connector code. **`getQueryParams()`** returns the same shallow copy of init params so existing connectors that still call the old name keep working.
:::

Notable getter semantics (cc-widget parity):

| Getter | Behavior |
|--------|----------|
| `getMsalAccessToken()` | Returns `string \| null` **synchronously** — the last token cached after auth/`getToken()`. Do not treat it as a `Promise`. |
| `getAccessToken()` | Returns `Promise<string \| null>` — refreshes the token if expired before returning. Prefer this when making API calls that require a guaranteed valid token. |
| `getUserId()` | Returns the authenticated user/customer details `id` after that fetch completes, or `null` if unavailable. Not the query/init `userid` param. |

### Mutators

- **`addToTranscript`** — Append to the **call** transcript (telephony conversation), not the WebSocket chat transcript.
- **`setCallerInfo`**, **`setConversationId`**, **`setUserContext`**, **`setUserFilterTags`**, **`setPlatformAuthenticated`**, **`setPlatformToken`**

### Chat / widget hooks

- **`subscribeToAgentWidgetActions`** — Returns an unsubscribe function.
- **`onUserMessage`**, **`onSourceClick`**, **`onIntentConfirm`**

## Types

- **`CallTranscriptEntry`** — `{ sender, content, timestamp: Date }` for telephony transcript lines.
- **`CallerInfo`** — Optional `name`, `phone`, `email`, plus index signature for extra fields.

The SDK surfaces connector-driven updates as events on `AiAgent` (e.g. `callTranscriptUpdate`, `callerInfoUpdate`, `conversationIdUpdate`, `userContextUpdate`, `filterTagsUpdate`). See [Events](./events.md).

## Configuration from the host app

- **`platformScriptUrl`** — Load a specific script URL (local dev or custom hosting).
- **`initParams.platform`** — Select connector family; combined with environment to build the default script URL inside the SDK. Loaded for contact-center agents whenever set (including `standalone` / `test`).

## See also

- [Portal initialization](./portal-initialization.md)
- [HookContract](/api-generated/interfaces/HookContract) · [CallerInfo](/api-generated/interfaces/CallerInfo) · [CallTranscriptEntry](/api-generated/interfaces/CallTranscriptEntry) · [PlatformComponentService](/api-generated/interfaces/PlatformComponentService)
