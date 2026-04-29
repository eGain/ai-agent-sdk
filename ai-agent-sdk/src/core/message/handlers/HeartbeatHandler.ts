import { BaseMessageHandler } from '../BaseMessageHandler.js';
import { Message } from '../Message.js';
import { MessageHandlerResult } from '../types.js';
import { PERSONA, ROLE } from '../types.js';

/**
 * Handler for heartbeat messages
 * Processes system heartbeat messages indicating the agent is processing/typing
 */
export class HeartbeatHandler extends BaseMessageHandler {
  canHandle(message: Message): boolean {
    return (
      message.persona === PERSONA.SYSTEM &&
      message.role === ROLE.HEARTBEAT
    );
  }

  handle(message: Message): MessageHandlerResult {
    const sessionId = message.sessionId;
    const agentId = message.agentId;

    // Build from object - system/agent is the sender
    const from = {
      name: message.from || 'AI Agent',
      isAi: true,
    };

    // Build to object - customer is the recipient
    const to = {
      name: message.to || 'Customer',
      isAi: false,
    };

    // Build message object with persona, role, content, and raw data
    const messageObj = {
      persona: message.persona,
      role: message.role,
      content: message.content,
      raw: message.messageData || {},
    };

    // Build result in the required format
    const result: MessageHandlerResult = {
      type: 'heartbeat_processed',
      messageId: message.messageId,
      timestamp: message.timestamp || Date.now(),
      sessionId: sessionId,
      agentId: agentId,
      from: from,
      to: to,
      message: messageObj,
    };

    return result;
  }
}
