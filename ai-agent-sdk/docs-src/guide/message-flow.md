# Message Flow

Understanding how messages flow through the SDK is essential for building robust integrations.

## Sending Messages

### Basic String Message

```typescript
const messageId = await agent.send("Hello, agent!");
console.log("Sent message:", messageId);
```

### Structured Message

```typescript
const messageId = await agent.send({
  content: "Help with my account",
  persona: "customer",
  role: "human"
});
```

### With Message Options

```typescript
const messageId = await agent.send("Hello!", {
  id: "custom-msg-id",     // Custom message ID
  from: "user-123",        // Sender identifier
  to: "agent-456"          // Recipient identifier
});
```

## Message Types

The SDK provides helper functions for creating different message types:

### Customer Message

```typescript
import { createAgentMessage } from "@egain/ai-agent-sdk";

await agent.send(createAgentMessage({
  content: "I need help",
  persona: "customer",  // default
  role: "human"         // default
}));
```

### Context Message

Provide context to the agent (automatically cached):

```typescript
import { createContextMessage } from "@egain/ai-agent-sdk";

await agent.send(createContextMessage({
  context: {
    userId: "user-123",
    accountType: "premium",
    language: "en",
    timezone: "America/New_York"
  }
}));

// Context is automatically restored on reconnect
await agent.restartConnection();
// Context is automatically sent to new session
```

### Feedback Message

Send user feedback on agent responses:

```typescript
import { createFeedbackMessage } from "@egain/ai-agent-sdk";

await agent.send(createFeedbackMessage({
  rating: 5,
  answerMessageId: "msg-456"  // ID of the message being rated
}));
```

### Escalation Message

Trigger escalation to human agent:

```typescript
import { createEscalationMessage } from "@egain/ai-agent-sdk";

await agent.send(createEscalationMessage({
  escalationEvent: {
    type: "transfer",
    reason: "complex_query",
    priority: "high"
  }
}));
```

## Data masking

When the bot has **data masking** enabled in admin configuration, the SDK loads department chat masking patterns during `initialize()` (after authentication) and applies them to sensitive outbound text. There is no separate masking option on `AiAgent` — behavior follows **`agentDetails.enableDataMasking`** from the agent details API, plus platform support (deployment version **≥ 21.22.2**).

### What gets masked

Masking runs automatically in **`send()`** for outbound messages that are:

- `persona: "customer"`
- `role: "human"`
- Non-empty string `content`

Strings and `createAgentMessage()` calls match this path. **Context**, **feedback**, **escalation**, and other non–customer-human messages are **not** masked.

The transcript records the same masked `content` that is sent on the WebSocket.

```typescript
// Masking is applied inside send() when enableDataMasking is true
await agent.send("My card is 4532015112830366");
// Wire + SDK transcript contain masked digits, not the full PAN
```

### UI and escalation (`maskContent`)

For text that never goes through `send()` (for example pasted transcript rows or messages forwarded to live chat), use **`maskContent()`** so the same rules apply as cc-widget `eGainAiAgent.maskData`:

```typescript
const displayText = agent.maskContent(userPastedText);
// Use displayText in the UI or when handing off to escalation
```

Do **not** call `maskContent()` and then `send()` with the same string — `send()` already masks eligible customer messages. Double masking is unnecessary.

### When masking is inactive

Masking is a no-op when:

- `enableDataMasking` is false or missing on agent details
- The deployment version is below the supported threshold
- Pattern load fails (the SDK logs a warning and continues without masking)

You do not need to catch errors for masking during `initialize()`; initialization still completes.

## Message Processing Pipeline

```
┌─────────────┐     ┌──────────────────┐     ┌────────────────┐
│   Receive   │────▶│ MessageProcessor │────▶│  Event Emit    │
│   Message   │     │                  │     │                │
└─────────────┘     │  ┌────────────┐  │     │ • agentMessage │
                    │  │  Handler 1 │  │     │ • errorMessage │
                    │  └────────────┘  │     │ • heartbeat    │
                    │  ┌────────────┐  │     │ • message      │
                    │  │  Handler 2 │  │     └────────────────┘
                    │  └────────────┘  │
                    │  ┌────────────┐  │
                    │  │  Handler N │  │
                    │  └────────────┘  │
                    └──────────────────┘
```

