export type PlatformConnectorKind = 'agent-assist' | 'legacy' | 'none';

function present(params: Record<string, string>, ...keys: string[]): boolean {
  return keys.some((key) => (params[key] ?? '').trim().length > 0);
}

export function resolvePlatformConnector(
  initParams: Record<string, string>,
): PlatformConnectorKind {
  if (!present(initParams, 'platform')) {
    return 'none';
  }
  if (present(initParams, 'integrationId', 'integrationid')) {
    return 'agent-assist';
  }
  return 'legacy';
}

/** Id passed to connector-client-sdk `init({ integrationId })` for config resolve. */
export function resolveAgentAssistIntegrationId(
  initParams: Record<string, string>,
): string {
  for (const key of [
    'integrationId',
    'integrationid',
  ]) {
    const value = (initParams[key] ?? '').trim();
    if (value.length > 0) {
      return value;
    }
  }
  return '';
}
