# SDK Test Project

Example test project for testing the `@eGainDev/ai-agent-sdk` SDK locally.

## Quick Start

### 1. Build the SDK

In the SDK root directory:
```bash
cd ../../
npm run build
```

### 2. Install dependencies

In this directory:
```bash
cd examples/test-project
npm install
```

The `package.json` already references the SDK using a file path, so it will be installed automatically.

### 3. Configure

Edit `test.js` and update:
- `ENDPOINT` - Your WebSocket endpoint
- `TOKEN` - Your authentication token

Or use environment variables:
```bash
ENDPOINT=wss://your-endpoint.com TOKEN=your-token npm test
```

### 4. Run tests

```bash
npm test
```

## Alternative: Using npm link

If you prefer npm link for active development:

```bash
# In SDK directory
cd ../../
npm run build
npm link

# In this directory
cd examples/test-project
npm link @eGainDev/ai-agent-sdk
npm install
```

See [SETUP.md](./SETUP.md) for all setup methods.

## What it tests

- ✅ Initial state check
- ✅ Connection to endpoint
- ✅ Sending messages
- ✅ Message queuing when offline
- ✅ Queue flushing on reconnect
- ✅ Queue management

## Troubleshooting

### "Cannot find module '@eGainDev/ai-agent-sdk'"
- Make sure you ran `npm link @eGainDev/ai-agent-sdk` in this directory
- Verify the SDK was built: check that `../dist/index.js` exists

### Connection fails
- Check your ENDPOINT and TOKEN are correct
- Verify the endpoint is accessible
- Check network connectivity

### Import errors
- Make sure `package.json` has `"type": "module"`
- Verify you're using Node.js 18+ (for ES modules)


