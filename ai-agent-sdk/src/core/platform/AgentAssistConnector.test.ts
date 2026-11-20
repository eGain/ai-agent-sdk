import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  AgentAssistConnector,
  parseTranscriptEventTime,
} from "./AgentAssistConnector.js";

const connectorSdkMock = vi.hoisted(() => {
  const sessionHandlers: Record<string, (...args: unknown[]) => void> = {};
  const sessionOn = vi.fn(
    (event: string, handler: (...args: unknown[]) => void) => {
      sessionHandlers[event] = handler;
    },
  );
  const sessionOff = vi.fn();
  const sessionDestroy = vi.fn();
  const mockCreateSession = vi.fn().mockResolvedValue({
    on: sessionOn,
    off: sessionOff,
    destroy: sessionDestroy,
    conversationId: undefined,
  });
  const mockEndSession = vi.fn().mockResolvedValue(undefined);
  const mockDestroy = vi.fn();
  const mockInit = vi.fn(() => ({
    createSession: mockCreateSession,
    endSession: mockEndSession,
    destroy: mockDestroy,
  }));
  return {
    sessionHandlers,
    sessionOn,
    sessionDestroy,
    mockCreateSession,
    mockEndSession,
    mockDestroy,
    mockInit,
  };
});

vi.mock("@egain/connector-client-sdk", () => ({
  init: (...args: unknown[]) => connectorSdkMock.mockInit(...args),
}));

