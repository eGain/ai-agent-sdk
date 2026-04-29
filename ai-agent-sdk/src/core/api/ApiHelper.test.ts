import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiHelper } from './ApiHelper.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('ApiHelper', () => {
  let apiHelper: ApiHelper;
  const mockApiDomain = 'api.example.com';

  beforeEach(() => {
    vi.clearAllMocks();
    apiHelper = new ApiHelper({
      apiDomain: mockApiDomain,
      language: 'en-us',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should add https:// prefix if apiDomain does not start with http', () => {
      const helper = new ApiHelper({
        apiDomain: 'api.example.com',
      });
      expect(helper).toBeInstanceOf(ApiHelper);
    });

    it('should keep apiDomain as is if it starts with http', () => {
      const helper = new ApiHelper({
        apiDomain: 'https://api.example.com',
      });
      expect(helper).toBeInstanceOf(ApiHelper);
    });

    it('should use default language if not provided', () => {
      const helper = new ApiHelper({
        apiDomain: 'api.example.com',
      });
      expect(helper).toBeInstanceOf(ApiHelper);
    });
  });

  describe('getAiAgentDetails', () => {
    it('should fetch AI Agent details for v2 architecture', async () => {
      const mockResponse = {
        agentId: 'test-agent-id',
        name: 'Test Agent',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiHelper.getAiAgentDetails({
        architecture: 'v2',
        agentId: 'test-agent-id',
        authToken: 'test-token',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/core/aiservices/v4/aiagent/details/agent/test-agent-id',
        {
          method: 'GET',
          headers: { Authorization: 'Bearer test-token' },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error if fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(
        apiHelper.getAiAgentDetails({
          architecture: 'v2',
          agentId: 'test-agent-id',
          authToken: 'test-token',
        })
      ).rejects.toThrow('Failed to fetch AI Agent details: 404 Not Found');
    });
  });

  describe('getAiAgentSession', () => {
    it('should fetch AI Agent session for v2 architecture', async () => {
      const mockResponse = {
        sessionId: 'test-session-id',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiHelper.getAiAgentSession({
        architecture: 'v2',
        agentId: 'test-agent-id',
        authToken: 'test-token',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/core/aiservices/v4/aiagent/chat/agent/test-agent-id/session',
        {
          method: 'GET',
          headers: { Authorization: 'Bearer test-token' },
        }
      );
      expect(result).toBe('test-session-id');
    });

    it('should throw error if fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(
        apiHelper.getAiAgentSession({
          architecture: 'v2',
          agentId: 'test-agent-id',
          authToken: 'test-token',
        })
      ).rejects.toThrow('Failed to fetch AI Agent session: 500 Internal Server Error');
    });
  });

  describe('getPortalDetails', () => {
    it('should fetch portal details', async () => {
      const mockResponse = {
        portal: [
          {
            id: 'test-portal-id',
            name: 'Test Portal',
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiHelper.getPortalDetails({
        portalId: 'test-portal-id',
        authToken: 'test-token',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/knowledge/portalmgr/v3/internal/portals/test-portal-id?$lang=en-us',
        {
          headers: {
            Authorization: 'test-token',
            Accept: 'application/json',
            'Accept-Language': 'en-us',
          },
        }
      );
      expect(result).toEqual(mockResponse.portal[0]);
    });

    it('should use provided language if specified', async () => {
      const mockResponse = {
        portal: [
          {
            id: 'test-portal-id',
            name: 'Test Portal',
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await apiHelper.getPortalDetails({
        portalId: 'test-portal-id',
        authToken: 'test-token',
        language: 'fr-fr',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('$lang=fr-fr'),
        expect.any(Object)
      );
    });
  });

  describe('getConnectedApps', () => {
    it('should fetch connected apps', async () => {
      const mockResponse = [
        {
          id: 'app-1',
          name: 'Test App',
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiHelper.getConnectedApps({
        tenantId: 'test-tenant-id',
        agentId: 'test-agent-id',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/ai-agent-cc-connector/v1/tenants/test-tenant-id/agents/test-agent-id/apps',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should use provided apiDomain if specified', async () => {
      const mockResponse = [];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await apiHelper.getConnectedApps({
        apiDomain: 'https://custom-api.example.com',
        tenantId: 'test-tenant-id',
        agentId: 'test-agent-id',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://custom-api.example.com/ai-agent-cc-connector/v1/tenants/test-tenant-id/agents/test-agent-id/apps',
        { method: 'GET' }
      );
    });
  });

  describe('getPreviousTranscript', () => {
    it('should fetch previous transcript', async () => {
      const mockResponse = {
        messages: [
          { id: 'msg-1', body: 'Hello' },
          { id: 'msg-2', body: 'World' },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiHelper.getPreviousTranscript({
        agentId: 'test-agent-id',
        sessionId: 'test-session-id',
        authToken: 'test-token',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/core/aiservices/v4/aiagent/details/department/1000/agent/test-agent-id/conversations/sessions/test-session-id',
        {
          method: 'GET',
          headers: { Authorization: 'Bearer test-token' },
        }
      );
      expect(result).toEqual(mockResponse.messages);
    });

    it('should return empty array if messages are not present', async () => {
      const mockResponse = {};

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiHelper.getPreviousTranscript({
        agentId: 'test-agent-id',
        sessionId: 'test-session-id',
        authToken: 'test-token',
      });

      expect(result).toEqual([]);
    });
  });

  describe('getMaskingPatterns', () => {
    it('should fetch masking patterns', async () => {
      const mockResponse = {
        patterns: [
          { pattern: '\\d{4}-\\d{4}-\\d{4}-\\d{4}', type: 'credit-card' },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiHelper.getMaskingPatterns({
        departmentId: '999',
        channel: 'chat',
        authToken: 'test-token',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/core/securitymgr/v4/departments/999/maskingpatterns/chat',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Accept-Language': 'en-us',
            Authorization: 'Bearer test-token',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should use default channel if not provided', async () => {
      const mockResponse = { patterns: [] };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await apiHelper.getMaskingPatterns({
        departmentId: '999',
        authToken: 'test-token',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/maskingpatterns/chat'),
        expect.any(Object)
      );
    });

    it('should throw error if fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      });

      await expect(
        apiHelper.getMaskingPatterns({
          departmentId: '999',
          authToken: 'test-token',
        })
      ).rejects.toThrow('Failed to fetch masking patterns: 403 Forbidden');
    });
  });

  // ── New cc-widget API methods (R2) ─────────────────────────────────────────

  describe('getMyPortals', () => {
    it('should fetch portals list from v3/myportals only', async () => {
      const mockResponse = {
        portal: [
          { id: 1, name: 'Portal A' },
          { id: 2, name: 'Portal B' },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiHelper.getMyPortals({
        authToken: 'test-token',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/knowledge\/portalmgr\/v3\/myportals(\?|$)/),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
            Accept: 'application/json',
            'Accept-Language': 'en-us',
          }),
        })
      );
      expect(result).toEqual(mockResponse.portal);
    });

    it('should resolve auth token from getToken when authToken is omitted', async () => {
      const mockResponse = { portal: [{ id: 1, name: 'Portal A' }] };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const helper = new ApiHelper({
        apiDomain: mockApiDomain,
        language: 'en-us',
        getToken: async () => 'from-provider',
      });

      const result = await helper.getMyPortals({});
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/knowledge\/portalmgr\/v3\/myportals(\?|$)/),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer from-provider',
          }),
        })
      );
      expect(result).toEqual(mockResponse.portal);
    });

    it('should throw when auth token is missing and no getToken is configured', async () => {
      await expect(apiHelper.getMyPortals({})).rejects.toThrow(/Authentication token is required/);
    });

    it('should return empty array when myportals returns no portals', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await apiHelper.getMyPortals({
        authToken: 'test-token',
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect((global.fetch as any).mock.calls[0][0]).toContain('/v3/myportals');
      expect(result).toEqual([]);
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(
        apiHelper.getMyPortals({ authToken: 'bad-token' })
      ).rejects.toThrow('Failed to fetch portals: 401 Unauthorized');
    });

    it('should cache successful responses', async () => {
      const mockResponse = { portal: [{ id: 1, name: 'Portal A' }] };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const helperWithCache = new ApiHelper({
        apiDomain: mockApiDomain,
        cache: { enabled: true, storageType: 'memory' },
      });

      const result1 = await helperWithCache.getMyPortals({ authToken: 'test-token' });
      const result2 = await helperWithCache.getMyPortals({ authToken: 'test-token' });

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);
    });
  });

  describe('getAgentsByPortal', () => {
    it('should fetch agents for a portal with default agentType', async () => {
      const mockResponse = [
        { agentId: 'agent-1', name: 'Agent One' },
        { agentId: 'agent-2', name: 'Agent Two' },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiHelper.getAgentsByPortal({
        departmentId: '100',
        portalId: '200',
        authToken: 'test-token',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/core/aiservices/v4/aiagent/details/department/100/portal/200?agentType=contact-center',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should use custom agentType when provided', async () => {
      const mockResponse = [{ agentId: 'agent-1', name: 'Agent One' }];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await apiHelper.getAgentsByPortal({
        departmentId: '100',
        portalId: '200',
        authToken: 'test-token',
        agentType: 'custom-type',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('agentType=custom-type'),
        expect.any(Object)
      );
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(
        apiHelper.getAgentsByPortal({
          departmentId: '100',
          portalId: '200',
          authToken: 'test-token',
        })
      ).rejects.toThrow('Failed to fetch agents by portal: 404 Not Found');
    });

    it('should cache successful responses', async () => {
      const mockResponse = [{ agentId: 'agent-1', name: 'Agent One' }];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const helperWithCache = new ApiHelper({
        apiDomain: mockApiDomain,
        cache: { enabled: true, storageType: 'memory' },
      });

      await helperWithCache.getAgentsByPortal({
        departmentId: '100',
        portalId: '200',
        authToken: 'test-token',
      });
      await helperWithCache.getAgentsByPortal({
        departmentId: '100',
        portalId: '200',
        authToken: 'test-token',
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserProfiles', () => {
    it('should fetch user profiles for a portal', async () => {
      const mockResponse = {
        profile: [
          { id: 1, name: 'Profile A', isLastUsedInPortal: true },
          { id: 2, name: 'Profile B', isLastUsedInPortal: false },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiHelper.getUserProfiles({
        portalId: '200',
        authToken: 'test-token',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/knowledge/portalmgr/v3/portals/200/userprofiles',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
            Accept: 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse.profile);
    });

    it('should return empty array when no profiles exist', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await apiHelper.getUserProfiles({
        portalId: '200',
        authToken: 'test-token',
      });

      expect(result).toEqual([]);
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(
        apiHelper.getUserProfiles({
          portalId: '200',
          authToken: 'test-token',
        })
      ).rejects.toThrow('Failed to fetch user profiles: 500 Internal Server Error');
    });

    it('should cache successful responses', async () => {
      const mockResponse = { profile: [{ id: 1, name: 'Profile A' }] };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const helperWithCache = new ApiHelper({
        apiDomain: mockApiDomain,
        cache: { enabled: true, storageType: 'memory' },
      });

      await helperWithCache.getUserProfiles({ portalId: '200', authToken: 'test-token' });
      await helperWithCache.getUserProfiles({ portalId: '200', authToken: 'test-token' });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('selectUserProfile', () => {
    it('should select a user profile via PUT', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
      });

      await apiHelper.selectUserProfile({
        portalId: '200',
        profileId: '10',
        authToken: 'test-token',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/knowledge/portalmgr/v3/portals/200/userprofiles/10/select',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
            Accept: 'application/json',
          }),
        })
      );
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      await expect(
        apiHelper.selectUserProfile({
          portalId: '200',
          profileId: '10',
          authToken: 'test-token',
        })
      ).rejects.toThrow('Failed to select user profile: 400 Bad Request');
    });

    it('should not cache selectUserProfile (mutation)', async () => {
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ call: 1 }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ call: 2 }) });

      const helperWithCache = new ApiHelper({
        apiDomain: mockApiDomain,
        cache: { enabled: true, storageType: 'memory' },
      });

      await helperWithCache.selectUserProfile({ portalId: '200', profileId: '10', authToken: 'test-token' });
      await helperWithCache.selectUserProfile({ portalId: '200', profileId: '10', authToken: 'test-token' });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('getUserDetails', () => {
    it('should fetch user details from the correct endpoint and unwrap user[0]', async () => {
      const userRecord = { id: 'user-1', name: 'John Doe', email: 'john@example.com' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: [userRecord] }),
      });

      const result = await apiHelper.getUserDetails({ authToken: 'test-token' });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/knowledge/portalmgr/v3/portals/user',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer test-token',
            Accept: 'application/json',
            "Accept-Language": 'en-us',
          },
          credentials: 'include',
        }
      );
      expect(result).toEqual(userRecord);
    });

    it('should return null when the response has no user array', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await apiHelper.getUserDetails({ authToken: 'test-token' });

      expect(result).toBeNull();
    });

    it('should return null when the API returns a non-ok response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      const result = await apiHelper.getUserDetails({ authToken: 'bad-token' });

      expect(result).toBeNull();
    });

    it('should return null when fetch throws a network error', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await apiHelper.getUserDetails({ authToken: 'test-token' });

      expect(result).toBeNull();
    });
  });

  describe('getCustomerDetails', () => {
    it('should fetch customer details from the correct endpoint and unwrap customer[0]', async () => {
      const customerRecord = { id: 'cust-1', name: 'Jane Doe', email: 'jane@example.com' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ customer: [customerRecord] }),
      });

      const result = await apiHelper.getCustomerDetails({ authToken: 'test-token' });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/core/customermgr/v3/internal/customer?$attribute=all',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer test-token',
            Accept: 'application/json',
            "Accept-Language": 'en-us',
          },
          credentials: 'include',
        }
      );
      expect(result).toEqual(customerRecord);
    });

    it('should return null when the response has no customer array', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await apiHelper.getCustomerDetails({ authToken: 'test-token' });

      expect(result).toBeNull();
    });

    it('should return null when the API returns a non-ok response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const result = await apiHelper.getCustomerDetails({ authToken: 'bad-token' });

      expect(result).toBeNull();
    });

    it('should return null when fetch throws a network error', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await apiHelper.getCustomerDetails({ authToken: 'test-token' });

      expect(result).toBeNull();
    });
  });
});

