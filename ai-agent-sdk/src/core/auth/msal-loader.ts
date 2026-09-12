/**
 * MSAL module facade — imports vendored msal-browser.js as a module dependency
 * instead of relying on window.msal (which breaks under Vite/Rollup bundling).
 */
import * as MsalBrowser from './msal-browser.js';

export const PublicClientApplication = MsalBrowser.PublicClientApplication;
export const InteractionRequiredAuthError = MsalBrowser.InteractionRequiredAuthError;
