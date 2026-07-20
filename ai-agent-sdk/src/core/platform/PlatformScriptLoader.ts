/**
 * Dynamic loader for platform connector scripts.
 *
 * In browser environments, injects a `<script>` tag. In non-browser
 * environments (Node.js, SSR), falls back to dynamic `import()` using
 * the same constructed URL.
 *
 * @module PlatformScriptLoader
 */

import type { PlatformComponentService } from './PlatformComponentService.js';

export interface LoadPlatformScriptOptions {
  platform: string;
  baseUrl: string;
  overrideUrl?: string;
  logger: {
    debug: (msg: string, ctx?: object) => void;
    info: (msg: string, ctx?: object) => void;
    warn: (msg: string, ctx?: object) => void;
    error: (msg: string, err?: Error, ctx?: object) => void;
  };
}

const ENV_BASE_URLS: Record<string, string> = {
  dev: 'https://dev-apps.egeng.info/',
  qa: 'https://qa-apps.egeng.info/',
  prod: 'https://apps.egain.services/',
  stage: 'https://non-prod-apps.egain.services/',
  euprod: 'https://apps.egain.cloud/',
  eustage: 'https://non-prod-apps.egain.cloud/',
  devrf: 'https://dev-apps.ezdev.net/',
};

/**
 * Derive the deployment environment from available state.
 *
 * Priority: explicit env string > parsed from domain (dev-/qa- prefix) > "prod".
 */
export function deriveEnvironment(domain?: string, explicitEnv?: string): string {
  if (explicitEnv) {
    const env = explicitEnv.toLowerCase();
    if (env === 'dev' || env === 'qa' || env === 'prod') return env;
  }
  if (domain) {
    const d = domain.toLowerCase();
    if (d.startsWith('dev-') || d.includes('dev-')) return 'dev';
    if (d.startsWith('qa-') || d.includes('qa-')) return 'qa';
  }
  return 'prod';
}

/**
 * Construct the connector script URL for a given platform and environment.
 * Platform `test` maps to the standalone connector.
 */
export function buildPlatformScriptUrl(platform: string, environment: string): string {
  const connectorPlatform = platform === 'test' ? 'standalone' : platform;
  const baseUrl = ENV_BASE_URLS[environment] ?? ENV_BASE_URLS.prod;
  return `${baseUrl}ai-agent-connector-${connectorPlatform}/web/static/connector-ai-agent.js`;
}

/**
 * Load a platform connector script.
 *
 * - **Browser:** Injects a `<script>` tag into `document.head`, waits for
 *   `onload` + 100ms buffer, then verifies `window.PlatformComponentService`.
 * - **Non-browser:** Uses dynamic `import()` with the same constructed URL.
 *   The imported module must export `PlatformComponentService` as a default
 *   or named export.
 */
export async function loadPlatformScript(options: LoadPlatformScriptOptions): Promise<void> {
  const { platform, baseUrl, overrideUrl, logger } = options;
  const scriptUrl = overrideUrl ?? buildPlatformScriptUrl(platform, baseUrl);

  const isBrowser = typeof document !== 'undefined';

  if (isBrowser) {
    await loadViaBrowserScript(scriptUrl, logger);
  } else {
    await loadViaDynamicImport(scriptUrl, logger);
  }
}

async function loadViaBrowserScript(
  url: string,
  logger: LoadPlatformScriptOptions['logger'],
): Promise<void> {
  logger.info('Loading platform connector script via <script> tag', { url });

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      setTimeout(() => {
        if ((window as any).PlatformComponentService) {
          logger.info('PlatformComponentService registered successfully');
          resolve();
        } else {
          reject(new Error(
            `Platform connector script loaded from "${url}" but window.PlatformComponentService was not registered`,
          ));
        }
      }, 100);
    };

    script.onerror = () => {
      reject(new Error(`Failed to load platform connector script from "${url}"`));
    };

    document.head.appendChild(script);
  });
}

async function loadViaDynamicImport(
  url: string,
  logger: LoadPlatformScriptOptions['logger'],
): Promise<void> {
  logger.info('Loading platform connector module via dynamic import()', { url });

  try {
    const mod = await import(/* webpackIgnore: true */ url);
    const service: PlatformComponentService | undefined =
      mod.default ?? mod.PlatformComponentService;

    if (service) {
      (globalThis as any).PlatformComponentService = service;
      logger.info('PlatformComponentService resolved from dynamic import');
    } else {
      throw new Error('Imported module does not export PlatformComponentService');
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'Imported module does not export PlatformComponentService') {
      throw err;
    }
    throw new Error(
      `Failed to dynamically import platform connector from "${url}": ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}
