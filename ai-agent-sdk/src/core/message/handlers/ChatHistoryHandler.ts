import { BaseMessageHandler } from '../BaseMessageHandler.js';
import { Message } from '../Message.js';
import { MessageHandlerResult } from '../types.js';
import { PERSONA, ROLE } from '../types.js';

/**
 * Handler for chat history messages
 * Processes system messages containing chat history data
 */
export class ChatHistoryHandler extends BaseMessageHandler {
  canHandle(message: Message): boolean {
    return (
      message.persona === PERSONA.SYSTEM && 
      message.role === ROLE.CHAT_HISTORY
    );
  }

  handle(message: Message): MessageHandlerResult {
    const sessionId = message.sessionId;
    const agentId = message.agentId;
    const chatHistory = message.messageData?.chat_history;

    // Build from object - system is the sender
    const from = {
      name: message.from || 'System',
      isAi: false,
    };

    // Build to object - customer is the recipient
    const to = {
      name: message.to || 'Customer',
      isAi: false,
    };

    // Build message object with persona, role, content, raw data, and chat history
    const messageObj = {
      persona: message.persona,
      role: message.role,
      content: message.content,
      raw: message.messageData || {},
      ...(chatHistory && { chatHistory }),
    };

    // Build result in the required format
    const result: MessageHandlerResult = {
      type: 'chat_history_processed',
      messageId: message.messageId,
      timestamp: message.timestamp || Date.now(),
      sessionId: sessionId,
      agentId: agentId,
      from: from,
      to: to,
      message: messageObj,
      hasHistory: !!chatHistory,
    };

    return result;
  }
}
