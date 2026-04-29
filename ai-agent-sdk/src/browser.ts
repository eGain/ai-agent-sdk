/**
 * Browser entry point for @eGainDev/ai-agent-sdk
 * 
 * This file is used to create a UMD bundle that exposes the SDK
 * as a global variable (window.eGain) for use in plain JavaScript
 * without module bundlers.
 * 
 * Usage:
 *   <script src="dist/browser.js"></script>
 *   <script>
 *     const agent = new eGain.AiAgent({ ... });
 *   </script>
 */

// Import MSAL library as a side-effect to ensure it's available for PKCE authentication
// MSAL will be exposed as window.msal when this bundle is loaded
// The UMD module in msal-browser.js will execute and set window.msal
import './core/auth/msal-browser.js';

// Re-export everything from the main index
export * from './index.js';
