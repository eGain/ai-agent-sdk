# Connection Lifecycle

Understanding the connection lifecycle helps you build reliable applications that handle network conditions gracefully.

## Connection States

```
   ┌──────┐
   │ IDLE │◄────────────────────────────┐
   └──┬───┘                             │
      │ connect()                       │
      ▼                                 │
┌────────────┐                          │
│ CONNECTING │◄─────────┐               │
└─────┬──────┘          │               │
      │ success         │ retry         │
      ▼                 │               │
┌───────────┐      ┌────┴───────┐       │
│ CONNECTED │─────▶│RECONNECTING│       │
└─────┬─────┘      └────────────┘       │
      │ disconnect()                    │
      ▼                                 │
   ┌────────┐                           │
   │ CLOSED │───────────────────────────┘
   └────────┘
```

| State | Description |
|-------|-------------|
| `IDLE` | Initial state before any connection attempt |
| `CONNECTING` | Attempting to establish WebSocket connection |
| `CONNECTED` | WebSocket is open and ready |
| `RECONNECTING` | Connection lost, attempting to reconnect |
| `CLOSED` | Connection closed (gracefully or due to error) |

## Initialization

The agent must be initialized before use:

```typescript
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  auth: { type: "pre-auth", accessToken: "your-token" }
});

// Always await initialize()
await agent.initialize();

// Now you can connect
await agent.connect();
```

### Using Pre-Provided Session ID

If you already have a session ID (e.g., from a previous session or external source), you can provide it in the config to skip fetching from the network:

```typescript
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  auth: { type: "pre-auth", accessToken: "your-token" },
  sessionId: "existing-session-id"  // Skip network fetch
});

await agent.initialize();
// SessionId is used directly, no network call made
```

### Auto-Connect

Skip the manual connect step:

```typescript
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  auth: { type: "pre-auth", accessToken: "your-token" },
  autoConnect: true  // Connect automatically after initialize
});

await agent.initialize();
// Agent is now connected!
```

## Manual Connection Control

```typescript
// Check current state
const state = agent.getState();
console.log("Current state:", state);  // "CONNECTED", "IDLE", etc.

// Check if connected
if (agent.isConnected()) {
  await agent.send("Hello!");
}

// Connect manually
await agent.connect();

// Disconnect gracefully (sends disconnect message)
await agent.disconnect();

// Disconnect without graceful message
await agent.disconnect({ skipGracefulDisconnect: true });
```

## Reconnection

The SDK automatically reconnects with exponential backoff:

```typescript
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  auth: { type: "pre-auth", accessToken: "your-token" },
  
  // Reconnection settings
  maxReconnectAttempts: Infinity,   // Keep trying forever
  baseReconnectDelay: 1000,         // Start with 1 second
  maxReconnectDelay: 30000          // Cap at 30 seconds
});
```

### Reconnection Timing

```
Attempt 1: 1s delay
Attempt 2: 2s delay
Attempt 3: 4s delay
Attempt 4: 8s delay
Attempt 5: 16s delay
Attempt 6: 30s delay (capped)
Attempt 7+: 30s delay
```

### Handling Reconnection

```typescript
agent.on("stateChanged", (event) => {
  const { state, previousState } = event.payload;
  
  if (state === "RECONNECTING") {
    showReconnectingUI();
  } else if (state === "CONNECTED" && previousState === "RECONNECTING") {
    hideReconnectingUI();
    showReconnectedNotification();
  }
});
```

## Connection Restart

Restart with a fresh session (clears queue, transcript, sends stored context):

```typescript
// Useful when:
// - Starting a new conversation
// - User logs out/in
// - Need fresh session state

// Restart with a new sessionId (fetched from network)
await agent.restartConnection();

// Restart with a specific sessionId
await agent.restartConnection({ sessionId: 'existing-session-id' });

// Stored context is automatically sent to new session
```

### Updating Session ID After Initialization

You can update the session ID at runtime using `setSessionId()`:

```typescript
// Update sessionId
agent.setSessionId('new-session-id');

// If connected, restart with the new sessionId
if (agent.isConnected()) {
  await agent.restartConnection({ sessionId: 'new-session-id' });
}
```

## Event Handling

### Connection Established

```typescript
agent.on("connected", (event) => {
  console.log("Connected!", {
    sessionId: event.sessionId,
    agentId: event.agentId,
    at: new Date(event.timestamp)
  });
  
  enableChatInput();
});
```

### Connection Closed

```typescript
agent.on("closed", (event) => {
  const { code, reason } = event.payload;
  
  console.log(`Closed: ${code} - ${reason}`);
  
  // Common close codes:
  // 1000: Normal closure
  // 1001: Going away (page navigation)
  // 1006: Abnormal closure (network issue)
  // 4000+: Application-specific
  
  if (code === 1006) {
    showNetworkErrorMessage();
  }
});
```

### State Changes

```typescript
agent.on("stateChanged", (event) => {
  const { state, previousState } = event.payload;
  
  updateConnectionStatus(state);
  
  // Log state transitions
  console.log(`Connection: ${previousState} → ${state}`);
});
```

## Offline Behavior

When offline, messages are queued:

```typescript
// Send works even when offline
await agent.send("Hello!");  // Queued

// Check queue
console.log("Queued:", agent.getQueueSize());

// Messages sent automatically when reconnected
agent.on("queueFlushed", (event) => {
  console.log(`Sent ${event.payload.count} queued messages`);
});
```

## Graceful Shutdown

Always disconnect properly on application exit:

```typescript
// Browser
window.addEventListener("beforeunload", () => {
  agent.disconnect();
});

// Node.js
process.on("SIGINT", async () => {
  await agent.disconnect();
  process.exit(0);
});

// React
useEffect(() => {
  return () => {
    agent.disconnect();
  };
}, []);
```

## Error Handling

```typescript
agent.on("error", (event) => {
  const error = event.payload.error;
  
  if (error instanceof ConnectionError) {
    // Connection-specific errors
    handleConnectionError(error);
  }
});

// Connection errors include:
// - WebSocket connection failures
// - Network timeouts
// - Server rejections
```

## Best Practices

### 1. Wait for Connection

```typescript
async function sendWhenReady(message: string) {
  if (!agent.isConnected()) {
    // Wait for connection
    await new Promise<void>((resolve) => {
      agent.once("connected", () => resolve());
    });
  }
  
  await agent.send(message);
}
```

### 2. Handle All States

```typescript
function updateUI(state: ConnectionState) {
  switch (state) {
    case "IDLE":
      showConnectButton();
      break;
    case "CONNECTING":
      showConnectingSpinner();
      break;
    case "CONNECTED":
      showChatInterface();
      break;
    case "RECONNECTING":
      showReconnectingBanner();
      break;
    case "CLOSED":
      showDisconnectedMessage();
      break;
  }
}
```

### 3. Monitor Connection Health

```typescript
let lastHeartbeat = Date.now();

agent.on("heartbeat", () => {
  lastHeartbeat = Date.now();
});

setInterval(() => {
  const elapsed = Date.now() - lastHeartbeat;
  if (elapsed > 60000) {
    console.warn("No heartbeat for 60s");
  }
}, 10000);
```
