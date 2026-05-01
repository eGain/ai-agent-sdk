# Installation

## Package Manager

::: code-group

```bash [npm]
npm install @egain/ai-agent-sdk
```

```bash [yarn]
yarn add @egain/ai-agent-sdk
```

```bash [pnpm]
pnpm add @egain/ai-agent-sdk
```

:::

## GitHub Packages Configuration

This package is published to GitHub Packages. Configure your `.npmrc`:

```ini
@egain:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

::: tip Generating a GitHub Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate a new token with `read:packages` scope
3. Replace `YOUR_GITHUB_TOKEN` with your token
:::

## Environment-Specific Setup

### Browser (ES Modules)

```typescript
import { AiAgent } from "@egain/ai-agent-sdk";

const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  auth: { type: "pre-auth", accessToken: "your-access-token" }
});
```

### Browser (UMD / Script Tag)

```html
<script src="https://unpkg.com/@egain/ai-agent-sdk/dist/browser.js"></script>
<script>
  const agent = new eGain.AiAgent({
    id: "agent-id",
    endpoint: "https://your-endpoint.com",
    auth: { type: "pre-auth", accessToken: "your-access-token" }
  });
</script>
```

### Node.js

Node.js requires the `ws` package for WebSocket support. The SDK automatically loads it when running in Node.js:

```bash
npm install ws
```

```typescript
import { AiAgent } from "@egain/ai-agent-sdk";

const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  auth: { type: "pre-auth", accessToken: "your-access-token" }
});
```

::: tip Automatic Polyfill
The SDK automatically detects Node.js and loads the `ws` package. No manual setup is required in most cases.
:::

## TypeScript Configuration

The SDK includes TypeScript definitions. For optimal support, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true
  }
}
```

## Verifying Installation

```typescript
import { AiAgent, ConnectionState } from "@egain/ai-agent-sdk";

// Check types are working
const config: Parameters<typeof AiAgent>[0] = {
  id: "test",
  endpoint: "https://example.com",
  auth: { type: "anonymous" }
};

console.log("SDK installed successfully!");
```

## Troubleshooting

### Module Resolution Errors

If you see module resolution errors, ensure your bundler supports ES modules:

::: code-group

```javascript [vite.config.js]
export default {
  optimizeDeps: {
    include: ['@egain/ai-agent-sdk']
  }
}
```

```javascript [webpack.config.js]
module.exports = {
  resolve: {
    mainFields: ['module', 'main']
  }
}
```

:::

### WebSocket Errors in Node.js

If you see `WebSocket is not defined`, ensure the `ws` package is installed:

```bash
npm install ws
```

The SDK automatically loads the `ws` package. If auto-loading fails in your environment, you can set it up manually:

```typescript
import WebSocket from "ws";
(global as any).WebSocket = WebSocket;
```

### CORS Errors in Browser

Ensure your endpoint allows requests from your origin. Contact your eGain administrator to configure CORS headers.
