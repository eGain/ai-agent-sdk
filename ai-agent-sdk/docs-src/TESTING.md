# Testing Guide

This guide explains how to test the `@eGainDev/ai-agent-sdk` SDK before publishing.

## Prerequisites

Install dependencies:

```bash
npm install
```

## Running Tests

### Unit Tests

Run all unit tests:

```bash
npm test
```

Run tests in watch mode (for development):

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

Coverage reports will be generated in the `coverage/` directory.

### Test Structure

Tests are located alongside source files with `.test.ts` extension:

```
src/
├── core/
│   ├── AiAgent.test.ts
│   ├── api/
│   │   └── ApiHelper.test.ts
│   ├── connection/
│   │   ├── Connection.test.ts
│   │   └── WebSocketTransport.test.ts
│   ├── errors/
│   │   └── SDKError.test.ts
│   ├── events/
│   │   └── EventEmitter.test.ts
│   ├── logging/
│   │   └── Logger.test.ts
│   ├── message/
│   │   ├── Message.test.ts
│   │   ├── MessageProcessor.test.ts
│   │   ├── MessageTypes.test.ts
│   │   └── Transcript.test.ts
│   └── queue/
│       └── MessageQueue.test.ts
```

## Manual Testing

### Using the Example Script

A basic example script is provided for manual testing:

```bash
npm run example
```

Or with custom endpoint and token:

```bash
ENDPOINT=wss://your-endpoint.com TOKEN=your-token npm run example
```

### Testing Locally with npm link

1. **Link the package** (in the SDK directory):

```bash
npm run link
```

2. **In your test project**, link to the local SDK:

```bash
npm link @eGainDev/ai-agent-sdk
```

3. **Use the SDK** in your test project:

```typescript
import { AiAgent } from "@eGainDev/ai-agent-sdk";

const agent = new AiAgent({
  id: "your-agent-id",
  endpoint: "wss://your-endpoint.com",
  auth: { type: "pre-auth", accessToken: "your-token" },
  autoConnect: true
});
```

4. **Unlink when done**:

```bash
npm unlink @eGainDev/ai-agent-sdk
```

### Testing with Local npm Install

1. **Build the SDK**:

```bash
npm run build
```

2. **In your test project**, install from local path:

```bash
npm install /path/to/aiagent-sdk
```

Or use a relative path:

```bash
npm install ../aiagent-sdk
```

## Pre-Publish Checklist

Before publishing to npm, ensure:

- [ ] All tests pass: `npm test`
- [ ] Code builds successfully: `npm run build`
- [ ] No linting errors
- [ ] TypeScript compiles without errors
- [ ] Example script works: `npm run example`
- [ ] Manual testing with npm link works
- [ ] README.md is up to date
- [ ] Version number is updated in package.json
- [ ] All exports are correct in `src/index.ts`

## Testing in Different Environments

### Browser Testing

1. Build the SDK: `npm run build`
2. Use a bundler (Vite, Webpack, etc.) to import the SDK
3. Test in browser DevTools

### Node.js Testing

1. Install WebSocket package: `npm install ws`
2. The SDK automatically loads the WebSocket polyfill:

```typescript
import { AiAgent } from "@eGainDev/ai-agent-sdk";

// WebSocket is automatically polyfilled by the SDK
```

## Continuous Integration

The SDK is configured to run tests before publishing:

```json
{
  "scripts": {
    "prepublishOnly": "npm run clean && npm run build && npm test"
  }
}
```

This ensures tests pass before any package is published.

## Writing New Tests

When adding new features, write tests:

1. Create a `.test.ts` file next to your source file
2. Import testing utilities from `vitest`
3. Write descriptive test cases
4. Run tests: `npm run test:watch`

Example test structure:

```typescript
import { describe, it, expect } from 'vitest';
import { YourClass } from './YourClass.js';

describe('YourClass', () => {
  it('should do something', () => {
    const instance = new YourClass();
    expect(instance.method()).toBe(expected);
  });
});
```

## Debugging Tests

Run tests with Node.js debugger:

```bash
node --inspect-brk node_modules/.bin/vitest
```

Or use VS Code debugger with this configuration:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test"],
  "console": "integratedTerminal"
}
```




