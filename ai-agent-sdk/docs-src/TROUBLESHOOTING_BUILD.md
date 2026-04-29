# Build Troubleshooting

If `npm run build` is failing, try these solutions:

## Common Issues and Fixes

### 1. Module Resolution Issues

If you see errors about module resolution, try:

**Option A: Use "node" resolution (most compatible)**
```json
"moduleResolution": "node"
```

**Option B: Use "nodenext" (for Node.js ESM)**
```json
"moduleResolution": "nodenext"
```

**Option C: Use "bundler" (for modern bundlers)**
```json
"moduleResolution": "bundler"
```

### 2. WebSocket Type Errors

If you see `Cannot find name 'WebSocket'`:

- Make sure `"lib": ["ES2020", "DOM"]` includes "DOM" in tsconfig.json
- WebSocket types come from the DOM lib

### 3. Import Extension Errors

If imports fail:
- All imports use `.js` extensions (correct for ESM)
- TypeScript should resolve these automatically
- Make sure `moduleResolution` matches your setup

### 4. TypeScript Version

Make sure TypeScript is installed:
```bash
npm install
npx tsc --version
```

### 5. Clean Build

Try a clean build:
```bash
npm run clean
rm -rf node_modules
npm install
npm run build
```

### 6. Check Specific File

To check a specific file:
```bash
npx tsc --noEmit src/core/AiAgent.ts
```

## Current Configuration

The current `tsconfig.json` uses:
- `moduleResolution: "nodenext"` - For Node.js ESM support
- `module: "ES2020"` - ESM modules
- `lib: ["ES2020", "DOM"]` - Includes WebSocket types

## Get Help

If build still fails, please share:
1. The exact error message from `npm run build`
2. Node.js version: `node --version`
3. TypeScript version: `npx tsc --version`

