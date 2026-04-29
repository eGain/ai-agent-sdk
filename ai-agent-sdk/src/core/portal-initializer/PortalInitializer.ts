/**
 * PortalInitializer — Event-driven chained pipeline for portal-based agent initialization
 *
 * Uses a chained architecture where each step either auto-selects and calls
 * the next method directly, or emits an event and returns. The pipeline
 * progresses via direct method calls triggered by the consumer's selection
 * methods on AiAgent (selectPortal, selectAgent, selectUserProfile).
 *
 * Chain: start() → fetchPortals() → handleSelectedPortal() → handleSelectedAgent() → completeInitialization()
 *
 * Public handler methods: onPortalSelected(), onAgentSelected(), onProfileSelected()
 *
 * The pipeline has zero WebSocket knowledge — it is pure REST. The consumer
 * calls connect() after receiving the initialized event.
 *
 * **cc-widget customer parity** (`agentDetails.userType === 'customer'` with non-empty `agentDetails.portals`):
 * portal list is built only from those IDs (no myportals / portalIds / intersection / PCS / Flow B list filter).
 * When `userType === 'customer'` or `initParams.authType === 'customer'`, skips GET userprofiles and may set
 * profiles from `portalDetails.portal[0].portalSettings.defaultUserProfile` only. PUT `.../userprofiles/.../select`
 * runs only for `userType === 'agent'`, `authType === 'user'`, or legacy unset typing (defaults to persist).
 *
 * @module PortalInitializer
 */

import type { CacheAdapter } from "../api/CacheAdapter.js";
import type {
  Portal,
  UserProfile,
  AgentListItem
} from "../types/PortalTypes.js";
import type { PlatformComponentService } from "../platform/PlatformComponentService.js";
import type { HookContract } from "../platform/HookContract.js";

/**
 * Configuration for PortalInitializer (injected dependencies).
 * Pipeline has zero WebSocket knowledge; portal details and agents are always re-fetched via API (not cached).
 */
export interface PortalInitializerConfig {
  agentId: string;
  apiHelper: {
    getMyPortals: (options: any) => Promise<Portal[]>;
    getPortalDetails?: (options: any) => Promise<any>;
    getAgentsByPortal: (options: any) => Promise<AgentListItem[]>;
    getUserProfiles: (options: any) => Promise<UserProfile[]>;
    selectUserProfile: (options: any) => Promise<void>;
  };
  logger: {
    debug: (msg: string, ctx?: object) => void;
    info: (msg: string, ctx?: object) => void;
    warn: (msg: string, ctx?: object) => void;
    error: (msg: string, err?: Error, ctx?: object) => void;
    createChild: (name: string) => any;
  };
  authService: {
    getToken: () => Promise<string | null>;
  };
  initParams: Record<string, string>;
  /**
   * Event emission function. AiAgent injects its own emit here and performs
   * bookkeeping (setting resolvedAgentId, caching, isInitialized) when
   * type === 'initialized'.
   */
  emit: (eventType: string, event: any) => void;
  createAgentEventResponse: (type: string, payload: any) => any;
  /**
   * Optional cache adapter for profiles list reused on restart (portal-scoped).
   * Portals are always fetched fresh from the API. Portal details and agents are also never cached.
   */
  pipelineCache?: {
    adapter: CacheAdapter;
    /** Returns the profiles cache key scoped to the given portalId. */
    profilesKey: (portalId: string | number) => string;
    /** Time-to-live in ms. Cached entries older than this are discarded on read. */
    ttl?: number;
  };
  isAgentSelectionMode: boolean;
  /**
   * Agent details stored on the agent (e.g. AiAgent's agentDetails).
   * - `languageCode` — forwarded to portalmgr portal list API (`getMyPortals`) as `$lang`.
   * - `departmentId` — Flow B: filters portals by `portal.department.id` (cc-widget: from default agent API details). `initParams.departmentId` is fallback only.
   * - `portals` — used for user/agent portal intersection when `initParams.agentid` is set and not in Flow B; for `userType === 'customer'` with a non-empty list, used as the sole portal list (cc-widget parity).
   * - `userType` — `'customer'` enables cc-widget customer portal list, profile, and select-API behavior.
   */
  agentDetails?: {
    languageCode?: string;
    departmentId?: string | number;
    portals?: Array<string | number | { id?: string | number }>;
    userType?: "agent" | "customer";
  };

