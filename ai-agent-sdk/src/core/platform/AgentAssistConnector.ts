import type {
  AgentAssistManager,
  ConnectorClientError,
} from "@egain/connector-client-sdk";
import type { CallerInfo } from "./HookContract.js";

/** Hooks from {@link AiAgent} — same mutators legacy platform scripts use on HookContract. */
export interface AgentAssistHooks {
  addToTranscript: (entry: {
    sender: string;
    content: string;
    timestamp?: Date;
  }) => void;
  setCallerInfo: (info: CallerInfo) => void;
  setConversationId: (id: string) => void;
  setPlatformToken: (token: string) => void;
}

export interface AgentAssistStartInput {
  apiDomain: string;
  integrationId: string;
  aiAgentId?: string;
  getToken: () => Promise<string | null>;
  queryParams: Record<string, string>;
  hooks: AgentAssistHooks;
}

type AgentAssistSession = Awaited<
  ReturnType<AgentAssistManager["createSession"]>
>;

type AgentAssistConnectorLogger = {
  debug: (msg: string, ctx?: object) => void;
  info: (msg: string, ctx?: object) => void;
  warn: (msg: string, ctx?: object) => void;
};

export class AgentAssistConnector {
  private manager?: AgentAssistManager;
  private session?: AgentAssistSession;

  constructor(private readonly logger: AgentAssistConnectorLogger) {}

  async start(input: AgentAssistStartInput): Promise<void> {
    const apiDomain = normalizeApiDomain(input.apiDomain);
    let sdk: typeof import("@egain/connector-client-sdk");
    try {
      sdk = await import("@egain/connector-client-sdk");
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to load @egain/connector-client-sdk package: ${reason}`,
      );
    }

    const manager = sdk.init({
      mode: "agent-assist",
      apiDomain,
      integrationId: input.integrationId,
      token: async () => {
        const token = await input.getToken();
        if (!token) {
          throw new Error("No access token found");
        }
        return token;
      },
    });
    this.manager = manager;

    try {
      const session = await manager.createSession({
        ...(input.queryParams?.conversationId
          ? { conversationId: input.queryParams.conversationId }
          : {}),
        queryParams: { ...input.queryParams },
      });
      this.session = session;
      this.wireAgentAssistSession(session, input.hooks);

      if (session.conversationId) {
        input.hooks.setConversationId(session.conversationId);
      }

      this.logger.info("Agent-assist session started", {
        aiAgentId: input.aiAgentId,
      });
    } catch (error) {
      await this.stop().catch(() => undefined);
      throw error;
    }
  }

  async stop(): Promise<void> {
    const manager = this.manager;
    this.manager = undefined;

    if (!manager) {
      return;
    }
    try {
      await manager.endSession();
    } catch (error) {
      this.logger.warn("Agent-assist endSession failed", { error });
    }
    this.session = undefined;

    try {
      manager.destroy();
    } catch (error) {
      this.logger.warn("Agent-assist destroy failed", { error });
    }
  }

  private wireAgentAssistSession(
    session: AgentAssistSession,
    hooks: AgentAssistHooks,
  ): void {
    const events = [
      "transcript",
      "context_changed",
      "platform_token",
      "error",
      "ended",
    ] as const;
    this.logger.debug("Agent-assist session listeners registered", { events });

    session.on("transcript", (utterance) => {
      this.logger.debug("Agent-assist session event: transcript", {
        sender: utterance.sender,
        eventTime: utterance.eventTime,
        contentLength: utterance.content?.length ?? 0,
        utteranceId: utterance.utteranceId,
      });
      hooks.addToTranscript({
        sender: utterance.sender,
        content: utterance.content,
        timestamp: parseTranscriptEventTime(utterance.eventTime),
      });
    });

    session.on("context_changed", (ctx) => {
      this.logger.debug("Agent-assist session event: context_changed", {
        conversationId: ctx.conversationId,
        hasCaller: Boolean(ctx.caller),
        callerFieldKeys: ctx.caller ? Object.keys(ctx.caller) : [],
        portalName: ctx.portalName,
        attributeKeys: Object.keys(ctx.attributes ?? {}),
      });
      if (ctx.conversationId) {
        hooks.setConversationId(ctx.conversationId);
      }
      // Attributes first so explicit caller name/phone/issue win if keys overlap.
      hooks.setCallerInfo({
        ...ctx.attributes,
        name: ctx.caller?.name,
        phone: ctx.caller?.phone,
        issue: ctx.caller?.issue,
      });
    });

    session.on("platform_token", (token) => {
      this.logger.debug("Agent-assist session event: platform_token", {
        platform: token.platform,
        expiresAt: token.expiresAt,
      });
      hooks.setPlatformToken(token.accessToken);
    });

    session.on("error", (err: ConnectorClientError) => {
      this.logger.warn("Agent-assist session event: error", {
        code: err.code,
        message: err.message,
      });
    });

    session.on("ended", (reason) => {
      this.logger.info("Agent-assist session event: ended", { reason });
    });
  }
}

/**
 * Adapters may send ISO instants, epoch values, or display-only times (e.g. `12:38 PM`).
 * Invalid parses are omitted so {@link AgentAssistHooks.addToTranscript} can default to now.
 */
export function parseTranscriptEventTime(eventTime?: string): Date | undefined {
  const trimmed = eventTime?.trim();
  if (!trimmed) {
    return undefined;
  }

  const direct = new Date(trimmed);
  if (!Number.isNaN(direct.getTime())) {
    return direct;
  }

  if (/^\d+$/.test(trimmed)) {
    const numeric = Number(trimmed);
    const epochMs = numeric < 1e12 ? numeric * 1000 : numeric;
    const fromEpoch = new Date(epochMs);
    if (!Number.isNaN(fromEpoch.getTime())) {
      return fromEpoch;
    }
  }

  const timeOnToday = new Date(`${new Date().toDateString()} ${trimmed}`);
  if (!Number.isNaN(timeOnToday.getTime())) {
    return timeOnToday;
  }

  return undefined;
}

function normalizeApiDomain(apiDomain: string): string {
  const trimmed = apiDomain.trim();
  if (!trimmed) {
    throw new Error("deploymentInfo.apiDomain is required for agent-assist");
  }
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
