import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/browser.ts',
  output: {
    file: 'dist/browser.js',
    format: 'umd',
    name: 'eGain',
    sourcemap: true,
    globals: {
      // ws is not available in browser, so we mark it as external
      // The SDK should handle browser WebSocket natively
    }
  },
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false,
      extensions: ['.ts', '.js', '.json']
    }),
    commonjs({
      include: /node_modules/
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false,
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
      compilerOptions: {
        module: 'ESNext',
        moduleResolution: 'node'
      }
    }),
    isProduction && terser({
      compress: {
        drop_console: false
      }
    })
  ].filter(Boolean),
  external: ['ws'], // ws is Node.js only, browser uses native WebSocket
  onwarn(warning, warn) {
    // Suppress warnings about external dependencies
    if (warning.code === 'UNRESOLVED_IMPORT' && warning.source === 'ws') {
      return;
    }
    // Suppress circular dependency warnings (common in event emitters)
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      return;
    }
    warn(warning);
  }
};
