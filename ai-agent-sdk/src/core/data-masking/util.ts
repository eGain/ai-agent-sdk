import semver from 'semver';
import type { ApiHelper } from '../api/ApiHelper.js';
import type { Logger } from '../logging/Logger.js';
import { DataMasker } from './DataMasker.js';
import type { AgentDetailsForMasking } from './types.js';

export const MIN_MASKING_PLATFORM_VERSION = '21.22.2';

/** cc-widget / eGainAiAgent parity */
export function isPlatformMaskingSupported(
  currentVersion?: string,
  requiredVersion: string = MIN_MASKING_PLATFORM_VERSION
): boolean {
  if (!currentVersion) {
    return false;
  }
  try {
    const minRequiredVersion = semver.coerce(requiredVersion)?.version || requiredVersion;
    const normalizedCurrentVersion = semver.coerce(currentVersion)?.version || currentVersion;
    return semver.gte(normalizedCurrentVersion, minRequiredVersion);
  } catch {
    return false;
  }
}

export interface LoadDataMaskingOptions {
  deploymentVersion?: string;
  agentDetails?: AgentDetailsForMasking;
  apiHelper: ApiHelper;
  authToken: string | null | undefined;
  masker: DataMasker;
  logger: Logger;
}

/** Loads chat masking patterns when enabled. Fail-open on errors. */
export async function loadDataMasking(options: LoadDataMaskingOptions): Promise<void> {
  const { deploymentVersion, agentDetails, apiHelper, authToken, masker, logger } = options;

  const platformOk = isPlatformMaskingSupported(deploymentVersion);
  masker.setPlatformSupported(platformOk);

  if (!platformOk) {
    logger.debug('Data masking disabled for deployment version', { version: deploymentVersion });
    return;
  }

  if (!agentDetails?.enableDataMasking) {
    masker.clearPatterns();
    return;
  }

  const departmentId = agentDetails.departmentId;
  if (departmentId == null || departmentId === '') {
    logger.debug('Data masking skipped: missing departmentId');
    masker.clearPatterns();
    return;
  }

  if (!authToken) {
    logger.debug('Data masking skipped: no auth token');
    masker.clearPatterns();
    return;
  }

  try {
    const response = await apiHelper.getMaskingPatterns({
      departmentId: String(departmentId),
      channel: 'chat',
      authToken,
    });
    masker.setPatternsFromApiResponse(response);
    logger.debug('Data masking patterns loaded', { active: masker.isActive() });
  } catch (error) {
    masker.clearPatterns();
    logger.warn('Failed to load data masking patterns; continuing without masking', {
      error: error instanceof Error ? error : new Error(String(error)),
    });
  }
}
