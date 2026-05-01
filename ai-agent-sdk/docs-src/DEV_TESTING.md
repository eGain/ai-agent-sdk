# Development Testing Guide

Quick guide for testing the SDK during development.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Run Unit Tests

### Run all tests once:
```bash
npm test
```

### Watch mode (recommended for development):
```bash
npm run test:watch
```

This will re-run tests automatically when you change files.

### Check test coverage:
```bash
npm run test:coverage
```

## Step 3: Build the SDK

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

**Tip:** Use watch mode during development:
```bash
npm run dev
```
This builds and runs tests in watch mode.

## Step 4: Test with Example Script

### Quick test:
```bash
npm run build
npm run example
```

### With your own endpoint:
```bash
ENDPOINT=wss://your-endpoint.com TOKEN=your-token npm run example
```

## Step 5: Test in Your Own Project (npm link)

### In the SDK directory:
```bash
npm run build  # Build first!
npm run link
```

### In your test project:
```bash
# Create a new directory for testing
mkdir test-sdk-project
cd test-sdk-project
npm init -y

# Link the SDK
npm link @egain/ai-agent-sdk

# Install WebSocket for Node.js (if needed)
npm install ws
```

### Create a test file (`test.js`):
```javascript
// WebSocket polyfill is automatically loaded by the SDK
import { AiAgent } from '@egain/ai-agent-sdk';

const agent = new AiAgent({
  id: 'your-agent-id',
  endpoint: 'wss://your-endpoint.com',
  auth: { type: 'pre-auth', accessToken: 'your-token' },
  autoConnect: true
});

agent.on('connected', () => {
  console.log('✅ Connected!');
});

agent.on('message', (msg) => {
  console.log('📨 Message:', msg.data);
});

// Send a message after connecting
agent.on('connected', async () => {
  await agent.send({ text: 'Hello!' });
});
```

### Run your test:
```bash
node test.js
```

### When done testing, unlink:
```bash
npm unlink @egain/ai-agent-sdk
```

## Step 6: Test in Browser

### Create an HTML test file (`test.html`):
```html
<!DOCTYPE html>
<html>
<head>
  <title>SDK Test</title>
</head>
<body>
  <h1>eGain AI Agent SDK Test</h1>
  <button id="connect">Connect</button>
  <button id="send">Send Message</button>
  <div id="messages"></div>

  <script type="module">
    import { AiAgent } from './dist/index.js';

    const agent = new AiAgent({
      id: 'your-agent-id',
      endpoint: 'wss://your-endpoint.com',
      auth: { type: 'pre-auth', accessToken: 'your-token' },
      autoConnect: false
    });

    const messagesDiv = document.getElementById('messages');

    agent.on('connected', () => {
      addMessage('✅ Connected!');
    });

    agent.on('message', (msg) => {
      addMessage('📨 Message: ' + JSON.stringify(msg.data));
    });

    agent.on('error', ({ error }) => {
      addMessage('❌ Error: ' + error.message);
    });

    document.getElementById('connect').onclick = () => {
      agent.connect();
    };

    document.getElementById('send').onclick = async () => {
      await agent.send({ text: 'Hello from browser!' });
    };

    function addMessage(text) {
      const p = document.createElement('p');
      p.textContent = text;
      messagesDiv.appendChild(p);
    }
  </script>
</body>
</html>
```

Serve with a local server (browsers need HTTP/HTTPS for ES modules):
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000/test.html`

## Development Workflow

### Recommended workflow:

1. **Make changes** to SDK code
2. **Run tests in watch mode**: `npm run test:watch` (in another terminal)
3. **Build**: `npm run build` (or use watch mode)
4. **Test locally**: Use npm link in your test project
5. **Iterate** until everything works

### Quick commands:

```bash
# Watch mode (builds + tests)
npm run dev

# Just build
npm run build

# Just test
npm run test:watch

# Run example
npm run example
```

## Troubleshooting

### Tests fail after changes
- Make sure you saved all files
- Check TypeScript errors: `npm run build`
- Run tests again: `npm test`

### npm link doesn't work
- Make sure you built first: `npm run build`
- Check that `dist/` folder exists
- Try unlinking and linking again

### Example script fails
- Build first: `npm run build`
- Check `dist/index.js` exists
- Verify your endpoint/token are correct

### Import errors in test project
- Make sure you're using ES modules (`"type": "module"` in package.json)
- Check import paths match your build output
- Verify `dist/index.js` and `dist/index.d.ts` exist

## Next Steps

- See [TESTING.md](./TESTING.md) for detailed testing documentation
- See [QUICK_START_TESTING.md](./QUICK_START_TESTING.md) for quick reference


