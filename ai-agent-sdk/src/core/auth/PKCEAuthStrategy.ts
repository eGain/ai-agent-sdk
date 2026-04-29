import { AuthStrategy, PostAuthenticationCallback, AuthStrategyInitializeOptions } from './AuthStrategy.js';
import { Logger } from '../logging/Logger.js';
import './msal-loader.js'; // Ensure MSAL is loaded before using it

/**
 * Configuration for PKCE authentication strategy
 */
export interface PKCEAuthConfig {
  /**
   * Authorization server URL (authority)
   */
  authorizationUrl?: string;

  /**
   * Token endpoint URL (not used directly by MSAL, but kept for compatibility)
   */
  tokenUrl?: string;

  /**
   * Client ID
   */
  clientId: string;

  /**
   * Redirect URI for OAuth callback
   */
  redirectUri: string;

  /**
   * Optional scopes to request
   */
  scopes?: string[];

  /**
   * Authentication scheme: 'popup' or 'redirect'
   * @default 'redirect'
   */
  authScheme?: 'popup' | 'redirect';

  /**
   * Cache location: 'localStorage' or 'sessionStorage'
   * @default 'sessionStorage'
   */
  cacheLocation?: 'localStorage' | 'sessionStorage';

  /**
   * Known authorities
   */
  knownAuthorities: string[];

  /**
   * Authority metadata
   */
  authorityMetadata?: string;

  /**
   * Next route to navigate to after authentication (used as state parameter)
   */
  nextRoute?: string;

  /**
   * When true, forces local account login instead of federated SSO.
   */
  localLogin?: boolean;
}

// Type declarations for MSAL (since msal-browser.js is a UMD module)
declare global {
  interface Window {
    msal?: {
      PublicClientApplication: any;
      InteractionType: any;
      PopupRequest: any;
      RedirectRequest: any;
      SilentRequest: any;
      AccountInfo: any;
      AuthenticationResult: any;
    };
  }
}

/**
 * PKCE (Proof Key for Code Exchange) authentication strategy for browsers
 * Implements OAuth 2.0 PKCE flow for secure browser-based authentication using MSAL
 */
