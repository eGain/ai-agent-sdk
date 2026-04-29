import { BaseMessageHandler } from '../BaseMessageHandler.js';
import { Message } from '../Message.js';
import { MessageHandlerResult } from '../types.js';
import { PERSONA, ROLE } from '../types.js';

/**
 * Handler for agent messages (main chat responses)
 * Processes agent messages and extracts follow-up options, escalation data, sources, and reasoning
 */
export class AgentMessageHandler extends BaseMessageHandler {
  canHandle(message: Message): boolean {
    return message.persona === PERSONA.AGENT;
  }

  handle(message: Message): MessageHandlerResult {
    // Extract sessionId and agentId from messageData if available
    const sessionId = message.sessionId;
    const agentId = message.agentId;

    // Build from object - agent is the sender
    const from = {
      name: message.from || 'AI Agent',
      isAi: true,
    };

    // Build to object - customer is the recipient
    const to = {
      name: message.to || 'Customer',
      isAi: false,
    };

    // Process escalation scenarios
    const escalationResult = this.processEscalation(message);

    // Check if there are follow-up options
    const hasFollowUpOptions = this.hasFollowUpOptions(message);

    // Build message object with persona, role, content, raw data, and additional fields
    const messageObj = {
      persona: message.persona,
      role: message.role,
      content: message.content,
      raw: message.messageData || {},
      ...(escalationResult.escalationType && { escalationType: escalationResult.escalationType }),
      ...(escalationResult.escalationData && { escalationData: escalationResult.escalationData }),
      ...(message.messageData?.sources && { sources: message.messageData.sources }),
      ...(message.messageData?.reasoning && { reasoning: message.messageData.reasoning }),
      ...(escalationResult.isEscalation !== undefined && { showReasoning: escalationResult.isEscalation }),
      ...(message.role === ROLE.CUSTOMER_SUPPORT && { showFeedback: true }),
      ...(hasFollowUpOptions && { showOptions: true }),
    };

    // Build result in the required format
    const result: MessageHandlerResult = {
      type: 'agent_message',
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

  /**
   * Checks if message has follow-up question options
   * Only processes messages with role "follow up question agent"
   */
  private hasFollowUpOptions(message: Message): boolean {
    if (message.role !== ROLE.FOLLOW_UP_QUESTION) {
      return false;
    }

    const options = message.messageData?.options;
    return !!(options && Array.isArray(options) && options.length > 0);
  }

  /**
   * Processes escalation data from an agent message
   * Handles both live escalations (transfer to human agent) and alternate engagement options
   */
  private processEscalation(message: Message): {
    isEscalation: boolean;
    escalationType: string | null;
    escalationData?: any;
  } {
    const isEscalation = !!message.messageData?.escalation;
    const escalationData = message.messageData?.escalationData;
    const result = {
      isEscalation,
      escalationType: null as string | null,
      escalationData: undefined as any,
    };

    if (!isEscalation || !escalationData) {
      return result;
    }

    // Check for live escalation
    if (escalationData.live) {
      result.escalationType = 'live';
      result.escalationData = escalationData;
      return result;
    }

    // Build alternate engagement options
    const escalationOptions = this.buildEscalationOptions(escalationData);
    if (escalationOptions.length > 0) {
      result.escalationType = 'alternate';
      result.escalationData = {
        ...escalationData,
        options: escalationOptions,
      };
    }

    return result;
  }

  /**
   * Builds an array of alternate engagement options based on escalation configuration
   */
  private buildEscalationOptions(escalationData: any): Array<{
    label: string;
    type: string;
    value?: string;
    icon: string;
  }> {
    const options: Array<{
      label: string;
      type: string;
      value?: string;
      icon: string;
    }> = [];

    if (escalationData.phone) {
      options.push({
        label: 'EG_CALL',
        type: 'phone',
        value: escalationData.phoneNumber,
        icon: 'icon_phone_call_svg',
      });
    }

    if (escalationData.sms) {
      options.push({
        label: 'EG_ALT_CONTACT_SMS',
        type: 'sms',
        value: escalationData.smsNumber,
        icon: 'icon_messaging',
      });
    }

    if (escalationData.email) {
      options.push({
        label: 'EG_EMAIL',
        type: 'email',
        icon: 'icon_email_svg',
      });
    }

    return options;
  }
}

