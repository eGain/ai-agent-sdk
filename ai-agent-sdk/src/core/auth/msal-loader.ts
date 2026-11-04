/**
 * MSAL module facade — imports vendored msal-browser.cjs as a module dependency
 * instead of relying on window.msal (which breaks under Vite/Rollup bundling).
 */
import * as MsalBrowser from './msal-browser.cjs';

export const PublicClientApplication = MsalBrowser.PublicClientApplication;
export const InteractionRequiredAuthError = MsalBrowser.InteractionRequiredAuthError;