export class PKCEAuthStrategy implements AuthStrategy {
  /**
   * Build PKCE configuration from deployment info and agent details
   * This method fetches authentication metadata and constructs the PKCE config
   * @param deploymentInfo - Deployment information containing API domain, client IDs, tenant ID
   * @param agentDetails - Agent details containing userType and other agent-specific information
   * @param endpoint - The endpoint URL used to fetch deployment info (used for nextRoute)
   * @param scopes - Scopes to request (passed from AuthenticationService)
   * @param logger - Optional logger instance for logging
   * @param authScheme - Authentication scheme: 'popup' or 'redirect' (defaults to 'popup')
   * @param egClientId - Optional client ID override from initParams (takes priority over deployment client IDs)
   * @param localLogin - When true, forces local account login instead of federated SSO
   * @returns Promise resolving to PKCEAuthConfig
   */
  static async buildConfigFromDeploymentInfo(
    deploymentInfo: any,
    agentDetails: any,
    endpoint: string,
    scopes: string[],
    logger?: Logger,
    authScheme?: 'popup' | 'redirect',
    egClientId?: string,
    localLogin?: boolean
  ): Promise<PKCEAuthConfig> {
    const intClientId = deploymentInfo.intClientId;
    const extClientId = deploymentInfo.extClientId;
    const tenantId = deploymentInfo.tenantId;
    const clientId = deploymentInfo.clientId;
    const userType = agentDetails?.userType;

    // Determine metadata URL based on user type and client IDs
    let metaDataUrl = "";
    if ((userType === "agent" && intClientId) ||
      (userType === "customer" && extClientId)) {
      metaDataUrl = deploymentInfo.apiDomain + "/core/authmgr/v3/metadata/tenant/" + tenantId;
    } else {
      metaDataUrl = deploymentInfo.apiDomain + "/core/authmgr/v3/metadata/deployment";
    }

    // Ensure HTTPS protocol
    metaDataUrl = metaDataUrl && metaDataUrl.startsWith("https://") ? metaDataUrl : "https://" + metaDataUrl;
    
    // Fetch metadata
    let metaData;
    try {
      const metaDataResponse = await fetch(metaDataUrl);
      if (!metaDataResponse.ok) {
        throw new Error(`Failed to fetch metadata: ${metaDataResponse.status} ${metaDataResponse.statusText}`);
      }
      metaData = await metaDataResponse.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger?.error('Failed to fetch authentication metadata', error instanceof Error ? error : new Error(errorMessage), { metaDataUrl });
      throw new Error(`Failed to fetch authentication metadata from ${metaDataUrl}: ${errorMessage}`);
    }

    let loginDomainName = "";
    let idpGatewayId = "";
    let authorityMetadata: any = {};
    let policy;
    let prefixedScopes = [...scopes]; // Copy scopes to apply prefix later

    // Build authority metadata based on user type
    if (userType === "agent") {
      policy = metaData?.idpPolicies?.userSigninPolicy;
      const authURL = metaData?.authenticationDetails?.oAuthUser[0]?.authURL;
      if (authURL) {
        const authURLObject = new URL(authURL);
        loginDomainName = authURLObject.hostname;
        idpGatewayId = authURLObject.pathname.split("/")[1];
        // Remove query parameters from the URL as domain hints come in authURL for deployment metadata
        authorityMetadata.authorization_endpoint = authURLObject.origin + authURLObject.pathname;
      }

      authorityMetadata.token_endpoint = metaData?.authenticationDetails?.oAuthUser[0]?.accessTokenURL;
      authorityMetadata.issuer = ["https://" + loginDomainName, "tfp", idpGatewayId, policy, "v2.0/"].join("/");
      authorityMetadata.jwks_uri = ["https://" + loginDomainName, idpGatewayId, policy, "discovery/v2.0/keys"].join("/");
    } else if (userType === "customer") {
      policy = metaData?.idpPolicies?.customerSigninPolicy;
      const authURL = metaData?.authenticationDetails?.oAuthCustomer[0]?.authURL;
      if (authURL) {
        const authURLObject = new URL(authURL);
        loginDomainName = authURLObject.hostname;
        idpGatewayId = authURLObject.pathname.split("/")[1];
        // Remove query parameters from the URL as domain hints come in authURL for deployment metadata
        authorityMetadata.authorization_endpoint = authURLObject.origin + authURLObject.pathname;
      }

      authorityMetadata.token_endpoint = metaData?.authenticationDetails?.oAuthCustomer[0]?.accessTokenURL;
      authorityMetadata.issuer = ["https://" + loginDomainName, "tfp", idpGatewayId, policy, "v2.0/"].join("/");
      authorityMetadata.jwks_uri = ["https://" + loginDomainName, idpGatewayId, policy, "discovery/v2.0/keys"].join("/");
    } else {
      throw new Error(`Invalid userType: ${userType}. Expected 'agent' or 'customer'.`);
    }

    // Build authorization URL (authority)
    const authorizationUrl = ["https://" + loginDomainName, idpGatewayId, policy].join("/");

    // Add permission prefixes to scopes
    const apiPermissionPrefix =
      userType === "agent" && metaData?.apiMetadata?.CORE?.iApiPermissionPrefix
        ? metaData.apiMetadata.CORE.iApiPermissionPrefix
        : userType === "customer" && metaData?.apiMetadata?.CORE?.eApiPermissionPrefix
          ? metaData.apiMetadata.CORE.eApiPermissionPrefix
          : metaData?.apiMetadata?.CORE?.apiPermissionPrefix || "";

    if (apiPermissionPrefix && Array.isArray(prefixedScopes)) {
      prefixedScopes = prefixedScopes.map((scope: string) => apiPermissionPrefix + scope);
    }

    // Select appropriate client ID (egClientId from initParams takes priority)
    let selectedClientId = egClientId || clientId;
    if (!egClientId) {
      if (userType === "agent" && intClientId) {
        selectedClientId = intClientId;
      } else if (userType === "customer" && extClientId) {
        selectedClientId = extClientId;
      }
    }

    // Build redirect URI from domainHint
    const domainHint = deploymentInfo.domainHint;
    const redirectUri = "https://" + domainHint + "/system/templates/selfservice/auth-redirect.html";
    
    // Use the current page URL so auth-redirect.html navigates back to the app after login
    let nextRoute = typeof window !== 'undefined' ? window.location.href : endpoint;
    
    // Build and return PKCE config
    return {
      clientId: selectedClientId,
      redirectUri: redirectUri, // TODO: Make this configurable
      authorizationUrl: authorizationUrl,
      knownAuthorities: [loginDomainName],
      authorityMetadata: JSON.stringify(authorityMetadata),
      scopes: prefixedScopes,
      authScheme: authScheme ?? 'popup',
      cacheLocation: "sessionStorage",
      nextRoute: nextRoute,
      ...(localLogin != null && { localLogin }),
    };
  }
  private postAuthentication?: PostAuthenticationCallback;
  private isAuthenticatedFlag: boolean = false;
  private deploymentInfo?: any;
  private msalInstance: any;
  private authScheme: 'popup' | 'redirect' = 'redirect';
  private accessToken: string | null = null;
  private account: any = null;
  private isInitialized: boolean = false;

