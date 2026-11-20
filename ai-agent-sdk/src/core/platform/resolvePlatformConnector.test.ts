import { describe, it, expect } from 'vitest';
import {
  resolveAgentAssistIntegrationId,
  resolvePlatformConnector,
} from './resolvePlatformConnector.js';

describe('resolvePlatformConnector', () => {
  it('returns none when platform is absent', () => {
    expect(resolvePlatformConnector({})).toBe('none');
    expect(resolvePlatformConnector({ appid: 'x' })).toBe('none');
    expect(resolvePlatformConnector({ integrationId: 'i1' })).toBe('none');
  });

  it('returns legacy when only platform is set', () => {
    expect(resolvePlatformConnector({ platform: 'genesys' })).toBe('legacy');
  });

  it('returns legacy when platform and appid are set without new ids', () => {
    expect(resolvePlatformConnector({ platform: 'genesys', appid: 'my-app' })).toBe('legacy');
  });

  it('returns agent-assist when integrationId is set with platform', () => {
    expect(resolvePlatformConnector({ platform: 'genesys', integrationId: 'int-1' })).toBe(
      'agent-assist',
    );
    expect(resolvePlatformConnector({ platform: 'genesys', integrationid: 'int-1' })).toBe(
      'agent-assist',
    );
  });

  it.skip('returns agent-assist when connectorId is set with platform (pending product decision)', () => {
    expect(resolvePlatformConnector({ platform: 'genesys', connectorId: 'conn-1' })).toBe(
      'agent-assist',
    );
    expect(resolvePlatformConnector({ platform: 'genesys', connectorid: 'conn-1' })).toBe(
      'agent-assist',
    );
  });

  it('treats connectorId without integrationId as legacy', () => {
    expect(resolvePlatformConnector({ platform: 'genesys', connectorId: 'conn-1' })).toBe(
      'legacy',
    );
    expect(resolvePlatformConnector({ platform: 'genesys', connectorid: 'conn-1' })).toBe(
      'legacy',
    );
  });

  it('returns agent-assist when appid is also present', () => {
    expect(
      resolvePlatformConnector({
        platform: 'genesys',
        appid: 'legacy-app',
        integrationId: 'int-1',
      }),
    ).toBe('agent-assist');
  });

  it('returns agent-assist when both new ids are present', () => {
    expect(
      resolvePlatformConnector({
        platform: 'genesys',
        integrationId: 'int-1',
        connectorId: 'conn-1',
      }),
    ).toBe('agent-assist');
  });

  it('treats whitespace-only ids as absent', () => {
    expect(
      resolvePlatformConnector({ platform: 'genesys', integrationId: '   ', appid: 'a' }),
    ).toBe('legacy');
    expect(resolvePlatformConnector({ platform: '   ' })).toBe('none');
  });

  it('returns none when new id is set but platform is missing', () => {
    expect(resolvePlatformConnector({ connectorId: 'conn-1' })).toBe('none');
  });
});

describe('resolveAgentAssistIntegrationId', () => {
  it('prefers integrationId over connectorId', () => {
    expect(
      resolveAgentAssistIntegrationId({
        integrationId: 'int-1',
        connectorId: 'conn-1',
      }),
    ).toBe('int-1');
  });

  it.skip('falls back to connectorId (pending product decision)', () => {
    expect(resolveAgentAssistIntegrationId({ connectorId: 'conn-1' })).toBe('conn-1');
    expect(resolveAgentAssistIntegrationId({ connectorid: 'conn-2' })).toBe('conn-2');
  });

  it('returns empty when no id is set', () => {
    expect(resolveAgentAssistIntegrationId({})).toBe('');
  });
});
