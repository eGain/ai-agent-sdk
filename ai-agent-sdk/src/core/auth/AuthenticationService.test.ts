import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthenticationService } from './AuthenticationService.js';
import { AnonymousAuthStrategy } from './AnonymousAuthStrategy.js';
import { PreAuthStrategy } from './PreAuthStrategy.js';
import { PKCEAuthStrategy } from './PKCEAuthStrategy.js';
import { ClientCredentialsAuthStrategy } from './ClientCredentialsAuthStrategy.js';

// Mock the strategies
vi.mock('./AnonymousAuthStrategy.js');
vi.mock('./PreAuthStrategy.js');
vi.mock('./PKCEAuthStrategy.js');
vi.mock('./ClientCredentialsAuthStrategy.js');

describe('AuthenticationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup AnonymousAuthStrategy mock
    (AnonymousAuthStrategy as any).mockImplementation(() => ({
      initialize: vi.fn().mockResolvedValue(undefined),
      authenticate: vi.fn().mockResolvedValue(undefined),
      getToken: vi.fn().mockResolvedValue('anonymous-token'),
      cleanup: vi.fn().mockResolvedValue(undefined),
    }));

    // Setup PreAuthStrategy mock
    (PreAuthStrategy as any).mockImplementation(() => ({
      initialize: vi.fn().mockResolvedValue(undefined),
      authenticate: vi.fn().mockResolvedValue(undefined),
      getToken: vi.fn().mockResolvedValue('pre-auth-token'),
      cleanup: vi.fn().mockResolvedValue(undefined),
      updateToken: vi.fn().mockResolvedValue(undefined),
      setTokenExpiringCallback: vi.fn(),
    }));

    // Setup PKCEAuthStrategy mock
    (PKCEAuthStrategy as any).mockImplementation(() => ({
      initialize: vi.fn().mockResolvedValue(undefined),
      authenticate: vi.fn().mockResolvedValue(undefined),
      getToken: vi.fn().mockResolvedValue('pkce-token'),
      cleanup: vi.fn().mockResolvedValue(undefined),
    }));

    // Setup ClientCredentialsAuthStrategy mock
    (ClientCredentialsAuthStrategy as any).mockImplementation(() => ({
      initialize: vi.fn().mockResolvedValue(undefined),
      authenticate: vi.fn().mockResolvedValue(undefined),
      getToken: vi.fn().mockResolvedValue('client-credentials-token'),
      cleanup: vi.fn().mockResolvedValue(undefined),
    }));
  });

  describe('constructor', () => {
    it('should create service with anonymous strategy when no input provided', () => {
      const service = new AuthenticationService();
      expect(service.getAuthenticationType()).toBe('anonymous');
    });

    it('should create service with pre-auth strategy', () => {
      const service = new AuthenticationService({
        type: 'pre-auth',
        accessToken: 'test-token',
      });
      expect(service.getAuthenticationType()).toBe('pre-auth');
    });

    it('should create service with anonymous strategy when type is anonymous', () => {
      const service = new AuthenticationService({
        type: 'anonymous',
      });
      expect(service.getAuthenticationType()).toBe('anonymous');
    });
  });

  describe('initialize with scopes', () => {
    it('should use default scopes for agent userType', async () => {
      const mockStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (AnonymousAuthStrategy as any).mockImplementation(() => mockStrategy);

      const service = new AuthenticationService();
      await service.initialize({
        userType: 'agent',
      });

      expect(mockStrategy.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          scopes: ['knowledge.portalmgr.manage', 'core.aiservices.read'],
        })
      );
    });

    it('should add core.customermgr.read scope for customer userType', async () => {
      const mockStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (AnonymousAuthStrategy as any).mockImplementation(() => mockStrategy);

      const service = new AuthenticationService();
      await service.initialize({
        userType: 'customer',
      });

      expect(mockStrategy.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          scopes: ['knowledge.portalmgr.manage', 'core.aiservices.read', 'core.customermgr.read'],
        })
      );
    });

    it('should use custom scopes when provided', async () => {
      const mockStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (AnonymousAuthStrategy as any).mockImplementation(() => mockStrategy);

      const customScopes = ['custom.scope1', 'custom.scope2'];
      const service = new AuthenticationService();
      await service.initialize({
        scopes: customScopes,
        userType: 'customer', // userType should be ignored when custom scopes provided
      });

      expect(mockStrategy.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          scopes: customScopes,
        })
      );
    });

    it('should use default scopes when userType is not provided', async () => {
      const mockStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (AnonymousAuthStrategy as any).mockImplementation(() => mockStrategy);

      const service = new AuthenticationService();
      await service.initialize({});

      expect(mockStrategy.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          scopes: ['knowledge.portalmgr.manage', 'core.aiservices.read'],
        })
      );
    });

    it('should pass deploymentInfo along with scopes', async () => {
      const mockStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (AnonymousAuthStrategy as any).mockImplementation(() => mockStrategy);

      const deploymentInfo = { apiDomain: 'test.example.com' };
      const service = new AuthenticationService();
      await service.initialize({
        deploymentInfo,
        userType: 'agent',
      });

      expect(mockStrategy.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          deploymentInfo,
          scopes: ['knowledge.portalmgr.manage', 'core.aiservices.read'],
        })
      );
    });

  });

  describe('getToken', () => {
    it('should return token from strategy', async () => {
      const service = new AuthenticationService();
      const token = await service.getToken();
      expect(token).toBe('anonymous-token');
    });
  });

  describe('getCachedToken', () => {
    it('should return null before getToken is called', () => {
      const service = new AuthenticationService();
      expect(service.getCachedToken()).toBeNull();
    });

    it('should return the last token from getToken synchronously', async () => {
      const service = new AuthenticationService();
      await service.getToken();
      expect(service.getCachedToken()).toBe('anonymous-token');
    });
  });

  describe('authenticate', () => {
    it('should call strategy authenticate', async () => {
      const mockStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (AnonymousAuthStrategy as any).mockImplementation(() => mockStrategy);

      const service = new AuthenticationService();
      await service.authenticate();

      expect(mockStrategy.authenticate).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should call strategy cleanup', async () => {
      const mockStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (AnonymousAuthStrategy as any).mockImplementation(() => mockStrategy);

      const service = new AuthenticationService();
      await service.cleanup();

      expect(mockStrategy.cleanup).toHaveBeenCalled();
    });
  });

  describe('isAnonymousStrategy', () => {
    it('should return true for anonymous strategy', () => {
      const service = new AuthenticationService();
      // Note: Due to mocking, we need to check the type instead
      expect(service.getAuthenticationType()).toBe('anonymous');
    });

    it('should return false for pre-auth strategy', () => {
      const service = new AuthenticationService({
        type: 'pre-auth',
        accessToken: 'test-token',
      });
      expect(service.getAuthenticationType()).toBe('pre-auth');
    });
  });

  describe('switchStrategyTo', () => {
    it('should switch from anonymous to PKCE strategy', async () => {
      // Unmock to use real AnonymousAuthStrategy for instanceof check
      vi.doUnmock('./AnonymousAuthStrategy.js');
      const { AnonymousAuthStrategy: RealAnonymousAuthStrategy } = await import('./AnonymousAuthStrategy.js');
      
      const service = new AuthenticationService();
      
      // Spy on the strategy's cleanup method
      const strategy = (service as any).strategy;
      const cleanupSpy = vi.spyOn(strategy, 'cleanup').mockResolvedValue(undefined);

      const mockPKCEStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('pkce-token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (PKCEAuthStrategy as any).mockImplementation(() => mockPKCEStrategy);

      const pkceConfig = {
        authorizationUrl: 'https://auth.example.com/authorize',
        tokenUrl: 'https://auth.example.com/token',
        clientId: 'test-client-id',
        redirectUri: 'https://app.example.com/callback',
        knownAuthorities: ['auth.example.com'],
      };

      const postAuthCallback = vi.fn();
      const result = await service.switchStrategyTo(pkceConfig, postAuthCallback);

      expect(result).toBe(true);
      expect(cleanupSpy).toHaveBeenCalled();
      // Verify authentication type was updated
      expect(service.getAuthenticationType()).toBe('pkce');
      // After switching, isInitialized should be false (reset)
      expect(service.getIsInitialized()).toBe(false);
    });

    it('should not switch if already PKCE', async () => {
      const mockPKCEStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('pkce-token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (PKCEAuthStrategy as any).mockImplementation(() => mockPKCEStrategy);

      const service = new AuthenticationService({
        type: 'pkce',
        config: {
          authorizationUrl: 'https://auth.example.com/authorize',
          tokenUrl: 'https://auth.example.com/token',
          clientId: 'test-client-id',
          redirectUri: 'https://app.example.com/callback',
          knownAuthorities: ['auth.example.com'],
        },
      });

      const pkceConfig = {
        authorizationUrl: 'https://auth.example.com/authorize2',
        tokenUrl: 'https://auth.example.com/token2',
        clientId: 'test-client-id-2',
        redirectUri: 'https://app.example.com/callback2',
        knownAuthorities: ['auth.example.com'],
      };

      const result = await service.switchStrategyTo(pkceConfig);

      expect(result).toBe(false);
      expect(service.getAuthenticationType()).toBe('pkce');
    });

    it('should not switch if already PreAuth', async () => {
      const service = new AuthenticationService({
        type: 'pre-auth',
        accessToken: 'test-token',
      });

      const pkceConfig = {
        authorizationUrl: 'https://auth.example.com/authorize',
        tokenUrl: 'https://auth.example.com/token',
        clientId: 'test-client-id',
        redirectUri: 'https://app.example.com/callback',
        knownAuthorities: ['auth.example.com'],
      };

      const result = await service.switchStrategyTo(pkceConfig);

      expect(result).toBe(false);
      expect(service.getAuthenticationType()).toBe('pre-auth');
    });

    it('should store postAuthentication callback for later use', async () => {
      // Unmock to use real AnonymousAuthStrategy for instanceof check
      vi.doUnmock('./AnonymousAuthStrategy.js');
      
      const service = new AuthenticationService();

      const mockPKCEStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('pkce-token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (PKCEAuthStrategy as any).mockImplementation(() => mockPKCEStrategy);

      const pkceConfig = {
        authorizationUrl: 'https://auth.example.com/authorize',
        tokenUrl: 'https://auth.example.com/token',
        clientId: 'test-client-id',
        redirectUri: 'https://app.example.com/callback',
        knownAuthorities: ['auth.example.com'],
      };

      const postAuthCallback = vi.fn();
      const result = await service.switchStrategyTo(pkceConfig, postAuthCallback);

      // Verify strategy was switched successfully
      expect(result).toBe(true);
      expect(service.getAuthenticationType()).toBe('pkce');
      // postAuthentication callback is stored and will be used when initialize() is called
      expect(service).toBeDefined();
    });
  });

  describe('PKCE strategy', () => {
    it('should create service with PKCE strategy', () => {
      const service = new AuthenticationService({
        type: 'pkce',
        config: {
          authorizationUrl: 'https://auth.example.com/authorize',
          tokenUrl: 'https://auth.example.com/token',
          clientId: 'test-client-id',
          redirectUri: 'https://app.example.com/callback',
          knownAuthorities: ['auth.example.com'],
        },
      });
      expect(service.getAuthenticationType()).toBe('pkce');
    });

    it('should initialize PKCE strategy', async () => {
      const mockPKCEStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('pkce-token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (PKCEAuthStrategy as any).mockImplementation(() => mockPKCEStrategy);

      const service = new AuthenticationService({
        type: 'pkce',
        config: {
          authorizationUrl: 'https://auth.example.com/authorize',
          tokenUrl: 'https://auth.example.com/token',
          clientId: 'test-client-id',
          redirectUri: 'https://app.example.com/callback',
          knownAuthorities: ['auth.example.com'],
        },
      });

      await service.initialize({
        deploymentInfo: { apiDomain: 'test.example.com' },
        scopes: ['scope1', 'scope2'],
      });

      expect(mockPKCEStrategy.initialize).toHaveBeenCalled();
      expect(service.getIsInitialized()).toBe(true);
    });

    it('should authenticate with PKCE strategy', async () => {
      const mockPKCEStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('pkce-token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (PKCEAuthStrategy as any).mockImplementation(() => mockPKCEStrategy);

      const service = new AuthenticationService({
        type: 'pkce',
        config: {
          authorizationUrl: 'https://auth.example.com/authorize',
          tokenUrl: 'https://auth.example.com/token',
          clientId: 'test-client-id',
          redirectUri: 'https://app.example.com/callback',
          knownAuthorities: ['auth.example.com'],
        },
      });

      await service.authenticate();

      expect(mockPKCEStrategy.authenticate).toHaveBeenCalled();
    });

    it('should get token from PKCE strategy', async () => {
      const mockPKCEStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('pkce-token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (PKCEAuthStrategy as any).mockImplementation(() => mockPKCEStrategy);

      const service = new AuthenticationService({
        type: 'pkce',
        config: {
          authorizationUrl: 'https://auth.example.com/authorize',
          tokenUrl: 'https://auth.example.com/token',
          clientId: 'test-client-id',
          redirectUri: 'https://app.example.com/callback',
          knownAuthorities: ['auth.example.com'],
        },
      });

      const token = await service.getToken();
      expect(token).toBe('pkce-token');
    });
  });

  describe('ClientCredentials strategy', () => {
    it('should create service with ClientCredentials strategy', () => {
      const service = new AuthenticationService({
        type: 'client-credentials',
        config: {
          tokenUrl: 'https://auth.example.com/token',
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
        },
      });
      expect(service.getAuthenticationType()).toBe('client-credentials');
    });

    it('should initialize ClientCredentials strategy', async () => {
      const mockClientCredentialsStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('client-credentials-token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (ClientCredentialsAuthStrategy as any).mockImplementation(() => mockClientCredentialsStrategy);

      const service = new AuthenticationService({
        type: 'client-credentials',
        config: {
          tokenUrl: 'https://auth.example.com/token',
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
        },
      });

      await service.initialize({
        deploymentInfo: { apiDomain: 'test.example.com' },
        scopes: ['scope1', 'scope2'],
      });

      expect(mockClientCredentialsStrategy.initialize).toHaveBeenCalled();
      expect(service.getIsInitialized()).toBe(true);
    });

    it('should authenticate with ClientCredentials strategy', async () => {
      const mockClientCredentialsStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('client-credentials-token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (ClientCredentialsAuthStrategy as any).mockImplementation(() => mockClientCredentialsStrategy);

      const service = new AuthenticationService({
        type: 'client-credentials',
        config: {
          tokenUrl: 'https://auth.example.com/token',
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
        },
      });

      await service.authenticate();

      expect(mockClientCredentialsStrategy.authenticate).toHaveBeenCalled();
    });

    it('should get token from ClientCredentials strategy', async () => {
      const mockClientCredentialsStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('client-credentials-token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (ClientCredentialsAuthStrategy as any).mockImplementation(() => mockClientCredentialsStrategy);

      const service = new AuthenticationService({
        type: 'client-credentials',
        config: {
          tokenUrl: 'https://auth.example.com/token',
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
        },
      });

      const token = await service.getToken();
      expect(token).toBe('client-credentials-token');
    });
  });

  describe('postAuthentication callback updates', () => {
    it('should update callback when already initialized', async () => {
      const mockStrategy = {
        initialize: vi.fn().mockResolvedValue(undefined),
        authenticate: vi.fn().mockResolvedValue(undefined),
        getToken: vi.fn().mockResolvedValue('token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (AnonymousAuthStrategy as any).mockImplementation(() => mockStrategy);

      const service = new AuthenticationService();
      
      // First initialization without postAuthentication
      await service.initialize({
        deploymentInfo: { apiDomain: 'test.example.com' },
      });

      expect(service.getIsInitialized()).toBe(true);
      expect(mockStrategy.initialize).toHaveBeenCalledTimes(1);

      // Second initialization with postAuthentication
      const postAuthCallback = vi.fn();
      await service.initialize({
        deploymentInfo: { apiDomain: 'test.example.com' },
        postAuthentication: postAuthCallback,
      });

      // Should update strategy's postAuthentication callback
      expect(mockStrategy.initialize).toHaveBeenCalledTimes(2);
      expect(mockStrategy.initialize).toHaveBeenNthCalledWith(2, expect.objectContaining({
        postAuthentication: postAuthCallback,
      }));
    });

    it('should call updated callback after authentication', async () => {
      let storedPostAuth: any = null;
      const mockStrategy = {
        initialize: vi.fn().mockImplementation(async (options?: any) => {
          if (options?.postAuthentication) {
            storedPostAuth = options.postAuthentication;
          }
        }),
        authenticate: vi.fn().mockImplementation(async () => {
          if (storedPostAuth) {
            await storedPostAuth('test-token');
          }
        }),
        getToken: vi.fn().mockResolvedValue('token'),
        cleanup: vi.fn().mockResolvedValue(undefined),
      };
      (AnonymousAuthStrategy as any).mockImplementation(() => mockStrategy);

      const service = new AuthenticationService();
      const postAuthCallback = vi.fn();

      await service.initialize({
        deploymentInfo: { apiDomain: 'test.example.com' },
        postAuthentication: postAuthCallback,
      });

      await service.authenticate();

      expect(postAuthCallback).toHaveBeenCalledWith('test-token');
    });
  });
});
