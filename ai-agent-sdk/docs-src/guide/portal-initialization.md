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
| `platform` | Platform id for loading the connector script (e.g. genesys) |
| `env` | Deployment environment hint for connector URL resolution |

Other keys are stored and returned from `agent.getInitParams()`.

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

For **`userType === 'customer'`** (or `initParams.authType === 'customer'`), profile handling aligns with cc-widget: user profile APIs may be skipped or defaulted from portal settings. **`PUT .../userprofiles/.../select`** runs for agent/user flows (or legacy unset typing). See JSDoc on `PortalInitializer` in the source for the full parity matrix.

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

await agent.initialize();
```

## Restarting the pipeline

- **`restartPortalInitializer()`** — For agents that **completed** the CC portal pipeline, tears down state and re-runs portal → agent → profile selection. If the agent never used that pipeline, this delegates to `restartConnection()`.
- **`updateUserProfile(profile)`** — After initialization, switch profile without re-running the full pipeline (persists selection, clears queue/transcript, new session).

## Related docs

- [Platform connectors](./platform-connectors.md) — connector script contract
- [Events](./events.md) — portal and platform event payloads
- [Authentication](./authentication.md) — PKCE options for CC (`authScheme`, scopes, `localLogin`)
