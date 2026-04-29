/**
 * Message type constants
 */
export const PERSONA = Object.freeze({
  METADATA: "metadata",
  SYSTEM: "system",
  AGENT: "agent",
  CUSTOMER: "customer",
} as const);

export const ROLE = Object.freeze({
  STALE_TOKEN: "stale_token",
  EXPIRED_TOKEN: "expired_token",
  TOKEN: "token",
  CHAT_HISTORY: "chat history",
  ERROR: "error",
  HEARTBEAT: "heartbeat",
  FOLLOW_UP_QUESTION: "follow up question agent",
  CUSTOMER_SUPPORT: "customer support agent",
  CONTEXT: "context",
  GRACEFUL_DISCONNECT: "graceful disconnect",
  ESCALATION: "escalation",
  FEEDBACK: "feedback",
  HUMAN: "human",
} as const);

export const ERROR_CODES = Object.freeze({
  STALE_TOKEN: "401-012",
  UNAUTHORIZED_PREFIX: "401",
  FORBIDDEN_PREFIX: "403",
} as const);

/**
 * Type definitions for persona values
 */
export type Persona = typeof PERSONA[keyof typeof PERSONA];

/**
 * Type definitions for role values
 */
export type Role = typeof ROLE[keyof typeof ROLE];

/**
 * Message data structure
 */
export interface MessageData {
  [key: string]: any;
  error_code?: string;
  chat_history?: any[];
  options?: string[];
  escalation?: boolean;
  escalationData?: {
    live?: boolean;
    phone?: boolean;
    phoneNumber?: string;
    sms?: boolean;
  smsNumber?: string;
    email?: boolean;
  };
  sources?: any[];
  reasoning?: string;
  context?: object;
  feedback?: {
    rating: any;
    answerMessageId: string;
  };
  escalationEvent?: any;
  token?: string;
  workflowType?: "preChatWorkflow" | "escalationWorkflow" | "agentWorkflow" | null;
  workflowNodeType?: string | null;
  inputType?: string | null;
}

/**
 * Result returned by message handlers
 */
export interface MessageHandlerResult {
  type: string;
  messageId?: string | number;
  timestamp: number;
  sessionId?: string | number;
  agentId?: string | number;
  from: {
    name: string;
    isAi: boolean;
  };
  to: {
    name: string;
    isAi: boolean;
  };
  message: {
    persona: string;
    role: string;
    content?: string;
    raw: any;
    escalationType?: string | null;
    escalationData?: any;
    sources?: any[];
    reasoning?: string;
    showReasoning?: boolean;
    showFeedback?: boolean;
    showOptions?: boolean;
  };
  // Optional fields for agent messages
  isEscalation?: boolean;
  // Allow additional fields for extensibility
  [key: string]: any;
}
export interface SessionContext {
  agentId: string;
  sessionId: string;
  customerName: string;
  agentName: string;
}
