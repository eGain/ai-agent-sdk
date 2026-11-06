# Client Actions

A client action is something the server asks the browser to do on its behalf. The first one is **`pkce_user_auth`**. When an agent tool needs to call a third-party API *as the end user*, the server pauses the tool, and the browser has the person sign in to that provider. The tool then resumes with their token.

Every action arrives in the same envelope and moves through the same lifecycle, so one integration covers any type:

- The SDK supplies handlers for some types, such as `createPkceUserAuthHandler()`.
- A host can register its own handlers for others.
- Some actions need a click from the person. Others run as soon as they arrive.
- Some actions have the server waiting for an answer. Others are UI-only and nothing goes back.

## Opting In

Register a handler for each type the page can carry out, **before connecting**:

```typescript
import { AiAgent, createPkceUserAuthHandler } from "@egain/ai-agent-sdk";

const agent = new AiAgent({ id: "agent-id", endpoint: "https://your-endpoint.com" });
agent.registerClientActionHandler(createPkceUserAuthHandler());

await agent.initialize();
await agent.connect();
```

- The SDK answers any action it has no handler for with `unsupported`, straight away. For PKCE, the agent then carries on without the tool's data. An integration that registers nothing loses nothing except the action itself.
- Register before connecting, so no action can arrive before its handler is in place.
- Clients built on SDK versions before 0.4 don't understand client actions at all. They ignore the action, so that question goes unanswered until the person sends another message.

## Rendering an Action

`clientAction` fires when an action arrives. `clientActionUpdate` fires whenever it moves on.

```typescript
agent.on("clientAction", ({ payload: { action } }) => {
  if (action.type === "pkce_user_auth") {
    showSignInCard(action.actionId, action.payload); // serviceName, toolPurpose, scopes, ...
  }
});

agent.on("clientActionUpdate", ({ payload }) => {
  // payload.lifecycle: pending | in_progress | completed | failed | cancelled | expired
  updateCard(payload.actionId, payload.lifecycle, payload.progress);
});
```

For a `user-gesture` action, answer from the card's buttons:

```typescript
signInButton.onclick = () => {
  // Synchronously, with nothing awaited first: see below.
  void agent.performClientAction(actionId);
};
notNowButton.onclick = () => agent.declineClientAction(actionId);
```

### The user-gesture rule

**Call `performClientAction` synchronously inside the click handler.** A sign-in opens a popup, and browsers only allow that while a click is being handled. Anything awaited before the call, even a resolved promise, spends the click, and Safari and Firefox then block the popup. The SDK opens the window as the first thing it does inside the call.

## What the SDK Guarantees

- **Always answered.** An action the server waits on is answered whichever way it ends: completed, declined, failed, timed out, or unsupported. That includes a handler that throws: a `parse` that throws is answered `failed` / `invalid_payload`, and a `tryWithoutUser` that throws falls back to asking the person. The server never waits on a page that has gone quiet.
- **Exactly once.** If a popup finishes after the action was already cancelled, the late outcome is dropped.
- **One at a time.** A new action the server waits on supersedes the previous one.
- **Typing cancels.** If the person sends a message instead, the pending action ends (`cancelled`). The typed message is the server's answer, so no separate result is sent.
- **Expiry.** The server says when it stops waiting (`expiresAt`). The SDK gives up a few seconds before that, and the action ends as `expired`.
- **Not queued.** A result is never queued while disconnected, because it may carry the person's access token. The server's own expiry ends the wait instead.
- **Every action ends with an update.** That includes the ones that end without a run: a payload the handler can't use (`failed` / `invalid_payload`), and every open action when `disconnect()` tears the agent down (`cancelled` / `disconnected`, not sent to the server). So a card always closes on `clientActionUpdate`, even one the host drew from the raw `client action` message before the SDK read its payload.

## Statuses and Lifecycle

| Status | Lifecycle | Sent to the server |
|--------|-----------|--------------------|
| `completed` | `completed` | yes |
| `declined` | `failed` | yes |
| `failed` (with a `reason`) | `failed` | yes |
| `unsupported` | `failed` | yes |
| `timeout` | `expired` | yes |
| `cancelled` | `cancelled` | no |
| `superseded` | `cancelled` | no |

## PKCE Sign-in (`pkce_user_auth`)

`createPkceUserAuthHandler()` only asks the person when it has to:

1. A token cached from an earlier sign-in in this tab finishes the action straight away.
2. Otherwise, a stored refresh token is used to get a new one.
3. Only then does the action wait for a click. `progress` reports `cached`, `refreshing`, `prompting`, `waiting` and `authorized` as it goes.

Failure reasons are `popup_blocked`, `state_mismatch`, `exchange_failed` and `unknown`. A closed popup counts as a decline.

The code exchange and every token refresh are sent from your page, so the provider's app must be a public client (PKCE, no client secret) that allows your page's origin for CORS on its token endpoint. Without that, the browser blocks the response and the sign-in fails with `exchange_failed`; the CORS error appears only in the browser console.

Tokens are kept in `sessionStorage`, so they last until the tab closes. `logout()` clears them. If the person signs out some other way, for example through your own sign-out endpoint, call `agent.clearClientActionCredentials()` so the next person to use the tab can't call the provider as them.

The provider keeps its own login session, in a cookie on its domain, and closing the tab does not end it. So every sign-in sends `prompt=login`, and the provider asks for credentials even when that session is still open. Otherwise the next person at a shared machine to click "Sign in" would be signed in as the previous one. Most providers honour `prompt=login` (it is part of OpenID Connect); one that ignores it reuses its session as before.

By default the handler uses the SDK's own `oidc-client-ts`. A page that already loads the library can pass its copy instead: `createPkceUserAuthHandler({ oidcClient: OidcClient })`.

## Writing a Handler

```typescript
import type { ClientActionHandler } from "@egain/ai-agent-sdk";

const refreshPage: ClientActionHandler<{ reason: string }> = {
  type: "refresh_page",
  interaction: "none", // runs on arrival
  parse: (payload) => (typeof payload === "object" && payload ? (payload as { reason: string }) : null),
  perform: async () => {
    window.location.reload();
    return { status: "completed" };
  },
};

agent.registerClientActionHandler(refreshPage);
```

Action types are defined by eGain, because the server has to know them. A handler only decides how the page carries one out.
