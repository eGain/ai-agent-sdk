/**
 * # Message Queue
 * 
 * The Message Queue feature provides automatic message buffering when the 
 * connection is unavailable. Messages are queued locally and automatically 
 * sent when the connection is restored.
 * 
 * ## Overview
 * 
 * When you call `agent.send()` while disconnected:
 * 1. The message is added to an internal queue
 * 2. The SDK continues without throwing an error
 * 3. When connection is restored, queued messages are sent automatically
 * 4. A `queueFlushed` event is emitted with the count of sent messages
 * 
 * ## Quick Start
 * 
 * Message queuing works automatically:
 * 
 * ```typescript
 * // This works even if disconnected
 * await agent.send("Hello!");  // Queued if offline
 * 
 * // Check queue status
 * const queueSize = agent.getQueueSize();
 * console.log(`${queueSize} messages waiting`);
 * 
 * // Clear the queue if needed
 * agent.clearQueue();
 * ```
 * 
 * ## Queue Events
 * 
 * Listen for queue-related events:
 * 
 * ```typescript
 * agent.on('queueFlushed', (event) => {
 *   console.log(`Sent ${event.payload.count} queued messages`);
 * });
 * ```
 * 
 * ## Configuration
 * 
 * Configure queue behavior when creating the agent:
 * 
 * ```typescript
 * const agent = new AiAgent({
 *   id: "agent-id",
 *   endpoint: "https://your-endpoint.com",
 *   maxQueueSize: 1000  // Maximum messages to queue (default: 1000)
 * });
 * ```
 * 
 * ## Retry Behavior
 * 
 * The queue includes automatic retry logic:
 * - Each message is retried up to 3 times
 * - Failed messages are removed after max attempts
 * - An error event is emitted for failed messages
 * 
 * ## Use Cases
 * 
 * - **Offline Support**: Continue sending while temporarily disconnected
 * - **Network Resilience**: Handle flaky network connections
 * - **User Experience**: No need to handle connection state in UI
 * 
 * @module MessageQueue
 * @category Features
 */

import { MessageError } from '../errors/SDKError.js';

/**
 * Queued message with metadata for retry handling.
 * 
 * Each queued message includes a unique ID for idempotency,
 * timestamp for ordering, and attempt counter for retry logic.
 * 
 * @example
 * ```typescript
 * const queuedMessage: QueuedMessage = {
 *   id: "msg-123",
 *   data: { persona: "customer", content: "Hello" },
 *   timestamp: Date.now(),
 *   attempts: 0
 * };
 * ```
 * 
 * @category Features
 * @group MessageQueue
 */
export interface QueuedMessage {
  /** Unique message identifier for idempotency */
  id: string;
  /** The message payload to be sent */
  data: any;
  /** Timestamp when the message was queued */
  timestamp: number;
  /** Number of send attempts made */
  attempts: number;
}

/**
 * FIFO message queue with idempotency and retry support.
 * 
 * The MessageQueue class manages outgoing messages when the connection
 * is unavailable. Messages are stored in order and sent when the
 * connection is restored.
 * 
 * @example Basic usage
 * ```typescript
 * const queue = new MessageQueue(1000, 3);  // max 1000 messages, 3 retries
 * 
 * // Add a message
 * const id = queue.enqueue({ text: "Hello" });
 * 
 * // Check queue status
 * console.log(`Queue size: ${queue.size()}`);
 * console.log(`Is empty: ${queue.isEmpty()}`);
 * 
 * // Process messages
 * while (!queue.isEmpty()) {
 *   const message = queue.peek();
 *   try {
 *     await sendToServer(message.data);
 *     queue.dequeue();  // Remove on success
 *   } catch (error) {
 *     const shouldRetry = queue.markAttempted(message.id);
 *     if (!shouldRetry) {
 *       queue.remove(message.id);  // Max retries exceeded
 *     }
 *   }
 * }
 * ```
 * 
 * @example With custom ID
 * ```typescript
 * // Use custom ID for idempotency
 * const messageId = queue.enqueue(data, "custom-id-123");
 * 
 * // Later, you can remove by ID
 * queue.remove("custom-id-123");
 * ```
 * 
 * @category Features
 * @group MessageQueue
 */
