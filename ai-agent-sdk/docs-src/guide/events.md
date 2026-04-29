# Events

The SDK uses a type-safe event system for all communication. Events are the primary way to react to agent responses, connection state changes, and errors.

## Event Structure

All events follow a consistent structure:

```typescript
interface AgentEvent<T> {
  type: string;           // Event type identifier
  timestamp: number;      // Unix timestamp (ms)
  sessionId?: string;     // Current session ID
  agentId?: string;       // Agent ID
  payload: T;             // Event-specific data
}
```

## Connection Events

### `connected`

Emitted when WebSocket connection is established.

```typescript
agent.on("connected", (event) => {
  console.log("Connected!", {
    sessionId: event.sessionId,
    agentId: event.agentId,
    timestamp: new Date(event.timestamp)
  });
});
```

### `closed`

Emitted when connection is closed.

```typescript
agent.on("closed", (event) => {
  const { code, reason } = event.payload;
  console.log(`Connection closed: ${code} - ${reason}`);
});
```

**Payload:**
| Property | Type | Description |
|----------|------|-------------|
| `code` | `number?` | WebSocket close code |
| `reason` | `string?` | Close reason |

### `stateChanged`

Emitted on any connection state transition.

```typescript
agent.on("stateChanged", (event) => {
  const { state, previousState } = event.payload;
  console.log(`State: ${previousState} → ${state}`);
  
  switch (state) {
    case "CONNECTING":
      showConnectingIndicator();
      break;
    case "CONNECTED":
      hideConnectingIndicator();
      break;
    case "RECONNECTING":
      showReconnectingBanner();
      break;
    case "CLOSED":
      showDisconnectedMessage();
      break;
  }
});
```

**Connection States:**
| State | Description |
|-------|-------------|
| `IDLE` | Initial state, not connected |
| `CONNECTING` | Establishing connection |
| `CONNECTED` | Successfully connected |
| `RECONNECTING` | Attempting reconnection |
| `CLOSED` | Connection closed |

## Message Events

### `message`

Emitted for every incoming message (raw).

```typescript
agent.on("message", (event) => {
  console.log("Raw message:", event.payload.data);
});
```

### `agentMessage`

Emitted when an agent response is received (parsed and typed).

```typescript
agent.on("agentMessage", (event) => {
  const { message, from, to, attachments } = event.payload;
  
  console.log("Agent says:", message?.content);
  console.log("From:", from?.name);
  
  if (attachments?.length) {
    console.log("Attachments:", attachments);
  }
});
```

**Payload:**
| Property | Type | Description |
|----------|------|-------------|
| `message` | `Message` | The message object |
| `type` | `string` | Message type identifier |
| `from` | `object?` | Sender information |
| `to` | `object?` | Recipient information |
| `attachments` | `array?` | File attachments |

### `errorMessage`

Emitted when an error message is received from the agent.

```typescript
agent.on("errorMessage", (event) => {
  const { message, error } = event.payload;
  
  console.error("Error from agent:", error.message);
  console.error("Original message:", message);
  
  // Optionally show user-friendly error
  showErrorToUser("Something went wrong. Please try again.");
});
```

### `heartbeat`

Emitted when the agent is processing (typing indicator).

```typescript
agent.on("heartbeat", (event) => {
  showTypingIndicator();
  
  // Auto-hide after timeout
  setTimeout(() => {
    hideTypingIndicator();
  }, 3000);
});
```

## System Events

### `error`

Emitted on SDK errors (connection, auth, message processing).

```typescript
import { ConnectionError, AuthError, MessageError } from "@eGainDev/ai-agent-sdk";

agent.on("error", (event) => {
  const error = event.payload.error;
  
  if (error instanceof ConnectionError) {
    console.error("Connection error:", error.message);
    // Maybe retry or show offline UI
  } else if (error instanceof AuthError) {
    console.error("Auth error:", error.message);
    // Redirect to login
  } else if (error instanceof MessageError) {
    console.error("Message error:", error.message);
    // Show message failed UI
  }
});
```

### `queueFlushed`

Emitted when queued messages are sent after reconnection.

```typescript
agent.on("queueFlushed", (event) => {
  console.log(`Sent ${event.payload.count} queued messages`);
  showNotification("Your messages have been sent!");
});
```

### `tokenExpiring`

Emitted when authentication token is about to expire.

```typescript
agent.on("tokenExpiring", async (event) => {
  const { reason, expiresAt } = event.payload;
  
  if (reason === "expiring") {
    console.log(`Token expires at: ${new Date(expiresAt!)}`);
  }
  
  // Refresh the token
  const newToken = await refreshToken();
  await agent.updateAccessToken(newToken);
});
```

## Transcript Events

### `transcriptUpdate`

Emitted whenever the transcript is updated (message sent or received). Use this to track all message activity in real-time.

```typescript
agent.on("transcriptUpdate", (event) => {
  const { entry } = event.payload;
  
  console.log(`[${entry.direction.toUpperCase()}]`, entry.message.content);
  
  // Track sent vs received messages
  if (entry.direction === "sent") {
    console.log("User sent:", entry.message.content);
  } else {
    console.log("Agent replied:", entry.message.content);
  }
});
```

**Payload:**
| Property | Type | Description |
|----------|------|-------------|
| `entry` | `TranscriptEntry` | The transcript entry that was added |

