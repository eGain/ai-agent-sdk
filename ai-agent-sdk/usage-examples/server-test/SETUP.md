# Setting Up Test Project

## Method 1: File Path (Recommended for this test project)

The `package.json` already includes the SDK using a file path:

```json
{
  "dependencies": {
    "@eGainDev/ai-agent-sdk": "file:../../"
  }
}
```

### Setup Steps:

1. **Make sure SDK is built:**
   ```bash
   cd ../../
   npm run build
   ```

2. **Install dependencies:**
   ```bash
   cd examples/test-project
   npm install
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

---

## Method 2: npm link (For Active Development)

If you're actively developing the SDK:

### In SDK directory:
```bash
cd ../../
npm run build
npm link
```

### In test-project directory:
```bash
cd examples/test-project
npm link @eGainDev/ai-agent-sdk
npm install  # Install other dependencies
```

### Run tests:
```bash
npm test
```

**Note:** With npm link, changes to SDK are immediately available after rebuilding.

---

## Method 3: Tarball Install

If you have a `.tgz` file:

### In test-project directory:
```bash
cd examples/test-project
npm install ../../egain-ai-agent-1.0.0.tgz
```

Or update `package.json`:
```json
{
  "dependencies": {
    "@eGainDev/ai-agent-sdk": "file:../../egain-ai-agent-1.0.0.tgz"
  }
}
```

Then:
```bash
npm install
```

---

## Current Setup

The test project is configured to use **Method 1** (file path) by default.

To use it:

```bash
# 1. Build the SDK (from SDK root)
cd ../../
npm run build

# 2. Install in test project
cd examples/test-project
npm install

# 3. Run tests
npm test
```

---

## Troubleshooting

### "Cannot find module '@eGainDev/ai-agent-sdk'"
- Make sure SDK is built: `cd ../../ && npm run build`
- Run `npm install` in test-project directory
- Check that `../../dist/index.js` exists

### Import errors
- Verify `package.json` has `"type": "module"`
- Check that SDK's `dist/` folder exists
- Rebuild SDK: `cd ../../ && npm run build`

### Changes not reflected
- Rebuild SDK: `cd ../../ && npm run build`
- If using file path, reinstall: `npm install`
- If using npm link, just rebuild SDK (changes are immediate)

