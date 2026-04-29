# Browser Test Project

A browser-based test environment for the `@eGainDev/ai-agent-sdk` SDK.

## Test Pages

This directory contains two test pages:

1. **`index.html`** - ES Module test (uses Vite bundler with ES6 imports)
2. **`browser-umd.html`** - UMD Bundle test (uses global `window.eGain` variable, no bundler required)

## Features

- 🎨 Modern, responsive UI
- 🔌 Real-time connection status
- 📊 Statistics dashboard (queue size, messages sent/received)
- 📝 Event log with color-coded messages
- 💬 Send messages with JSON support
- 🔄 Automatic state updates
- 🧪 SDK class availability testing (UMD page)

## Prerequisites

- Node.js 18+ (25.0.0 recommended - see `.nvmrc`)
- npm or yarn

To use the correct Node version:
```bash
nvm use  # Automatically uses version from .nvmrc
# or
nvm use 25.0.0
```

## Quick Start

### Option 1: UMD Bundle Test (No Bundler Required!)

The `browser-umd.html` page tests the SDK as a global variable - perfect for plain JavaScript:

```bash
# 1. Build the SDK and browser bundle
cd ../../
npm run build:browser

# 2. Serve with any HTTP server
cd usage-examples/browser-test
python3 -m http.server 8080
# or
npx http-server -p 8080

# 3. Open browser-umd.html
# Navigate to: http://localhost:8080/browser-umd.html
```

**Features:**
- ✅ No bundler required
- ✅ No ES6 modules needed
- ✅ Uses `window.eGain` global variable
- ✅ Tests all SDK classes availability
- ✅ Works with plain HTML/JavaScript

### Option 2: Using Vite (ES Modules)

Vite handles module resolution and bundling automatically for the ES module test (`index.html`):

```bash
# 1. Make sure you're using Node 25
nvm use

# 2. Build the SDK
cd ../../
npm run build

# 3. Install dependencies in browser-test
cd usage-examples/browser-test
npm install

# 4. Start Vite dev server
npm run dev
# or
npm start
```

The browser will open automatically at `http://localhost:8080` (shows `index.html`)

### Option 2: Using Tarball

If you have a `.tgz` file:

```bash
# 1. Create tarball (in SDK root)
cd ../../
npm run pack

# 2. Install from tarball
cd examples/browser-test
npm install ../../egain-ai-agent-1.0.0.tgz
npm install

# 3. Start Vite
npm run dev
```

### Option 3: Simple HTTP Server (Limited)

For simple testing without bundling, you can use a basic server, but you'll need to ensure the SDK is properly built and accessible:

```bash
# Build SDK first
cd ../../
npm run build

# Serve with Python
cd examples/browser-test
python3 -m http.server 8080
```

**Note:** Simple HTTP servers may have issues with ES modules. Vite is recommended.

## Usage

### UMD Bundle Test (`browser-umd.html`)

1. **Build the browser bundle:**
   ```bash
   cd ../../
   npm run build:browser
   ```

2. **Open the page:**
   - Serve with any HTTP server (Python, http-server, etc.)
   - Navigate to `browser-umd.html`

3. **Test SDK Classes:**
   - Click "Test SDK Classes" button to verify all classes are available
   - Should show all classes like `eGain.AiAgent`, `eGain.PreAuthStrategy`, etc.

4. **Use the SDK:**
   - Enter Server URL and agent ID
   - Optionally enter authentication token
   - Click "Connect" to test the connection
   - Send messages and monitor the transcript

### ES Module Test (`index.html`)

1. **Enter Configuration:**
   - Server URL (e.g., `https://api.egain.ai`)
   - Authentication Token

2. **Connect:**
   - Click "Connect" button
   - Watch the status indicator change

3. **Send Messages:**
   - Type a message in JSON format (e.g., `{"text": "Hello!"}`)
   - Or type plain text (will be wrapped in `{text: "..."}`)
   - Click "Send Message" or press `Ctrl+Enter`

4. **Monitor:**
   - Watch the event log for real-time updates
   - Check statistics (queue size, messages sent/received)
   - Monitor connection state

## Features Explained

### Connection States

- **IDLE** - Not connected
- **CONNECTING** - Establishing connection
- **CONNECTED** - Successfully connected
- **RECONNECTING** - Attempting to reconnect
- **CLOSED** - Connection closed

### Event Log

The log shows:
- ✅ Success messages (green)
- ❌ Errors (red)
- 📨 Received messages (orange)
- 🔄 State changes (blue)
- ⚠️ Warnings (yellow)

### Statistics

- **Queue Size** - Number of messages waiting to be sent
- **Messages Received** - Total messages received from agent
- **Messages Sent** - Total messages sent to agent

## Troubleshooting

### "Failed to load module" or 404 errors
- Make sure the SDK is built: `cd ../../ && npm run build`
- Run `npm install` in the browser-test directory
- Use Vite instead of a simple HTTP server

### "Cannot find module '@eGainDev/ai-agent-sdk'"
- Install dependencies: `npm install`
- Check that `package.json` has the SDK reference
- Verify SDK is built: check `../../dist/index.js` exists

### CORS errors
- Always use a local server (Vite, http-server, etc.)
- Never use `file://` protocol for ES modules

