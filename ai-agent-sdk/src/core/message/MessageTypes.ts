import { PERSONA, ROLE, MessageData } from './types.js';

/**
 * Base interface for message parameters with common optional fields
 */
interface BaseMessageParams {
  messageId?: string;
  from?: string;
  to?: string;
}

/**
 * Parameters for creating a context message
 */
export interface ContextMessageParams extends BaseMessageParams {
  /**
   * The context content to send
   */
  context: object;
}

/**
 * Parameters for creating an escalation event message
 */
export interface EscalationMessageParams extends BaseMessageParams {
  /**
   * The escalation event data
   */
  escalationEvent: any;
}

/**
 * Parameters for creating a feedback message
 */
export interface FeedbackMessageParams extends BaseMessageParams {
  /**
   * The feedback rating - "up" for positive, "down" for negative
   */
  rating: 'up' | 'down';
  /**
   * ID of the message being rated
   */
  answerMessageId: string;
}

/**
 * Parameters for creating a normal customer/agent message
 */
export interface AgentMessageParams extends BaseMessageParams {
  /**
   * Message content
   */
  content: string;
  /**
   * Persona (defaults to "customer")
   */
  persona?: string;
  /**
   * Role (defaults to "human")
   */
  role?: string;
}

/**
 * Parameters for creating a graceful disconnect message
 */
export interface GracefulDisconnectParams extends BaseMessageParams {
  // No additional required fields
}

/**
 * Message object structure returned by helper functions
 * Compatible with AiAgent.send()
 */
export interface MessageObject {
  persona: string;
  role: string;
  content?: string;
  messageData?: MessageData;
  messageId?: string;
  from?: string;
  to?: string;
}

/**
 * Create a context message object
 * @param params - Context message parameters
 * @returns Message object compatible with AiAgent.send()
 */
export function createContextMessage(params: ContextMessageParams): MessageObject {
  return {
    persona: PERSONA.SYSTEM,
    role: ROLE.CONTEXT,
    content: '',
    messageData: {
      context: params.context,
    },
    ...(params.messageId && { messageId: params.messageId }),
    ...(params.from && { from: params.from }),
    ...(params.to && { to: params.to }),
  };
}

/**
 * Create an escalation event message object
 * @param params - Escalation message parameters
 * @returns Message object compatible with AiAgent.send()
 */
export function createEscalationMessage(params: EscalationMessageParams): MessageObject {
  return {
    persona: PERSONA.SYSTEM,
    role: ROLE.ESCALATION,
    content: '',
    messageData: {
      escalationEvent: params.escalationEvent,
    },
    ...(params.messageId && { messageId: params.messageId }),
    ...(params.from && { from: params.from }),
    ...(params.to && { to: params.to }),
  };
}

/**
 * Create a feedback message object
 * @param params - Feedback message parameters
 * @returns Message object compatible with AiAgent.send()
 */
export function createFeedbackMessage(params: FeedbackMessageParams): MessageObject {
  return {
    persona: PERSONA.SYSTEM,
    role: ROLE.FEEDBACK,
    messageData: {
      feedback: {
        rating: params.rating,
        answerMessageId: params.answerMessageId,
      },
    },
    ...(params.messageId && { messageId: params.messageId }),
    ...(params.from && { from: params.from }),
    ...(params.to && { to: params.to }),
  };
}

/**
 * Create a normal customer/agent message object
 * @param params - Agent message parameters
 * @returns Message object compatible with AiAgent.send()
 */
export function createAgentMessage(params: AgentMessageParams): MessageObject {
  return {
    persona: params.persona || PERSONA.CUSTOMER,
    role: params.role || ROLE.HUMAN,
    content: params.content,
    ...(params.messageId && { messageId: params.messageId }),
    ...(params.from && { from: params.from }),
    ...(params.to && { to: params.to }),
  };
}

/**
 * Create a graceful disconnect message object
 * @param params - Optional graceful disconnect parameters
 * @returns Message object compatible with AiAgent.send()
 */
export function createGracefulDisconnectMessage(params?: GracefulDisconnectParams): MessageObject {
  return {
    persona: PERSONA.SYSTEM,
    role: ROLE.GRACEFUL_DISCONNECT,
    ...(params?.messageId && { messageId: params.messageId }),
    ...(params?.from && { from: params.from }),
    ...(params?.to && { to: params.to }),
  };
}

/**
 * Parameters for creating a token message
 */
export interface TokenMessageParams extends BaseMessageParams {
  /**
   * The authentication token to send
   */
  token: string;
}

/**
 * Create a token message object for authentication
 * Used to send authentication token to the agent after connection is established
 * @param params - Token message parameters
 * @returns Message object compatible with AiAgent.send()
 */
export function createTokenMessage(params: TokenMessageParams): MessageObject {
  return {
    persona: PERSONA.METADATA,
    role: ROLE.TOKEN,
    content: '',
    messageData: {
      token: params.token,
    },
    ...(params.messageId && { messageId: params.messageId }),
    ...(params.from && { from: params.from }),
    ...(params.to && { to: params.to }),
  };
}
