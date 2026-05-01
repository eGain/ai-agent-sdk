# Error Handling

The SDK uses typed errors and an event-based system to help you handle errors gracefully.

## Error Types

```typescript
import {
  SDKError,       // Base class
  AuthError,      // Authentication issues
  ConnectionError, // Connection issues
  MessageError    // Message issues
} from "@egain/ai-agent-sdk";
```

## Handling Errors

### Event-Based Handling

Most errors are emitted as events:

```typescript
agent.on("error", (event) => {
  const error = event.payload.error;
  
  if (error instanceof AuthError) {
    console.error("Authentication failed:", error.message);
    redirectToLogin();
  } else if (error instanceof ConnectionError) {
    console.error("Connection issue:", error.message);
    showReconnectingUI();
  } else if (error instanceof MessageError) {
    console.error("Message failed:", error.message);
    showRetryButton();
  } else {
    console.error("Unknown error:", error);
  }
});
```

### Error Message Events

Handle errors from the agent server:

```typescript
agent.on("errorMessage", (event) => {
  const { message, error } = event.payload;
  
  console.error("Server error:", error.message);
  
  // Show user-friendly message
  showNotification("Something went wrong. Please try again.");
});
```

### Try-Catch for Methods

Some methods can throw directly:

```typescript
try {
  await agent.initialize();
} catch (error) {
  if (error instanceof AuthError) {
    console.error("Auth failed during init");
  }
  throw error;
}
```

## Common Error Scenarios

### Initialization Errors

```typescript
try {
  await agent.initialize();
} catch (error) {
  if (error.message.includes("Deployment information not found")) {
    showError("Invalid endpoint configuration");
  } else if (error instanceof AuthError) {
    showError("Invalid credentials");
  }
}
```

### Connection Errors

```typescript
agent.on("error", (event) => {
  if (event.payload.error instanceof ConnectionError) {
    // SDK handles reconnection automatically
    showReconnectingBanner();
  }
});

agent.on("stateChanged", (event) => {
  if (event.payload.state === "CONNECTED") {
    hideReconnectingBanner();
  }
});
```

### Token Expiration

```typescript
agent.on("tokenExpiring", async (event) => {
  try {
    const newToken = await refreshToken();
    await agent.updateAccessToken(newToken);
  } catch (error) {
    // Token refresh failed
    redirectToLogin();
  }
});
```

## Error Recovery

### Automatic Recovery

The SDK automatically handles:
- **Reconnection** - Exponential backoff retry
- **Message queuing** - Messages sent when offline are queued
- **Queue flushing** - Queued messages sent on reconnect

### Manual Recovery

```typescript
// Retry connection
if (!agent.isConnected()) {
  try {
    await agent.connect();
  } catch (error) {
    console.error("Manual connect failed:", error);
  }
}

// Restart with fresh session
try {
  await agent.restartConnection();
} catch (error) {
  console.error("Restart failed:", error);
}
```

## Best Practices

### 1. Always Listen for Errors

```typescript
// ❌ Bad - errors are ignored
const agent = new AiAgent({ ... });
await agent.initialize();

// ✅ Good - errors are handled
agent.on("error", handleError);
await agent.initialize();
```

### 2. Use Error Types

```typescript
// ❌ Bad - string matching
if (error.message.includes("auth")) { ... }

// ✅ Good - type checking
if (error instanceof AuthError) { ... }
```

### 3. Provide User Feedback

```typescript
agent.on("error", (event) => {
  // Log for debugging
  console.error(event.payload.error);
  
  // Show user-friendly message
  showNotification("Connection issue. We're working on it!");
});
```

### 4. Report to Error Tracking

```typescript
agent.on("error", (event) => {
  Sentry.captureException(event.payload.error, {
    extra: {
      sessionId: event.sessionId,
      agentId: event.agentId
    }
  });
});
```

## Error Reference

| Error | Cause | Recovery |
|-------|-------|----------|
| `AuthError` | Invalid credentials, expired token | Re-authenticate |
| `ConnectionError` | Network issue, server down | Wait for reconnect |
| `MessageError` | Invalid message, queue full | Retry or check format |
