import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PreAuthStrategy } from './PreAuthStrategy.js';

describe('PreAuthStrategy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should create strategy with access token', () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
      });
      expect(strategy).toBeDefined();
    });

    it('should create strategy with access token and refresh function', () => {
      const refreshTokenFn = vi.fn().mockResolvedValue('new-token-456');
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
        refreshTokenFn,
      });
      expect(strategy).toBeDefined();
    });

    it('should create strategy with custom expiry buffer', () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
        expiryBufferMs: 60000, // 1 minute
      });
      expect(strategy).toBeDefined();
    });
  });

  describe('initialize', () => {
    it('should initialize strategy', async () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
      });
      await strategy.initialize({
        deploymentInfo: { apiDomain: 'test.example.com' },
        scopes: ['scope1', 'scope2'],
      });
      expect(strategy).toBeDefined();
    });

    it('should store postAuthentication callback', async () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
      });
      const postAuthCallback = vi.fn();
      await strategy.initialize({
        postAuthentication: postAuthCallback,
      });
      expect(strategy).toBeDefined();
    });

    it('should update postAuthentication callback if already initialized', async () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
      });
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
  });

  describe('authenticate', () => {
    it('should authenticate successfully', async () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
      });
      await strategy.initialize();
      await strategy.authenticate();
      expect(strategy.isAuthenticated()).toBe(true);
    });

    it('should call postAuthentication callback after authentication', async () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
      });
      const postAuthCallback = vi.fn();
      
      await strategy.initialize({
        postAuthentication: postAuthCallback,
      });

      await strategy.authenticate();

      expect(postAuthCallback).toHaveBeenCalledWith('test-token-123');
    });

    it('should not call postAuthentication if not set', async () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
      });
      await strategy.initialize();
      await strategy.authenticate();
      expect(strategy.isAuthenticated()).toBe(true);
    });
  });

  describe('getToken', () => {
    it('should return the access token', async () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
      });
      await strategy.initialize();
      const token = await strategy.getToken();
      expect(token).toBe('test-token-123');
    });

    it('should return token without initialization', async () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
      });
      const token = await strategy.getToken();
      expect(token).toBe('test-token-123');
    });
  });

  describe('updateToken', () => {
    it('should update the access token', async () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'old-token-123',
      });
      await strategy.initialize();

      await strategy.updateToken('new-token-456');
      const token = await strategy.getToken();
      expect(token).toBe('new-token-456');
    });

    it('should update token and call postAuthentication if authenticated', async () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'old-token-123',
      });
      const postAuthCallback = vi.fn();
      
      await strategy.initialize({
        postAuthentication: postAuthCallback,
      });
      await strategy.authenticate();

      await strategy.updateToken('new-token-456');
      
      expect(postAuthCallback).toHaveBeenCalledWith('new-token-456');
    });
  });

  describe('setTokenExpiringCallback', () => {
    it('should set token expiring callback', () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
      });
      const callback = vi.fn();
      strategy.setTokenExpiringCallback(callback);
      expect(strategy).toBeDefined();
    });

    it('should trigger callback when token expires', async () => {
      // Create a JWT token that expires in 2 seconds
      const exp = Math.floor(Date.now() / 1000) + 2;
      const payload = { exp };
      const token = `header.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`;
      
      const strategy = new PreAuthStrategy({
        accessToken: token,
        expiryBufferMs: 1000,
      });
      
      const callback = vi.fn();
      await strategy.initialize();
      strategy.setTokenExpiringCallback(callback);
      
      // Authenticate to schedule the expiry event
      await strategy.authenticate();

      // Fast-forward time past expiry buffer
      vi.advanceTimersByTime(2000);

      // Callback should be triggered
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false initially', () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
      });
      expect(strategy.isAuthenticated()).toBe(false);
    });

    it('should return true after authentication', async () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
      });
      await strategy.initialize();
      await strategy.authenticate();
      expect(strategy.isAuthenticated()).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should cleanup resources', async () => {
      const strategy = new PreAuthStrategy({
        accessToken: 'test-token-123',
      });
      await strategy.initialize();
      await strategy.authenticate();
      await strategy.cleanup();
      expect(strategy).toBeDefined();
    });
  });
});
