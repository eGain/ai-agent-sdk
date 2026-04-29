import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const sdkRoot = resolve(__dirname, '../..');
const sdkDist = resolve(sdkRoot, 'dist');

export default defineConfig({
  server: {
    port: 8080,
    open: true,
    sourcemapIgnoreList: false
  },
  resolve: {
    alias: {
      // Use pre-built dist files instead of TypeScript source
      '@eGainDev/ai-agent-sdk': resolve(sdkDist, 'index.js')
    },
    // Dedupe to prevent multiple instances
    dedupe: ['@eGainDev/ai-agent-sdk']
  },
  optimizeDeps: {
    // Include the pre-built SDK for optimization
    include: ['@eGainDev/ai-agent-sdk'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    target: 'es2020',
    sourcemap: true
  }
});
