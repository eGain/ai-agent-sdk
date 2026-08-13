import { BaseMessageHandler } from '../BaseMessageHandler.js';
import { Message } from '../Message.js';
import { MessageHandlerResult, PERSONA, ROLE } from '../types.js';

/**
 * Handles non-terminal system messages describing rejected context attributes.
 */
export class ContextValidationHandler extends BaseMessageHandler {
  canHandle(message: Message): boolean {
    return message.persona === PERSONA.SYSTEM && message.role === ROLE.CONTEXT_VALIDATION;
  }

  handle(message: Message): MessageHandlerResult {
    return {
      type: 'context_validation',
      messageId: message.messageId,
      timestamp: message.timestamp || Date.now(),
      sessionId: message.sessionId,
      agentId: message.agentId,
      from: {
        name: message.from || 'System',
        isAi: false,
      },
      to: {
        name: message.to || 'Client',
        isAi: false,
      },
      message: {
        persona: message.persona,
        role: message.role,
        content: message.content,
        raw: message.messageData || {},
      },
      contextValidationErrors: message.messageData?.contextValidationErrors || [],
    };
  }
}
