import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { PKCEAuthStrategy } from './PKCEAuthStrategy.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('PKCEAuthStrategy', () => {
  describe('buildConfigFromDeploymentInfo', () => {
    const mockDeploymentInfo = {
      apiDomain: 'https://api.example.com',
      intClientId: 'int-client-id',
      extClientId: 'ext-client-id',
      tenantId: 'tenant-123',
      clientId: 'default-client-id',
      domainHint: 'example.com',
    };

    const mockMetadata = {
      idpPolicies: {
        userSigninPolicy: 'B2C_1A_User_SignIn',
        customerSigninPolicy: 'B2C_1A_Customer_SignIn',
      },
      authenticationDetails: {
        oAuthUser: [{
          authURL: 'https://login.example.com/tenant-123/B2C_1A_User_SignIn/oauth2/v2.0/authorize',
          accessTokenURL: 'https://login.example.com/tenant-123/B2C_1A_User_SignIn/oauth2/v2.0/token',
        }],
        oAuthCustomer: [{
          authURL: 'https://login.example.com/tenant-123/B2C_1A_Customer_SignIn/oauth2/v2.0/authorize',
          accessTokenURL: 'https://login.example.com/tenant-123/B2C_1A_Customer_SignIn/oauth2/v2.0/token',
        }],
      },
      apiMetadata: {
        CORE: {
          iApiPermissionPrefix: 'api://internal/',
          eApiPermissionPrefix: 'api://external/',
          apiPermissionPrefix: 'api://default/',
        },
      },
    };

    beforeEach(() => {
      vi.clearAllMocks();
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMetadata),
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should pass scopes to config and apply prefix for agent userType', async () => {
      const agentDetails = { userType: 'agent' };
      const scopes = ['knowledge.portalmgr.manage', 'core.aiservices.read'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes
      );

      // Scopes should have the internal API permission prefix applied
      expect(config.scopes).toEqual([
        'api://internal/knowledge.portalmgr.manage',
        'api://internal/core.aiservices.read',
      ]);
    });

    it('should pass scopes to config and apply prefix for customer userType', async () => {
      const agentDetails = { userType: 'customer' };
      const scopes = ['knowledge.portalmgr.manage', 'core.aiservices.read', 'core.customermgr.read'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes
      );

      // Scopes should have the external API permission prefix applied
      expect(config.scopes).toEqual([
        'api://external/knowledge.portalmgr.manage',
        'api://external/core.aiservices.read',
        'api://external/core.customermgr.read',
      ]);
    });

    it('should use default prefix when user-specific prefix not available', async () => {
      const metadataWithoutUserPrefix = {
        ...mockMetadata,
        apiMetadata: {
          CORE: {
            apiPermissionPrefix: 'api://default/',
          },
        },
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(metadataWithoutUserPrefix),
      });

      const agentDetails = { userType: 'agent' };
      const scopes = ['scope1', 'scope2'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes
      );

      expect(config.scopes).toEqual([
        'api://default/scope1',
        'api://default/scope2',
      ]);
    });

    it('should not modify scopes when no prefix available', async () => {
      const metadataWithoutPrefix = {
        ...mockMetadata,
        apiMetadata: {
          CORE: {},
        },
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(metadataWithoutPrefix),
      });

      const agentDetails = { userType: 'agent' };
      const scopes = ['scope1', 'scope2'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes
      );

      expect(config.scopes).toEqual(['scope1', 'scope2']);
    });

    it('should handle empty scopes array', async () => {
      const agentDetails = { userType: 'agent' };
      const scopes: string[] = [];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes
      );

      expect(config.scopes).toEqual([]);
    });

    it('should use intClientId for agent userType', async () => {
      const agentDetails = { userType: 'agent' };
      const scopes = ['scope1'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes
      );

      expect(config.clientId).toBe('int-client-id');
    });

    it('should use extClientId for customer userType', async () => {
      const agentDetails = { userType: 'customer' };
      const scopes = ['scope1'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes
      );

      expect(config.clientId).toBe('ext-client-id');
    });

    it('should throw error for invalid userType', async () => {
      const agentDetails = { userType: 'invalid' };
      const scopes = ['scope1'];

      await expect(
        PKCEAuthStrategy.buildConfigFromDeploymentInfo(
          mockDeploymentInfo,
          agentDetails,
          'https://endpoint.example.com',
          scopes
        )
      ).rejects.toThrow("Invalid userType: invalid. Expected 'agent' or 'customer'.");
    });

    it('should throw error when metadata fetch fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const agentDetails = { userType: 'agent' };
      const scopes = ['scope1'];

      await expect(
        PKCEAuthStrategy.buildConfigFromDeploymentInfo(
          mockDeploymentInfo,
          agentDetails,
          'https://endpoint.example.com',
          scopes
        )
      ).rejects.toThrow('Failed to fetch metadata');
    });

    it('should build correct authorization URL', async () => {
      const agentDetails = { userType: 'agent' };
      const scopes = ['scope1'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes
      );

      expect(config.authorizationUrl).toBe('https://login.example.com/tenant-123/B2C_1A_User_SignIn');
      expect(config.knownAuthorities).toEqual(['login.example.com']);
    });

    it('should include authority metadata in config', async () => {
      const agentDetails = { userType: 'agent' };
      const scopes = ['scope1'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes
      );

      expect(config.authorityMetadata).toBeDefined();
      const metadata = JSON.parse(config.authorityMetadata!);
      expect(metadata.authorization_endpoint).toContain('authorize');
      expect(metadata.token_endpoint).toContain('token');
    });

    it('should default authScheme to popup when not provided', async () => {
      const agentDetails = { userType: 'agent' };
      const scopes = ['scope1'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes
      );

      expect(config.authScheme).toBe('popup');
    });

    it('should use the provided authScheme value', async () => {
      const agentDetails = { userType: 'agent' };
      const scopes = ['scope1'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes,
        undefined,
        'redirect'
      );

      expect(config.authScheme).toBe('redirect');
    });

    it('should use egClientId when provided, overriding intClientId for agent', async () => {
      const agentDetails = { userType: 'agent' };
      const scopes = ['scope1'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes,
        undefined,
        undefined,
        'custom-eg-client-id'
      );

      expect(config.clientId).toBe('custom-eg-client-id');
    });

    it('should use egClientId when provided, overriding extClientId for customer', async () => {
      const agentDetails = { userType: 'customer' };
      const scopes = ['scope1'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes,
        undefined,
        undefined,
        'custom-eg-client-id'
      );

      expect(config.clientId).toBe('custom-eg-client-id');
    });

    it('should fall back to intClientId/extClientId when egClientId is undefined', async () => {
      const agentDetails = { userType: 'agent' };
      const scopes = ['scope1'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes,
        undefined,
        undefined,
        undefined
      );

      expect(config.clientId).toBe('int-client-id');
    });

    it('should set localLogin when passed as parameter', async () => {
      const agentDetails = { userType: 'agent' };
      const scopes = ['scope1'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes,
        undefined,
        undefined,
        undefined,
        true
      );

      expect(config.localLogin).toBe(true);
    });

    it('should not include localLogin when not passed', async () => {
      const agentDetails = { userType: 'agent' };
      const scopes = ['scope1'];

      const config = await PKCEAuthStrategy.buildConfigFromDeploymentInfo(
        mockDeploymentInfo,
        agentDetails,
        'https://endpoint.example.com',
        scopes
      );

      expect(config.localLogin).toBeUndefined();
    });
  });

  describe('instance methods', () => {
    let mockMsalInstance: any;
    let strategy: PKCEAuthStrategy;

    beforeEach(() => {
      // Mock window.msal
      (global as any).window = {
        msal: {
          PublicClientApplication: vi.fn().mockImplementation(() => {
            mockMsalInstance = {
              initialize: vi.fn().mockResolvedValue(undefined),
              getAllAccounts: vi.fn().mockReturnValue([]),
              loginPopup: vi.fn().mockResolvedValue({
                account: { username: 'test@example.com' },
                accessToken: 'pkce-token-123',
              }),
              loginRedirect: vi.fn(),
              handleRedirectPromise: vi.fn().mockResolvedValue(null),
              setActiveAccount: vi.fn(),
              acquireTokenSilent: vi.fn().mockResolvedValue({
                accessToken: 'silent-token-123',
              }),
            };
            return mockMsalInstance;
          }),
        },
      };

      strategy = new PKCEAuthStrategy({
        authorizationUrl: 'https://auth.example.com/authorize',
        tokenUrl: 'https://auth.example.com/token',
        clientId: 'test-client-id',
        redirectUri: 'https://app.example.com/callback',
        knownAuthorities: ['auth.example.com'],
        authScheme: 'popup', // Use popup flow for tests
      });
    });

    afterEach(() => {
      delete (global as any).window;
    });

    describe('initialize', () => {
      it('should initialize PKCE strategy', async () => {
        await strategy.initialize({
          deploymentInfo: { apiDomain: 'test.example.com' },
          scopes: ['scope1', 'scope2'],
        });

        expect(mockMsalInstance.initialize).toHaveBeenCalled();
      });

      it('should store postAuthentication callback', async () => {
        const postAuthCallback = vi.fn();
        await strategy.initialize({
          postAuthentication: postAuthCallback,
        });

        expect(strategy).toBeDefined();
      });

      it('should update postAuthentication callback if already initialized', async () => {
        const postAuthCallback1 = vi.fn();
        const postAuthCallback2 = vi.fn();

        await strategy.initialize({
          postAuthentication: postAuthCallback1,
        });

        await strategy.initialize({
          postAuthentication: postAuthCallback2,
        });

        expect(strategy).toBeDefined();
      });

      it('should throw error if MSAL is not available', async () => {
        delete (global as any).window.msal;

        await expect(
          strategy.initialize({
            deploymentInfo: { apiDomain: 'test.example.com' },
          })
        ).rejects.toThrow('MSAL library not found');
      });

      it('should set navigateToLoginRequestUrl to true in MSAL config', async () => {
        await strategy.initialize({
          deploymentInfo: { apiDomain: 'test.example.com' },
        });

        const msalConfigArg = (global as any).window.msal.PublicClientApplication.mock.calls[0][0];
        expect(msalConfigArg.auth.navigateToLoginRequestUrl).toBe(true);
      });

      it('should set system.allowRedirectInIframe to true in MSAL config', async () => {
        await strategy.initialize({
          deploymentInfo: { apiDomain: 'test.example.com' },
        });

        const msalConfigArg = (global as any).window.msal.PublicClientApplication.mock.calls[0][0];
        expect(msalConfigArg.system).toBeDefined();
        expect(msalConfigArg.system.allowRedirectInIframe).toBe(true);
      });
    });

    describe('authenticate', () => {
      it('should authenticate using popup flow', async () => {
        await strategy.initialize({
          deploymentInfo: { apiDomain: 'test.example.com' },
        });

        const postAuthCallback = vi.fn();
        await strategy.initialize({
          postAuthentication: postAuthCallback,
        });

        await strategy.authenticate();

        expect(mockMsalInstance.loginPopup).toHaveBeenCalled();
        expect(postAuthCallback).toHaveBeenCalledWith('pkce-token-123');
      });

      it('should call postAuthentication callback after popup authentication', async () => {
        const postAuthCallback = vi.fn();
        await strategy.initialize({
          postAuthentication: postAuthCallback,
        });

        await strategy.authenticate();

        expect(postAuthCallback).toHaveBeenCalledWith('pkce-token-123');
      });

      it('should not call postAuthentication if not set', async () => {
        await strategy.initialize();
        await strategy.authenticate();

        expect(mockMsalInstance.loginPopup).toHaveBeenCalled();
      });

      it('should handle already authenticated state', async () => {
        // Set up strategy as already authenticated
        (strategy as any).isAuthenticatedFlag = true;
        (strategy as any).accessToken = 'existing-token-123';

        const postAuthCallback = vi.fn();
        await strategy.initialize({
          postAuthentication: postAuthCallback,
        });

        await strategy.authenticate();

        // Should call postAuthentication with existing token
        expect(postAuthCallback).toHaveBeenCalledWith('existing-token-123');
        // Should not call loginPopup again
        expect(mockMsalInstance.loginPopup).not.toHaveBeenCalled();
      });

      it('should include domain_hint in extraQueryParameters when deploymentInfo has domainHint', async () => {
        await strategy.initialize({
          deploymentInfo: { apiDomain: 'test.example.com', domainHint: 'example.com' },
        });
        await strategy.authenticate();

        const loginRequest = mockMsalInstance.loginPopup.mock.calls[0][0];
        expect(loginRequest.extraQueryParameters).toBeDefined();
        expect(loginRequest.extraQueryParameters.domain_hint).toBe('example.com');
      });

      it('should include localLogin in extraQueryParameters when configured', async () => {
        const strategyWithLocal = new PKCEAuthStrategy({
          authorizationUrl: 'https://auth.example.com/authorize',
          clientId: 'test-client-id',
          redirectUri: 'https://app.example.com/callback',
          knownAuthorities: ['auth.example.com'],
          authScheme: 'popup',
          localLogin: true,
        });

        await strategyWithLocal.initialize();
        await strategyWithLocal.authenticate();

        const loginRequest = mockMsalInstance.loginPopup.mock.calls[0][0];
        expect(loginRequest.extraQueryParameters).toBeDefined();
        expect(loginRequest.extraQueryParameters.localLogin).toBe('true');
      });

      it('should omit extraQueryParameters when neither domainHint nor localLogin is set', async () => {
        await strategy.initialize({
          deploymentInfo: { apiDomain: 'test.example.com' },
        });
        await strategy.authenticate();

        const loginRequest = mockMsalInstance.loginPopup.mock.calls[0][0];
        expect(loginRequest.extraQueryParameters).toBeUndefined();
      });
    });

    describe('getToken', () => {
      it('should return token after authentication', async () => {
        await strategy.initialize();
        await strategy.authenticate();

        // After authenticate(), getToken() will use silent acquisition
        // Make sure acquireTokenSilent returns the same token
        mockMsalInstance.acquireTokenSilent.mockResolvedValue({
          accessToken: 'pkce-token-123',
        });

        const token = await strategy.getToken();
        expect(token).toBe('pkce-token-123');
      });

      it('should use silent token acquisition if account exists', async () => {
        const mockAccount = { username: 'test@example.com' };
        mockMsalInstance.getAllAccounts.mockReturnValue([mockAccount]);
        
        await strategy.initialize();
        
        // Set the account on the strategy so getToken() can use it for silent acquisition
        (strategy as any).account = mockAccount;
        // Also set isInitialized flag
        (strategy as any).isInitialized = true;

        const token = await strategy.getToken();

        expect(mockMsalInstance.acquireTokenSilent).toHaveBeenCalled();
        expect(token).toBe('silent-token-123');
      });

      it('should throw error if no token available', async () => {
        (strategy as any).accessToken = null;
        mockMsalInstance.getAllAccounts.mockReturnValue([]);

        await strategy.initialize();

        await expect(strategy.getToken()).rejects.toThrow('No access token available');
      });

      it('should return stored token if silent acquisition fails', async () => {
        mockMsalInstance.getAllAccounts.mockReturnValue([
          { username: 'test@example.com' },
        ]);
        mockMsalInstance.acquireTokenSilent.mockRejectedValue(new Error('Silent failed'));
        (strategy as any).accessToken = 'stored-token-123';

        await strategy.initialize();

        const token = await strategy.getToken();
        expect(token).toBe('stored-token-123');
      });
    });

    describe('isAuthenticated', () => {
      it('should return false initially', () => {
        expect(strategy.isAuthenticated()).toBe(false);
      });

      it('should return true after authentication', async () => {
        await strategy.initialize();
        await strategy.authenticate();

        expect(strategy.isAuthenticated()).toBe(true);
      });
    });

    describe('cleanup', () => {
      it('should cleanup resources', async () => {
        await strategy.initialize();
        await strategy.authenticate();
        await strategy.cleanup();

        expect(strategy).toBeDefined();
      });
    });

    describe('redirect flow', () => {
      const redirectConfig = {
        authorizationUrl: 'https://auth.example.com/authorize',
        tokenUrl: 'https://auth.example.com/token',
        clientId: 'test-client-id',
        redirectUri: 'https://app.example.com/callback',
        knownAuthorities: ['auth.example.com'],
        authScheme: 'redirect' as const,
      };

      function mockMsalWithRedirectResponse(response: any) {
        (global as any).window.msal.PublicClientApplication = vi.fn().mockImplementation(() => {
          mockMsalInstance = {
            initialize: vi.fn().mockResolvedValue(undefined),
            getAllAccounts: vi.fn().mockReturnValue([]),
            loginPopup: vi.fn(),
            loginRedirect: vi.fn(),
            handleRedirectPromise: vi.fn().mockResolvedValue(response),
            setActiveAccount: vi.fn(),
            acquireTokenSilent: vi.fn(),
          };
          return mockMsalInstance;
        });
      }

      it('should not call postAuthentication during initialize when redirect response is handled', async () => {
        mockMsalWithRedirectResponse({
          account: { username: 'test@example.com' },
          accessToken: 'redirect-token-123',
        });

        const redirectStrategy = new PKCEAuthStrategy(redirectConfig);
        const postAuthCallback = vi.fn();

        await redirectStrategy.initialize({
          deploymentInfo: { apiDomain: 'test.example.com' },
          postAuthentication: postAuthCallback,
        });

        expect(mockMsalInstance.handleRedirectPromise).toHaveBeenCalled();
        expect(postAuthCallback).not.toHaveBeenCalled();
      });

      it('should call postAuthentication only from authenticate after redirect return', async () => {
        mockMsalWithRedirectResponse({
          account: { username: 'test@example.com' },
          accessToken: 'redirect-token-123',
        });

        const redirectStrategy = new PKCEAuthStrategy(redirectConfig);
        const postAuthCallback = vi.fn();

        await redirectStrategy.initialize({
          deploymentInfo: { apiDomain: 'test.example.com' },
          postAuthentication: postAuthCallback,
        });

        await redirectStrategy.authenticate();

        expect(postAuthCallback).toHaveBeenCalledTimes(1);
        expect(postAuthCallback).toHaveBeenCalledWith('redirect-token-123');
      });

      it('should call loginRedirect when no prior redirect response exists', async () => {
        mockMsalWithRedirectResponse(null);

        const redirectStrategy = new PKCEAuthStrategy(redirectConfig);

        await redirectStrategy.initialize({
          deploymentInfo: { apiDomain: 'test.example.com' },
        });

        // Don't await — redirect flow returns a never-resolving promise
        // since the page is about to navigate away
        redirectStrategy.authenticate();

        await vi.waitFor(() => {
          expect(mockMsalInstance.loginRedirect).toHaveBeenCalled();
        });
        expect(mockMsalInstance.loginPopup).not.toHaveBeenCalled();
      });

      it('should acquire token silently when account exists but no cached token after redirect', async () => {
        const mockAccount = { username: 'test@example.com' };

        // Simulate post-redirect: handleRedirectPromise returns null,
        // but MSAL has an account in session storage from auth-redirect.html
        (global as any).window.msal.PublicClientApplication = vi.fn().mockImplementation(() => {
          mockMsalInstance = {
            initialize: vi.fn().mockResolvedValue(undefined),
            getAllAccounts: vi.fn().mockReturnValue([mockAccount]),
            loginPopup: vi.fn(),
            loginRedirect: vi.fn(),
            handleRedirectPromise: vi.fn().mockResolvedValue(null),
            setActiveAccount: vi.fn(),
            acquireTokenSilent: vi.fn().mockResolvedValue({
              accessToken: 'silent-redirect-token-123',
            }),
          };
          return mockMsalInstance;
        });

        const redirectStrategy = new PKCEAuthStrategy(redirectConfig);
        const postAuthCallback = vi.fn();

        await redirectStrategy.initialize({
          deploymentInfo: { apiDomain: 'test.example.com' },
          postAuthentication: postAuthCallback,
        });

        await redirectStrategy.authenticate();

        expect(mockMsalInstance.acquireTokenSilent).toHaveBeenCalledWith({
          scopes: ['openid', 'profile', 'offline_access'],
          account: mockAccount,
        });
        expect(postAuthCallback).toHaveBeenCalledWith('silent-redirect-token-123');
        expect(mockMsalInstance.loginRedirect).not.toHaveBeenCalled();
      });
    });
  });
});
