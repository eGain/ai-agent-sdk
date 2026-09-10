import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadPlatformScript } from './PlatformScriptLoader.js';

describe('PlatformScriptLoader', () => {
  const mockLogger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  const prodGenesysUrl =
    'https://apps.egain.services/ai-agent-connector-genesys/web/static/connector-ai-agent.js';

  beforeEach(() => {
    vi.clearAllMocks();
    delete (globalThis as any).PlatformComponentService;
  });

  afterEach(() => {
    delete (globalThis as any).PlatformComponentService;
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
        scriptUrl: prodGenesysUrl,
        logger: mockLogger,
      });

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
        scriptUrl: prodGenesysUrl,
        logger: mockLogger,
      });

      mockScript.onerror();

      await expect(promise).rejects.toThrow('Failed to load platform connector script from');
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

    it('lazy loads module via import() using the provided URL', async () => {
      await expect(loadPlatformScript({
        scriptUrl: prodGenesysUrl,
        logger: mockLogger,
      })).rejects.toThrow();

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Loading platform connector module via dynamic import()',
        expect.objectContaining({ url: prodGenesysUrl }),
      );
    });
  });
});