**TranscriptEntry:**
| Property | Type | Description |
|----------|------|-------------|
| `message` | `Message` | The message object |
| `direction` | `"sent" \| "received"` | Message direction |
| `timestamp` | `number` | When the entry was added |
| `sessionId` | `string \| number?` | Session ID |
| `agentId` | `string \| number?` | Agent ID |

**Use cases:**
- Building a custom chat UI that updates on every message
- Logging all conversation activity
- Analytics and message tracking
- Syncing transcript with external systems

## Portal and platform events

These events support the [contact center portal initialization](./portal-initialization.md) flow and [platform connectors](./platform-connectors.md).

### `initialized`

Emitted when the REST initialization pipeline finishes (portal / agent / profile resolution). Payload always includes enough identity for the agent; when the CC pipeline runs, it may also include portal details, selected profile, and available lists.

```typescript
agent.on("initialized", async (event) => {
  const { portal, agent, profile, availablePortals, availableProfiles } = event.payload;
  await agent.connect();
});
```

**Payload (subset):**

| Property | Type | Description |
|----------|------|-------------|
| `portal` | `Portal?` | Selected portal |
| `portalDetails` | `any?` | Raw portal details from API |
| `agent` | `AgentListItem \| Record<string, unknown>?` | Resolved agent |
| `profile` | `UserProfile?` | Selected user profile |
| `availableProfiles` | `UserProfile[]?` | Profiles shown to the user |
| `availablePortals` | `Portal[]?` | Portals shown to the user |

### `portalsAvailable`

User must pick a portal. Call `agent.selectPortal(portal)` with one of `payload.portals`.

```typescript
agent.on("portalsAvailable", (e) => {
  agent.selectPortal(e.payload.portals[0]); // or show a picker
});
```

### `agentsAvailable`

Flow B (`initParams.isDefaultAgent === "true"`): user must pick an agent. Call `agent.selectAgent(agent)`.

### `profilesAvailable`

User must pick a profile. Call `agent.selectUserProfile(profile)`.

| Property | Type | Description |
|----------|------|-------------|
| `profiles` | `UserProfile[]` | Choices |
| `selectedPortal` | `Portal` | Portal context |

### `callTranscriptUpdate`

Telephony **call** transcript (platform connector), not the WebSocket chat transcript.

| Property | Type | Description |
|----------|------|-------------|
| `entry` | `CallTranscriptEntry` | `sender`, `content`, `timestamp` |

### `callerInfoUpdate`

| Property | Type | Description |
|----------|------|-------------|
| `callerInfo` | `CallerInfo` | CTI fields (name, phone, email, …) |

### `conversationIdUpdate`

| Property | Type | Description |
|----------|------|-------------|
| `conversationId` | `string` | Platform interaction id |

### `userContextUpdate`

| Property | Type | Description |
|----------|------|-------------|
| `userContext` | `Record<string, unknown>` | Merged context from connector |

### `filterTagsUpdate`

| Property | Type | Description |
|----------|------|-------------|
| `filterTags` | `Record<string, string[]>` | Tags from `onPortalSelected` / connector |

## Event Handling Patterns

### One-Time Listeners

```typescript
// Handle only the first occurrence
agent.once("connected", () => {
  console.log("First connection established");
  initializeApp();
});
```

### Removing Listeners

```typescript
const handler = (event) => {
  console.log("Message:", event.payload);
};

// Add listener
agent.on("message", handler);

// Remove specific listener
agent.off("message", handler);

// Remove all listeners for event
agent.off("message");
```

### Async Handlers

Event handlers can be async:

```typescript
agent.on("agentMessage", async (event) => {
  const message = event.payload.message;
  
  // Async operations are supported
  await saveToDatabase(message);
  await updateUI(message);
});
```

### Error Handling in Handlers

Errors in handlers are caught to prevent SDK crashes:

```typescript
agent.on("message", (event) => {
  // This error won't crash the SDK
  throw new Error("Handler error");
});

// The SDK continues to work normally
```

## TypeScript Support

All events are fully typed:

```typescript
import type { AgentEvent, AgentEvents } from "@eGainDev/ai-agent-sdk";

// Type-safe event handling
agent.on("agentMessage", (event: AgentEvent<"agentMessage">) => {
  // event.payload is fully typed
  const content = event.payload.message?.content;
});

// Custom typed handler
type MessageHandler = (event: AgentEvents["message"]) => void;

const handleMessage: MessageHandler = (event) => {
  console.log(event.payload.data);
};
```

## Best Practices

### 1. Always Handle Errors

```typescript
agent.on("error", (event) => {
  // Log for debugging
  console.error("SDK Error:", event.payload.error);
  
  // Report to error tracking
  errorTracker.capture(event.payload.error);
});
```

### 2. Show Connection State

```typescript
agent.on("stateChanged", ({ payload }) => {
  updateConnectionIndicator(payload.state);
});
```

### 3. Use Heartbeat for UX

```typescript
let typingTimeout: NodeJS.Timeout;

agent.on("heartbeat", () => {
  showTypingIndicator();
  
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(hideTypingIndicator, 2000);
});

agent.on("agentMessage", () => {
  clearTimeout(typingTimeout);
  hideTypingIndicator();
});
```

### 4. Clean Up on Unmount

```typescript
// React example
useEffect(() => {
  const handleMessage = (event) => {
    setMessages(prev => [...prev, event.payload]);
  };
  
  agent.on("agentMessage", handleMessage);
  
  return () => {
    agent.off("agentMessage", handleMessage);
  };
}, []);
```
