import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadPlatformScript, deriveEnvironment, buildPlatformScriptUrl } from './PlatformScriptLoader.js';

describe('PlatformScriptLoader', () => {
  const mockLogger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    delete (globalThis as any).PlatformComponentService;
  });

  afterEach(() => {
    delete (globalThis as any).PlatformComponentService;
  });

  describe('deriveEnvironment', () => {
    it('returns explicit env when provided', () => {
      expect(deriveEnvironment('anything.com', 'dev')).toBe('dev');
      expect(deriveEnvironment('anything.com', 'QA')).toBe('qa');
      expect(deriveEnvironment('anything.com', 'Prod')).toBe('prod');
    });

    it('parses dev from domain', () => {
      expect(deriveEnvironment('dev-api.egeng.info')).toBe('dev');
    });

    it('parses qa from domain', () => {
      expect(deriveEnvironment('qa-api.egeng.info')).toBe('qa');
    });

    it('defaults to prod', () => {
      expect(deriveEnvironment('api.egain.services')).toBe('prod');
      expect(deriveEnvironment(undefined)).toBe('prod');
    });
  });

  describe('buildPlatformScriptUrl', () => {
    it('constructs correct URL for dev environment', () => {
      const url = buildPlatformScriptUrl('genesys', 'dev');
      expect(url).toBe('https://dev-apps.egeng.info/ai-agent-connector-genesys/web/static/connector-ai-agent.js');
    });

    it('constructs correct URL for qa environment', () => {
      const url = buildPlatformScriptUrl('genesys', 'qa');
      expect(url).toBe('https://qa-apps.egeng.info/ai-agent-connector-genesys/web/static/connector-ai-agent.js');
    });

    it('constructs correct URL for production environment', () => {
      const url = buildPlatformScriptUrl('genesys', 'prod');
      expect(url).toBe('https://apps.egain.services/ai-agent-connector-genesys/web/static/connector-ai-agent.js');
    });

    it('defaults to production for unknown environment', () => {
      const url = buildPlatformScriptUrl('genesys', 'staging');
      expect(url).toBe('https://apps.egain.services/ai-agent-connector-genesys/web/static/connector-ai-agent.js');
    });
  });

  describe('loadPlatformScript (browser path)', () => {
    let originalDocument: any;

    beforeEach(() => {
      originalDocument = globalThis.document;
    });

    afterEach(() => {
      if (originalDocument === undefined) {
        delete (globalThis as any).document;
      } else {
        (globalThis as any).document = originalDocument;
      }
    });

    it('loads script and resolves when PlatformComponentService is registered', async () => {
      const mockScript: any = {
        set src(val: string) { (this as any)._src = val; },
        get src() { return (this as any)._src; },
        set async(val: boolean) { (this as any)._async = val; },
        get async() { return (this as any)._async; },
        set crossOrigin(val: string) { (this as any)._crossOrigin = val; },
        get crossOrigin() { return (this as any)._crossOrigin; },
        onload: null as any,
        onerror: null as any,
      };

      (globalThis as any).document = {
        createElement: vi.fn().mockReturnValue(mockScript),
        head: { appendChild: vi.fn() },
      };

      const promise = loadPlatformScript({
        platform: 'genesys',
        baseUrl: 'prod',
        logger: mockLogger,
      });

      // Simulate script load and PCS registration
      (globalThis as any).PlatformComponentService = { initPlatform: vi.fn() };
      (globalThis as any).window = { PlatformComponentService: (globalThis as any).PlatformComponentService };
      mockScript.onload();

      await promise;
      expect((globalThis as any).document.createElement).toHaveBeenCalledWith('script');
      expect((globalThis as any).document.head.appendChild).toHaveBeenCalledWith(mockScript);
    });

    it('rejects when script onerror fires', async () => {
      const mockScript: any = { onload: null, onerror: null };
      (globalThis as any).document = {
        createElement: vi.fn().mockReturnValue(mockScript),
        head: { appendChild: vi.fn() },
      };

      const promise = loadPlatformScript({
        platform: 'genesys',
        baseUrl: 'prod',
        logger: mockLogger,
      });

      mockScript.onerror();

      await expect(promise).rejects.toThrow('Failed to load platform connector script from');
    });

    it('uses overrideUrl when provided', async () => {
      let capturedSrc: string | undefined;
      const mockScript: any = { onload: null, onerror: null };
      Object.defineProperty(mockScript, 'src', {
        set(val: string) { capturedSrc = val; },
        get() { return capturedSrc; },
      });
      (globalThis as any).document = {
        createElement: vi.fn().mockReturnValue(mockScript),
        head: { appendChild: vi.fn() },
      };

      const customUrl = 'https://custom.example.com/connector.js';
      const promise = loadPlatformScript({
        platform: 'genesys',
        baseUrl: 'prod',
        overrideUrl: customUrl,
        logger: mockLogger,
      });

      (globalThis as any).PlatformComponentService = { initPlatform: vi.fn() };
      (globalThis as any).window = { PlatformComponentService: (globalThis as any).PlatformComponentService };
      mockScript.onload();

      await promise;
      expect(capturedSrc).toBe(customUrl);
    });
  });

  describe('loadPlatformScript (non-browser path)', () => {
    let originalDocument: any;

    beforeEach(() => {
      originalDocument = (globalThis as any).document;
      delete (globalThis as any).document;
    });

    afterEach(() => {
      if (originalDocument !== undefined) {
        (globalThis as any).document = originalDocument;
      }
    });

    it('lazy loads module via import() using constructed URL', async () => {
      // We can't fully test dynamic import in a unit test, but we can verify
      // the non-browser path is taken and the correct URL is used
      const url = buildPlatformScriptUrl('genesys', 'prod');

      await expect(loadPlatformScript({
        platform: 'genesys',
        baseUrl: 'prod',
        logger: mockLogger,
      })).rejects.toThrow(); // Will fail because the URL doesn't resolve to a module

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Loading platform connector module via dynamic import()',
        expect.objectContaining({ url }),
      );
    });

    it('uses overrideUrl for import() when provided', async () => {
      const customUrl = './custom-connector.js';

      await expect(loadPlatformScript({
        platform: 'genesys',
        baseUrl: 'prod',
        overrideUrl: customUrl,
        logger: mockLogger,
      })).rejects.toThrow(); // Will fail because the module doesn't exist

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Loading platform connector module via dynamic import()',
        expect.objectContaining({ url: customUrl }),
      );
    });
  });
});
