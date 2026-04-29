/**
 * MSAL Loader Module
 * 
 * This module ensures MSAL is loaded and available as window.msal
 * The msal-browser.js is a UMD module that sets window.msal when executed.
 * We import it as a side-effect so it executes and sets window.msal.
 */

// Import MSAL as a side-effect - the UMD module will execute and set window.msal
// When esbuild bundles this, the UMD wrapper executes and sets window.msal
import './msal-browser.js';

/**
 * Ensure MSAL is available on window object
 * This function verifies that window.msal was set by the UMD module
 */
export function ensureMSALLoaded(): void {
  if (typeof window === 'undefined') {
    return; // Not in browser environment
  }

  // The UMD module should have set window.msal when it executed
  // We verify it's available
  if (!window.msal) {
    // In a bundled environment, the UMD wrapper should execute synchronously
    // If window.msal is not available, there may be a bundling issue
    throw new Error('MSAL library not found. Please ensure msal-browser.js is loaded. The SDK bundle should include MSAL automatically.');
  }
  
  // Verify that PublicClientApplication is available
  if (!window.msal.PublicClientApplication) {
    throw new Error('MSAL PublicClientApplication not found. The MSAL library may not have loaded correctly.');
  }
}

// Ensure MSAL is loaded when this module is imported
// Use a small delay to ensure the UMD module has executed
if (typeof window !== 'undefined') {
  // The UMD module executes synchronously, but we check after a microtask
  // to ensure it has completed
  Promise.resolve().then(() => {
    ensureMSALLoaded();
  }).catch(() => {
    // If ensureMSALLoaded throws, it means MSAL wasn't loaded
    // This will be caught when PKCEAuthStrategy tries to use it
  });
}
