# Quick Start

This guide walks you through creating your first AI Agent integration in under 5 minutes.

## Prerequisites

- Node.js 18+ or modern browser
- An eGain AI Agent endpoint and credentials
- npm/yarn/pnpm package manager

## Step 1: Create a New Project

```bash
mkdir my-ai-agent-app
cd my-ai-agent-app
npm init -y
npm install @egain/ai-agent-sdk
```

## Step 2: Basic Integration

The example below uses the **pre-auth** option — your server obtains an access token and passes it to the SDK. To generate one, follow the instructions for [Generating An Access Token using PKCE Flow](https://apidev.egain.com/developer-portal/guides/authentication/pkce-flow). 

**Required scopes:**
- `core.aiservices.read`
- `knowledge.portalmgr.manage`
- `core.customermgr.read` _(required for AI Agent for Customer Self Service only)_

Create `index.ts`:

```typescript
import { AiAgent } from "@egain/ai-agent-sdk";

async function main() {
  // 1. Create the agent
  const agent = new AiAgent({
    id: "your-agent-id",
    endpoint: "https://your-endpoint.com",
    auth: { type: "pre-auth", accessToken: "your-access-token" },  // Optional: omit for anonymous session
    autoConnect: true  // Connect automatically after initialize
  });

  // 2. Set up event handlers
  agent.on("connected", (event) => {
    console.log("✅ Connected!", { sessionId: event.sessionId });
  });

  agent.on("agentMessage", (event) => {
    console.log("🤖 Agent:", event.payload.message?.content);
  });

  agent.on("error", (event) => {
    console.error("❌ Error:", event.payload.error.message);
  });

  // 3. Initialize (this connects automatically with autoConnect: true)
  await agent.initialize();

  // 4. Send a message
  await agent.send("Hello! What can you help me with?");
}

main().catch(console.error);
```

## Step 3: Run It

```bash
npx tsx index.ts
```

You should see:
```
✅ Connected! { sessionId: '...' }
🤖 Agent: Hello! I'm here to help you with...
```

## Understanding the Flow

```
┌──────────────┐       ┌─────────────────┐       ┌───────────────┐
│   Your App   │──────▶│   AiAgent SDK   │──────▶│  eGain Server │
└──────────────┘       └─────────────────┘       └───────────────┘
      │                        │                        │
      │  1. new AiAgent()      │                        │
      │  2. initialize()       │                        │
      │        │───────────────┼───────────────────────▶│
      │        │               │    Authenticate        │
      │        │◀──────────────┼───────────────────────│
      │        │               │    WebSocket Connect   │
      │        │───────────────┼───────────────────────▶│
      │  3. on("connected")◀───┼───────────────────────│
      │        │               │                        │
      │  4. send("Hello!")     │                        │
      │        │───────────────┼───────────────────────▶│
      │        │               │                        │
      │  5. on("agentMessage")◀┼───────────────────────│
      │        │               │                        │
```

## Adding Context

Provide context to personalize the conversation:

```typescript
import { AiAgent, createContextMessage } from "@egain/ai-agent-sdk";

const agent = new AiAgent({
  id: "your-agent-id",
  endpoint: "https://your-endpoint.com",
  auth: { type: "pre-auth", accessToken: "your-access-token" }
});

await agent.initialize();
await agent.connect();

// Send context (automatically cached for reconnection)
await agent.send(createContextMessage({
  context: {
    userId: "user-123",
    accountType: "premium",
    language: "en",
    previousInteractions: 5
  }
}));

// Now the agent knows about the user
await agent.send("I need help with my account");
```

## Handling Reconnection

The SDK handles reconnection automatically:

```typescript
agent.on("stateChanged", (event) => {
  const { state, previousState } = event.payload;
  console.log(`Connection: ${previousState} → ${state}`);
  
  if (state === "RECONNECTING") {
    console.log("Reconnecting... messages will be queued");
  }
});

agent.on("queueFlushed", (event) => {
  console.log(`Sent ${event.payload.count} queued messages`);
});
```

## Graceful Shutdown

Always disconnect properly:

```typescript
// On application exit
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await agent.disconnect();
  process.exit(0);
});
```

## Next Steps

- [Authentication](/guide/authentication) - Configure different auth strategies
- [Message Flow](/guide/message-flow) - Understand message types and handlers
- [Events](/guide/events) - Handle all SDK events
- [Examples](/examples/) - Complete working examples
