/** Minimal typings for the vendored @azure/msal-browser UMD build. */
export class PublicClientApplication {
  constructor(configuration: unknown);
  initialize(): Promise<void>;
  getAllAccounts(): unknown[];
  setActiveAccount(account: unknown): void;
  handleRedirectPromise(): Promise<unknown>;
  loginPopup(request: unknown): Promise<unknown>;
  loginRedirect(request: unknown): Promise<void>;
  logoutPopup(request: unknown): Promise<void>;
  logoutRedirect(request: unknown): Promise<void>;
  getActiveAccount(): unknown;
  acquireTokenSilent(request: unknown): Promise<unknown>;
  acquireTokenPopup(request: unknown): Promise<unknown>;
  acquireTokenRedirect(request: unknown): void;
}

export class InteractionRequiredAuthError extends Error {
  errorCode?: string;
}
