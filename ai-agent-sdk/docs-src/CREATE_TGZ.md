# Creating a .tgz Package

## Quick Method

```bash
# 1. Build the SDK first
npm run build

# 2. Create the tarball
npm pack
```

This creates a file named: `egain-ai-agent-1.0.0.tgz`

## What Gets Included

The tarball includes only the files specified in `package.json` under `"files"`:
- `dist/` - Compiled JavaScript and TypeScript definitions
- `README.md` - Documentation
- `package.json` - Package metadata (always included)

## Install from Tarball

### In your test project:

```bash
npm install /path/to/egain-ai-agent-1.0.0.tgz
```

Or if the tarball is in the current directory:

```bash
npm install ./egain-ai-agent-1.0.0.tgz
```

### Or add to package.json:

```json
{
  "dependencies": {
    "@eGain/ai-agent-sdk": "file:./egain-ai-agent-1.0.0.tgz"
  }
}
```

Then run:
```bash
npm install
```

## Full Workflow

```bash
# 1. Clean previous builds (optional)
npm run clean

# 2. Build the SDK
npm run build

# 3. Create tarball
npm pack

# 4. The tarball is ready!
# File: egain-ai-agent-1.0.0.tgz
```

## Verify Tarball Contents

To see what's inside:

```bash
tar -tzf egain-ai-agent-1.0.0.tgz | head -20
```

## Notes

- The tarball name is based on `name` and `version` in `package.json`
- Scoped packages (like `@eGain/ai-agent-sdk`) create tarballs with the format: `egain-ai-agent-1.0.0.tgz`
- Only files listed in `"files"` array are included (plus package.json)
- The tarball can be shared and installed on any machine