describe("AgentAssistConnector", () => {
  const logger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  };

  const hooks = {
    addToTranscript: vi.fn(),
    setCallerInfo: vi.fn(),
    setConversationId: vi.fn(),
    setPlatformToken: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    connectorSdkMock.mockEndSession.mockResolvedValue(undefined);
    connectorSdkMock.mockDestroy.mockImplementation(() => undefined);
    connectorSdkMock.mockCreateSession.mockResolvedValue({
      on: connectorSdkMock.sessionOn,
      off: vi.fn(),
      destroy: connectorSdkMock.sessionDestroy,
      conversationId: undefined,
    });
    Object.keys(connectorSdkMock.sessionHandlers).forEach(
      (key) => delete connectorSdkMock.sessionHandlers[key],
    );
  });

  it("does not load the SDK until start() runs", () => {
    new AgentAssistConnector(logger);
    expect(connectorSdkMock.mockInit).not.toHaveBeenCalled();
  });

  it("starts a session with normalized apiDomain and queryParams", async () => {
    const connector = new AgentAssistConnector(logger);
    const queryParams = { platform: "genesys", integrationId: "int-1" };

    await connector.start({
      apiDomain: "api.example.com",
      integrationId: "int-1",
      aiAgentId: "agent-1",
      getToken: async () => "access-token",
      queryParams,
      hooks,
    });

    expect(connectorSdkMock.mockInit).toHaveBeenCalledWith({
      mode: "agent-assist",
      apiDomain: "https://api.example.com",
      integrationId: "int-1",
      token: expect.any(Function),
    });
    expect(connectorSdkMock.mockCreateSession).toHaveBeenCalledWith({
      queryParams: { ...queryParams },
    });
    for (const event of [
      "transcript",
      "context_changed",
      "platform_token",
      "error",
      "ended",
    ] as const) {
      expect(connectorSdkMock.sessionOn).toHaveBeenCalledWith(
        event,
        expect.any(Function),
      );
    }
    expect(logger.info).toHaveBeenCalledWith("Agent-assist session started", {
      aiAgentId: "agent-1",
    });
  });

  it("cleans up with endSession and destroy when createSession rejects", async () => {
    connectorSdkMock.mockCreateSession.mockRejectedValueOnce(
      new Error("createSession failed"),
    );

    const connector = new AgentAssistConnector(logger);
    await expect(
      connector.start({
        apiDomain: "api.example.com",
        integrationId: "int-1",
        aiAgentId: "agent-1",
        getToken: async () => "access-token",
        queryParams: {},
        hooks,
      }),
    ).rejects.toThrow("createSession failed");

    expect(connectorSdkMock.mockInit).toHaveBeenCalled();
    expect(connectorSdkMock.mockCreateSession).toHaveBeenCalled();
    expect(connectorSdkMock.mockEndSession).toHaveBeenCalled();
    expect(connectorSdkMock.mockDestroy).toHaveBeenCalled();
    expect(connectorSdkMock.sessionDestroy).not.toHaveBeenCalled();
    expect(connectorSdkMock.sessionOn).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalledWith("Agent-assist session started", {
      aiAgentId: "agent-1",
    });
  });

  it("logs error and ended session events", async () => {
    const connector = new AgentAssistConnector(logger);
    await connector.start({
      apiDomain: "api.example.com",
      integrationId: "int-1",
      getToken: async () => "token",
      queryParams: {},
      hooks,
    });

    const sessionError = Object.assign(new Error("adapter failed"), {
      code: "TEST_CODE",
    });
    connectorSdkMock.sessionHandlers.error?.(sessionError);
    connectorSdkMock.sessionHandlers.ended?.("user hung up");

    expect(logger.warn).toHaveBeenCalledWith("Agent-assist session event: error", {
      code: "TEST_CODE",
      message: "adapter failed",
    });
    expect(logger.info).toHaveBeenCalledWith("Agent-assist session event: ended", {
      reason: "user hung up",
    });
  });

  describe("parseTranscriptEventTime", () => {
    it("parses ISO strings", () => {
      const parsed = parseTranscriptEventTime("2026-01-01T12:00:00.000Z");
      expect(parsed?.toISOString()).toBe("2026-01-01T12:00:00.000Z");
    });

    it("parses time-only strings on today’s date", () => {
      const parsed = parseTranscriptEventTime("12:38 PM");
      expect(parsed).toBeDefined();
      expect(Number.isNaN(parsed!.getTime())).toBe(false);
      expect(parsed!.getHours()).toBe(12);
      expect(parsed!.getMinutes()).toBe(38);
    });

    it("returns undefined for unparseable values", () => {
      expect(parseTranscriptEventTime("not-a-time")).toBeUndefined();
      expect(parseTranscriptEventTime("   ")).toBeUndefined();
    });
  });

  it("maps transcript events to addToTranscript", async () => {
    const connector = new AgentAssistConnector(logger);
    await connector.start({
      apiDomain: "api.example.com",
      integrationId: "int-1",
      getToken: async () => "token",
      queryParams: {},
      hooks,
    });

    connectorSdkMock.sessionHandlers.transcript?.({
      sender: "Customer",
      content: "Hello",
      eventTime: "2026-01-01T12:00:00.000Z",
    });

    expect(hooks.addToTranscript).toHaveBeenCalledWith({
      sender: "Customer",
      content: "Hello",
      timestamp: new Date("2026-01-01T12:00:00.000Z"),
    });
  });

  it("maps time-only eventTime to a valid timestamp", async () => {
    const connector = new AgentAssistConnector(logger);
    await connector.start({
      apiDomain: "api.example.com",
      integrationId: "int-1",
      getToken: async () => "token",
      queryParams: {},
      hooks,
    });

    connectorSdkMock.sessionHandlers.transcript?.({
      sender: "Customer",
      content: "Hello",
      eventTime: "12:38 PM",
    });

    const call = hooks.addToTranscript.mock.calls.at(-1)?.[0];
    expect(call?.timestamp).toBeDefined();
    expect(Number.isNaN(call!.timestamp!.getTime())).toBe(false);
    expect(call!.timestamp!.getHours()).toBe(12);
    expect(call!.timestamp!.getMinutes()).toBe(38);
  });

  it("sets conversationId when the session exposes one", async () => {
    connectorSdkMock.mockCreateSession.mockResolvedValueOnce({
      on: connectorSdkMock.sessionOn,
      off: vi.fn(),
      destroy: connectorSdkMock.sessionDestroy,
      conversationId: "conv-99",
    });

    const connector = new AgentAssistConnector(logger);
    await connector.start({
      apiDomain: "api.example.com",
      integrationId: "int-1",
      getToken: async () => "token",
      queryParams: {},
      hooks,
    });

    expect(hooks.setConversationId).toHaveBeenCalledWith("conv-99");
  });

  it("maps context_changed without logging caller PII and merges caller over attribute keys", async () => {
    const connector = new AgentAssistConnector(logger);
    await connector.start({
      apiDomain: "api.example.com",
      integrationId: "int-1",
      getToken: async () => "token",
      queryParams: {},
      hooks,
    });

    connectorSdkMock.sessionHandlers["context_changed"]?.({
      conversationId: "conv-1",
      portalName: "Portal A",
      attributes: {
        name: "from-attributes",
        phone: "000",
        customKey: "kept",
      },
      caller: {
        name: "from-caller",
        phone: "111",
        issue: "Billing",
      },
    });

    expect(hooks.setConversationId).toHaveBeenCalledWith("conv-1");
    expect(hooks.setCallerInfo).toHaveBeenCalledWith({
      customKey: "kept",
      name: "from-caller",
      phone: "111",
      issue: "Billing",
    });

    const contextLog = logger.debug.mock.calls.find(
      (call) => call[0] === "Agent-assist session event: context_changed",
    );
    expect(contextLog?.[1]).toEqual(
      expect.objectContaining({
        conversationId: "conv-1",
        hasCaller: true,
        callerFieldKeys: expect.arrayContaining(["name", "phone", "issue"]),
        portalName: "Portal A",
        attributeKeys: expect.arrayContaining(["name", "phone", "customKey"]),
      }),
    );
    expect(contextLog?.[1] as object).not.toHaveProperty("caller");
  });

  it("passes token from getToken on each call", async () => {
    const getToken = vi.fn().mockResolvedValue("fresh-token");
    const connector = new AgentAssistConnector(logger);

    await connector.start({
      apiDomain: "https://api.example.com",
      integrationId: "int-1",
      aiAgentId: "agent-1",
      getToken,
      queryParams: {},
      hooks,
    });

    const tokenFn = connectorSdkMock.mockInit.mock.calls[0][0]
      .token as () => Promise<string>;
    await expect(tokenFn()).resolves.toBe("fresh-token");
    expect(getToken).toHaveBeenCalled();
  });

  it("throws when getToken returns null", async () => {
    const connector = new AgentAssistConnector(logger);
    await connector.start({
      apiDomain: "https://api.example.com",
      integrationId: "int-1",
      aiAgentId: "agent-1",
      getToken: async () => null,
      queryParams: {},
      hooks,
    });

    const tokenFn = connectorSdkMock.mockInit.mock.calls[0][0]
      .token as () => Promise<string>;
    await expect(tokenFn()).rejects.toThrow("No access token found");
  });

  it("throws before init when apiDomain is missing", async () => {
    const connector = new AgentAssistConnector(logger);
    await expect(
      connector.start({
        apiDomain: "   ",
        integrationId: "int-1",
        aiAgentId: "agent-1",
        getToken: async () => "token",
        queryParams: {},
        hooks,
      }),
    ).rejects.toThrow("deploymentInfo.apiDomain is required for agent-assist");
    expect(connectorSdkMock.mockInit).not.toHaveBeenCalled();
  });

  it("stop calls endSession then manager destroy (does not call session.destroy)", async () => {
    const connector = new AgentAssistConnector(logger);
    await connector.start({
      apiDomain: "api.example.com",
      integrationId: "int-1",
      aiAgentId: "agent-1",
      getToken: async () => "token",
      queryParams: {},
      hooks,
    });

    await connector.stop();

    expect(connectorSdkMock.sessionDestroy).not.toHaveBeenCalled();
    expect(connectorSdkMock.mockEndSession).toHaveBeenCalled();
    expect(connectorSdkMock.mockDestroy).toHaveBeenCalled();
  });

  it("stop logs warnings when teardown fails", async () => {
    connectorSdkMock.mockEndSession.mockRejectedValueOnce(
      new Error("end failed"),
    );
    connectorSdkMock.mockDestroy.mockImplementationOnce(() => {
      throw new Error("destroy failed");
    });

    const connector = new AgentAssistConnector(logger);
    await connector.start({
      apiDomain: "api.example.com",
      integrationId: "int-1",
      aiAgentId: "agent-1",
      getToken: async () => "token",
      queryParams: {},
      hooks,
    });

    await connector.stop();

    expect(logger.warn).toHaveBeenCalledWith("Agent-assist endSession failed", {
      error: expect.any(Error),
    });
    expect(logger.warn).toHaveBeenCalledWith("Agent-assist destroy failed", {
      error: expect.any(Error),
    });
  });
});
