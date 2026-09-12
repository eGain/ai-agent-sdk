import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AiAgent } from './AiAgent.js';
import { ApiHelper } from './api/ApiHelper.js';
import { Connection } from './connection/Connection.js';
import { ConnectionState } from './connection/ConnectionState.js';

const authServiceMock = vi.hoisted(() => ({
  getToken: vi.fn().mockResolvedValue('mock-token'),
  getCachedToken: vi.fn().mockReturnValue('mock-token'),
  initialize: vi.fn().mockResolvedValue(undefined),
  getIsInitialized: vi.fn().mockReturnValue(false),
  isAnonymousStrategy: vi.fn().mockReturnValue(true),
  getAuthenticationType: vi.fn().mockReturnValue('anonymous'),
  authenticate: vi.fn().mockResolvedValue(undefined),
  getStrategy: vi.fn().mockReturnValue({ isAuthenticated: () => false }),
  setTokenExpiringCallback: vi.fn(),
  switchStrategyTo: vi.fn().mockResolvedValue(true),
  cleanup: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('./connection/Connection.js');
vi.mock('./auth/AuthenticationService.js', () => ({
  AuthenticationService: vi.fn(function AuthenticationService() {
    return authServiceMock;
  }),
}));

global.fetch = vi.fn();

function waitForEvent(agent: AiAgent, event: string): Promise<any> {
  return new Promise((resolve) => agent.once(event as any, resolve));
}

function getUrlLangParam(url: string): string | null {
  return new URL(url).searchParams.get('$lang');
}

function findFetchCall(matcher: (url: string) => boolean): [string, RequestInit] | undefined {
  const call = (global.fetch as any).mock.calls.find(([url]: [string]) =>
    matcher(url)
  );
  return call as [string, RequestInit] | undefined;
}

function createFetchHandler(languageCode: string, agentId: string) {
  return async (url: string) => {
    if (url.includes('/aiagent/details/agent/')) {
      return {
        ok: true,
        json: async () => ({
          name: 'Test Agent',
          agentType: 'contact-center',
          isAuthenticated: false,
          languageCode,
          portals: [{ id: 1 }],
          agentId,
        }),
      };
    }
    if (url.includes('/myportals')) {
      return {
        ok: true,
        json: async () => ({
          portal: [
            {
              id: 1,
              name: 'Portal A',
              department: { id: 100, name: 'Dept' },
            },
          ],
        }),
      };
    }
    if (url.includes('/internal/portals/')) {
      return {
        ok: true,
        json: async () => ({
          portal: [{ id: 1, name: 'Portal A', departmentId: 100 }],
        }),
      };
    }
    if (url.includes('/userprofiles') && !url.includes('/select')) {
      return {
        ok: true,
        json: async () => ({
          profile: [{ id: 10, name: 'Profile P', isLastUsedInPortal: true }],
        }),
      };
    }
    if (url.includes('/userprofiles/') && url.includes('/select')) {
      return { ok: true };
    }
    return {
      ok: false,
      status: 404,
      statusText: 'Not Found',
    };
  };
}

async function initializeAgentWithLanguage(languageCode: string): Promise<AiAgent> {
  (global.fetch as any).mockImplementation(
    createFetchHandler(languageCode, mockAgentId)
  );

  vi.spyOn(ApiHelper, 'getDeploymentInfo').mockResolvedValue({
    aiAgentDomain: 'test.example.com',
    apiDomain: 'api.test.example.com',
  });

  const agent = new AiAgent({
    id: mockAgentId,
    endpoint: mockEndpoint,
    initParams: {},
    autoConnect: false,
  });

  const initDone = waitForEvent(agent, 'initialized');
  await agent.initialize();
  await initDone;
  return agent;
}

const mockEndpoint = 'https://test.example.com';
const mockAgentId = 'test-agent-id';

describe('AiAgent language → API integration', () => {
  let mockConnection: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockConnection = {
      connect: vi.fn().mockResolvedValue(undefined),
      disconnect: vi.fn(),
      send: vi.fn().mockResolvedValue(undefined),
      isConnected: vi.fn().mockReturnValue(false),
      getState: vi.fn().mockReturnValue(ConnectionState.IDLE),
      on: vi.fn(),
      off: vi.fn(),
    };

    vi.mocked(Connection).mockImplementation(() => mockConnection);

    authServiceMock.getToken.mockResolvedValue('mock-token');
    authServiceMock.getCachedToken.mockReturnValue('mock-token');
    authServiceMock.initialize.mockResolvedValue(undefined);
    authServiceMock.getIsInitialized.mockReturnValue(false);
    authServiceMock.isAnonymousStrategy.mockReturnValue(true);
    authServiceMock.getAuthenticationType.mockReturnValue('anonymous');
    authServiceMock.authenticate.mockResolvedValue(undefined);
    authServiceMock.getStrategy.mockReturnValue({ isAuthenticated: () => false });
    authServiceMock.setTokenExpiringCallback.mockReset();
    authServiceMock.switchStrategyTo.mockResolvedValue(true);
    authServiceMock.cleanup.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    { languageCode: 'en-US', expectedLang: 'en-us', expectedHeader: 'en-us' },
    { languageCode: 'en-GB', expectedLang: 'en-gb', expectedHeader: 'en-us' },
    { languageCode: 'nl-NL', expectedLang: 'nl-nl', expectedHeader: 'nl-nl' },
  ])(
    'passes agent languageCode $languageCode to portal list API during initialize',
    async ({ languageCode, expectedLang, expectedHeader }) => {
      await initializeAgentWithLanguage(languageCode);

      const agentDetailsCallIndex = (global.fetch as any).mock.calls.findIndex(
        ([url]: [string]) => url.includes('/aiagent/details/agent/')
      );
      const portalListCall = findFetchCall(
        (url) => url.includes('/myportals') && getUrlLangParam(url) != null
      );

      expect(agentDetailsCallIndex).toBeGreaterThanOrEqual(0);
      expect(portalListCall).toBeDefined();

      const portalListCallIndex = (global.fetch as any).mock.calls.findIndex(
        ([url]: [string]) => portalListCall![0] === url
      );
      expect(portalListCallIndex).toBeGreaterThan(agentDetailsCallIndex);

      const [portalUrl, portalOpts] = portalListCall!;
      expect(getUrlLangParam(portalUrl)).toBe(expectedLang);
      expect(portalOpts.headers['Accept-Language']).toBe(expectedHeader);
    }
  );

  it.each([
    { languageCode: 'en-US', expectedLang: 'en-us', expectedHeader: 'en-us' },
    { languageCode: 'en-GB', expectedLang: 'en-gb', expectedHeader: 'en-us' },
    { languageCode: 'nl-NL', expectedLang: 'nl-nl', expectedHeader: 'nl-nl' },
  ])(
    'syncs agent languageCode $languageCode onto portal details API after agent details are fetched',
    async ({ languageCode, expectedLang, expectedHeader }) => {
      await initializeAgentWithLanguage(languageCode);

      const portalDetailsCall = findFetchCall(
        (url) => url.includes('/internal/portals/') && getUrlLangParam(url) != null
      );

      expect(portalDetailsCall).toBeDefined();
      expect(getUrlLangParam(portalDetailsCall![0])).toBe(expectedLang);
      expect(portalDetailsCall![1].headers['Accept-Language']).toBe(expectedHeader);
    }
  );
});
