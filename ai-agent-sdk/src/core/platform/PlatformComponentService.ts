/**
 * Interface for platform-specific connector scripts (Genesys, Amazon Connect, etc.).
 *
 * Connector scripts register an implementation of this interface on
 * `window.PlatformComponentService` (browser) or `globalThis.PlatformComponentService`
 * (non-browser). The SDK calls these methods at defined lifecycle points
 * during initialization.
 *
 * @module PlatformComponentService
 */

import type { HookContract } from './HookContract.js';
import type { Portal } from '../types/PortalTypes.js';

/**
 * Contract that platform connector scripts must implement.
 *
 * All methods except `initPlatform` are optional — the SDK calls them
 * when present and silently skips them when absent.
 */
export interface PlatformComponentService {
  /** Main connector initialization (e.g., connecting to Genesys/NICE). Called after authentication, before the CC pipeline starts. */
  initPlatform: (hookContract: HookContract) => Promise<void>;

  /** Filter or reorder the portal list after fetching. */
  getPortalList?: (filteredPortals: Portal[]) => Portal[] | Promise<Portal[]>;

  /** Auto-select a default portal. Receives the output of `getPortalList`. Return `null` to fall through to count-based logic. */
  getDefaultPortal?: (portalList: Portal[]) => Portal | null | Promise<Portal | null>;

  /** Called after a portal is selected. Returns filter tags (`Record<string, string[]>`) stored via `setUserFilterTags`. */
  onPortalSelected?: (portal: Portal) => Record<string, string[]> | Promise<Record<string, string[]>>;

  /** Modify OAuth scopes before authentication. Returns the augmented scopes array. */
  addCustomAuthScopes?: (scopes: string[]) => string[] | Promise<string[]>;

  /** Register custom hooks on the HookContract. */
  loadCustomHook?: (hookContract: HookContract) => void;

  /** Receive the HookContract for bidirectional communication with the SDK. */
  setHookContract?: (hookContract: HookContract) => void;
}

declare global {
  interface Window {
    PlatformComponentService?: PlatformComponentService;
  }
}
