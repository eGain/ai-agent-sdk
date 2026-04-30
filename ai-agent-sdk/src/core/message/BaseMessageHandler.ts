/**
 * # Custom Message Handlers
 * 
 * Message handlers process incoming messages from the AI Agent server.
 * You can create custom handlers to implement specialized message processing,
 * custom business logic, or integration with other systems.
 * 
 * ## Overview
 * 
 * The SDK uses a chain of message handlers to process incoming messages.
 * Each handler can:
 * - Decide if it can handle a specific message type
 * - Process the message and return a result
 * - Pass the message to the next handler in the chain
 * 
 * ## Built-in Handlers
 * 
 * The SDK includes these handlers by default:
 * - `AgentMessageHandler` - Processes agent responses
 * - `HeartbeatHandler` - Handles typing indicators
 * - `ErrorMessageHandler` - Handles error messages
 * - `TokenRefreshHandler` - Handles token refresh requests
 * - `ChatHistoryHandler` - Processes chat history messages
 * 
 * ## Creating a Custom Handler
 * 
 * Extend `BaseMessageHandler` to create your own:
 * 
 * ```typescript
 * import { BaseMessageHandler, Message, MessageHandlerResult } from "@eGain/ai-agent-sdk";
 * 
 * class CustomHandler extends BaseMessageHandler {
 *   canHandle(message: Message): boolean {
 *     // Return true if this handler should process the message
 *     return message.role === 'custom_type';
 *   }
 * 
 *   handle(message: Message): MessageHandlerResult {
 *     // Process the message
 *     console.log('Custom message:', message.content);
 *     
 *     return {
 *       type: 'custom_processed',
 *       message,
 *       timestamp: Date.now()
 *     };
 *   }
 * }
 * ```
 * 
 * ## Registering Custom Handlers
 * 
 * Add your handler to the message processor:
 * 
 * ```typescript
 * const agent = new AiAgent({ ... });
 * await agent.initialize();
 * 
 * // Get the message processor
 * const processor = agent.getMessageProcessor();
 * 
 * // Add custom handler with priority (lower = higher priority)
 * processor.addHandler(new CustomHandler(), 5);
 * ```
 * 
 * ## Handler Priority
 * 
 * Handlers are processed in priority order (lowest number first).
 * Built-in handlers use priorities 0-100. Use higher numbers for
 * handlers that should run after built-in processing.
 * 
 * ```typescript
 * processor.addHandler(new HighPriorityHandler(), 1);   // Runs first
 * processor.addHandler(new LowPriorityHandler(), 200);  // Runs last
 * ```
 * 
 * ## Use Cases
 * 
 * - **Analytics**: Track specific message types
 * - **Transformations**: Modify messages before display
 * - **Integrations**: Forward messages to external systems
 * - **Custom UI**: Trigger specific UI behaviors
 * 
 * @module CustomHandlers
 * @category Advanced
 */

import { Message } from './Message.js';
import { MessageHandlerResult } from './types.js';

/**
 * Base class for message handlers.
 * 
 * All custom message handlers must extend this class and implement
 * the `canHandle` and `handle` methods.
 * 
 * @example Simple handler
 * ```typescript
 * class LoggingHandler extends BaseMessageHandler {
 *   canHandle(message: Message): boolean {
 *     return true;  // Handle all messages
 *   }
 * 
 *   handle(message: Message): MessageHandlerResult {
 *     console.log(`[${message.persona}] ${message.content}`);
 *     return {
 *       type: 'logged',
 *       message,
 *       timestamp: Date.now()
 *     };
 *   }
 * }
 * ```
 * 
 * @example Async handler
 * ```typescript
 * class AsyncHandler extends BaseMessageHandler {
 *   canHandle(message: Message): boolean {
 *     return message.role === 'needs_processing';
 *   }
 * 
 *   async handle(message: Message): Promise<MessageHandlerResult> {
 *     const result = await processExternally(message);
 *     return {
 *       type: 'processed',
 *       message,
 *       data: result,
 *       timestamp: Date.now()
 *     };
 *   }
 * }
 * ```
 * 
 * @example Conditional handler
 * ```typescript
 * class SentimentHandler extends BaseMessageHandler {
 *   canHandle(message: Message): boolean {
 *     // Only handle agent messages with content
 *     return message.persona === 'agent' && !!message.content;
 *   }
 * 
 *   handle(message: Message): MessageHandlerResult {
 *     const sentiment = analyzeSentiment(message.content);
 *     return {
 *       type: 'sentiment_analyzed',
 *       message,
 *       sentiment,
 *       timestamp: Date.now()
 *     };
 *   }
 * }
 * ```
 * 
 * @category Advanced
 * @group CustomHandlers
 */
export abstract class BaseMessageHandler {
  /**
   * Check if this handler can process the given message.
   * 
   * This method is called for each incoming message. Return `true`
   * if this handler should process the message, `false` otherwise.
   * 
   * @param message - The incoming message to check
   * @returns `true` if this handler can process the message
   * 
   * @example
   * ```typescript
   * canHandle(message: Message): boolean {
   *   // Handle only customer messages
   *   return message.persona === 'customer';
   * }
   * ```
   */
  abstract canHandle(message: Message): boolean;

  /**
   * Process the message.
   * 
   * Called when `canHandle` returns `true`. Implement your message
   * processing logic here. Can be synchronous or asynchronous.
   * 
   * @param message - The message to process
   * @returns Handler result or Promise resolving to result
   * 
   * @example Synchronous
   * ```typescript
   * handle(message: Message): MessageHandlerResult {
   *   return {
   *     type: 'processed',
   *     message,
   *     timestamp: Date.now()
   *   };
   * }
   * ```
   * 
   * @example Asynchronous
   * ```typescript
   * async handle(message: Message): Promise<MessageHandlerResult> {
   *   await saveToDatabase(message);
   *   return {
   *     type: 'saved',
   *     message,
   *     timestamp: Date.now()
   *   };
   * }
   * ```
   */
  abstract handle(message: Message): Promise<MessageHandlerResult> | MessageHandlerResult;
}
