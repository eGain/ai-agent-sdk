import { BaseMessageHandler } from '../BaseMessageHandler.js';
import { Message } from '../Message.js';
import { MessageHandlerResult } from '../types.js';
import { PERSONA, ROLE } from '../types.js';

/**
 * Handler for error messages
 * Processes metadata error messages indicating an error occurred
 */
export class ErrorMessageHandler extends BaseMessageHandler {
  canHandle(message: Message): boolean {
    return (
      message.persona === PERSONA.METADATA &&
      message.role === ROLE.ERROR
    );
  }

  handle(message: Message): MessageHandlerResult {
    const sessionId = message.sessionId;
    const agentId = message.agentId;
    const errorCode = message.messageData?.error_code;

    // Build from object - metadata/system is the sender
    const from = {
      name: message.from || 'System',
      isAi: false,
    };

    // Build to object - customer/client is the recipient
    const to = {
      name: message.to || 'Client',
      isAi: false,
    };

    // Build message object with persona, role, content, and raw data
    const messageObj = {
      persona: message.persona,
      role: message.role,
      content: message.content,
      raw: message.messageData || {},
      ...(errorCode && { errorCode }),
    };

    // Build result in the required format
    const result: MessageHandlerResult = {
      type: 'error_message',
      messageId: message.messageId,
      timestamp: message.timestamp || Date.now(),
      sessionId: sessionId,
      agentId: agentId,
      from: from,
      to: to,
      message: messageObj,
      errorCode,
    };

    return result;
  }
}
