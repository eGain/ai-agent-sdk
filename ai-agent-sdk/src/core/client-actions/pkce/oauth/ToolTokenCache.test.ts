import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { installFakeDom } from './test-dom';
import { ToolTokenCache } from './ToolTokenCache';
import type { ToolTokenSource } from './types';

const HOUR = 3_600_000;

const SOURCE: ToolTokenSource = {
  credentialId: 'cred-9',
  clientId: 'client-3x9k',
  tokenUrl: 'https://login.acme.com/oauth/token',
  authorizationUrl: 'https://login.acme.com/authorize',
  scopes: 'openid',
};

describe('ToolTokenCache', () => {
  let cache: ToolTokenCache;
  let dom: ReturnType<typeof installFakeDom>;

  beforeEach(() => {
    dom = installFakeDom();
    cache = new ToolTokenCache();
  });

  afterEach(() => dom.restore());

  const store = (scopes: string, expiresAt = Date.now() + HOUR) =>
    cache.set({ ...SOURCE, scopes }, { accessToken: 'tok', expiresAt, scopes });

  it('returns a token that is still good', () => {
    store('openid profile');
    expect(cache.get({ ...SOURCE, scopes: 'openid profile' })?.accessToken).toBe('tok');
  });

  it('misses when the credential now asks for different scopes', () => {
    // A credential edited in Studio to request more permissions must not be satisfied by the
    // narrower token issued before the change.
    store('openid');
    expect(cache.get({ ...SOURCE, scopes: 'openid profile' })).toBeNull();
  });

  it('ignores the order scopes happen to be written in', () => {
    store('profile openid');
    expect(cache.get({ ...SOURCE, scopes: 'openid  profile' })?.accessToken).toBe('tok');
  });

  it.each<[string, Partial<ToolTokenSource>]>([
    ['client id', { clientId: 'client-prod' }],
    ['token URL', { tokenUrl: 'https://login.acme-prod.com/oauth/token' }],
    ['authorization URL', { authorizationUrl: 'https://login.acme-prod.com/authorize' }],
  ])('misses when the credential is repointed at another %s', (_field, change) => {
    // The token was issued by the old app: the new one's API would reject it, and with a cache hit
    // no sign-in card would appear to fix that.
    store('openid');
    expect(cache.get({ ...SOURCE, ...change })).toBeNull();
  });

  it('treats a token expiring imminently as already gone', () => {
    // Skew allowance: a token with 10s left would expire mid-flight and fail the tool call
    // instead of the sign-in, which is much harder to explain.
    store('openid', Date.now() + 10_000);
    expect(cache.get(SOURCE)).toBeNull();
  });

  it('still hands back an expired entry to peek, so a refresh can use it', () => {
    cache.set(SOURCE, {
      accessToken: 'old',
      refreshToken: 'refresh',
      expiresAt: Date.now() - HOUR,
      scopes: 'openid',
    });

    expect(cache.get(SOURCE)).toBeNull();
    expect(cache.peek(SOURCE)?.refreshToken).toBe('refresh');
  });

  it('keeps credentials apart', () => {
    store('openid');
    expect(cache.get({ ...SOURCE, credentialId: 'cred-other' })).toBeNull();
  });

  it('removes only the entry it is asked to', () => {
    store('openid');
    store('openid profile');

    cache.remove(SOURCE);

    expect(cache.get(SOURCE)).toBeNull();
    expect(cache.get({ ...SOURCE, scopes: 'openid profile' })?.accessToken).toBe('tok');
  });

  it('treats unavailable storage as a miss rather than an error', () => {
    // Private browsing and blocked site data both throw here. One extra sign-in is an acceptable
    // cost; a thrown exception would take down the conversation.
    (globalThis as unknown as Record<string, unknown>).sessionStorage = {
      getItem: () => {
        throw new Error('denied');
      },
    };

    expect(() => cache.get(SOURCE)).not.toThrow();
    expect(cache.get(SOURCE)).toBeNull();
  });

  it('survives a corrupt entry', () => {
    sessionStorage.setItem(ToolTokenCache.keyFor(SOURCE), 'not json');
    expect(cache.get(SOURCE)).toBeNull();
  });

  it('clears every tool token without touching anything else', () => {
    store('openid');
    sessionStorage.setItem('unrelated', 'keep me');

    cache.clearAll();

    expect(cache.get(SOURCE)).toBeNull();
    expect(sessionStorage.getItem('unrelated')).toBe('keep me');
  });
});
