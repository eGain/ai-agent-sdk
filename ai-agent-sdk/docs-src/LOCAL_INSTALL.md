# Making the SDK Installable Locally

There are several ways to install this package locally for testing before publishing to npm.

## Method 1: npm link (Recommended for Development)

This creates a symlink, so changes are immediately available.

### Step 1: Build the SDK
```bash
npm run build
```

### Step 2: Create the link (in SDK directory)
```bash
npm run link
# or
npm link
```

### Step 3: Use in your project
```bash
cd /path/to/your/project
npm link @eGain/ai-agent-sdk
```

### Step 4: Use in your code
```javascript
import { AiAgent } from '@eGain/ai-agent-sdk';
```

### To unlink:
```bash
npm unlink @eGain/ai-agent-sdk
```

**Pros:**
- Changes are immediately reflected (no reinstall needed)
- Fast iteration during development
- Easy to switch between versions

**Cons:**
- Symlinks can sometimes cause issues with some tools
- Need to rebuild SDK for changes to take effect

---

## Method 2: Local Path Install (Simple)

Install directly from the local file system.

### Step 1: Build the SDK
```bash
npm run build
```

### Step 2: Install in your project
```bash
cd /path/to/your/project
npm install /absolute/path/to/aiagent-sdk
```

Or with relative path:
```bash
npm install ../aiagent-sdk
```

### Step 3: Use in your code
```javascript
import { AiAgent } from '@eGain/ai-agent-sdk';
```

**Pros:**
- Simple and straightforward
- Works like a normal npm package
- No symlink issues

**Cons:**
- Need to reinstall after SDK changes
- Copies files to node_modules

---

## Method 3: npm pack (Create Tarball)

Create a tarball package and install from it.

### Step 1: Build and pack
```bash
npm run build
npm pack
```

This creates a file like: `egain-ai-agent-1.0.0.tgz`

### Step 2: Install in your project
```bash
cd /path/to/your/project
npm install /path/to/aiagent-sdk/egain-ai-agent-1.0.0.tgz
```

Or copy the tarball and install:
```bash
cp egain-ai-agent-1.0.0.tgz /path/to/your/project/
cd /path/to/your/project
npm install ./egain-ai-agent-1.0.0.tgz
```

**Pros:**
- Mimics real npm install
- Good for testing the actual package structure
- Can share tarball with others

**Cons:**
- Need to repack after changes
- Extra step compared to link

---

## Method 4: file: Protocol in package.json

Add the SDK as a dependency using the `file:` protocol.

### In your project's package.json:
```json
{
  "dependencies": {
    "@eGain/ai-agent-sdk": "file:../aiagent-sdk"
  }
}
```

Then run:
```bash
npm install
```

**Pros:**
- Version controlled in package.json
- Works well in monorepos
- Easy to update path

**Cons:**
- Need to reinstall after SDK changes
- Path is relative to package.json location

---

## Quick Start Script

Use the provided script for quick local testing:

```bash
# In SDK directory
npm run build
npm run link

# In your test project
npm link @eGain/ai-agent-sdk
```

---

## Testing the Installation

After installing, test it works:

```javascript
// test.js
import { AiAgent } from '@eGain/ai-agent-sdk';

console.log('SDK imported successfully!');

const agent = new AiAgent({
  id: 'test-agent',
  endpoint: 'wss://test.com',
  auth: { type: 'pre-auth', accessToken: 'test-token' },
  autoConnect: false
});

console.log('Agent created:', agent.getState());
```

Run:
```bash
node test.js
```

---

## Troubleshooting

### "Cannot find module '@eGain/ai-agent-sdk'"
- Make sure you ran `npm link` in the SDK directory first
- Verify `npm link @eGain/ai-agent-sdk` ran successfully in your project
- Check that `dist/` folder exists and has been built

### "Module not found" errors
- Rebuild the SDK: `npm run build`
- Reinstall: `npm unlink @eGain/ai-agent-sdk && npm link @eGain/ai-agent-sdk`

### TypeScript errors
- Make sure `dist/index.d.ts` exists
- Check that types are being generated: `npm run build`

### Changes not reflected
- Rebuild SDK: `npm run build`
- If using npm link, changes should be immediate
- If using local install, reinstall: `npm install /path/to/sdk`

---

## Recommended Workflow

For active development:

1. **SDK directory:**
   ```bash
   npm run build
   npm run link
   ```

2. **Test project:**
   ```bash
   npm link @eGain/ai-agent-sdk
   ```

3. **During development:**
   - Make changes to SDK
   - Run `npm run build` in SDK directory
   - Changes are immediately available in test project (with npm link)

4. **When done:**
   ```bash
   npm unlink @eGain/ai-agent-sdk
   ```

