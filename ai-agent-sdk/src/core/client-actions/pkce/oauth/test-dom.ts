/**
 * Minimal browser stand-ins for this suite.
 *
 * The SDK's tests run in vitest's `node` environment and no DOM library is installed, so rather
 * than pull one in for a handful of files, the PKCE OAuth modules' entire browser surface is stubbed
 * here: session storage, `window.open`, and the message listener. Small enough to be obvious, and
 * it keeps these tests in the same environment as every other suite in the package.
 */

export class FakeSessionStorage implements Storage {
  private data = new Map<string, string>();

  get length(): number {
    return this.data.size;
  }
  key(index: number): string | null {
    return [...this.data.keys()][index] ?? null;
  }
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
  clear(): void {
    this.data.clear();
  }
  [name: string]: unknown;
}

export interface FakeWindow {
  open: (url?: string, target?: string, features?: string) => FakePopup | null;
  addEventListener: (type: string, listener: (event: MessageEvent) => void) => void;
  removeEventListener: (type: string, listener: (event: MessageEvent) => void) => void;
  setInterval: typeof setInterval;
  clearInterval: typeof clearInterval;
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
  /** Deliver a message to every registered listener, as the browser would. */
  post: (event: { origin: string; data: unknown }) => void;
}

export interface FakePopup {
  closed: boolean;
  close: () => void;
}

export function installFakeDom(options: { popupBlocked?: boolean } = {}): {
  window: FakeWindow;
  popup: FakePopup;
  /** True once anything has been awaited -- i.e. the user gesture is spent. */
  gestureSpent: () => boolean;
  restore: () => void;
} {
  // A microtask set at install time; once it runs, any synchronous window.open opportunity is
  // gone. This is what makes the "opened during the gesture" rule testable.
  let spent = false;
  void Promise.resolve().then(() => {
    spent = true;
  });
  const listeners = new Set<(event: MessageEvent) => void>();
  const popup: FakePopup = {
    closed: false,
    close() {
      this.closed = true;
    },
  };

  const fakeWindow: FakeWindow = {
    open: () => (options.popupBlocked ? null : popup),
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
    setInterval: ((fn: () => void, ms: number) => setInterval(fn, ms)) as typeof setInterval,
    clearInterval: ((id: number) => clearInterval(id)) as typeof clearInterval,
    setTimeout: ((fn: () => void, ms: number) => setTimeout(fn, ms)) as typeof setTimeout,
    clearTimeout: ((id: number) => clearTimeout(id)) as typeof clearTimeout,
    post: (event) => listeners.forEach((listener) => listener(event as MessageEvent)),
  };

  const globals = globalThis as unknown as Record<string, unknown>;
  const previousWindow = globals.window;
  const previousStorage = globals.sessionStorage;
  globals.window = fakeWindow;
  globals.sessionStorage = new FakeSessionStorage();

  return {
    window: fakeWindow,
    popup,
    gestureSpent: () => spent,
    restore: () => {
      globals.window = previousWindow;
      globals.sessionStorage = previousStorage;
    },
  };
}