  constructor(private readonly config: PKCEAuthConfig) {
    // Validate browser environment
    if (typeof window === 'undefined') {
      throw new Error('PKCEAuthStrategy can only be used in browser environments');
    }

    // Note: MSAL check is deferred to initialize() to allow lazy loading
    this.authScheme = config.authScheme || 'redirect';
  }

  /**
   * Initialize the PKCE authentication strategy
   */
  async initialize(options?: AuthStrategyInitializeOptions): Promise<void> {
    // Update postAuthentication callback even if already initialized
    // This allows setting the callback after early initialization (e.g., for fetching agent details)
    if (options?.postAuthentication) {
      this.postAuthentication = options.postAuthentication;
    }

    if (this.isInitialized) {
      // If already initialized, just update deploymentInfo if provided
      if (options?.deploymentInfo) {
        this.deploymentInfo = options.deploymentInfo;
      }
      return;
    }

    // Check if MSAL is available (deferred from constructor to allow lazy loading)
    // The msal-loader import ensures MSAL is bundled, but we still need to verify it's available
    if (!window.msal) {
      throw new Error('MSAL library not found. Please ensure msal-browser.js is loaded. The SDK bundle should include MSAL automatically. If you see this error, there may be a bundling issue.');
    }

    this.deploymentInfo = options?.deploymentInfo;

    /**
     {
    "auth": {
        "navigateToLoginRequestUrl": false,
        "clientId": "0e22ec34-1b8f-4d7f-9621-336e5317d2e7",
        "redirectUri": "https://EG5841AIN.ezdev.net/system/templates/selfservice/auth-redirect.html",
        "authority": "https://tmprod95058780int.b2clogin.com/91dc7b59-21d9-4345-a053-a57f4ebddea8/B2C_1A_User_V3_SignIn_OIDC",
        "knownAuthorities": [
            "tmprod95058780int.b2clogin.com"
        ],
        "authorityMetadata": "{\"authorization_endpoint\":\"https://tmprod95058780int.b2clogin.com/91dc7b59-21d9-4345-a053-a57f4ebddea8/B2C_1A_User_V3_SignIn_OIDC/oauth2/v2.0/authorize\",\"token_endpoint\":\"https://TMPROD95058780int.b2clogin.com/91dc7b59-21d9-4345-a053-a57f4ebddea8/B2C_1A_User_V3_SignIn_OIDC/oauth2/v2.0/token\",\"issuer\":\"https://tmprod95058780int.b2clogin.com/tfp/91dc7b59-21d9-4345-a053-a57f4ebddea8/B2C_1A_User_V3_SignIn_OIDC/v2.0/\",\"jwks_uri\":\"https://tmprod95058780int.b2clogin.com/91dc7b59-21d9-4345-a053-a57f4ebddea8/B2C_1A_User_V3_SignIn_OIDC/discovery/v2.0/keys\"}"
    },
    "cache": {
        "cacheLocation": "sessionStorage",
        "storeAuthStateInCookie": false,
        "claimsBasedCachingEnabled": true
    }
}
     */

    // Build MSAL configuration
    const msalConfig: any = {
      auth: {
        navigateToLoginRequestUrl: true,
        clientId: this.config.clientId,
        redirectUri: this.config.redirectUri,
        authority: this.config.authorizationUrl,
        knownAuthorities: this.config.knownAuthorities,
        authorityMetadata: this.config.authorityMetadata,
      },
      cache: {
        cacheLocation: this.config.cacheLocation || 'sessionStorage',
        storeAuthStateInCookie: false,
        claimsBasedCachingEnabled: true,
      },
      system: {
        allowRedirectInIframe: true,
      },
    };

    // Add OIDC options if tenantAlias or tenantId is present (similar to egAuthentication.js)
    const tenantAlias = this.deploymentInfo?.tenant_identifier;
    if (tenantAlias) {
      msalConfig.auth.protocolMode = "OIDC";
      msalConfig.auth.OIDCOptions = {
        serverResponseType: "query"
      };
    }

    // Create MSAL instance
    this.msalInstance = new window.msal!.PublicClientApplication(msalConfig);

    // Initialize MSAL
    await this.msalInstance.initialize();

    // Handle redirect callback if using redirect flow
    if (this.authScheme === 'redirect') {
      await this.handleRedirectPromise();
    }

    // Check for existing accounts
    const accounts = this.msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      this.account = accounts[0];
      this.msalInstance.setActiveAccount(this.account);
      this.isAuthenticatedFlag = true;
    }

