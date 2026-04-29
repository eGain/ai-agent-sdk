import { BaseMessageHandler } from './BaseMessageHandler.js';
import { Message } from './Message.js';
import { MessageHandlerResult } from './types.js';
import { AgentMessageHandler } from './handlers/AgentMessageHandler.js';
import { ChatHistoryHandler } from './handlers/ChatHistoryHandler.js';
import { TokenRefreshHandler } from './handlers/TokenRefreshHandler.js';
import { HeartbeatHandler } from './handlers/HeartbeatHandler.js';
import { ErrorMessageHandler } from './handlers/ErrorMessageHandler.js';
import { Logger } from '../logging/Logger.js';
import { globalLogger } from '../logging/globalLogger.js';

/**
 * MessageProcessor class that routes messages to appropriate handlers
 * Uses a handler registry pattern where handlers are checked in priority order
 */
export class MessageProcessor {
  private handlers: BaseMessageHandler[] = [];
  private logger: Logger;

  /**
   * Create a new MessageProcessor instance
   * Registers default handlers
   */
  constructor(logger?: Logger) {
    this.logger = logger ?? globalLogger;
    this.registerDefaultHandlers();
  }

  /**
   * Register default handlers in priority order
   * More specific handlers should come first (lower index = higher priority)
   * The first handler that can process a message wins
   */
  private registerDefaultHandlers(): void {
    // Order matters - more specific handlers should come first
    // TokenRefreshHandler has highest priority as it handles critical auth issues
    // ErrorMessageHandler should come before AgentMessageHandler to catch errors early
    this.handlers = [
      new TokenRefreshHandler(),
      new ErrorMessageHandler(),
      new ChatHistoryHandler(),
      new AgentMessageHandler(),
      new HeartbeatHandler(),
    ];
  }

  /**
   * Process an incoming message
   * Routes the message to the first handler that can process it
   * @param message - The incoming message
   * @returns Processing result or null if no handler matched
   */
  async process(message: Message): Promise<MessageHandlerResult | null> {
    this.logger.debug('Processing message', { 
      messageId: message.messageId, 
      persona: message.persona, 
      role: message.role 
    });

    for (const handler of this.handlers) {
      if (handler.canHandle(message)) {
        this.logger.debug('Handler matched', { 
          messageId: message.messageId,
          handlerName: handler.constructor.name 
        });
        const result = handler.handle(message);
        const resolvedResult = result instanceof Promise ? await result : result;
        if (resolvedResult) {
          this.logger.debug('Message processed successfully', { 
            messageId: message.messageId,
            resultType: resolvedResult.type 
          });
        }
        return resolvedResult;
      }
    }

    // No handler matched
    this.logger.warn('No handler matched message', { 
      messageId: message.messageId, 
      persona: message.persona, 
      role: message.role 
    });
    return null;
  }

  /**
   * Add a custom handler
   * @param handler - Handler instance
   * @param priority - Position to insert (lower = higher priority, default: end of list)
   */
  addHandler(handler: BaseMessageHandler, priority?: number): void {
    if (!(handler instanceof BaseMessageHandler)) {
      throw new Error('Handler must extend BaseMessageHandler');
    }

    if (priority !== undefined) {
      this.handlers.splice(priority, 0, handler);
      this.logger.debug('Handler added at priority', { 
        handlerName: handler.constructor.name, 
        priority 
      });
    } else {
      this.handlers.push(handler);
      this.logger.debug('Handler added', { handlerName: handler.constructor.name });
    }
  }

  /**
   * Remove a handler
   * @param handler - Handler instance to remove
   */
  removeHandler(handler: BaseMessageHandler): void {
    const index = this.handlers.indexOf(handler);
    if (index !== -1) {
      this.handlers.splice(index, 1);
      this.logger.debug('Handler removed', { handlerName: handler.constructor.name });
    }
  }

  /**
   * Get all registered handlers
   * @returns Array of registered handlers
   */
  getHandlers(): BaseMessageHandler[] {
    return [...this.handlers];
  }

  /**
   * Clear all handlers and re-register defaults
   */
  reset(): void {
    this.handlers = [];
    this.registerDefaultHandlers();
  }
}