export class MessageQueue {
  private queue: QueuedMessage[] = [];
  private maxSize: number;
  private maxAttempts: number;

  /**
   * Create a new MessageQueue
   * @param maxSize - Maximum number of messages to queue (default: 1000)
   * @param maxAttempts - Maximum send attempts per message (default: 3)
   */
  constructor(maxSize: number = 1000, maxAttempts: number = 3) {
    this.maxSize = maxSize;
    this.maxAttempts = maxAttempts;
  }

  /**
   * Add a message to the queue.
   * 
   * Messages are added to the end of the queue (FIFO order).
   * If the queue is full, a MessageError is thrown.
   * 
   * @param data - The message data to queue
   * @param id - Optional custom message ID (auto-generated if not provided)
   * @returns The message ID
   * @throws MessageError if queue is full
   * 
   * @example
   * ```typescript
   * // Auto-generated ID
   * const id1 = queue.enqueue({ text: "Hello" });
   * 
   * // Custom ID for tracking
   * const id2 = queue.enqueue({ text: "World" }, "my-message-id");
   * ```
   */
  enqueue(data: any, id?: string): string {
    if (this.queue.length >= this.maxSize) {
      throw new MessageError(`Queue is full (max size: ${this.maxSize})`);
    }

    const messageId = id || this.generateId();
    const message: QueuedMessage = {
      id: messageId,
      data,
      timestamp: Date.now(),
      attempts: 0,
    };

    this.queue.push(message);
    return messageId;
  }

  /**
   * Get the next message without removing it.
   * 
   * Use this to inspect the next message before deciding
   * whether to process and remove it.
   * 
   * @returns The next message or null if queue is empty
   * 
   * @example
   * ```typescript
   * const next = queue.peek();
   * if (next) {
   *   console.log(`Next message: ${next.id}`);
   * }
   * ```
   */
  peek(): QueuedMessage | null {
    return this.queue.length > 0 ? this.queue[0] : null;
  }

  /**
   * Remove and return the next message from the queue.
   * 
   * Call this after successfully processing a message.
   * 
   * @returns The removed message or null if queue is empty
   * 
   * @example
   * ```typescript
   * const message = queue.dequeue();
   * if (message) {
   *   await processMessage(message.data);
   * }
   * ```
   */
  dequeue(): QueuedMessage | null {
    return this.queue.shift() || null;
  }

  /**
   * Mark a message as attempted and check if retry is allowed.
   * 
   * Call this when a send attempt fails. Returns true if the
   * message should be retried, false if max attempts exceeded.
   * 
   * @param id - The message ID to mark
   * @returns True if retry is allowed, false if max attempts reached
   * 
   * @example
   * ```typescript
   * try {
   *   await sendMessage(message.data);
   *   queue.dequeue();
   * } catch (error) {
   *   const shouldRetry = queue.markAttempted(message.id);
   *   if (!shouldRetry) {
   *     queue.remove(message.id);
   *     console.error(`Message ${message.id} failed permanently`);
   *   }
   * }
   * ```
   */
  markAttempted(id: string): boolean {
    const message = this.queue.find((msg) => msg.id === id);
    if (message) {
      message.attempts++;
      return message.attempts < this.maxAttempts;
    }
    return false;
  }

  /**
   * Remove a message by ID.
   * 
   * Use this to remove a message that failed permanently
   * or is no longer needed.
   * 
   * @param id - The message ID to remove
   * @returns True if message was found and removed
   * 
   * @example
   * ```typescript
   * const removed = queue.remove("message-id");
   * console.log(removed ? "Removed" : "Not found");
   * ```
   */
  remove(id: string): boolean {
    const index = this.queue.findIndex((msg) => msg.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get the current number of messages in the queue.
   * @returns Number of queued messages
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Check if the queue is empty.
   * @returns True if no messages are queued
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Remove all messages from the queue.
   * 
   * Use with caution - all queued messages will be lost.
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Get all messages in the queue (for debugging).
   * 
   * Returns a read-only copy of the queue contents.
   * 
   * @returns Array of all queued messages
   */
  getAll(): readonly QueuedMessage[] {
    return [...this.queue];
  }

  /**
   * Generate a unique message ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}
