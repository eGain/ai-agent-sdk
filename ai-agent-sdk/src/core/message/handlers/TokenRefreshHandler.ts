import { BaseMessageHandler } from '../BaseMessageHandler.js';
import { Message } from '../Message.js';
import { MessageHandlerResult } from '../types.js';
import { PERSONA, ROLE, ERROR_CODES } from '../types.js';

/**
 * Options for TokenRefreshHandler
 */
export interface TokenRefreshHandlerOptions {
  /**
   * Function to get a new access token
   * @returns Promise resolving to the access token string
   */
  getAccessToken?: () => Promise<string>;

  /**
   * Function to send a message to the connection
   * @param payload - The message payload to send
   */
  sendToConnection?: (payload: any) => Promise<void> | void;
}

/**
 * Handler for stale or expired token messages
 * Processes metadata messages indicating token refresh is required
 */
export class TokenRefreshHandler extends BaseMessageHandler {
  private getAccessToken?: () => Promise<string>;
  private sendToConnection?: (payload: any) => Promise<void> | void;

  constructor(options?: TokenRefreshHandlerOptions) {
    super();
    this.getAccessToken = options?.getAccessToken;
    this.sendToConnection = options?.sendToConnection;
  }

  canHandle(message: Message): boolean {
    if (message.persona !== PERSONA.METADATA) {
      return false;
    }

    const isStaleToken =
      message.role === ROLE.STALE_TOKEN &&
      message.messageData?.error_code === ERROR_CODES.STALE_TOKEN;

    const isExpiredToken =
      message.role === ROLE.EXPIRED_TOKEN &&
      (message.messageData?.error_code?.indexOf(ERROR_CODES.UNAUTHORIZED_PREFIX) === 0 ||
        message.messageData?.error_code?.indexOf(ERROR_CODES.FORBIDDEN_PREFIX) === 0);

    return isStaleToken || isExpiredToken;
  }

  async handle(message: Message): Promise<MessageHandlerResult> {
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
      errorCode,
    };

    // Build result in the required format
    const result: MessageHandlerResult = {
      type: 'token_refresh_required',
      messageId: message.messageId,
      timestamp: message.timestamp || Date.now(),
      sessionId: sessionId,
      agentId: agentId,
      from: from,
      to: to,
      message: messageObj,
      role: message.role,
      errorCode,
    };

    // If callbacks are provided, perform the token refresh automatically
    if (this.getAccessToken && this.sendToConnection) {
      try {
        const authToken = await this.getAccessToken();
        
        const payload = {
          persona: PERSONA.METADATA,
          role: ROLE.TOKEN,
          messageData: {
            token: authToken,
          },
        };
        
        await this.sendToConnection(payload);
        
        // Update result to indicate refresh was successful
        result.type = 'token_refreshed';
        (result as any).tokenRefreshed = true;
      } catch (error) {
        // Update result to indicate refresh failed
        result.type = 'token_refresh_failed';
        (result as any).tokenRefreshError = error instanceof Error ? error.message : String(error);
      }
    }

    return result;
  }
}
