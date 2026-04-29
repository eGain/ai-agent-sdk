# @eGainDev/ai-agent-sdk

TypeScript-first SDK for eGain's AI Agent platform with WebSocket communication, automatic reconnection, and comprehensive message handling.

**Current release:** v0.0.14

[![npm version](https://img.shields.io/npm/v/@eGainDev/ai-agent-sdk.svg)](https://www.npmjs.com/package/@eGainDev/ai-agent-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔌 **WebSocket Communication** - Real-time bidirectional messaging with auto-reconnection
- 📬 **Message Queuing** - Automatic queuing when offline, flush on reconnect
- 🔐 **Multiple Auth Strategies** - Pre-Auth, Anonymous, PKCE, Client Credentials
- 🎯 **Type-Safe Events** - Full TypeScript support with strongly-typed events
- 📝 **Transcript Management** - Built-in conversation history with filtering
- 🧠 **Context Persistence** - Automatic caching and restoration on reconnect
- 🛡️ **Error Handling** - Comprehensive typed errors that protect your app
- 🌐 **Universal** - Works in Browser and Node.js
- 🏢 **Portal initialization** - Contact center REST pipeline (portals, agents, profiles) before WebSocket `connect()`
- 🔌 **Platform connectors** - Load CC connector scripts; typed `HookContract` / `PlatformComponentService` for integrators

## Installation

```bash
npm install @eGainDev/ai-agent-sdk
```

**GitHub Packages Configuration** (`.npmrc`):
```ini
@eGainDev:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

## Quick Start

```typescript
import { AiAgent } from "@eGainDev/ai-agent-sdk";

const agent = new AiAgent({
  id: "your-agent-id",
  endpoint: "https://your-endpoint.com",
  auth: { type: "pre-auth", accessToken: "your-access-token" },
  autoConnect: true
});

agent.on("agentMessage", (event) => {
  console.log("Agent:", event.payload.message?.content);
});

agent.on("error", (event) => {
  console.error("Error:", event.payload.error);
});

await agent.initialize();
await agent.send("Hello!");
```

### Contact center (portal flow)

For agents that use the portal / profile pipeline, listen for selection events and call `connect()` after `initialized`:

```typescript
import { AiAgent } from "@eGainDev/ai-agent-sdk";

const agent = new AiAgent({
  id: "your-agent-id",
  endpoint: "https://your-endpoint.com",
  initParams: { authType: "user", userid: "user-1", platform: "standalone" },
  authScheme: "popup",
});

agent.on("portalsAvailable", (e) => agent.selectPortal(e.payload.portals[0]));
agent.on("profilesAvailable", (e) => agent.selectUserProfile(e.payload.profiles[0]));
agent.on("initialized", async () => {
  await agent.connect();
});

await agent.initialize();
```

See the [Portal initialization](https://silver-adventure-o37mv53.pages.github.io/guide/portal-initialization.html) guide for the full flow.

## Documentation

Published docs and TypeDoc on the site below describe the **current release** (version at top of this file).

📚 **[Full Documentation](https://silver-adventure-o37mv53.pages.github.io/)**

| Guide | Description |
|-------|-------------|
| [Getting Started](https://silver-adventure-o37mv53.pages.github.io/guide/) | Introduction and concepts |
| [Installation](https://silver-adventure-o37mv53.pages.github.io/guide/installation.html) | Setup instructions |
| [Quick Start](https://silver-adventure-o37mv53.pages.github.io/guide/quick-start.html) | First integration |
| [Authentication](https://silver-adventure-o37mv53.pages.github.io/guide/authentication.html) | Auth strategies |
| [Events](https://silver-adventure-o37mv53.pages.github.io/guide/events.html) | Event handling |
| [Portal initialization](https://silver-adventure-o37mv53.pages.github.io/guide/portal-initialization.html) | CC portal / agent / profile pipeline |
| [Platform connectors](https://silver-adventure-o37mv53.pages.github.io/guide/platform-connectors.html) | Connector scripts and `HookContract` |
| [Message Flow](https://silver-adventure-o37mv53.pages.github.io/guide/message-flow.html) | Sending/receiving messages |
| [API Reference](https://silver-adventure-o37mv53.pages.github.io/api-generated/README.html) | TypeDoc: classes, interfaces, and methods |
| [Types](https://silver-adventure-o37mv53.pages.github.io/api-generated/README.html) | `Portal`, `UserProfile`, `AgentListItem`, API options (see TypeDoc index) |

## Authentication Options

```typescript
// Pre-Auth (API Key / Token)
auth: { type: "pre-auth", accessToken: "your-access-token" }

// Anonymous
auth: { type: "anonymous" }

// PKCE (Browser OAuth)
auth: {
  type: "pkce",
  config: {
    authorizationUrl: "https://auth.example.com/authorize",
    tokenUrl: "https://auth.example.com/token",
    clientId: "your-client-id",
    redirectUri: "https://your-app.com/callback"
  }
}

// Pre-Auth (Server-provided token)
auth: {
  type: "pre-auth",
  accessToken: "token-from-server"
}
```

## Events

```typescript
agent.on("connected", (event) => { /* Connected */ });
agent.on("agentMessage", (event) => { /* Agent response */ });
agent.on("message", (event) => { /* Any message */ });
agent.on("heartbeat", (event) => { /* Agent typing */ });
agent.on("error", (event) => { /* Error occurred */ });
agent.on("closed", (event) => { /* Disconnected */ });
agent.on("stateChanged", (event) => { /* State change */ });
agent.on("queueFlushed", (event) => { /* Queue sent */ });
agent.on("tokenExpiring", (event) => { /* Token refresh needed */ });
agent.on("transcriptUpdate", (event) => { /* Chat transcript line */ });
agent.on("initialized", (event) => { /* CC init done; safe to connect */ });
agent.on("portalsAvailable", (event) => { /* Call selectPortal */ });
agent.on("agentsAvailable", (event) => { /* Call selectAgent */ });
agent.on("profilesAvailable", (event) => { /* Call selectUserProfile */ });
```

## Message Helpers

```typescript
import {
  createContextMessage,
  createFeedbackMessage,
  createEscalationMessage
} from "@eGainDev/ai-agent-sdk";

// Send context (auto-cached for reconnect)
await agent.send(createContextMessage({
  context: { userId: "123", language: "en" }
}));

// Send feedback
await agent.send(createFeedbackMessage({
  rating: 5,
  answerMessageId: "msg-456"
}));

// Trigger escalation
await agent.send(createEscalationMessage({
  escalationEvent: { type: "transfer", reason: "complex" }
}));
```

## Node.js Setup

```bash
npm install ws
```

The SDK automatically loads the `ws` package when running in Node.js. Just import and use:

```typescript
import { AiAgent } from "@eGainDev/ai-agent-sdk";

const agent = new AiAgent({
  id: "your-agent-id",
  endpoint: "https://your-endpoint.com",
  auth: { type: "pre-auth", accessToken: process.env.AI_AGENT_TOKEN }
});
// ... rest of code
```

If the automatic polyfill doesn't work in your environment, you can set it up manually:

```typescript
import WebSocket from "ws";
(global as any).WebSocket = WebSocket;

import { AiAgent } from "@eGainDev/ai-agent-sdk";
// ... rest of code
```

## Browser (UMD)

```html
<script src="https://unpkg.com/@eGainDev/ai-agent-sdk/dist/browser.js"></script>
<script>
  const agent = new eGain.AiAgent({ ... });
</script>
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build:all

# Test
npm test

# Documentation
npm run docs:dev     # Dev server
npm run docs:build   # Build docs
```

## Examples

See [usage-examples](https://github.com/eGainDev/ai-agent/tree/master/ai-agent-sdk/usage-examples) in this repository for complete examples:
- **Basic Usage** - Simple getting started
- **Browser Test** - Browser integration with UI
- **Server Test** - Node.js implementation

## API Reference

### AiAgent Methods

| Method | Description |
|--------|-------------|
| `initialize()` | Initialize the agent (required) |
| `connect()` | Connect to the server |
| `disconnect(options?)` | Disconnect from server |
| `restartConnection()` | Restart with new session |
| `send(data, options?)` | Send a message |
| `getState()` | Get connection state |
| `isConnected()` | Check if connected |
| `getTranscript(options?)` | Get conversation transcript |
| `getContext()` | Get stored context |
| `removeContext()` | Remove stored context |
| `updateAccessToken(token)` | Update auth token |
| `selectPortal(portal)` | CC: continue after `portalsAvailable` |
| `selectAgent(agent)` | CC Flow B: continue after `agentsAvailable` |
| `selectUserProfile(profile)` | CC: continue after `profilesAvailable` |
| `getInitParams()` | Copy of configured `initParams` |
| `getIsInitialized()` | Whether `initialize()` completed |
| `restartPortalInitializer()` | Re-run CC portal pipeline (or `restartConnection` fallback) |
| `updateUserProfile(profile)` | Switch profile after CC init without full pipeline restart |
| `getUserDetails()` | User details from init (or `null`) |
| `getCallTranscript()` / `clearCallTranscript()` | Telephony call transcript (connector) |
| `getCallerInfo()` / `getConversationId()` | Connector-provided CTI state |

### Configuration

```typescript
new AiAgent({
  id: string,                    // Required: Agent ID
  endpoint: string,              // Required: Endpoint URL
  auth?: AuthenticationInput,    // Optional: Auth config (defaults to anonymous)
  autoConnect?: boolean,         // Auto-connect (default: false)
  maxQueueSize?: number,         // Queue size (default: 1000)
  maxReconnectAttempts?: number, // Reconnect attempts (default: Infinity)
  baseReconnectDelay?: number,   // Base delay ms (default: 1000)
  maxReconnectDelay?: number,    // Max delay ms (default: 30000)
  logLevel?: LogLevel,           // Log level (default: INFO)
  transcriptConfig?: TranscriptConfig,
  cache?: CacheConfig,
  sessionId?: string | number,  // Skip session fetch if already known
  scopes?: string[],              // OAuth resource scopes
  initParams?: Record<string, string>, // CC: portalIds, authType, platform, etc.
  platformScriptUrl?: string,     // Override connector script URL
  authScheme?: "popup" | "redirect" // Auto-built PKCE only
});
```

## License

MIT

## Support

For issues and questions, please open an issue on [GitHub](https://github.com/eGainDev/ai-agent/issues).