    this.isInitialized = true;
  }

  /**
   * Handle redirect promise after OAuth redirect
   */
  private async handleRedirectPromise(): Promise<void> {
    try {
      const response = await this.msalInstance.handleRedirectPromise();
      if (response) {
        this.account = response.account;
        this.msalInstance.setActiveAccount(this.account);
        this.accessToken = response.accessToken;
        this.isAuthenticatedFlag = true;
      }
    } catch (error) {
      console.error('Error handling redirect promise:', error);
      throw error;
    }
  }

  /**
   * Authenticate using PKCE flow
   */
  async authenticate(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // If we have an account from a previous redirect but no cached token,
    // acquire one silently from MSAL's cache before proceeding
    if (this.isAuthenticatedFlag && this.account && !this.accessToken) {
      const silentRequest = {
        scopes: this.config.scopes || ['openid', 'profile', 'offline_access'],
        account: this.account,
      };
      const response = await this.msalInstance.acquireTokenSilent(silentRequest);
      this.accessToken = response.accessToken;
    }

    // Check if already authenticated
    if (this.isAuthenticatedFlag && this.accessToken) {
      if (this.postAuthentication) {
        await this.postAuthentication(this.accessToken);
      }
      return;
    }

    // Build login request
    const loginRequest: any = {
      scopes: this.config.scopes || ['openid', 'profile', 'offline_access'],
    };

    // Add state parameter from nextRoute if available (similar to egAuthentication.js)
    if (this.config.nextRoute) {
      // Remove hash from URL if present (similar to #removeHashFromURL in egAuthentication.js)
      const relayState = this.config.nextRoute.split('#')[0];
      loginRequest.state = relayState;
    }

    // Add extraQueryParameters for identity provider routing (matches cc-widget behavior)
    const extraQueryParameters: Record<string, string> = {};
    if (this.deploymentInfo?.domainHint) {
      extraQueryParameters.domain_hint = this.deploymentInfo.domainHint;
    }
    if (this.config.localLogin) {
      extraQueryParameters.localLogin = 'true';
    }
    if (Object.keys(extraQueryParameters).length > 0) {
      loginRequest.extraQueryParameters = extraQueryParameters;
    }

    try {
      let response: any;

      if (this.authScheme === 'popup') {
        // Use popup flow
        response = await this.msalInstance.loginPopup(loginRequest);
      } else {
        // Use redirect flow — page will navigate to the identity provider.
        await this.msalInstance.loginRedirect(loginRequest);
        // Block the caller until the browser navigates away.
        // The promise is garbage-collected when the page unloads.
        return new Promise<void>(() => {});
      }

      // Handle popup response
      if (response && response.account) {
        this.account = response.account;
        this.msalInstance.setActiveAccount(this.account);
        this.accessToken = response.accessToken;
        this.isAuthenticatedFlag = true;

        // Call postAuthentication callback
        if (this.postAuthentication) {
          await this.postAuthentication(response.accessToken);
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  /**
   * Check if the user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedFlag && this.account !== null;
  }

  /**
   * Get authentication token using PKCE flow
   */
  async getToken(): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // If we have a cached token and account, try to get it silently
    if (this.account) {
      try {
        const silentRequest = {
          scopes: this.config.scopes || ['openid', 'profile', 'offline_access'],
          account: this.account,
        };

        const response = await this.msalInstance.acquireTokenSilent(silentRequest);
        this.accessToken = response.accessToken;
        return response.accessToken;
      } catch (error: any) {
        // If silent acquisition fails, we may need to re-authenticate
        // For now, if we have a stored token, return it
        if (this.accessToken) {
          return this.accessToken;
        }
        // Otherwise, throw the error
        throw error;
      }
    }

    // No account, need to authenticate
    if (!this.accessToken) {
      throw new Error('No access token available. Please call authenticate() first.');
    }

    return this.accessToken;
  }

  /**
   * Start the PKCE authorization flow
   * Redirects user to authorization server
   */
  async startAuthorizationFlow(): Promise<void> {
    await this.authenticate();
  }

  /**
   * Handle the OAuth callback with authorization code
   * This is handled automatically by MSAL's handleRedirectPromise
   */
  async handleCallback(code: string, state: string): Promise<void> {
    // MSAL handles this automatically via handleRedirectPromise
    // This method is kept for compatibility but redirects are handled internally
    await this.handleRedirectPromise();
  }

  /**
   * Refresh the access token using refresh token
   */
  async refreshToken(): Promise<string> {
    if (!this.account) {
      throw new Error('No account available for token refresh');
    }

    const silentRequest = {
      scopes: this.config.scopes || ['openid', 'profile', 'offline_access'],
      account: this.account,
      forceRefresh: true,
    };

    try {
      const response = await this.msalInstance.acquireTokenSilent(silentRequest);
      this.accessToken = response.accessToken;
      return response.accessToken;
    } catch (error: any) {
      // If silent refresh fails, may need interactive login
      throw error;
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    this.accessToken = null;
    this.account = null;
    this.isAuthenticatedFlag = false;
    this.isInitialized = false;
    // MSAL handles its own cleanup, but we can clear our references
  }
}

