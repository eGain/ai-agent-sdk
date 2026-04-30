# Context Management

Context allows you to provide additional information about the user or session to personalize agent responses.

## Sending Context

```typescript
import { AiAgent, createContextMessage } from "@eGain/ai-agent-sdk";

const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  auth: { type: "pre-auth", accessToken: "your-access-token" }
});

await agent.initialize();
await agent.connect();

// Send context information
await agent.send(createContextMessage({
  context: {
    userId: "user-123",
    accountType: "premium",
    language: "en",
    timezone: "America/New_York",
    previousInteractions: 15
  }
}));
```

## Automatic Caching

Context messages are automatically cached by the SDK:

```typescript
// Send context - automatically cached
await agent.send(createContextMessage({
  context: { userId: "user-123" }
}));

// Context persists across page refreshes (session storage)
// When you restart the connection, context is auto-sent

await agent.restartConnection();
// Context is automatically sent to new session!
```

## Retrieving Context

```typescript
// Get stored context
const context = agent.getContext();
console.log(context);
// { userId: "user-123", accountType: "premium", ... }
```

## Removing Context

```typescript
// Remove context (e.g., on user logout)
agent.removeContext();
```

## Context Best Practices

### 1. Send Context Early

```typescript
await agent.initialize();
await agent.connect();

// Send context before any user messages
await agent.send(createContextMessage({
  context: {
    userId: currentUser.id,
    name: currentUser.name
  }
}));

// Now start the conversation
await agent.send("Hello!");
```

### 2. Include Relevant Information

```typescript
const context = {
  // User identification
  userId: user.id,
  accountId: user.accountId,
  
  // Preferences
  language: user.preferredLanguage,
  timezone: user.timezone,
  
  // Account details
  accountType: user.subscription,
  memberSince: user.createdAt,
  
  // Session info
  currentPage: window.location.pathname,
  referrer: document.referrer,
  
  // Support context
  openTickets: user.ticketCount,
  lastInteraction: user.lastSupportDate
};

await agent.send(createContextMessage({ context }));
```

### 3. Update Context When Needed

```typescript
// Initial context
await agent.send(createContextMessage({
  context: { page: "home" }
}));

// User navigates
function onPageChange(newPage) {
  agent.send(createContextMessage({
    context: { page: newPage }
  }));
}
```

## Cache Configuration

Context caching uses the same configuration as the agent:

```typescript
const agent = new AiAgent({
  // ...
  cache: {
    enabled: true,
    storageType: "session",  // "local", "session", "memory"
    ttl: 300000              // 5 minutes
  }
});
```

| Storage Type | Persistence | Use Case |
|--------------|-------------|----------|
| `session` | Tab lifetime | Most apps (default) |
| `local` | Browser lifetime | Persistent sessions |
| `memory` | Page lifetime | Sensitive data |

## Custom Cache Adapter

```typescript
const customAdapter: CacheAdapter = {
  get: (key) => myStore.get(key),
  set: (key, entry) => myStore.set(key, entry),
  delete: (key) => myStore.delete(key),
  clear: (prefix) => myStore.clear(prefix),
  keys: (prefix) => myStore.keys(prefix)
};

const agent = new AiAgent({
  // ...
  cache: {
    enabled: true,
    adapter: customAdapter
  }
});
```
