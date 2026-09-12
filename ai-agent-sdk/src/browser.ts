/**
 * Browser entry point for @egain/ai-agent-sdk
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

// MSAL is bundled via PKCEAuthStrategy → msal-loader → vendored msal-browser.js
export * from './index.js';
