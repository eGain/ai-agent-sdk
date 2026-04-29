import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryCacheAdapter } from '../api/CacheAdapter.js';
import { PortalInitializer } from './PortalInitializer.js';
import type { Portal, UserProfile, AgentListItem } from '../types/PortalTypes.js';

describe('PortalInitializer', () => {
  let mockApiHelper: any;
  let mockLogger: any;
  let mockAuthService: any;
  let mockEmit: ReturnType<typeof vi.fn>;
  let mockCreateAgentEventResponse: ReturnType<typeof vi.fn>;
  let defaultDeps: any;

  const portalA: Portal = { id: 1, name: 'Portal A', description: 'Desc A', department: { id: 100, name: 'Dept A' } };
  const portalB: Portal = { id: 2, name: 'Portal B', description: 'Desc B', department: { id: 200, name: 'Dept B' } };
  const portalC: Portal = { id: 3, name: 'Portal C', description: 'Desc C', department: { id: 300, name: 'Dept C' } };
  /** Same department as portalA — Flow B tests that need multiple portals after department filter. */
  const portalBSameDept: Portal = { ...portalB, department: { id: 100, name: 'Dept B' } };
  const flowBDepsBase = { isAgentSelectionMode: true as const, agentDetails: { departmentId: 100 as const } };
  const agentX: AgentListItem = { agentId: 'agent-x', name: 'Agent X', description: 'Agent X desc' };
  const agentY: AgentListItem = { agentId: 'agent-y', name: 'Agent Y' };
  const profileP: UserProfile = { id: 10, name: 'Profile P', isLastUsedInPortal: false };
  const profileQ: UserProfile = { id: 20, name: 'Profile Q', isLastUsedInPortal: false };

  const portalDetailsA = { id: 1, name: 'Portal A', departmentId: 100 };

  beforeEach(() => {
    mockApiHelper = {
      getMyPortals: vi.fn().mockResolvedValue([portalA, portalB]),
      getPortalDetails: vi.fn().mockResolvedValue(portalDetailsA),
      getAgentsByPortal: vi.fn().mockResolvedValue([agentX, agentY]),
      getUserProfiles: vi.fn().mockResolvedValue([profileP, profileQ]),
      selectUserProfile: vi.fn().mockResolvedValue({ success: true }),
    };

    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      createChild: vi.fn().mockReturnThis(),
    };

    mockAuthService = {
      getToken: vi.fn().mockResolvedValue('mock-token'),
    };

    mockEmit = vi.fn();
    mockCreateAgentEventResponse = vi.fn((type, payload) => ({
      type,
      timestamp: Date.now(),
      payload,
    }));

    defaultDeps = {
      agentId: 'test-agent',
      apiHelper: mockApiHelper,
      logger: mockLogger,
      authService: mockAuthService,
      initParams: {},
      emit: mockEmit,
      createAgentEventResponse: mockCreateAgentEventResponse,
      isAgentSelectionMode: false,
      agentDetails: undefined,
    };
  });

  function getEmittedEvent(type: string) {
    const call = mockEmit.mock.calls.find(([t]) => t === type);
    return call ? call[1] : undefined;
  }

  // ── Flow A: portal → profile → initialized ────────────────────────────

  describe('Flow A (specific agent)', () => {
    it('should pass agentDetails.languageCode to getMyPortals', async () => {
      const deps = { ...defaultDeps, agentDetails: { languageCode: 'da-dk' } };
      const initializer = new PortalInitializer(deps);
      await initializer.start();
      expect(mockApiHelper.getMyPortals).toHaveBeenCalledWith(
        expect.objectContaining({ language: 'da-dk' })
      );
    });

    it('should use portalIds from initParams without calling getMyPortals', async () => {
      const deps = { ...defaultDeps, initParams: { portalIds: '7,8' } };
      const initializer = new PortalInitializer(deps);
      await initializer.start();
      expect(mockApiHelper.getMyPortals).not.toHaveBeenCalled();
      await vi.waitFor(() => {
        const ev = getEmittedEvent('portalsAvailable');
        expect(ev.payload.portals).toEqual([{ id: '7' }, { id: '8' }]);
      });
    });

    it('should run to completion: portal event → profile event → initialized', async () => {
      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith(
          'portalsAvailable',
          expect.objectContaining({
            type: 'portalsAvailable',
            payload: { portals: [portalA, portalB] },
          })
        );
      });

      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith(
          'profilesAvailable',
          expect.objectContaining({
            type: 'profilesAvailable',
            payload: { profiles: [profileP, profileQ], selectedPortal: portalA },
          })
        );
      });

      initializer.onProfileSelected(profileP);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({
        portal: portalA,
        profile: profileP,
      }));
    });

    it('should NOT emit agentsAvailable in Flow A', async () => {
      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });

      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything());
      });

      initializer.onProfileSelected(profileP);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const agentCalls = mockEmit.mock.calls.filter(([type]) => type === 'agentsAvailable');
      expect(agentCalls).toHaveLength(0);
    });

    it('should filter portals to agent-associated only when agentDetails.portals is set', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA, portalB, portalC]);
      const deps = { ...defaultDeps, initParams: { agentid: 'agent-1' }, agentDetails: { portals: [1] } };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything());
      });
      expect(mockEmit).not.toHaveBeenCalledWith('portalsAvailable', expect.anything());
      initializer.onProfileSelected(profileP);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({
        portal: portalA,
        profile: profileP,
      }));
    });

    it('should filter portals using deps.agentId when initParams.agentid is not set', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA, portalB, portalC]);
      const deps = { ...defaultDeps, agentId: 'my-agent', agentDetails: { portals: [1] } };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything());
      });
      expect(mockEmit).not.toHaveBeenCalledWith('portalsAvailable', expect.anything());
      initializer.onProfileSelected(profileP);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({
        portal: portalA,
        profile: profileP,
      }));
    });
  });

  // ── Flow B: portal → agent → profile → initialized ────────────────────

  describe('Flow B (agent selection mode)', () => {
    it('should run full pipeline: portal → agent → profile → initialized', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA, portalBSameDept]);
      const deps = { ...defaultDeps, ...flowBDepsBase };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('agentsAvailable', expect.anything());
      });
      initializer.onAgentSelected(agentX);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything());
      });
      initializer.onProfileSelected(profileP);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({
        portal: portalA,
        agent: agentX,
        profile: profileP,
      }));
    });

    it('should throw when departmentId is missing in Flow B', async () => {
      const deps = { ...defaultDeps, isAgentSelectionMode: true, initParams: {}, agentDetails: undefined };
      const initializer = new PortalInitializer(deps);
      await expect(initializer.start()).rejects.toThrow(/departmentId is required for Flow B/i);
    });

    it('should accept initParams.departmentId when agentDetails.departmentId is absent (fallback)', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA, portalBSameDept]);
      const deps = {
        ...defaultDeps,
        isAgentSelectionMode: true,
        agentDetails: undefined,
        initParams: { departmentId: '100' },
      };
      const initializer = new PortalInitializer(deps);
      await initializer.start();
      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
    });
  });

  // ── Auto-select ──────────────────────────────────────────────────────────

  describe('auto-select', () => {
    it('should auto-select portal when only one is available', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA]);
      mockApiHelper.getUserProfiles.mockResolvedValue([profileP]);

      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const portalCalls = mockEmit.mock.calls.filter(([type]) => type === 'portalsAvailable');
      expect(portalCalls).toHaveLength(0);

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({
        portal: portalA,
        profile: profileP,
      }));
    });

    it('should auto-select agent when only one is available (Flow B)', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA]);
      mockApiHelper.getAgentsByPortal.mockResolvedValue([agentX]);
      mockApiHelper.getUserProfiles.mockResolvedValue([profileP]);

      const deps = { ...defaultDeps, ...flowBDepsBase };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const agentCalls = mockEmit.mock.calls.filter(([type]) => type === 'agentsAvailable');
      expect(agentCalls).toHaveLength(0);

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({
        portal: portalA,
        agent: agentX,
        profile: profileP,
      }));
    });

    it('should auto-select profile when only one is available', async () => {
      mockApiHelper.getUserProfiles.mockResolvedValue([profileP]);

      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const profileCalls = mockEmit.mock.calls.filter(([type]) => type === 'profilesAvailable');
      expect(profileCalls).toHaveLength(0);

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({ profile: profileP }));
    });

    it('should auto-select last-used profile when multiple profiles exist', async () => {
      const lastUsedProfile: UserProfile = { id: 10, name: 'Profile P', isLastUsedInPortal: true };
      const otherProfile: UserProfile = { id: 20, name: 'Profile Q', isLastUsedInPortal: false };
      mockApiHelper.getUserProfiles.mockResolvedValue([lastUsedProfile, otherProfile]);

      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const profileCalls = mockEmit.mock.calls.filter(([type]) => type === 'profilesAvailable');
      expect(profileCalls).toHaveLength(0);

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({ profile: lastUsedProfile }));
    });

    it('should auto-select default profile when no last-used profile exists', async () => {
      const profile1: UserProfile = { id: 10, name: 'Profile 1', isLastUsedInPortal: false };
      const profile2: UserProfile = { id: 20, name: 'Profile 2', isLastUsedInPortal: false };
      mockApiHelper.getUserProfiles.mockResolvedValue([profile1, profile2]);
      mockApiHelper.getPortalDetails.mockResolvedValue({
        id: 1, name: 'Portal A', departmentId: 100,
        portalSettings: { defaultUserProfile: { id: 20 } },
      });

      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const profileCalls = mockEmit.mock.calls.filter(([type]) => type === 'profilesAvailable');
      expect(profileCalls).toHaveLength(0);

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({ profile: profile2 }));
    });

    it('should prefer last-used profile over default profile', async () => {
      const lastUsedProfile: UserProfile = { id: 10, name: 'Profile 1', isLastUsedInPortal: true };
      const defaultProfileObj: UserProfile = { id: 20, name: 'Profile 2', isLastUsedInPortal: false };
      mockApiHelper.getUserProfiles.mockResolvedValue([lastUsedProfile, defaultProfileObj]);
      mockApiHelper.getPortalDetails.mockResolvedValue({
        id: 1, name: 'Portal A', departmentId: 100,
        portalSettings: { defaultUserProfile: { id: 20 } },
      });

      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({ profile: lastUsedProfile }));
    });

    it('should emit profilesAvailable when no last-used and no default profile', async () => {
      const profile1: UserProfile = { id: 10, name: 'Profile 1', isLastUsedInPortal: false };
      const profile2: UserProfile = { id: 20, name: 'Profile 2', isLastUsedInPortal: false };
      mockApiHelper.getUserProfiles.mockResolvedValue([profile1, profile2]);

      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything());
      });
      initializer.onProfileSelected(profile1);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({ profile: profile1 }));
    });

    it('should emit profilesAvailable when default profile ID does not match any profile', async () => {
      const profile1: UserProfile = { id: 10, name: 'Profile 1', isLastUsedInPortal: false };
      const profile2: UserProfile = { id: 20, name: 'Profile 2', isLastUsedInPortal: false };
      mockApiHelper.getUserProfiles.mockResolvedValue([profile1, profile2]);
      mockApiHelper.getPortalDetails.mockResolvedValue({
        id: 1, name: 'Portal A', departmentId: 100,
        portalSettings: { defaultUserProfile: { id: 999 } },
      });

      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything());
      });
      initializer.onProfileSelected(profile2);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({ profile: profile2 }));
    });
  });

  // ── Error: zero items ──────────────────────────────────────────────────

  describe('error on zero items', () => {
    it('should throw when zero portals are returned', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([]);

      const initializer = new PortalInitializer(defaultDeps);

      await expect(initializer.start()).rejects.toThrow(/no portals/i);
      expect(mockEmit).not.toHaveBeenCalledWith('initialized', expect.anything());
    });

    it('should fetch user portals when agent has empty portals list (cc-widget parity)', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA, portalB]);

      const initializer = new PortalInitializer({
        ...defaultDeps,
        agentDetails: { portals: [] },
      });

      await initializer.start();

      expect(mockApiHelper.getMyPortals).toHaveBeenCalled();
      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
    });

    it('should throw when zero agents are returned (Flow B)', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA]);
      mockApiHelper.getAgentsByPortal.mockResolvedValue([]);

      const deps = { ...defaultDeps, ...flowBDepsBase };
      const initializer = new PortalInitializer(deps);

      await expect(initializer.start()).rejects.toThrow(/no.*agents/i);
      expect(mockEmit).not.toHaveBeenCalledWith('initialized', expect.anything());
    });

    it('should throw when portal details lack departmentId (Flow B)', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA]);
      mockApiHelper.getPortalDetails.mockResolvedValue({ id: 1, name: 'Portal A' });

      const deps = { ...defaultDeps, ...flowBDepsBase };
      const initializer = new PortalInitializer(deps);

      await expect(initializer.start()).rejects.toThrow(/department.*required for agent selection/i);
      expect(mockEmit).not.toHaveBeenCalledWith('initialized', expect.anything());
      expect(mockApiHelper.getAgentsByPortal).not.toHaveBeenCalled();
    });

    it('should complete initialization when API returns zero profiles (no selectUserProfile)', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA]);
      mockApiHelper.getUserProfiles.mockResolvedValue([]);
      mockApiHelper.getPortalDetails.mockResolvedValue({
        id: 1,
        name: 'Portal A',
        departmentId: 100,
        portalSettings: { defaultUserProfile: { id: 42 } },
      });

      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Profile auto-resolved',
        expect.objectContaining({ portalId: portalA.id })
      );
      expect(mockApiHelper.selectUserProfile).not.toHaveBeenCalled();
      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(
        expect.objectContaining({
          portal: portalA,
          availableProfiles: [],
        })
      );
      expect(event.payload.profile).toBeUndefined();
    });
  });

  // ── Event-driven chaining ─────────────────────────────────────────────

  describe('event-driven chaining', () => {
    it('should not emit initialized until onPortalSelected is called', async () => {
      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });

      expect(mockEmit).not.toHaveBeenCalledWith('initialized', expect.anything());

      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything());
      });

      initializer.onProfileSelected(profileP);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });
    });

    it('should not emit initialized until onAgentSelected is called (Flow B)', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA, portalBSameDept]);
      const deps = { ...defaultDeps, ...flowBDepsBase };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('agentsAvailable', expect.anything());
      });

      expect(mockEmit).not.toHaveBeenCalledWith('initialized', expect.anything());

      initializer.onAgentSelected(agentX);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything());
      });
      initializer.onProfileSelected(profileP);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });
    });

    it('should not emit initialized until onProfileSelected is called', async () => {
      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything());
      });

      expect(mockEmit).not.toHaveBeenCalledWith('initialized', expect.anything());
      initializer.onProfileSelected(profileQ);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({ profile: profileQ }));
    });
  });

  describe('selection validation', () => {
    it('should not advance pipeline when onPortalSelected uses a portal not in the list', async () => {
      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();
      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
      const callsBefore = mockApiHelper.getUserProfiles.mock.calls.length;
      initializer.onPortalSelected({ id: 999, name: 'Unknown' });
      await new Promise((r) => setTimeout(r, 40));
      expect(mockApiHelper.getUserProfiles.mock.calls.length).toBe(callsBefore);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should not advance when onAgentSelected uses unknown agent (Flow B)', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA, portalBSameDept]);
      const deps = { ...defaultDeps, ...flowBDepsBase };
      const initializer = new PortalInitializer(deps);
      await initializer.start();
      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
      initializer.onPortalSelected(portalA);
      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('agentsAvailable', expect.anything());
      });
      const callsBefore = mockApiHelper.getUserProfiles.mock.calls.length;
      initializer.onAgentSelected({ agentId: 'unknown', name: 'X' });
      await new Promise((r) => setTimeout(r, 40));
      expect(mockApiHelper.getUserProfiles.mock.calls.length).toBe(callsBefore);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should not complete when onProfileSelected uses unknown profile', async () => {
      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();
      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
      initializer.onPortalSelected(portalA);
      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything());
      });
      initializer.onProfileSelected({ id: 999, name: 'Bad' });
      await new Promise((r) => setTimeout(r, 40));
      expect(mockEmit).not.toHaveBeenCalledWith('initialized', expect.anything());
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  // ── initialized event payload ─────────────────────────────────────────

  describe('initialized event payload', () => {
    it('should include portal and profile (no agent) in Flow A', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA]);
      mockApiHelper.getUserProfiles.mockResolvedValue([profileP]);

      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const event = getEmittedEvent('initialized');
      expect(event.payload.portal).toEqual(portalA);
      expect(event.payload.profile).toEqual(profileP);
      expect(event.payload.agent).toBeUndefined();
    });

    it('should include portal, agent, and profile in Flow B', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA]);
      mockApiHelper.getAgentsByPortal.mockResolvedValue([agentX]);
      mockApiHelper.getUserProfiles.mockResolvedValue([profileP]);

      const deps = { ...defaultDeps, ...flowBDepsBase };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const event = getEmittedEvent('initialized');
      expect(event.payload.portal).toEqual(portalA);
      expect(event.payload.agent).toEqual(agentX);
      expect(event.payload.profile).toEqual(profileP);
    });
  });

  // ── No WebSocket interaction ──────────────────────────────────────────

  describe('no WebSocket interaction', () => {
    it('should only call apiHelper and authService — no connection/transport methods', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA]);
      mockApiHelper.getUserProfiles.mockResolvedValue([profileP]);

      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      expect(mockApiHelper.getMyPortals).toHaveBeenCalled();
      expect(mockApiHelper.getUserProfiles).toHaveBeenCalled();
      expect(mockAuthService.getToken).toHaveBeenCalled();
    });
  });

  // ── destroy() ──────────────────────────────────────────────────────────

  describe('destroy()', () => {
    it('should prevent onPortalSelected from advancing the pipeline', async () => {
      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });

      initializer.destroy();
      initializer.onPortalSelected(portalA);

      await new Promise((r) => setTimeout(r, 50));

      expect(mockEmit).not.toHaveBeenCalledWith('initialized', expect.anything());
      expect(mockEmit).not.toHaveBeenCalledWith('profilesAvailable', expect.anything());
    });

    it('should prevent onAgentSelected from advancing the pipeline (Flow B)', async () => {
      mockApiHelper.getMyPortals.mockResolvedValue([portalA, portalBSameDept]);
      const deps = { ...defaultDeps, ...flowBDepsBase };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('agentsAvailable', expect.anything());
      });

      initializer.destroy();
      initializer.onAgentSelected(agentX);

      await new Promise((r) => setTimeout(r, 50));

      expect(mockEmit).not.toHaveBeenCalledWith('initialized', expect.anything());
    });

    it('should prevent onProfileSelected from advancing the pipeline', async () => {
      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything());
      });

      initializer.destroy();
      initializer.onProfileSelected(profileP);

      await new Promise((r) => setTimeout(r, 50));

      expect(mockEmit).not.toHaveBeenCalledWith('initialized', expect.anything());
    });

    it('should be a no-op when called on a freshly constructed (not started) instance', () => {
      const initializer = new PortalInitializer(defaultDeps);
      expect(() => initializer.destroy()).not.toThrow();
    });

    it('should make onPortalSelected a no-op after destroy', async () => {
      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything());
      });

      initializer.destroy();
      expect(() => initializer.onPortalSelected(portalA)).not.toThrow();

      await new Promise((r) => setTimeout(r, 50));
      expect(mockEmit).not.toHaveBeenCalledWith('initialized', expect.anything());
    });
  });

  // ── pipelineCache (CacheAdapter) ────────────────────────────────────────

  describe('pipelineCache', () => {
    const profilesKey = (portalId: string | number) => `test_pipeline_profiles_${portalId}`;

    it('should always fetch portals from API (portals are not cached)', async () => {
      const adapter = new MemoryCacheAdapter();
      const deps = {
        ...defaultDeps,
        pipelineCache: { adapter, profilesKey },
      };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything()));
      expect(mockApiHelper.getMyPortals).toHaveBeenCalled();

      initializer.onPortalSelected(portalA);
      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything()));
      initializer.onProfileSelected(profileP);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({ portal: portalA, profile: profileP }));
    });

    it('should always fetch agents via API in Flow B (agents are not cached)', async () => {
      const adapter = new MemoryCacheAdapter();
      adapter.set(profilesKey(portalA.id), { value: [profileP, profileQ], timestamp: Date.now() });
      mockApiHelper.getMyPortals.mockResolvedValue([portalA, portalBSameDept]);
      const deps = {
        ...defaultDeps,
        ...flowBDepsBase,
        pipelineCache: { adapter, profilesKey },
      };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything()));
      initializer.onPortalSelected(portalA);
      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('agentsAvailable', expect.anything()));
      expect(mockApiHelper.getPortalDetails).toHaveBeenCalled();
      expect(mockApiHelper.getAgentsByPortal).toHaveBeenCalled();
      initializer.onAgentSelected(agentX);
      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything()));
      initializer.onProfileSelected(profileP);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({ portal: portalA, agent: agentX, profile: profileP }));
    });

    it('should use cached profiles when provided and not call getUserProfiles; portal details are always fetched', async () => {
      const adapter = new MemoryCacheAdapter();
      adapter.set(profilesKey(portalA.id), { value: [profileP, profileQ], timestamp: Date.now() });
      const deps = {
        ...defaultDeps,
        pipelineCache: { adapter, profilesKey },
      };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything()));
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything()));
      expect(mockApiHelper.getUserProfiles).not.toHaveBeenCalled();
      expect(mockApiHelper.getPortalDetails).toHaveBeenCalled();

      initializer.onProfileSelected(profileP);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });

      const event = getEmittedEvent('initialized');
      expect(event.payload).toEqual(expect.objectContaining({ portal: portalA, profile: profileP }));
    });

    it('should fetch from API when pipelineCache is omitted', async () => {
      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything()));
      expect(mockApiHelper.getMyPortals).toHaveBeenCalled();
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything()));
      expect(mockApiHelper.getPortalDetails).toHaveBeenCalled();
      expect(mockApiHelper.getUserProfiles).toHaveBeenCalled();

      initializer.onProfileSelected(profileP);

      await vi.waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything());
      });
    });
  });

  // ── PlatformComponentService integration ──────────────────────────────

  describe('PlatformComponentService hooks', () => {
    let mockPcs: any;
    let mockHookContract: any;

    beforeEach(() => {
      mockPcs = {};
      mockHookContract = {
        setUserFilterTags: vi.fn(),
      };
    });

    it('getPortalList() is called with fetched portals', async () => {
      mockPcs.getPortalList = vi.fn().mockResolvedValue([portalB, portalA]);
      const deps = { ...defaultDeps, platformComponentService: mockPcs, hookContract: mockHookContract };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      expect(mockPcs.getPortalList).toHaveBeenCalledWith([portalA, portalB]);
      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything()));
      const event = getEmittedEvent('portalsAvailable');
      expect(event.payload.portals).toEqual([portalB, portalA]);
    });

    it('getPortalList() return value replaces the portal list', async () => {
      mockPcs.getPortalList = vi.fn().mockResolvedValue([portalB]);
      const deps = { ...defaultDeps, platformComponentService: mockPcs, hookContract: mockHookContract };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      // Single portal should be auto-selected
      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything()));
      expect(mockEmit).not.toHaveBeenCalledWith('portalsAvailable', expect.anything());
    });

    it('getDefaultPortal() auto-selects when it returns a portal', async () => {
      mockPcs.getDefaultPortal = vi.fn().mockResolvedValue(portalA);
      mockPcs.onPortalSelected = vi.fn().mockResolvedValue({});
      const deps = { ...defaultDeps, platformComponentService: mockPcs, hookContract: mockHookContract };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      expect(mockPcs.getDefaultPortal).toHaveBeenCalledWith([portalA, portalB]);
      // Should auto-select without emitting portalsAvailable
      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything()));
      expect(mockEmit).not.toHaveBeenCalledWith('portalsAvailable', expect.anything());
    });

    it('getDefaultPortal() falls back to normal logic when it returns null', async () => {
      mockPcs.getDefaultPortal = vi.fn().mockResolvedValue(null);
      const deps = { ...defaultDeps, platformComponentService: mockPcs, hookContract: mockHookContract };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything()));
    });

    it('onPortalSelected() is called after portal selection', async () => {
      mockPcs.onPortalSelected = vi.fn().mockResolvedValue({ topic: ['billing'] });
      const deps = { ...defaultDeps, platformComponentService: mockPcs, hookContract: mockHookContract };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything()));
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => {
        expect(mockPcs.onPortalSelected).toHaveBeenCalledWith(portalA);
        expect(mockHookContract.setUserFilterTags).toHaveBeenCalledWith({ topic: ['billing'] });
      });
    });

    it('onPortalSelected() stores returned filter tags via setUserFilterTags', async () => {
      const filterTags = { category: ['support', 'sales'] };
      mockPcs.onPortalSelected = vi.fn().mockResolvedValue(filterTags);
      const deps = { ...defaultDeps, platformComponentService: mockPcs, hookContract: mockHookContract };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything()));
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => expect(mockHookContract.setUserFilterTags).toHaveBeenCalledWith(filterTags));
    });

    it('onPortalSelected() defaults to {} on invalid return', async () => {
      mockPcs.onPortalSelected = vi.fn().mockRejectedValue(new Error('hook error'));
      const deps = { ...defaultDeps, platformComponentService: mockPcs, hookContract: mockHookContract };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything()));
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => expect(mockHookContract.setUserFilterTags).toHaveBeenCalledWith({}));
    });

    it('onPortalSelected() is called when getDefaultPortal auto-selects', async () => {
      mockPcs.getDefaultPortal = vi.fn().mockResolvedValue(portalA);
      mockPcs.onPortalSelected = vi.fn().mockResolvedValue({ topic: ['auto'] });
      const deps = { ...defaultDeps, platformComponentService: mockPcs, hookContract: mockHookContract };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => expect(mockPcs.onPortalSelected).toHaveBeenCalledWith(portalA));
      expect(mockHookContract.setUserFilterTags).toHaveBeenCalledWith({ topic: ['auto'] });
    });

    it('getPortalList error clears portal list (cc-widget callPortalWebhook parity)', async () => {
      mockPcs.getPortalList = vi.fn().mockRejectedValue(new Error('hook error'));
      const deps = { ...defaultDeps, platformComponentService: mockPcs, hookContract: mockHookContract };
      const initializer = new PortalInitializer(deps);
      await expect(initializer.start()).rejects.toThrow(/no portals/i);
    });

    it('pipeline works normally when platformComponentService is undefined', async () => {
      const initializer = new PortalInitializer(defaultDeps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything()));
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything()));
      initializer.onProfileSelected(profileP);

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything()));
    });
  });

  // ── cc-widget customer parity (portal list, profiles, select PUT) ─────

  describe('cc-widget customer parity', () => {
    const customerAgentDetails = {
      userType: 'customer' as const,
      portals: ['p1', 'p2'],
    };

    it('uses only agentDetails.portals for customer; does not call getMyPortals', async () => {
      const deps = { ...defaultDeps, agentDetails: customerAgentDetails };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      expect(mockApiHelper.getMyPortals).not.toHaveBeenCalled();
      await vi.waitFor(() => {
        const ev = getEmittedEvent('portalsAvailable');
        expect(ev.payload.portals).toEqual([
          { id: 'p1', name: ' ' },
          { id: 'p2', name: ' ' },
        ]);
      });
    });

    it('customer portal list ignores portalIds query param (cc-widget parity)', async () => {
      const deps = {
        ...defaultDeps,
        agentDetails: customerAgentDetails,
        initParams: { portalIds: '9,10' },
      };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      expect(mockApiHelper.getMyPortals).not.toHaveBeenCalled();
      await vi.waitFor(() => {
        const ev = getEmittedEvent('portalsAvailable');
        expect(ev.payload.portals.map((p: Portal) => p.id)).toEqual(['p1', 'p2']);
      });
    });

    it('customer synthetic path does not call PCS getPortalList or getDefaultPortal', async () => {
      const mockPcs = {
        getPortalList: vi.fn().mockResolvedValue([]),
        getDefaultPortal: vi.fn().mockResolvedValue(null),
      };
      const deps = {
        ...defaultDeps,
        agentDetails: customerAgentDetails,
        platformComponentService: mockPcs,
      };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      expect(mockPcs.getPortalList).not.toHaveBeenCalled();
      expect(mockPcs.getDefaultPortal).not.toHaveBeenCalled();
    });

    it('Flow B with customer: no department filter on portal list; getAgentsByPortal uses portal details departmentId', async () => {
      mockApiHelper.getPortalDetails.mockResolvedValue({
        departmentId: 100,
        portal: [{ name: 'Synth', portalSettings: {} }],
      });
      const deps = {
        ...defaultDeps,
        isAgentSelectionMode: true,
        agentDetails: {
          userType: 'customer' as const,
          portals: ['p1', 'p2'],
          departmentId: 100,
        },
      };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything()));
      initializer.onPortalSelected({ id: 'p1', name: ' ' });

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('agentsAvailable', expect.anything()));
      expect(mockApiHelper.getAgentsByPortal).toHaveBeenCalledWith(
        expect.objectContaining({ departmentId: 100, portalId: 'p1' }),
      );
    });

    it('customer: skips getUserProfiles; completes without profile when no portal default', async () => {
      mockApiHelper.getPortalDetails.mockResolvedValue({
        departmentId: 100,
        portal: [{ name: 'P', portalSettings: {} }],
      });
      const deps = { ...defaultDeps, agentDetails: { userType: 'customer' as const, portals: ['only'] } };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything()));
      expect(mockApiHelper.getUserProfiles).not.toHaveBeenCalled();
      const ev = getEmittedEvent('initialized');
      expect(ev.payload.profile).toBeUndefined();
      expect(mockApiHelper.selectUserProfile).not.toHaveBeenCalled();
    });

    it('customer: injects default profile from portal details; skips selectUserProfile', async () => {
      const defaultProf = { id: 42, name: 'DefaultCust' };
      mockApiHelper.getPortalDetails.mockResolvedValue({
        departmentId: 100,
        portal: [{ name: 'P', portalSettings: { defaultUserProfile: defaultProf } }],
      });
      const deps = { ...defaultDeps, agentDetails: { userType: 'customer' as const, portals: ['only'] } };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything()));
      expect(mockApiHelper.getUserProfiles).not.toHaveBeenCalled();
      expect(mockApiHelper.selectUserProfile).not.toHaveBeenCalled();
      const ev = getEmittedEvent('initialized');
      expect(ev.payload.profile).toEqual(defaultProf);
    });

    it('authType customer without userType still skips getUserProfiles and injects default', async () => {
      const defaultProf = { id: 77, name: 'Def' };
      mockApiHelper.getPortalDetails.mockResolvedValue({
        portal: [{ portalSettings: { defaultUserProfile: defaultProf } }],
      });
      const deps = {
        ...defaultDeps,
        initParams: { authType: 'customer' },
        agentDetails: { portals: [1, 2] },
      };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything()));
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything()));
      expect(mockApiHelper.getUserProfiles).not.toHaveBeenCalled();
      expect(getEmittedEvent('initialized').payload.profile).toEqual(defaultProf);
    });

    it('initParams authType user persists profile via selectUserProfile', async () => {
      const deps = { ...defaultDeps, initParams: { authType: 'user' } };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything()));
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything()));
      initializer.onProfileSelected(profileP);

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything()));
      expect(mockApiHelper.selectUserProfile).toHaveBeenCalledWith(
        expect.objectContaining({ portalId: portalA.id, profileId: profileP.id }),
      );
    });

    it('initParams authType anonymous does not call selectUserProfile', async () => {
      const deps = { ...defaultDeps, initParams: { authType: 'anonymous' } };
      const initializer = new PortalInitializer(deps);
      await initializer.start();

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('portalsAvailable', expect.anything()));
      initializer.onPortalSelected(portalA);

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('profilesAvailable', expect.anything()));
      initializer.onProfileSelected(profileP);

      await vi.waitFor(() => expect(mockEmit).toHaveBeenCalledWith('initialized', expect.anything()));
      expect(mockApiHelper.selectUserProfile).not.toHaveBeenCalled();
    });
  });
});
