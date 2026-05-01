# Quick Start: Testing Before Publishing

## 1. Install Dependencies

```bash
npm install
```

## 2. Run Unit Tests

```bash
npm test
```

Expected output: All tests should pass ✅

## 3. Build the SDK

```bash
npm run build
```

This creates the `dist/` directory with compiled JavaScript and TypeScript definitions.

## 4. Test Locally with npm link

### Option A: npm link (Recommended for development)

**In the SDK directory:**
```bash
npm run link
```

**In your test project:**
```bash
npm link @egain/ai-agent-sdk
```

Now you can import and use the SDK in your test project:
```typescript
import { AiAgent } from "@egain/ai-agent-sdk";
```

**When done testing, unlink:**
```bash
npm unlink @egain/ai-agent-sdk
```

### Option B: Local npm install

**In your test project:**
```bash
npm install /absolute/path/to/aiagent-sdk
```

Or relative path:
```bash
npm install ../aiagent-sdk
```

## 5. Run Example Script

Test with the provided example:

```bash
npm run example
```

Or with custom endpoint:
```bash
ENDPOINT=wss://your-endpoint.com TOKEN=your-token npm run example
```

## 6. Pre-Publish Checklist

Before publishing, verify:

- ✅ `npm test` - All tests pass
- ✅ `npm run build` - Builds without errors
- ✅ `npm run example` - Example script works
- ✅ Manual testing with npm link works
- ✅ TypeScript types are correct (`dist/index.d.ts` exists)
- ✅ Version number is updated in `package.json`

## 7. Publish

Once everything is tested:

```bash
npm publish
```

The `prepublishOnly` script will automatically:
1. Clean old builds
2. Build the SDK
3. Run tests

If any step fails, publishing will be aborted.

## Troubleshooting

### Tests fail
- Check that all dependencies are installed: `npm install`
- Verify TypeScript compiles: `npm run build`

### npm link doesn't work
- Make sure you ran `npm run link` in the SDK directory first
- Check that the package name matches: `@egain/ai-agent-sdk`

### Example script fails
- Make sure you've built the SDK: `npm run build`
- Check that `dist/` directory exists
- Verify your endpoint and token are correct

## Next Steps

For detailed testing information, see [TESTING.md](./TESTING.md)




