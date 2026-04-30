# Transcript

The Transcript feature automatically records all messages sent and received during a conversation, providing a complete history for display, debugging, or analytics.

## Overview

Transcript is enabled by default and automatically captures:
- Customer messages (sent)
- Agent responses (received)
- System messages
- Context messages

## Quick Start

Access the transcript through the agent instance:

```typescript
import { AiAgent } from "@eGain/ai-agent-sdk";

const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com"
});

await agent.initialize();
await agent.connect();

// Send some messages
await agent.send("Hello!");
// ... agent responds ...

// Get all transcript entries
const entries = agent.getTranscript();

// Get as JSON (for display or storage)
const json = agent.getTranscriptAsJSON();

// Get transcript size
const count = agent.getTranscriptSize();

// Clear transcript
agent.clearTranscript();
```

## Configuration

Configure transcript behavior when creating the agent:

```typescript
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  transcriptConfig: {
    enabled: true,                    // Enable/disable transcript
    excludeRoles: ["heartbeat"],      // Exclude heartbeat messages
    excludePersonas: ["system"]       // Exclude system messages
  }
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable transcript storage |
| `excludeRoles` | string[] | `[]` | Roles to exclude (e.g., "heartbeat", "token") |
| `excludePersonas` | string[] | `[]` | Personas to exclude (e.g., "system") |
| `includeMessageTypes` | string[] | `[]` | Only include these message types |

## Retrieving Entries

### Get All Entries

```typescript
// Get all transcript entries with Message objects
const entries = agent.getTranscript();

for (const entry of entries) {
  console.log(`${entry.direction}: ${entry.message.content}`);
}
```

### Get as JSON

```typescript
// Get as plain objects (JSON-serializable)
const json = agent.getTranscriptAsJSON();

// Each entry includes:
// {
//   messageId, persona, role, content, messageData,
//   timestamp, from, to, agentId, sessionId,
//   direction, entryTimestamp
// }

// Save to database
await db.saveTranscript(json);
```

## Filtering Entries

Filter transcript entries with options:

```typescript
// Get only received messages
const received = agent.getTranscript({ 
  direction: "received" 
});

// Get only sent messages
const sent = agent.getTranscript({ 
  direction: "sent" 
});

// Get messages from a specific time range
const recent = agent.getTranscript({
  fromTimestamp: Date.now() - 3600000  // Last hour
});

// Get messages up to a specific time
const older = agent.getTranscript({
  toTimestamp: Date.now() - 300000  // Before 5 minutes ago
});

// Get only agent messages
const agentMessages = agent.getTranscript({ 
  persona: "agent" 
});

// Get only customer messages
const customerMessages = agent.getTranscript({ 
  persona: "customer" 
});

// Combine filters
const recentAgentMessages = agent.getTranscript({
  direction: "received",
  persona: "agent",
  fromTimestamp: Date.now() - 600000  // Last 10 minutes
});
```

## Transcript Events

Listen for transcript updates in real-time:

```typescript
agent.on("transcriptUpdate", (event) => {
  const { entry } = event.payload;
  
  console.log(`[${entry.direction}] ${entry.message.persona}: ${entry.message.content}`);
  
  // Update UI
  addMessageToUI(entry);
});
```

## Display in UI

### React Example

```tsx
function ChatHistory() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Load existing transcript
    setMessages(agent.getTranscriptAsJSON());

    // Listen for updates
    agent.on("transcriptUpdate", (event) => {
      setMessages(prev => [...prev, event.payload.entry]);
    });
  }, []);

  return (
    <div className="chat-history">
      {messages.map((msg, i) => (
        <div key={i} className={`message ${msg.direction}`}>
          <strong>{msg.persona}:</strong>
          <p>{msg.content}</p>
          <span className="time">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
}
```

### Vue Example

```vue
<script setup>
import { ref, onMounted } from 'vue';

const messages = ref([]);

onMounted(() => {
  // Load existing transcript
  messages.value = agent.getTranscriptAsJSON();

  // Listen for updates
  agent.on('transcriptUpdate', (event) => {
    messages.value.push(event.payload.entry);
  });
});
</script>

<template>
  <div class="chat-history">
    <div 
      v-for="(msg, i) in messages" 
      :key="i" 
      :class="['message', msg.direction]"
    >
      <strong>{{ msg.persona }}:</strong>
      <p>{{ msg.content }}</p>
    </div>
  </div>
</template>
```

## Excluding Messages

### Exclude Heartbeats

Heartbeat messages indicate the agent is typing. Usually excluded from display:

```typescript
const agent = new AiAgent({
  // ...
  transcriptConfig: {
    excludeRoles: ["heartbeat"]
  }
});
```

### Exclude System Messages

```typescript
const agent = new AiAgent({
  // ...
  transcriptConfig: {
    excludePersonas: ["system"]
  }
});
```

### Exclude Multiple Types

```typescript
const agent = new AiAgent({
  // ...
  transcriptConfig: {
    excludeRoles: ["heartbeat", "token", "context"],
    excludePersonas: ["system"]
  }
});
```

## Persistence

### Save to Database

```typescript
// Get transcript as JSON
const transcript = agent.getTranscriptAsJSON();

// Save to your backend
await fetch("/api/conversations", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sessionId: agent.sessionId,
    messages: transcript
  })
});
```

### Save to localStorage

```typescript
// Save on disconnect
agent.on("closed", () => {
  const transcript = agent.getTranscriptAsJSON();
  localStorage.setItem(
    `transcript_${sessionId}`,
    JSON.stringify(transcript)
  );
});

// Restore on next session
const saved = localStorage.getItem(`transcript_${sessionId}`);
if (saved) {
  const messages = JSON.parse(saved);
  // Display in UI
}
```

## Transcript Entry Structure

Each transcript entry contains:

```typescript
interface TranscriptEntry {
  message: Message;           // The message object
  direction: "sent" | "received";  // Direction
  timestamp: number;          // When recorded
  sessionId?: string;         // Session ID
  agentId?: string;           // Agent ID
}
```

When converted to JSON:

```typescript
{
  messageId: "msg-123",
  persona: "agent",           // "agent" | "customer" | "system"
  role: "human",              // Message role
  content: "Hello!",          // Message text
  messageData: {},            // Additional data
  timestamp: 1704067200000,   // Message timestamp
  from: "AI Agent",           // Sender name
  to: "customer",             // Recipient
  agentId: "agent-456",
  sessionId: "session-789",
  direction: "received",      // "sent" | "received"
  entryTimestamp: 1704067200100  // When added to transcript
}
```

## Best Practices

### 1. Exclude Non-Display Messages

```typescript
transcriptConfig: {
  excludeRoles: ["heartbeat", "token", "stale_token", "expired_token"]
}
```

### 2. Use Real-Time Events for UI

```typescript
// Don't poll - use events
agent.on("transcriptUpdate", updateUI);
```

### 3. Clear on New Conversation

```typescript
async function startNewConversation() {
  agent.clearTranscript();
  await agent.restartConnection();
}
```

### 4. Save Before Disconnect

```typescript
window.addEventListener("beforeunload", () => {
  saveTranscript(agent.getTranscriptAsJSON());
});
```

## API Reference

- [Transcript Class](/api-generated/classes/Transcript)
- [TranscriptConfig Interface](/api-generated/interfaces/TranscriptConfig)
- [TranscriptEntry Interface](/api-generated/interfaces/TranscriptEntry)
- [TranscriptOptions Interface](/api-generated/interfaces/TranscriptOptions)
