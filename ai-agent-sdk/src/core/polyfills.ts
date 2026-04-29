/**
 * Automatic polyfill detection and setup for Node.js environments
 * 
 * This module automatically detects the runtime environment and sets up
 * necessary polyfills for WebSocket and fetch when running in Node.js.
 * 
 * In browser environments, native WebSocket and fetch are used.
 * In Node.js environments, it attempts to load 'ws' for WebSocket and
 * 'node-fetch' for fetch (if Node version < 18).
 */

/**
 * Check if we're running in a Node.js environment
 */
function isNodeEnvironment(): boolean {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null &&
    typeof window === 'undefined'
  );
}

/**
 * Get a require function for loading CommonJS modules in ES module context
 * Works in both CommonJS and ES module environments
 */
function getRequire(): NodeRequire | null {
  if (!isNodeEnvironment()) {
    return null;
  }

  try {
    // In ES modules, we need to use createRequire from 'module'
    // However, we can't synchronously import in ES modules
    // So we use a workaround: try to access require via different methods
    
    // Method 1: Try CommonJS require (if we're in a CommonJS context)
    if (typeof require !== 'undefined' && typeof require === 'function') {
      try {
        const Module = require('module');
        if (Module && Module.createRequire) {
          return Module.createRequire(import.meta.url);
        }
        // If createRequire not available, use require directly (CommonJS)
        return require;
      } catch {
        // module not available, but require might still work
        return require;
      }
    }
    
    // Method 2: Try global require (some environments expose this)
    if (typeof (globalThis as any).require === 'function') {
      try {
        const Module = (globalThis as any).require('module');
        if (Module && Module.createRequire) {
          return Module.createRequire(import.meta.url);
        }
        return (globalThis as any).require;
      } catch {
        return (globalThis as any).require;
      }
    }
    
    // Method 3: Try to use createRequire via Function constructor (works in Node.js)
    // This is a workaround for ES modules where require is not directly available
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const requireFn = new Function('return require')();
      if (typeof requireFn === 'function') {
        const Module = requireFn('module');
        if (Module && Module.createRequire) {
          return Module.createRequire(import.meta.url);
        }
        return requireFn;
      }
    } catch {
      // Function constructor approach failed
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Setup WebSocket polyfill for Node.js
 * Attempts to load 'ws' package and assign it to global.WebSocket
 */
function setupWebSocketPolyfill(): void {
  // Only setup in Node.js environment
  if (!isNodeEnvironment()) {
    return;
  }

  // Check if WebSocket is already available globally
  if (typeof globalThis.WebSocket !== 'undefined') {
    return;
  }

  const requireFn = getRequire();
  if (!requireFn) {
    // Can't load polyfill automatically - this is OK, user can set it up manually
    // We don't warn here because the SDK might be bundled and this is expected
    return;
  }

  try {
    const ws = requireFn('ws');
    if (ws && ws.default) {
      // Handle ES module default export
      globalThis.WebSocket = ws.default;
    } else if (ws) {
      // Handle CommonJS export
      globalThis.WebSocket = ws;
    }
  } catch (error) {
    // 'ws' package not available - this is expected in browser builds
    // In Node.js, users should install 'ws' as a peer dependency
    // We don't warn here to avoid noise - the error will be clear when WebSocket is used
  }
}

/**
 * Setup fetch polyfill for Node.js (only needed for Node < 18)
 * Attempts to load 'node-fetch' package and assign it to global.fetch
 */
function setupFetchPolyfill(): void {
  // Only setup in Node.js environment
  if (!isNodeEnvironment()) {
    return;
  }

  // Check if fetch is already available globally
  if (typeof globalThis.fetch !== 'undefined') {
    return;
  }

  // Node.js 18+ has native fetch, so we only need polyfill for older versions
  const nodeVersion = process.versions.node;
  const majorVersion = parseInt(nodeVersion.split('.')[0], 10);
  
  // For Node 18+, native fetch should be available
  if (majorVersion >= 18) {
    return;
  }
  
  const requireFn = getRequire();
  if (!requireFn) {
    // Can't load polyfill automatically
    return;
  }

  try {
    const nodeFetch = requireFn('node-fetch');
    if (nodeFetch && nodeFetch.default) {
      globalThis.fetch = nodeFetch.default;
    } else if (nodeFetch) {
      globalThis.fetch = nodeFetch;
    }
  } catch (error) {
    // node-fetch not available - this is OK for Node 18+, but needed for < 18
    // Error will be clear when fetch is used
  }
}

/**
 * Initialize polyfills automatically
 * This function is called when the SDK is imported
 */
export function initializePolyfills(): void {
  setupWebSocketPolyfill();
  setupFetchPolyfill();
}

// Auto-initialize polyfills when this module is imported
// This ensures polyfills are set up before any SDK code runs
initializePolyfills();
