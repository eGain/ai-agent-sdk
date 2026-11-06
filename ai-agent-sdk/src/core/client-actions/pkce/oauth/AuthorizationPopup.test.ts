import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AuthorizationPopup } from './AuthorizationPopup';
import { installFakeDom } from './test-dom';

const REDIRECT_URI = 'https://tenant1.egain.cloud/oauth/callback';
const CALLBACK_ORIGIN = 'https://tenant1.egain.cloud';
const STATE = 'state-abc';

const callbackMessage = (overrides: Record<string, unknown> = {}) => ({
  origin: CALLBACK_ORIGIN,
  data: {
    source: 'egain-tool-auth',
    url: `${REDIRECT_URI}?code=CODE&state=${STATE}`,
    state: STATE,
    ...overrides,
  },
});

describe('AuthorizationPopup', () => {
  let dom: ReturnType<typeof installFakeDom>;

  afterEach(() => dom?.restore());

  const open = (options: { popupBlocked?: boolean; timeoutMs?: number } = {}) => {
    dom = installFakeDom({ popupBlocked: options.popupBlocked });
    const popup = AuthorizationPopup.open({
      redirectUri: REDIRECT_URI,
      timeoutMs: options.timeoutMs ?? 180_000,
    });
    if (!popup) return Promise.resolve({ failureReason: 'popup_blocked' as const });
    popup.navigate('https://login.acme.com/authorize');
    return popup.awaitCallback(STATE);
  };

  it('resolves with the callback url the bridge delivered', async () => {
    const pending = open();
    dom.window.post(callbackMessage());

    await expect(pending).resolves.toEqual({
      callbackUrl: `${REDIRECT_URI}?code=CODE&state=${STATE}`,
    });
  });

  it('ignores a message from any origin but the callback', async () => {
    // The widget runs inside the customer's page, so anything on that page can post to it. An
    // authorization code arriving from an unexpected origin is not evidence of anything.
    //
    // The impostor carries a *different* url on purpose: with matching data the assertion would
    // pass whether or not the origin was ever checked.
    const pending = open();
    dom.window.post({
      origin: 'https://evil.example.com',
      data: {
        source: 'egain-tool-auth',
        url: 'https://evil.example.com/callback?code=ATTACKER-CODE',
        state: STATE,
      },
    });
    dom.window.post(callbackMessage());

    await expect(pending).resolves.toEqual({
      callbackUrl: `${REDIRECT_URI}?code=CODE&state=${STATE}`,
    });
  });

  it('refuses a callback whose state does not match this attempt', async () => {
    // A replayed or late message from an earlier attempt must not satisfy this one.
    const pending = open();
    dom.window.post(callbackMessage({ state: 'some-other-state' }));

    await expect(pending).resolves.toEqual({ failureReason: 'state_mismatch' });
  });

  it('ignores unrelated postMessage traffic on the same origin', async () => {
    const pending = open();
    dom.window.post({ origin: CALLBACK_ORIGIN, data: { source: 'something-else' } });
    dom.window.post({ origin: CALLBACK_ORIGIN, data: 'a bare string' });
    dom.window.post(callbackMessage());

    await expect(pending).resolves.toHaveProperty('callbackUrl');
  });

  it('reports a blocked popup rather than waiting for a window that never opened', async () => {
    await expect(open({ popupBlocked: true })).resolves.toEqual({
      failureReason: 'popup_blocked',
    });
  });

  it('treats closing the window as declining', async () => {
    // There is no event for it, and closing the popup is how most people say no.
    const pending = open();
    dom.popup.closed = true;

    await expect(pending).resolves.toEqual({ failureReason: 'declined' });
  });

  it('gives up once the timeout passes', async () => {
    await expect(open({ timeoutMs: 10 })).resolves.toEqual({ failureReason: 'timeout' });
  });

  it('closes the popup once it has an answer', async () => {
    const pending = open();
    dom.window.post(callbackMessage());
    await pending;

    expect(dom.popup.closed).toBe(true);
  });

  it('settles once, even if the callback arrives twice', async () => {
    const pending = open();
    dom.window.post(callbackMessage());
    dom.window.post(callbackMessage({ state: 'different' }));

    await expect(pending).resolves.toHaveProperty('callbackUrl');
  });
});