### Module resolution issues
- Use Vite (recommended) - it handles all module resolution
- Or ensure your server supports ES modules properly

### Connection fails
- Verify your endpoint URL is correct
- Check that your token is valid
- Ensure the endpoint is accessible from your network

### "Super constructor may only be called once" error
This error occurs when Vite's module cache has duplicate module instances. To fix:

1. **Clear Vite's cache and restart:**
   ```bash
   npm run start:clean
   # or manually:
   rm -rf node_modules/.vite
   npm start
   ```

2. **If that doesn't work, clear browser cache:**
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

3. **Check for duplicate imports:**
   - Ensure you're only importing from `@eGainDev/ai-agent-sdk` once
   - Check that there are no circular dependencies in your code

4. **Restart the dev server:**
   - Stop the server (Ctrl+C)
   - Clear cache: `rm -rf node_modules/.vite`
   - Start again: `npm start`

## Development

### Hot Reload Development (No Rebuild Needed!)

The Vite configuration is set up to use SDK TypeScript source files directly, so you can make changes to the SDK without rebuilding:

1. **Start the dev server:**
   ```bash
   npm start
   # or
   npm run dev
   ```

2. **Make changes to SDK source files** in `../../src/`

3. **Changes are automatically picked up** - Vite will:
   - Detect the file changes
   - Recompile the changed files
   - Hot reload the browser
   - Preserve your breakpoints and state

**No need to rebuild or repack!** Just save your changes and the browser will update automatically.

### Traditional Development (With Rebuild)

If you prefer the traditional workflow or need to test the compiled output:

1. Make changes to SDK source
2. Rebuild: `cd ../../ && npm run build`
3. Refresh browser (Vite will auto-reload)

## Debugging with Breakpoints

The Vite configuration is set up to enable debugging with breakpoints directly in the SDK TypeScript source files.

### Setting Up Debugging

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open Chrome DevTools:**
   - Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows/Linux)
   - Go to the **Sources** tab

3. **Enable Source Maps:**
   - Open DevTools Settings (⚙️ icon)
   - Under **Preferences** → **Sources**, ensure:
     - ✅ "Enable JavaScript source maps" is checked
     - ✅ "Detect indentation" is checked (optional)

4. **Find SDK Source Files:**
   - In the Sources panel, look for:
     - `node_modules/@eGainDev/ai-agent-sdk/` (if using compiled dist)
     - Or `src/` folder (if using TypeScript source directly via alias)
   - The Vite config is configured to use TypeScript source files directly for better debugging

### Setting Breakpoints

1. **In Chrome DevTools:**
   - Navigate to the SDK source file (e.g., `src/core/AiAgent.ts`)
   - Click on the line number to set a breakpoint
   - Breakpoints will persist across page reloads

2. **In VS Code (with Debugger for Chrome extension):**
   - Install the "Debugger for Chrome" extension
   - Create `.vscode/launch.json`:
     ```json
     {
       "version": "0.2.0",
       "configurations": [
         {
           "type": "chrome",
           "request": "launch",
           "name": "Debug Browser Test",
           "url": "http://localhost:8080",
           "webRoot": "${workspaceFolder}/examples/browser-test",
           "sourceMaps": true,
           "sourceMapPathOverrides": {
             "webpack://@eGainDev/ai-agent-sdk/*": "${workspaceFolder}/src/*"
           }
         }
       ]
     }
     ```
   - Set breakpoints in your TypeScript files
   - Press `F5` to start debugging

3. **Directly in TypeScript Files:**
   - Open the SDK source files in your editor
   - Add `debugger;` statements where you want to pause:
     ```typescript
     async connect(): Promise<void> {
       debugger; // Execution will pause here
       if (!this.connection) {
         throw new Error('Connection not initialized. Call initialize() first.');
       }
       await this.connection.connect();
     }
     ```

### Debugging Tips

- **Source Maps:** The Vite config generates source maps automatically, so you can debug the original TypeScript code
- **Hot Reload:** Vite's HMR will preserve breakpoints when you make changes
- **Console:** Use `console.log()` or the DevTools console to inspect variables
- **Network Tab:** Monitor WebSocket connections in the Network tab (filter by WS)
- **Call Stack:** Use the Call Stack panel to trace execution flow

### Troubleshooting Debugging

**Breakpoints not hitting:**
- Ensure source maps are enabled in DevTools
- Check that the file path matches (look in Sources panel)
- Try adding `debugger;` statements as a fallback
- Clear browser cache and reload

**Can't find SDK source files:**
- Check that Vite is running in dev mode (`npm run dev`)
- Look in the Sources panel under `node_modules/@eGainDev/ai-agent-sdk/src/`
- Verify the alias in `vite.config.js` is pointing to the correct path

**Source maps not working:**
- Ensure `sourcemap: true` is set in `tsconfig.json` (already configured)
- Check Vite dev server console for source map errors
- Try rebuilding the SDK: `cd ../../ && npm run build`

## Notes

- The SDK uses native browser WebSocket (no polyfill needed)
- All events are logged to the console as well
- Messages can be sent as JSON or plain text
- Queue size updates automatically
- Vite handles all module bundling and resolution automatically