  /**
   * Platform component service (from loaded connector script).
   * When present, the pipeline calls portal-related hooks during execution.
   */
  platformComponentService?: PlatformComponentService;

  /**
   * HookContract instance (built by AiAgent). Needed so that onPortalSelected
   * can store filter tags via setUserFilterTags.
   */
  hookContract?: HookContract;
}

/** Comma-separated portal IDs (cc-widget `portalIds` shortcut). */
function parsePortalIdsFromParams(params: Record<string, string>): string[] {
  const raw = params.portalIds ?? params.portalids ?? "";
  if (!raw.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** True when two API ids match; compares via String() only (no Number() coercion). */
function sameId(a: unknown, b: unknown): boolean {
  if (a == null || b == null) return false;
  if (a === "" || b === "") return false;
  return String(a) === String(b);
}

function getPortalIdRaw(p: Portal): string | number | null {
  const v = p.id;
  if (v === null || v === undefined || v === "") return null;
  return typeof v === "number" || typeof v === "string" ? v : String(v);
}

/**
 * Intersection of user portals and agent-configured portals (cc-widget `filterPortals`).
 * Empty agent list yields all user portals; otherwise strict ID intersection (can be empty).
 */
function filterPortalsUserAndAgent(
  userPortals: Portal[],
  botPortals: unknown[]
): Portal[] {
  if (!userPortals?.length) return [];
  if (!botPortals?.length) return [...userPortals];

  const botIds: Array<string | number> = [];
  for (const item of botPortals) {
    if (typeof item === "string" || typeof item === "number") {
      if (item !== "") botIds.push(item);
    } else if (item != null && typeof item === "object") {
      const id = (item as { id?: string | number }).id;
      if (id != null && id !== "")
        botIds.push(
          typeof id === "number" || typeof id === "string" ? id : String(id)
        );
    }
  }

  return userPortals.filter((u) => {
    const uid = getPortalIdRaw(u);
    if (uid == null) return false;
    return botIds.some((b) => sameId(b, uid));
  });
}

/**
 * Flow B portal department filter: cc-widget uses `store.state.departmentId` from fetched agent details.
 * Prefer `agentDetails.departmentId`; if absent, use `initParams.departmentId` / `departmentid`.
 * Values are kept as string or number (no numeric coercion).
 */
function resolveDepartmentIdForAgentSelection(
  agentDetails: PortalInitializerConfig["agentDetails"],
  params: Record<string, string>
): string | number | null {
  const fromDetails = agentDetails?.departmentId;
  if (fromDetails != null && fromDetails !== "") {
    if (typeof fromDetails === "string") {
      const t = fromDetails.trim();
      return t === "" ? null : t;
    }
    return fromDetails;
  }
  const raw = params.departmentId ?? params.departmentid;
  if (raw === undefined || raw === "") return null;
  const t = raw.trim();
  return t === "" ? null : t;
}

/**
 * Event-driven chained pipeline for the CC widget initialization flow.
 *
 * Each step auto-selects (count == 1) and calls the next method directly,
 * or emits an event and returns. The consumer's selection call triggers the
 * next step — no await gates.
 *
 * Supports Flow A (specific agent: portal → profile) and Flow B (default agent: portal → agent → profile).
 */
export class PortalInitializer {
  private deps: PortalInitializerConfig;

  private portals: Portal[] = [];
  private selectedPortal?: Portal;
  private portalDetails?: any;
  private profiles: UserProfile[] = [];
  private agents: AgentListItem[] = [];
  private selectedAgent?: AgentListItem;
  private selectedProfile?: UserProfile;
  private destroyed = false;

  constructor(deps: PortalInitializerConfig) {
    this.deps = deps;
  }

  private readCachedFromAdapter<T>(key: string): T | null {
    const pc = this.deps.pipelineCache;
    if (!pc) return null;
    const entry = pc.adapter.get<T>(key);
    if (!entry) return null;
    if (pc.ttl != null && Date.now() - entry.timestamp > pc.ttl) {
      pc.adapter.delete(key);
      return null;
    }
    return entry.value;
  }

  /**
   * Start the pipeline. Performs pre-flight (token acquisition, portal-selection
   * requirement check) and kicks off fetchPortals() when needed.
   *
   * Per the architecture diagram, start() checks queryParam.isDefaultAgent:
   *  - True  → fetchPortals() (Flow B)
   *  - False → fetchPortals() (Flow A); portal list may be narrowed via `agentid` + `agentDetails.portals` like cc-widget
   */
  async start(): Promise<void> {
    const { logger, authService, isAgentSelectionMode } = this.deps;
    logger.info("PortalInitializer pipeline started", { isAgentSelectionMode });

    const preflight = await authService.getToken();
    if (preflight == null || String(preflight).trim() === "") {
      throw new Error(
        "Authentication token required for portal initialization"
      );
    }
    logger.debug("Token obtained for portal pipeline");

    await this.fetchPortals();
  }

  /**
   * Fetch portals (once), apply mode-specific filtering, then auto-select or emit.
   *
   * Mirrors cc-widget's `getFilteredPortals`: resolve the portal list first
   * (customer synthetic / portalIds / API), then branch on mode for filtering.
   * Customer synthetic path skips filtering entirely.
   */
  private async fetchPortals(): Promise<void> {
    const { apiHelper, logger, initParams, agentDetails, isAgentSelectionMode } = this.deps;

    let portals: Portal[];

    if (agentDetails?.userType === 'customer' && (agentDetails.portals?.length ?? 0) > 0) {
      const rawList = agentDetails.portals || [];
      portals = rawList.map((entry) => {
        const id =
          typeof entry === 'object' && entry != null
            ? (entry as { id?: string | number }).id
            : entry;
        return { id, name: ' ' } as Portal;
      });
      logger.info('Customer portal list from agentDetails.portals (cc-widget parity)', { count: portals.length });
    } else {
      const idList = parsePortalIdsFromParams(initParams);
      if (idList.length > 0) {
        logger.info('Using portalIds from params', { count: idList.length });
        portals = idList.map((id) => ({ id } as Portal));
      } else {
        const userId = initParams.userid ?? initParams.userId ?? 'default';
        const themeTemplate = (initParams.templateName || initParams.shortUrlTemplate || '').trim();
        const shortUrlTemplate = themeTemplate || undefined;
        const language =
          typeof agentDetails?.languageCode === 'string' && agentDetails.languageCode.trim()
            ? agentDetails.languageCode.trim()
            : 'en-us';

        logger.info('Fetching portals...');
        try {
          const fromMy = await apiHelper.getMyPortals({ language, userId, shortUrlTemplate });
          portals = Array.isArray(fromMy) ? fromMy : [];
        } catch (err) {
          logger.error('Failed to fetch portals', err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      }

      let filterResult: { portals: Portal[]; pcsAutoSelected?: Portal };

      if (!isAgentSelectionMode) {
        filterResult = await this.filterAgentSpecificPortals(portals);
      } else {
        filterResult = await this.filterDepartmentSpecificPortals(portals);
      }

      if (filterResult.pcsAutoSelected) {
        this.selectedPortal = filterResult.pcsAutoSelected;
        await this.callOnPortalSelected(filterResult.pcsAutoSelected);
        await this.handleSelectedPortal();
        return;
      }

      portals = filterResult.portals;
    }

    await this.emitPortalsAvailable(portals);
  }

  /**
   * Flow A filter: intersect user portals with the specific agent's portal list
   * (when `initParams.agentid` is set), then run PCS hooks.
   */
  private async filterAgentSpecificPortals(
    portals: Portal[]
  ): Promise<{ portals: Portal[]; pcsAutoSelected?: Portal }> {
    const { logger, initParams, agentDetails } = this.deps;

    const agentIdForFilter = initParams.agentid || initParams.agentId || this.deps.agentId;
    if (agentIdForFilter) {
      const botList = Array.isArray(agentDetails?.portals) ? agentDetails.portals : [];
      const beforeCount = portals.length;
      portals = filterPortalsUserAndAgent(portals, botList as unknown[]);
      logger.info('Filtered portals (agent intersection)', {
        before: beforeCount,
        after: portals.length,
        agentid: agentIdForFilter,
      });
    }

    return this.applyPcsHooks(portals);
  }

  /**
   * Flow B filter: run PCS hooks, then narrow portals to those whose department
   * matches the resolved `departmentId` (from agentDetails or initParams).
   */
  private async filterDepartmentSpecificPortals(
    portals: Portal[]
  ): Promise<{ portals: Portal[]; pcsAutoSelected?: Portal }> {
    const { logger, agentDetails, initParams } = this.deps;

    const pcsResult = await this.applyPcsHooks(portals);
    if (pcsResult.pcsAutoSelected) return pcsResult;

    portals = pcsResult.portals;

    const flowBDepartmentId = resolveDepartmentIdForAgentSelection(agentDetails, initParams);
    if (flowBDepartmentId == null) {
      throw new Error(
        'departmentId is required for Flow B (agent selection mode): set agentDetails.departmentId from the default agent API response, or pass initParams.departmentId'
      );
    }
    const beforeDept = portals.length;
    portals = portals.filter((p) => sameId(p.department?.id, flowBDepartmentId));
    logger.info('Filtered portals by department (Flow B)', {
      before: beforeDept,
      after: portals.length,
      departmentId: flowBDepartmentId,
    });

    return { portals };
  }

  /**
   * Run PCS getPortalList and getDefaultPortal hooks on the portal list.
   * Errors cause the portal list to be cleared (cc-widget callPortalWebhook parity).
   */
  private async applyPcsHooks(
    portals: Portal[]
  ): Promise<{ portals: Portal[]; pcsAutoSelected?: Portal }> {
    const { logger } = this.deps;
    const pcs = this.deps.platformComponentService;

    try {
      let portalList = portals;
      if (pcs?.getPortalList) {
        const processed = await pcs.getPortalList(portals);
        portalList = Array.isArray(processed) ? processed : [];
        logger.info("PCS.getPortalList processed portal list", {
          count: portalList.length
        });
      }

      if (pcs?.getDefaultPortal && portalList.length > 0) {
        const defaultPortal = await pcs.getDefaultPortal(portalList);
        if (defaultPortal && defaultPortal.id != null) {
          logger.info("PCS.getDefaultPortal auto-selected portal", {
            portalId: defaultPortal.id,
            name: defaultPortal.name
          });
          return { portals: portalList, pcsAutoSelected: defaultPortal };
        }
      }

      return { portals: portalList };
    } catch (err) {
      logger.warn(
        "PCS portal hooks failed; using empty portal list (cc-widget callPortalWebhook parity)",
        err instanceof Error ? err : new Error(String(err))
      );
      return { portals: [] };
    }
  }

  /**
   * Validate that the portal list is non-empty, store it, then either
   * auto-select (single portal) or emit portalsAvailable for the consumer.
   */
  private async emitPortalsAvailable(portals: Portal[]): Promise<void> {
    const { logger, emit, createAgentEventResponse } = this.deps;

    if (!portals || portals.length === 0) {
      throw new Error("No portals available for this user");
    }

    this.portals = portals;
    logger.info("Portals fetched", { count: portals.length });

    if (portals.length === 1) {
      this.selectedPortal = portals[0];
      logger.info("Auto-selected single portal", {
        portalId: this.selectedPortal.id,
        name: this.selectedPortal.name
      });
      await this.callOnPortalSelected(this.selectedPortal);
      await this.handleSelectedPortal();
    } else {
      logger.info(
        "Emitting portalsAvailable; awaiting consumer selectPortal()",
        { count: portals.length }
      );
      emit(
        "portalsAvailable",
        createAgentEventResponse("portalsAvailable", { portals })
      );
    }
  }

  /**
   * Process the selected portal: resolve portal details + profiles, enrich
   * the portal name, then branch to agent selection (Flow B) or profile
   * resolution (Flow A).
   */
  private async handleSelectedPortal(): Promise<void> {
    if (this.destroyed) return;
    const { logger, agentDetails, initParams } = this.deps;
    const portalId = this.selectedPortal!.id;

    const isCustomer =
      agentDetails?.userType === "customer" ||
      initParams.authType?.trim().toLowerCase() === "customer";

    const resolved =
      (await this.resolveProfilesFromCache(portalId)) ??
      (isCustomer
        ? await this.resolveProfilesForCustomer(portalId)
        : await this.resolveProfilesFromApi(portalId));

    this.portalDetails = resolved.portalDetails;
    this.profiles = resolved.profiles;

    this.addPortalName();

    logger.info("Portal details fetched", {
      portalDetails: this.portalDetails
    });
    logger.info("User profiles fetched", { profiles: this.profiles });
    logger.info("Department ID", {
      departmentId: this.portalDetails?.departmentId
    });

    if (this.deps.isAgentSelectionMode) {
      await this.fetchAndEmitAgents();
    } else {
      await this.handleSelectedAgent();
    }
  }

  /** Fetch portal details from API. Swallows errors and returns undefined on failure. */
  private async fetchPortalDetails(
    portalId: string | number
  ): Promise<any | undefined> {
    const { apiHelper } = this.deps;
    return (
      (await apiHelper
        .getPortalDetails?.({ portalId: String(portalId) })
        .catch(() => null)) ?? undefined
    );
  }

  /** Cache-hit strategy: return cached profiles with fresh portal details, or null if cache miss. */
  private async resolveProfilesFromCache(
    portalId: string | number
  ): Promise<{ portalDetails: any; profiles: UserProfile[] } | null> {
    const key = this.deps.pipelineCache?.profilesKey(portalId) ?? "";
    const cached = this.readCachedFromAdapter<UserProfile[]>(key);
    if (cached == null) return null;
    this.deps.logger.info("Using cached profiles", { count: cached.length });
    const portalDetails = await this.fetchPortalDetails(portalId);
    return { portalDetails, profiles: [...cached] };
  }

  /**
   * Customer strategy: fetch portal details only (skip getUserProfiles),
   * extract defaultUserProfile from portal settings if present.
   */
  private async resolveProfilesForCustomer(
    portalId: string | number
  ): Promise<{ portalDetails: any; profiles: UserProfile[] }> {
    const { logger } = this.deps;
    logger.info(
      "Customer profile mode: skipping getUserProfiles (cc-widget parity)"
    );
    const portalDetails = await this.fetchPortalDetails(portalId);
    const profiles = this.extractCustomerProfileFromDetails(portalDetails);
    return { portalDetails, profiles };
  }

  /** Normal strategy: fetch portal details and user profiles in parallel. */
  private async resolveProfilesFromApi(
    portalId: string | number
  ): Promise<{ portalDetails: any; profiles: UserProfile[] }> {
    const { apiHelper } = this.deps;
    const [portalDetails, profiles] = await Promise.all([
      this.fetchPortalDetails(portalId),
      apiHelper.getUserProfiles({ portalId })
    ]);
    return { portalDetails, profiles: profiles ?? [] };
  }

  /**
   * Extract the default user profile from portal details for customer mode.
   * Returns a single-element array if a valid default exists, otherwise empty.
   */
  private extractCustomerProfileFromDetails(
    portalDetails: any
  ): UserProfile[] {
    const { logger } = this.deps;
    const defaultFromPortal =
      portalDetails?.portal?.[0]?.portalSettings?.defaultUserProfile ??
      portalDetails?.portalSettings?.defaultUserProfile;
    if (
      defaultFromPortal != null &&
      defaultFromPortal.id != null &&
      defaultFromPortal.id !== ""
    ) {
      logger.info(
        "Customer profile mode: using default user profile from portal details",
        { profileId: defaultFromPortal.id }
      );
      return [defaultFromPortal as UserProfile];
    }
    return [];
  }

  /**
   * Enrich `selectedPortal.name` and the matching `portals[]` entry from
   * the portal details API response (cc-widget portalService.handlePortalSelection parity).
   */
  private addPortalName(): void {
    const portalDisplayName =
      this.portalDetails?.name ?? this.portalDetails?.portal?.[0]?.name;
    if (
      portalDisplayName == null ||
      String(portalDisplayName).trim() === "" ||
      this.selectedPortal == null
    ) {
      return;
    }
    const name = String(portalDisplayName).trim();
    this.selectedPortal = { ...this.selectedPortal, name };
    const idx = this.portals.findIndex((p) =>
      sameId(p.id, this.selectedPortal!.id)
    );
    if (idx >= 0) {
      this.portals[idx] = { ...this.portals[idx], name };
    }
  }

  /**
   * Flow B: validate departmentId, fetch agents for the selected portal,
   * then auto-select (single agent) or emit agentsAvailable.
   */
  private async fetchAndEmitAgents(): Promise<void> {
    const { apiHelper, logger, emit, createAgentEventResponse } = this.deps;
    const departmentId = this.portalDetails?.departmentId;
    if (!departmentId) {
      throw new Error(
        "Department ID required for agent selection but not found in portal"
      );
    }

    this.agents = await apiHelper.getAgentsByPortal({
      departmentId,
      portalId: this.selectedPortal!.id,
      agentType: "contact-center"
    });
    logger.info("Agents fetched", { agents: this.agents });

    if (!this.agents || this.agents.length === 0) {
      throw new Error("No agents available for the selected portal");
    }

    if (this.agents.length === 1) {
      this.selectedAgent = this.agents[0];
      logger.info("Auto-selected single agent", {
        agentId: this.selectedAgent?.agentId
      });
      await this.handleSelectedAgent();
    } else {
      emit(
        "agentsAvailable",
        createAgentEventResponse("agentsAvailable", { agents: this.agents })
      );
    }
  }

  /**
   * Process the selected agent (or no agent in Flow A): resolve profile selection
   * using priority logic, then chain to completeInitialization or emit profilesAvailable.
   */
  private async handleSelectedAgent(): Promise<void> {
    if (this.destroyed) return;
    const { logger, emit, createAgentEventResponse } = this.deps;

    const resolved = this.resolveAutoProfile();

    if (resolved) {
      this.selectedProfile = resolved.profile;
      logger.info("Profile auto-resolved", {
        profileId: this.selectedProfile?.id,
        portalId: this.selectedPortal?.id
      });
      await this.completeInitialization();
    } else {
      logger.info(
        "Emitting profilesAvailable; awaiting consumer selectUserProfile()",
        { count: this.profiles.length }
      );
      emit(
        "profilesAvailable",
        createAgentEventResponse("profilesAvailable", {
          profiles: this.profiles,
          selectedPortal: this.selectedPortal
        })
      );
    }
  }

  /**
   * Priority cascade for auto-selecting a profile.
   * Returns `{ profile }` when one can be auto-selected (including `undefined`
   * for the zero-profiles case), or `null` when the consumer must choose.
   *
   * Priority: no profiles → single → lastUsed → portalDefault → null (emit)
   */
  private resolveAutoProfile(): { profile: UserProfile | undefined } | null {
    const profiles = this.profiles;

    if (!profiles || profiles.length === 0) {
      return { profile: undefined };
    }
    if (profiles.length === 1) {
      return { profile: profiles[0] };
    }

    const lastUsed = profiles.find((p) => p.isLastUsedInPortal);
    if (lastUsed) return { profile: lastUsed };

    const defaultId = this.getDefaultProfileFromPortal();
    if (defaultId != null) {
      const defaultProfile = profiles.find((p) => String(p.id) === defaultId);
      if (defaultProfile) return { profile: defaultProfile };
    }

    return null;
  }

  /** Extract the default profile ID from the two possible portal details shapes. */
  private getDefaultProfileFromPortal(): string | undefined {
    const id =
      this.portalDetails?.portal?.[0]?.portalSettings?.defaultUserProfile?.id ??
      this.portalDetails?.portalSettings?.defaultUserProfile?.id;
    return id != null ? String(id) : undefined;
  }

  /**
   * Final pipeline step: persist profile selection and emit the initialized event
   * with the full payload built from instance fields.
   */
  private async completeInitialization(): Promise<void> {
    if (this.destroyed) return;
    const {
      apiHelper,
      emit,
      createAgentEventResponse,
      agentDetails,
      initParams
    } = this.deps;
    const selectedPortal = this.selectedPortal!;
    const selectedProfile = this.selectedProfile;

    if (selectedProfile != null) {
      // cc-widget: no PUT for customer; PUT for agent / authType user / legacy (no userType and no authType).
      const authTypeLower = initParams.authType?.trim().toLowerCase();
      const customerLike =
        agentDetails?.userType === "customer" || authTypeLower === "customer";
      const legacyUnsetTyping =
        agentDetails?.userType == null &&
        (authTypeLower == null || authTypeLower === "");
      const callSelect =
        !customerLike &&
        (agentDetails?.userType === "agent" ||
          authTypeLower === "user" ||
          legacyUnsetTyping);
      if (callSelect) {
        await apiHelper.selectUserProfile({
          portalId: selectedPortal.id,
          profileId: selectedProfile.id
        });
      }
    }

    // Build the payload for the initialized event
    const payload: Record<string, any> = {
      portal: selectedPortal,
      availableProfiles: this.profiles ?? []
    };
    if (selectedProfile != null) {
      payload.profile = selectedProfile;
    }
    if (this.portalDetails != null) {
      payload.portalDetails = this.portalDetails;
    }
    if (this.portals.length > 0) {
      payload.availablePortals = this.portals;
    }
    if (this.selectedAgent) {
      const agent =
        this.agents.length > 0
          ? (this.agents.find(
              (a) => (a as any).agentId === this.selectedAgent!.agentId
            ) ?? this.selectedAgent)
          : this.selectedAgent;
      payload.agent = agent;
    }

    emit("initialized", createAgentEventResponse("initialized", payload));
  }

  /**
   * Call PCS.onPortalSelected() and store filter tags if returned.
   * Best-effort: errors are logged as warnings and filter tags default to {}.
   */
  private async callOnPortalSelected(portal: Portal): Promise<void> {
    const pcs = this.deps.platformComponentService;
    if (!pcs?.onPortalSelected) return;
    try {
      const result = await pcs.onPortalSelected(portal);
      if (result && typeof result === "object" && !Array.isArray(result)) {
        this.deps.hookContract?.setUserFilterTags(result);
        this.deps.logger.debug("PCS.onPortalSelected stored filter tags", {
          tags: result
        });
      }
    } catch (err) {
      this.deps.logger.warn(
        "PCS.onPortalSelected threw; filter tags defaulting to {}",
        err instanceof Error ? err : new Error(String(err))
      );
      this.deps.hookContract?.setUserFilterTags({});
    }
  }

  /**
   * Called by AiAgent.selectPortal(). Stores the selected portal and triggers
   * the next pipeline step (handleSelectedPortal).
   */
  onPortalSelected(portal: Portal): void {
    if (this.destroyed) return;
    this.deps.logger.debug("onPortalSelected called", {
      portalId: portal?.id,
      name: portal?.name
    });
    if (
      this.portals.length > 0 &&
      !this.portals.some((p) => sameId(p.id, portal?.id))
    ) {
      this.deps.logger.error(
        "Selected portal is not in the available portals list",
        undefined,
        { portalId: portal?.id }
      );
      return;
    }
    this.selectedPortal = portal;
    this.callOnPortalSelected(portal)
      .then(() => {
        return this.handleSelectedPortal();
      })
      .catch((err) => {
        this.deps.logger.error(
          "Pipeline error after portal selection",
          err instanceof Error ? err : new Error(String(err))
        );
      });
  }

  /**
   * Called by AiAgent.selectAgent(). Stores the selected agent and triggers
   * the next pipeline step (handleSelectedAgent). Flow B only.
   */
  onAgentSelected(agent: AgentListItem): void {
    if (this.destroyed) return;
    if (
      this.agents.length > 0 &&
      !this.agents.some((a) => sameId(a.agentId, agent?.agentId))
    ) {
      this.deps.logger.error(
        "Selected agent is not in the available agents list",
        undefined,
        { agentId: agent?.agentId }
      );
      return;
    }
    this.selectedAgent = agent;
    // Trigger the next pipeline step (handleSelectedAgent)
    this.handleSelectedAgent().catch((err) => {
      this.deps.logger.error(
        "Pipeline error after agent selection",
        err instanceof Error ? err : new Error(String(err))
      );
    });
  }

  /**
   * Called by AiAgent.selectUserProfile(). Stores the selected profile and triggers
   * the final pipeline step (completeInitialization).
   */
  onProfileSelected(profile: UserProfile): void {
    if (this.destroyed) return;
    if (
      this.profiles.length > 0 &&
      !this.profiles.some((p) => sameId(p.id, profile?.id))
    ) {
      this.deps.logger.error(
        "Selected profile is not in the available profiles list",
        undefined,
        { profileId: profile?.id }
      );
      return;
    }
    this.selectedProfile = profile;
    // Trigger the final pipeline step (completeInitialization)
    this.completeInitialization().catch((err) => {
      this.deps.logger.error(
        "Pipeline error after profile selection",
        err instanceof Error ? err : new Error(String(err))
      );
    });
  }

  /**
   * Destroy the pipeline. Sets a destroyed flag so that any in-progress or
   * future chained method calls are no-ops. After calling destroy(), the
   * pipeline instance must not be reused.
   */
  destroy(): void {
    this.destroyed = true;
  }
}
