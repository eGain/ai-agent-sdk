# Message Queue

The Message Queue feature provides automatic message buffering when the connection is unavailable. Messages are queued locally and automatically sent when the connection is restored.

## Overview

When you call `agent.send()` while disconnected:
1. The message is added to an internal queue
2. The SDK continues without throwing an error
3. When connection is restored, queued messages are sent automatically
4. A `queueFlushed` event is emitted with the count of sent messages

This provides a seamless experience for users even with intermittent connectivity.

## Quick Start

Message queuing works automatically:

```typescript
import { AiAgent } from "@egain/ai-agent-sdk";

const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com"
});

await agent.initialize();

// This works even if disconnected!
await agent.send("Hello!");  // Queued if offline

// Check queue status
const queueSize = agent.getQueueSize();
console.log(`${queueSize} messages waiting`);

// Clear the queue if needed
agent.clearQueue();
```

## Configuration

Configure queue behavior when creating the agent:

```typescript
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  maxQueueSize: 1000  // Maximum messages to queue (default: 1000)
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxQueueSize` | number | `1000` | Maximum number of messages to queue |

## Queue Events

Listen for queue-related events:

```typescript
// When queued messages are sent after reconnection
agent.on("queueFlushed", (event) => {
  console.log(`Sent ${event.payload.count} queued messages`);
});

// When connection state changes
agent.on("stateChanged", (event) => {
  const { state, previousState } = event.payload;
  
  if (state === "RECONNECTING") {
    console.log("Reconnecting... messages will be queued");
  }
  
  if (state === "CONNECTED" && previousState === "RECONNECTING") {
    console.log("Reconnected! Queued messages will be sent");
  }
});
```

## Queue Methods

### Check Queue Size

```typescript
const size = agent.getQueueSize();
console.log(`${size} messages in queue`);
```

### Clear Queue

```typescript
// Remove all queued messages
agent.clearQueue();
```

## How It Works

### Normal Flow (Connected)

```
User sends message → SDK sends immediately → Server receives
```

### Offline Flow

```
User sends message → SDK queues locally → Connection restored → SDK sends queued messages
```

### Automatic Flush

When the connection is established (or re-established), the SDK automatically:

1. Checks for queued messages
2. Sends them in order (FIFO)
3. Emits `queueFlushed` event with count

```typescript
agent.on("connected", () => {
  // Queue is automatically flushed after this
});

agent.on("queueFlushed", (event) => {
  console.log(`${event.payload.count} queued messages sent`);
});
```

## Retry Behavior

The queue includes automatic retry logic:

| Behavior | Description |
|----------|-------------|
| Max Attempts | Each message is retried up to 3 times |
| Failure Handling | Failed messages are removed after max attempts |
| Error Events | An error event is emitted for failed messages |

```typescript
agent.on("error", (event) => {
  // Handle permanently failed messages
  console.error("Message failed:", event.payload.error);
});
```

## UI Integration

### Show Queue Status

```typescript
function updateQueueIndicator() {
  const size = agent.getQueueSize();
  
  if (size > 0) {
    showBadge(`${size} pending`);
  } else {
    hideBadge();
  }
}

// Update on state changes
agent.on("stateChanged", updateQueueIndicator);
agent.on("queueFlushed", updateQueueIndicator);
```

### React Example

```tsx
function ConnectionStatus() {
  const [queueSize, setQueueSize] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setQueueSize(agent.getQueueSize());
      setIsConnected(agent.isConnected());
    };

    agent.on("stateChanged", updateStatus);
    agent.on("queueFlushed", updateStatus);
    
    return () => {
      agent.off("stateChanged", updateStatus);
      agent.off("queueFlushed", updateStatus);
    };
  }, []);

  return (
    <div className="status">
      {isConnected ? (
        <span className="online">● Connected</span>
      ) : (
        <span className="offline">
          ○ Offline
          {queueSize > 0 && ` (${queueSize} pending)`}
        </span>
      )}
    </div>
  );
}
```

### Vue Example

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const queueSize = ref(0);
const isConnected = ref(false);

function updateStatus() {
  queueSize.value = agent.getQueueSize();
  isConnected.value = agent.isConnected();
}

onMounted(() => {
  agent.on('stateChanged', updateStatus);
  agent.on('queueFlushed', updateStatus);
  updateStatus();
});

onUnmounted(() => {
  agent.off('stateChanged', updateStatus);
  agent.off('queueFlushed', updateStatus);
});
</script>

<template>
  <div class="status">
    <span v-if="isConnected" class="online">● Connected</span>
    <span v-else class="offline">
      ○ Offline
      <template v-if="queueSize > 0">({{ queueSize }} pending)</template>
    </span>
  </div>
</template>
```

## Handling Offline State

### Optimistic UI Updates

Show messages immediately in the UI, even when queued:

```typescript
async function sendMessage(text: string) {
  // Add to UI immediately (optimistic)
  addMessageToUI({
    text,
    status: agent.isConnected() ? "sent" : "pending"
  });

  // Send (queued if offline)
  const messageId = await agent.send(text);
  
  return messageId;
}

// Update status when flushed
agent.on("queueFlushed", () => {
  updatePendingMessagesStatus("sent");
});
```

### Show Pending Indicator

```typescript
function sendMessage(text: string) {
  const message = {
    id: Date.now().toString(),
    text,
    status: "sending"
  };
  
  addMessageToUI(message);
  
  agent.send(text).then(() => {
    if (agent.isConnected()) {
      updateMessageStatus(message.id, "sent");
    } else {
      updateMessageStatus(message.id, "queued");
    }
  });
}
```

## Queue Limits

### Max Queue Size

When the queue is full, `send()` will throw an error:

```typescript
try {
  await agent.send("Message");
} catch (error) {
  if (error.message.includes("Queue is full")) {
    alert("Too many pending messages. Please wait for connection.");
  }
}
```

### Handling Queue Full

```typescript
async function safeSend(text: string) {
  const queueSize = agent.getQueueSize();
  const maxSize = 1000;  // Your configured max
  
  if (queueSize >= maxSize * 0.9) {
    showWarning("Message queue is almost full");
  }
  
  if (queueSize >= maxSize) {
    showError("Cannot send: too many pending messages");
    return null;
  }
  
  return await agent.send(text);
}
```

## Best Practices

### 1. Show Queue Status to Users

```typescript
agent.on("stateChanged", (event) => {
  if (event.payload.state === "RECONNECTING") {
    showToast("Reconnecting... messages will be sent when online");
  }
});
```

### 2. Handle Queue Full Gracefully

```typescript
const MAX_QUEUE_WARNING = 900;

if (agent.getQueueSize() > MAX_QUEUE_WARNING) {
  disableSendButton();
  showWarning("Please wait for connection to restore");
}
```

### 3. Clear Queue on Logout

```typescript
function logout() {
  agent.clearQueue();  // Don't send pending messages
  agent.disconnect();
}
```

### 4. Don't Clear Queue on Reconnect

The queue auto-flushes on reconnect. Don't clear it manually unless intentional:

```typescript
// ❌ Don't do this
agent.on("connected", () => {
  agent.clearQueue();  // This loses messages!
});

// ✅ Let it auto-flush
agent.on("queueFlushed", (event) => {
  console.log(`Sent ${event.payload.count} pending messages`);
});
```

## API Reference

- [MessageQueue Class](/api-generated/classes/MessageQueue)
- [QueuedMessage Interface](/api-generated/interfaces/QueuedMessage)
