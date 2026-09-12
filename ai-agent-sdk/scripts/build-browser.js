#!/usr/bin/env node

/**
 * Browser build script using esbuild
 * Creates a UMD bundle that exposes the SDK as window.eGain
 */

import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const isProduction = process.env.NODE_ENV === 'production';

build({
  entryPoints: [resolve(projectRoot, 'src/browser.ts')],
  bundle: true,
  outfile: resolve(projectRoot, 'dist/browser.js'),
  format: 'iife',
  globalName: 'eGain',
  platform: 'browser',
  target: 'es2020',
  minify: isProduction,
  // Use inline source maps for browser debugging - embeds source map and source content
  // directly in the JS file, so browser doesn't need to resolve relative paths
  // This ensures breakpoints work correctly in TypeScript source files
  sourcemap: 'inline',
  external: ['ws'], // ws is Node.js only
  define: {
    'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
  },
  banner: {
    js: `/* @eGainDev/ai-agent-sdk Browser Bundle - Exposes window.eGain */`
  },
  footer: {
    js: `if (typeof window !== 'undefined') { window.eGain = eGain; }`
  }
}).then(() => {
  console.log('✅ Browser bundle built successfully: dist/browser.js');
  console.log('   MSAL library included via msal-loader for PKCE authentication');
}).catch((error) => {
  console.error('❌ Browser build failed:', error);
  process.exit(1);
});
