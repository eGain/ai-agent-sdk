# Portal initialization (contact center)

For contact center (CC) deployments, the SDK can run a **REST-only initialization pipeline** before opening the WebSocket. This mirrors the cc-widget flow: resolve portals, optionally pick an agent, pick a user profile, then emit `initialized` so your app can call `connect()`.

## When the pipeline runs

During `initialize()`, if agent details indicate a CC-style setup (portals / default-agent mode), the SDK starts an internal `PortalInitializer` chain. The pipeline has **no WebSocket** until you call `connect()` (or use `autoConnect: true` after `initialized`).

```text
initialize
    │
    ▼
Fetch portals
    │
    ├─── selection needed? ── No (auto path) ──► initialized ──► connect
    │
    Yes
    │
    ▼
portalsAvailable ──► selectPortal
    │
    ▼
(optional) agentsAvailable ──► selectAgent
    │
    ▼
profilesAvailable ──► selectUserProfile
    │
    ▼
initialized ──► connect
```

## Configuration

### `initParams`

Pass host-driven parameters explicitly (the SDK stays URL-agnostic):

| Key | Role |
|-----|------|
| `agentid` | When set and not default-agent flow, portals are intersected with `agentDetails.portals` (cc-widget parity) |
| `departmentId` | Optional fallback when agent department is missing |
| `portalIds` | Comma-separated IDs; skips `getMyPortals` and uses minimal portal objects |
| `templateName` | Theme short URL template (sent as `shortUrlTemplate` to portalmgr APIs) |
| `authType` | `"user"` or `"customer"` |
| `scopes` | Comma-separated OAuth scopes; when non-empty after parsing, **overrides** `config.scopes` |
| `userid` | User id for portal cache keying |
| `isDefaultAgent` | `"true"` enables **Flow B** (agent selection from a list) |
| `platform` | Platform id for loading the connector script (e.g. `genesys`, `standalone`, `test`). Loaded when agent type is contact-center; `test` uses the standalone connector URL |
| `env` | Deployment environment hint for connector URL resolution |

Other keys are stored and returned from `agent.getInitParams()`.

### Initialization context (`initialize({ context })`)

Pass host KB context when calling `initialize()` (or set `AiAgentConfig.context`). The SDK stores it for chat reconnect via `setContext` and uses it during the portal pipeline:

| Context key | Effect |
|-------------|--------|
| `egain_portal_id` | When multiple portals remain after list fetch/filter, auto-select the matching portal (no `portalsAvailable` if matched) |
| `egain_personalization_profile_id` | When multiple profiles are available, auto-select the matching profile **before** server `isLastUsedInPortal` (v0.2.1+); customer mode may use a synthetic profile when the id is not the portal default |

Values may be plain strings or eGain attribute objects `{ value: "..." }`. Non-matching ids fall back to the normal auto-select rules below.

After a portal is selected, the SDK also includes `egain_portal_id` in the session `POST` body when creating or restarting chat sessions (merged with any stored portal attribute metadata). See [Context management](./context-management.md#session-creation-post-context).

### Profile auto-select priority (multiple profiles)

When the pipeline has a profile list and more than one row, the SDK picks in this order:

1. **`egain_personalization_profile_id`** in initialization context (if that id exists in the list)
2. Profile with **`isLastUsedInPortal: true`**
3. Portal **default** profile from portal settings
4. Otherwise emit **`profilesAvailable`** for the host to call `selectUserProfile`

### Top-level `AiAgentConfig`

- **`scopes`** — Custom OAuth resource scopes (defaults differ for agent vs customer).
- **`platformScriptUrl`** — Override URL for the platform connector script.
- **`authScheme`** — `'popup'` or `'redirect'` when the SDK **auto-builds** PKCE from deployment info (ignored if you pass a full `PKCEAuthConfig` in `auth`).
- **`sessionId`** — Skip session fetch if you already have a session id.

## Events and selection methods

Listen for selection events and call the matching method when the user chooses an item:

| Event | When | Your action |
|-------|------|-------------|
| `portalsAvailable` | Multiple (or filtered) portals need a choice | `agent.selectPortal(portal)` |
| `agentsAvailable` | Flow B: multiple agents for the portal | `agent.selectAgent(agent)` |
| `profilesAvailable` | Multiple profiles need a choice | `agent.selectUserProfile(profile)` |
| `initialized` | Pipeline finished (includes portal / agent / profile data when applicable) | Call `await agent.connect()` (unless `autoConnect` handles it) |

When there is only one portal, agent, or profile, the SDK may auto-select and continue without emitting the corresponding “available” event.

## Customer vs agent behavior

For **`userType === 'customer'`** (or `initParams.authType === 'customer'`) with KB portals configured, the pipeline uses `getPortals()` and intersects with `agentDetails.portals` (0.2.0). Profile handling aligns with cc-widget: user profile APIs may be skipped or defaulted from portal settings. **`PUT .../userprofiles/.../select`** runs for agent/user flows (or legacy unset typing). See JSDoc on `PortalInitializer` in the source for the full parity matrix.

User/customer details (`getUserDetails()` / `getCustomerDetails()`) are fetched only when the agent requires authentication (`agentDetails.isAuthenticated`). Unauthenticated agents skip that call; `agent.getUserDetails()` stays `null`. Platform connectors reading **`HookContract.getUserId()`** get that details `id` (once fetched), not `initParams.userid`.

## Example

```typescript
import { AiAgent, LogLevel } from "@egain/ai-agent-sdk";

const agent = new AiAgent({
  id: "your-agent-id",
  endpoint: "https://your-api-host",
  logLevel: LogLevel.DEBUG,
  initParams: {
    authType: "user",
    userid: "user-123",
    platform: "genesys",
  },
  authScheme: "popup",
});

agent.on("portalsAvailable", (e) => {
  const portal = pickPortalUi(e.payload.portals);
  agent.selectPortal(portal);
});

agent.on("agentsAvailable", (e) => {
  const a = pickAgentUi(e.payload.agents);
  agent.selectAgent(a);
});

agent.on("profilesAvailable", (e) => {
  const p = pickProfileUi(e.payload.profiles);
  agent.selectUserProfile(p);
});

agent.on("initialized", async () => {
  await agent.connect();
});

agent.on("agentMessage", (e) => {
  console.log(e.payload.message?.content);
});

await agent.initialize({
  // Optional: auto-select portal/profile when ids match the fetched lists
  // context: { egain_portal_id: { value: "123" }, egain_personalization_profile_id: { value: "456" } },
});
```

## Restarting the pipeline

- **`restartPortalInitializer()`** — For agents that **completed** the CC portal pipeline, tears down state and re-runs portal → agent → profile selection. Clears the portal-scoped profile list cache so profiles are refetched. If the agent never used that pipeline, this delegates to `restartConnection()`.
- **`updateUserProfile(profile)`** — After initialization, switch profile without re-running the full pipeline: persists selection via portalmgr select (when applicable), **invalidates cached profile lists** (pipeline `eg_profiles_*` and `ApiHelper` `getUserProfiles`), clears queue/transcript, starts a new session, and emits `initialized` with the new profile.

## Related docs

- [Platform connectors](./platform-connectors.md) — connector script contract
- [Events](./events.md) — portal and platform event payloads
- [Context management](./context-management.md) — `initialize({ context })` and chat context
- [Authentication](./authentication.md) — PKCE options for CC (`authScheme`, scopes, `localLogin`)
