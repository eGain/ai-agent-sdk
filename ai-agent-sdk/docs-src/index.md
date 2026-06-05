---
layout: home

hero:
  name: "@egain/ai-agent-sdk"
  text: "Enterprise AI Agent SDK"
  tagline: TypeScript-first SDK for eGain's AI Agent platform with WebSocket communication, automatic reconnection, and comprehensive message handling.
  image:
    src: /logo.svg
    alt: AI Agent SDK
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: API Reference
      link: /api-generated/README
    - theme: alt
      text: View on GitHub
      link: https://github.com/egain/ai-agent-sdk

features:
  - icon: 🔌
    title: WebSocket Communication
    details: Real-time bidirectional communication with automatic reconnection and exponential backoff for reliability.
  - icon: 🔐
    title: Multiple Auth Strategies
    details: Support for Anonymous, Pre-Auth, PKCE, and Client Credentials authentication methods.
  - icon: 📬
    title: Message Queuing
    details: Automatic message queuing when offline with seamless delivery on reconnection.
  - icon: 🎯
    title: Type-Safe Events
    details: Full TypeScript support with strongly-typed events and comprehensive type definitions.
  - icon: 📝
    title: Transcript Management
    details: Built-in transcript storage with filtering, serialization, and export capabilities.
  - icon: 🛡️
    title: Error Handling
    details: Comprehensive error handling with typed errors that protect your application from crashes.
  - icon: 🧠
    title: Context Persistence
    details: Automatic context caching and restoration on reconnect for seamless user experiences.
  - icon: 🌐
    title: Universal Compatibility
    details: Works in both Browser and Node.js environments with zero framework dependencies.
---

## Quick Start

The example below uses the **pre-auth** option — your server obtains an access token and passes it to the SDK. To generate one, follow the instructions for [Generating An Access Token using PKCE](https://apidev.egain.com/developer-portal/guides/authentication/pkce-flow).

**Required scopes:**
- `core.aiservices.read`
- `knowledge.portalmgr.manage`
- `core.customermgr.read` _(required for AI Agent for Customer Self Service only)_

```bash
npm install @egain/ai-agent-sdk
```

```typescript
import { AiAgent } from "@egain/ai-agent-sdk";

const agent = new AiAgent({
  id: "your-agent-id",
  endpoint: "https://your-endpoint.com",
  auth: { type: "pre-auth", accessToken: "your-access-token" },
  autoConnect: true
});

await agent.initialize();

agent.on("agentMessage", (event) => {
  console.log("Agent:", event.payload.message?.content);
});

await agent.send("Hello, agent!");
```

## Why This SDK?

<div class="features-grid">

### 🏢 Enterprise-Ready
Built for production use with comprehensive logging, error handling, and connection management.

### ⚡ Developer Experience
TypeScript-first design with excellent IDE support, autocomplete, and inline documentation.

### 🔧 Flexible Architecture
Extensible message handlers, pluggable cache adapters, and customizable authentication strategies.

### 📦 Lightweight
Tree-shakable with zero framework dependencies. Use only what you need.

</div>
