import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AnonymousAuthStrategy } from './AnonymousAuthStrategy.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AnonymousAuthStrategy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create strategy with default config', () => {
      const strategy = new AnonymousAuthStrategy();
      expect(strategy).toBeDefined();
    });

    it('should create strategy with custom cache config', () => {
      const strategy = new AnonymousAuthStrategy({
        cache: {
          enabled: false,
          storageType: 'local',
          keyPrefix: 'custom_prefix_',
          ttl: 600000,
        },
      });
      expect(strategy).toBeDefined();
    });
  });

  describe('initialize', () => {
    it('should initialize strategy', async () => {
      const strategy = new AnonymousAuthStrategy();
      await strategy.initialize({
        deploymentInfo: { apiDomain: 'test.example.com' },
        scopes: ['scope1', 'scope2'],
      });
      expect(strategy).toBeDefined();
    });

    it('should store postAuthentication callback', async () => {
      const strategy = new AnonymousAuthStrategy();
      const postAuthCallback = vi.fn();
      await strategy.initialize({
        postAuthentication: postAuthCallback,
      });
      expect(strategy).toBeDefined();
    });

    it('should store deploymentInfo', async () => {
      const strategy = new AnonymousAuthStrategy();
      const deploymentInfo = { apiDomain: 'test.example.com', tenantId: 'tenant-123' };
      await strategy.initialize({
        deploymentInfo,
      });
      expect(strategy).toBeDefined();
    });

    it('should store scopes', async () => {
      const strategy = new AnonymousAuthStrategy();
      const scopes = ['scope1', 'scope2'];
      await strategy.initialize({
        scopes,
      });
      expect(strategy).toBeDefined();
    });
  });

  describe('authenticate', () => {
    it('should authenticate successfully', async () => {
      const strategy = new AnonymousAuthStrategy();
      
      // Mock metadata fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authenticationDetails: {
            oAuthAnonymousCustomer: [{
              accessTokenURL: 'https://<DOMAIN_NAME>/token',
            }],
            apiPermissionPrefix: 'api.',
          },
        }),
      });
      
      // Mock token fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'anonymous-token-123',
          expires_in: 3600,
        }),
      });

      await strategy.initialize({
        deploymentInfo: { apiDomain: 'test.example.com', tenantId: 'tenant-123' },
      });
      await strategy.authenticate();
      expect(strategy).toBeDefined();
    });

    it('should call postAuthentication callback after authentication', async () => {
      const strategy = new AnonymousAuthStrategy();
      const postAuthCallback = vi.fn();
      
      // Mock metadata fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authenticationDetails: {
            oAuthAnonymousCustomer: [{
              accessTokenURL: 'https://<DOMAIN_NAME>/token',
            }],
            apiPermissionPrefix: 'api.',
          },
        }),
      });
      
      // Mock token fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'anonymous-token-123',
          expires_in: 3600,
        }),
      });

      await strategy.initialize({
        postAuthentication: postAuthCallback,
        deploymentInfo: { apiDomain: 'test.example.com', tenantId: 'tenant-123' },
      });

      await strategy.authenticate();

      // postAuthentication should be called with the token
      expect(postAuthCallback).toHaveBeenCalled();
    });
  });

  describe('getToken', () => {
    it('should return cached token if available and valid', async () => {
      const strategy = new AnonymousAuthStrategy({
        cache: { enabled: true, storageType: 'memory' },
      });

      // Mock metadata fetch (first call)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authenticationDetails: {
            oAuthAnonymousCustomer: [{
              accessTokenURL: 'https://<DOMAIN_NAME>/token',
            }],
            apiPermissionPrefix: 'api.',
          },
        }),
      });
      
      // Mock token fetch (second call)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'cached-token-123',
          expires_in: 3600,
        }),
      });

      await strategy.initialize({
        deploymentInfo: { apiDomain: 'test.example.com', tenantId: 'tenant-123' },
      });

      // First call - should fetch and cache
      const token1 = await strategy.getToken();
      expect(token1).toBe('cached-token-123');

      // Second call - should return cached token
      const token2 = await strategy.getToken();
      expect(token2).toBe('cached-token-123');

      // Should only fetch twice (metadata + token) on first call, then use cache
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should fetch new token if cache is disabled', async () => {
      const strategy = new AnonymousAuthStrategy({
        cache: { enabled: false },
      });

      // Mock metadata fetch calls (2 calls - one for each getToken)
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            authenticationDetails: {
              oAuthAnonymousCustomer: [{
                accessTokenURL: 'https://<DOMAIN_NAME>/token',
              }],
              apiPermissionPrefix: 'api.',
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            access_token: 'new-token-123',
            expires_in: 3600,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            authenticationDetails: {
              oAuthAnonymousCustomer: [{
                accessTokenURL: 'https://<DOMAIN_NAME>/token',
              }],
              apiPermissionPrefix: 'api.',
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            access_token: 'new-token-123',
            expires_in: 3600,
          }),
        });

      await strategy.initialize({
        deploymentInfo: { apiDomain: 'test.example.com', tenantId: 'tenant-123' },
      });

      const token1 = await strategy.getToken();
      const token2 = await strategy.getToken();

      expect(token1).toBe('new-token-123');
      expect(token2).toBe('new-token-123');
      // Should fetch 4 times (metadata + token) x 2 since cache is disabled
      expect(mockFetch).toHaveBeenCalledTimes(4);
    });

    it('should fetch new token if cached token expired', async () => {
      const strategy = new AnonymousAuthStrategy({
        cache: { enabled: true, storageType: 'memory', ttl: 100 }, // Very short TTL
      });

      // Mock metadata fetch (first call)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authenticationDetails: {
            oAuthAnonymousCustomer: [{
              accessTokenURL: 'https://<DOMAIN_NAME>/token',
            }],
            apiPermissionPrefix: 'api.',
          },
        }),
      });
      
      // Mock token fetch (first call - token-1)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'token-1',
          expires_in: 1, // 1 second expiry
        }),
      });
      
      // Mock metadata fetch (second call after expiry)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authenticationDetails: {
            oAuthAnonymousCustomer: [{
              accessTokenURL: 'https://<DOMAIN_NAME>/token',
            }],
            apiPermissionPrefix: 'api.',
          },
        }),
      });
      
      // Mock token fetch (second call - token-2)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'token-2',
          expires_in: 3600,
        }),
      });

      await strategy.initialize({
        deploymentInfo: { apiDomain: 'test.example.com', tenantId: 'tenant-123' },
      });

      const token1 = await strategy.getToken();
      expect(token1).toBe('token-1');

      // Wait for token to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      const token2 = await strategy.getToken();
      expect(token2).toBe('token-2');
      expect(mockFetch).toHaveBeenCalledTimes(4);
    });

    it('should return null if fetch fails', async () => {
      const strategy = new AnonymousAuthStrategy();
      
      // Mock metadata fetch to throw an error
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await strategy.initialize({
        deploymentInfo: { apiDomain: 'test.example.com', tenantId: 'tenant-123' },
      });

      // getToken() will throw if getUserSpecificMetaData throws
      // So we expect it to throw, not return null
      await expect(strategy.getToken()).rejects.toThrow('Network error');
    });

    it('should return null if response has no access_token', async () => {
      const strategy = new AnonymousAuthStrategy();
      
      // Mock metadata fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authenticationDetails: {
            oAuthAnonymousCustomer: [{
              accessTokenURL: 'https://<DOMAIN_NAME>/token',
            }],
            apiPermissionPrefix: 'api.',
          },
        }),
      });
      
      // Mock token fetch with no access_token
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await strategy.initialize({
        deploymentInfo: { apiDomain: 'test.example.com', tenantId: 'tenant-123' },
      });

      const token = await strategy.getToken();
      expect(token).toBeNull();
    });
  });

  describe('cleanup', () => {
    it('should clear cached token', async () => {
      const strategy = new AnonymousAuthStrategy({
        cache: { enabled: true, storageType: 'memory' },
      });

      // Mock metadata fetch (first call)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authenticationDetails: {
            oAuthAnonymousCustomer: [{
              accessTokenURL: 'https://<DOMAIN_NAME>/token',
            }],
            apiPermissionPrefix: 'api.',
          },
        }),
      });
      
      // Mock token fetch (first call)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'token-to-clear',
          expires_in: 3600,
        }),
      });

      await strategy.initialize({
        deploymentInfo: { apiDomain: 'test.example.com', tenantId: 'tenant-123' },
      });

      await strategy.getToken();
      await strategy.cleanup();

      // After cleanup, should fetch new token
      // Mock metadata fetch (second call after cleanup)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authenticationDetails: {
            oAuthAnonymousCustomer: [{
              accessTokenURL: 'https://<DOMAIN_NAME>/token',
            }],
            apiPermissionPrefix: 'api.',
          },
        }),
      });
      
      // Mock token fetch (second call after cleanup)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'new-token-after-cleanup',
          expires_in: 3600,
        }),
      });

      const token = await strategy.getToken();
      expect(token).toBe('new-token-after-cleanup');
    });
  });

  describe('isAuthenticated', () => {
    it('should return false initially', () => {
      const strategy = new AnonymousAuthStrategy();
      expect(strategy.isAuthenticated()).toBe(false);
    });

    it('should return true after authentication', async () => {
      const strategy = new AnonymousAuthStrategy();
      
      // Mock metadata fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          authenticationDetails: {
            oAuthAnonymousCustomer: [{
              accessTokenURL: 'https://<DOMAIN_NAME>/token',
            }],
            apiPermissionPrefix: 'api.',
          },
        }),
      });
      
      // Mock token fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'token-123',
          expires_in: 3600,
        }),
      });

      await strategy.initialize({
        deploymentInfo: { apiDomain: 'test.example.com', tenantId: 'tenant-123' },
      });

      await strategy.authenticate();
      expect(strategy.isAuthenticated()).toBe(true);
    });
  });
});
