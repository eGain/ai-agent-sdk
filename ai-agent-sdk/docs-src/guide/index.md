# Introduction

Welcome to the **@eGain/ai-agent-sdk** documentation. This SDK provides a production-ready interface for interacting with eGain's AI Agent platform.

## What is AI Agent SDK?

The AI Agent SDK is a TypeScript-first JavaScript library that enables seamless communication with eGain's AI Agent platform. It handles:

- **WebSocket connections** with automatic reconnection
- **Message queuing** for offline resilience
- **Authentication** across multiple strategies
- **Event-driven architecture** for reactive applications
- **Transcript management** for conversation history

## Key Concepts

### Agent

The main interface for interacting with the AI platform. An agent represents a connection to a specific AI service with its own configuration, authentication, and session.

```typescript
import { AiAgent } from "@eGain/ai-agent-sdk";

const agent = new AiAgent({
  id: "your-agent-id",
  endpoint: "https://your-endpoint.com",
  auth: { type: "pre-auth", accessToken: "your-access-token" }
});
```

### Events

All communication is event-driven. The SDK emits typed events for:

- Connection state changes (`connected`, `closed`, `stateChanged`)
- Messages (`message`, `agentMessage`, `errorMessage`)
- System events (`error`, `queueFlushed`, `heartbeat`)

```typescript
agent.on("agentMessage", (event) => {
  console.log("Agent says:", event.payload.message?.content);
});
```

### Messages

Messages can be sent as strings, objects, or using helper functions:

```typescript
// Simple string
await agent.send("Hello!");

// Structured message
await agent.send({
  content: "Hello",
  persona: "customer",
  role: "human"
});

// Context message
import { createContextMessage } from "@eGain/ai-agent-sdk";
await agent.send(createContextMessage({
  context: { userId: "123", language: "en" }
}));
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        AiAgent                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Connection  │  │   Message   │  │  Authentication    │ │
│  │  Manager    │  │   Queue     │  │     Service        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Message   │  │  Transcript │  │       Logger       │ │
│  │  Processor  │  │             │  │                    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                     Event Emitter                           │
└─────────────────────────────────────────────────────────────┘
```

## Platform Support

| Platform | Support |
|----------|---------|
| Browser (ES Modules) | ✅ Full support |
| Browser (UMD) | ✅ Full support |
| Node.js 18+ | ✅ Full support |
| Node.js 16+ | ⚠️ Requires `ws` polyfill |
| React Native | 🔄 Community support |

## Next Steps

- [Installation](/guide/installation) - Set up the SDK in your project
- [Quick Start](/guide/quick-start) - Build your first integration
- [Authentication](/guide/authentication) - Configure authentication strategies