### Built-in Handlers

| Handler | Priority | Purpose |
|---------|----------|---------|
| `TokenRefreshHandler` | 0 | Handle token refresh requests |
| `ErrorMessageHandler` | 10 | Detect and process error messages |
| `HeartbeatHandler` | 20 | Detect heartbeat/typing indicators |
| `AgentMessageHandler` | 100 | Process agent responses |
| `ChatHistoryHandler` | 200 | Handle chat history messages |

## Receiving Messages

### All Messages

```typescript
agent.on("message", (event) => {
  // Raw message data
  console.log("Received:", event.payload.data);
});
```

### Agent Messages (Parsed)

```typescript
agent.on("agentMessage", (event) => {
  const { message, from, attachments } = event.payload;
  
  console.log("Content:", message?.content);
  console.log("From:", from?.name);
  
  // Handle attachments
  if (attachments?.length) {
    for (const attachment of attachments) {
      console.log("Attachment:", attachment.name, attachment.url);
    }
  }
});
```

## Message Queue

When offline, messages are automatically queued:

```typescript
// Check queue status
console.log("Queued messages:", agent.getQueueSize());

// Queue is flushed automatically on reconnect
agent.on("queueFlushed", (event) => {
  console.log(`Sent ${event.payload.count} queued messages`);
});

// Clear queue manually if needed
agent.clearQueue();
```

### Queue Configuration

```typescript
const agent = new AiAgent({
  // ...
  maxQueueSize: 500,  // Default: 1000
});
```

## Transcript Management

All messages are recorded in the transcript:

```typescript
// Get all transcript entries
const entries = agent.getTranscript();

// Filter by direction
const received = agent.getTranscript({ direction: "received" });
const sent = agent.getTranscript({ direction: "sent" });

// Filter by time
const lastHour = agent.getTranscript({
  fromTimestamp: Date.now() - 3600000
});

// Filter by persona/role
const agentMessages = agent.getTranscript({
  persona: "agent",
  role: "assistant"
});

// Export as JSON
const json = agent.getTranscriptAsJSON();

// Get transcript size
console.log("Messages:", agent.getTranscriptSize());

// Clear transcript
agent.clearTranscript();
```

### Transcript Configuration

```typescript
const agent = new AiAgent({
  // ...
  transcriptConfig: {
    enabled: true,
    excludeRoles: ["heartbeat"],      // Don't record heartbeats
    excludePersonas: ["system"],       // Don't record system messages
    includeMessageTypes: [             // Only record specific types
      "agent_message",
      "customer_message"
    ]
  }
});
```

## Custom Message Handlers

Add custom processing logic:

```typescript
import { BaseMessageHandler, Message } from "@egain/ai-agent-sdk";

class CustomHandler extends BaseMessageHandler {
  async handle(message: Message) {
    // Check if this handler should process the message
    if (message.role === "custom_role") {
      // Process and return result
      return {
        type: "custom_processed",
        message: message,
        customData: { processed: true }
      };
    }
    
    // Return null to let other handlers process
    return null;
  }
}

// Add handler with priority (higher = processed first)
const processor = agent.getMessageProcessor();
processor.addHandler(new CustomHandler(), 50);
```

## Best Practices

### 1. Use Message Helpers

```typescript
// ✅ Clear and type-safe
await agent.send(createContextMessage({ context: data }));

// ❌ Prone to errors
await agent.send({
  persona: "system",
  role: "context",
  content: "",
  messageData: { context: data }
});
```

### 2. Handle Send Errors

```typescript
try {
  await agent.send("Hello!");
} catch (error) {
  if (error instanceof MessageError) {
    console.error("Failed to send:", error.message);
    // Message is queued if offline
  }
}
```

### 3. Track Message State

```typescript
const pendingMessages = new Set<string>();

async function sendMessage(content: string) {
  const id = await agent.send(content);
  pendingMessages.add(id);
  updateUI();
}

agent.on("agentMessage", (event) => {
  // Mark as delivered when agent responds
  pendingMessages.clear();
  updateUI();
});
```

### 4. Data masking and `send()`

If data masking is enabled for the bot, pass **plain** user text to `send()` — do not pre-mask. Use `maskContent()` only for UI or non-WebSocket paths (see [Data masking](#data-masking)).
