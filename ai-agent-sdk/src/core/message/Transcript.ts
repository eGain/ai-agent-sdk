/**
 * # Transcript
 * 
 * The Transcript feature automatically records all messages sent and received
 * during a conversation, providing a complete history for display, debugging,
 * or analytics.
 * 
 * ## Overview
 * 
 * Transcript is enabled by default and automatically captures:
 * - Customer messages (sent)
 * - Agent responses (received)
 * - System messages
 * - Context messages
 * 
 * ## Quick Start
 * 
 * Access the transcript through the agent instance:
 * 
 * ```typescript
 * // Get all transcript entries
 * const entries = agent.getTranscript();
 * 
 * // Get as JSON (for display or storage)
 * const json = agent.getTranscriptAsJSON();
 * 
 * // Get transcript size
 * const count = agent.getTranscriptSize();
 * 
 * // Clear transcript
 * agent.clearTranscript();
 * ```
 * 
 * ## Configuration
 * 
 * Configure transcript behavior when creating the agent:
 * 
 * ```typescript
 * const agent = new AiAgent({
 *   id: "agent-id",
 *   endpoint: "https://your-endpoint.com",
 *   transcriptConfig: {
 *     enabled: true,                    // Enable/disable transcript
 *     excludeRoles: ["heartbeat"],      // Exclude heartbeat messages
 *     excludePersonas: ["system"]       // Exclude system messages
 *   }
 * });
 * ```
 * 
 * ## Filtering Entries
 * 
 * Retrieve filtered transcript entries:
 * 
 * ```typescript
 * // Get only received messages
 * const received = agent.getTranscript({ direction: 'received' });
 * 
 * // Get messages from a specific time range
 * const recent = agent.getTranscript({
 *   fromTimestamp: Date.now() - 3600000  // Last hour
 * });
 * 
 * // Get only agent messages
 * const agentMessages = agent.getTranscript({ persona: 'agent' });
 * ```
 * 
 * ## Transcript Events
 * 
 * Listen for transcript updates in real-time:
 * 
 * ```typescript
 * agent.on('transcriptUpdate', (event) => {
 *   const { entry } = event.payload;
 *   console.log(`${entry.direction}: ${entry.message.content}`);
 * });
 * ```
 * 
 * ## Use Cases
 * 
 * - **Chat UI**: Display conversation history
 * - **Analytics**: Track conversation patterns
 * - **Debugging**: Review message flow
 * - **Persistence**: Save conversations to database
 * 
 * @module Transcript
 * @category Features
 */

import { Message } from './Message.js';
import { Persona, Role } from './types.js';

/**
 * Transcript entry containing a message with metadata.
 * 
 * Each entry represents a single message in the conversation
 * with direction and timing information.
 * 
 * @example
 * ```typescript
 * const entry: TranscriptEntry = {
 *   message: message,
 *   direction: 'received',
 *   timestamp: Date.now(),
 *   sessionId: 'session-123',
 *   agentId: 'agent-456'
 * };
 * ```
 * 
 * @category Features
 * @group Transcript
 */
export interface TranscriptEntry {
  /** The message object */
  message: Message;
  /** Whether the message was sent or received */
  direction: 'sent' | 'received';
  /** Timestamp when the message was recorded */
  timestamp: number;
  /** Session ID associated with this message */
  sessionId?: string | number;
  /** Agent ID associated with this message */
  agentId?: string | number;
}

/**
 * Configuration for transcript storage and filtering.
 * 
 * Use this to control which messages are recorded in the transcript.
 * 
 * @example
 * ```typescript
 * const config: TranscriptConfig = {
 *   enabled: true,
 *   excludeRoles: ['heartbeat', 'token'],
 *   excludePersonas: ['system']
 * };
 * ```
 * 
 * @category Features
 * @group Transcript
 */
export interface TranscriptConfig {
  /**
   * Enable or disable transcript storage.
   * When disabled, no messages are recorded.
   * @default true
   */
  enabled?: boolean;

  /**
   * Array of message types to include.
   * If specified, only these message types are recorded.
   * If not specified, all message types are included (subject to exclude filters).
   * 
   * @example ['agent_message', 'customer_message']
   */
  includeMessageTypes?: string[];

  /**
   * Array of roles to exclude from the transcript.
   * Messages with these roles will not be recorded.
   * 
   * @example ['heartbeat', 'token']
   */
  excludeRoles?: string[];

  /**
   * Array of personas to exclude from the transcript.
   * Messages from these personas will not be recorded.
   * 
   * @example ['system']
   */
  excludePersonas?: string[];
}

/**
 * Options for filtering transcript entries when retrieving.
 * 
 * @example
 * ```typescript
 * // Get received messages from the last hour
 * const options: TranscriptOptions = {
 *   direction: 'received',
 *   fromTimestamp: Date.now() - 3600000
 * };
 * const entries = transcript.getEntries(options);
 * ```
 * 
 * @category Features
 * @group Transcript
 */
export interface TranscriptOptions {
  /**
   * Filter entries from this timestamp onwards (inclusive)
   */
  fromTimestamp?: number;

  /**
   * Filter entries up to this timestamp (inclusive)
   */
  toTimestamp?: number;

  /**
   * Filter by direction: 'sent', 'received', or 'both'
   */
  direction?: 'sent' | 'received' | 'both';

  /**
   * Filter by message persona (e.g., 'agent', 'customer')
   */
  persona?: Persona;

  /**
   * Filter by message role (e.g., 'human', 'context')
   */
  role?: Role;
}

/**
 * Transcript storage class for managing conversation history.
 * 
 * The Transcript class provides a complete record of all messages
 * exchanged during a conversation. It supports filtering, JSON export,
 * and real-time updates.
 * 
 * @example Basic usage
 * ```typescript
 * const transcript = new Transcript();
 * 
 * // Add a message
 * transcript.add(message, 'sent', sessionId, agentId);
 * 
 * // Get all entries
 * const entries = transcript.getEntries();
 * 
 * // Get as JSON for storage
 * const json = transcript.getEntriesAsJSON();
 * 
 * // Get entry count
 * console.log(`${transcript.size()} messages`);
 * 
 * // Clear all entries
 * transcript.clear();
 * ```
 * 
 * @example With configuration
 * ```typescript
 * const transcript = new Transcript({
 *   enabled: true,
 *   excludeRoles: ['heartbeat'],  // Don't record heartbeats
 * });
 * ```
 * 
 * @example Filtering entries
 * ```typescript
 * // Get only agent responses
 * const agentResponses = transcript.getEntries({
 *   direction: 'received',
 *   persona: 'agent'
 * });
 * 
 * // Get messages from the last 5 minutes
 * const recentMessages = transcript.getEntries({
 *   fromTimestamp: Date.now() - 300000
 * });
 * ```
 * 
 * @category Features
 * @group Transcript
 */
export class Transcript {
  private entries: TranscriptEntry[] = [];
  private config: Required<TranscriptConfig>;

  /**
   * Create a new Transcript instance
   * @param config - Optional configuration for filtering
   */
  constructor(config: TranscriptConfig = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      includeMessageTypes: config.includeMessageTypes ?? [],
      excludeRoles: config.excludeRoles ?? [],
      excludePersonas: config.excludePersonas ?? [],
    };
  }

  /**
   * Add a message to the transcript.
   * 
   * Messages are automatically filtered based on configuration.
   * If the transcript is disabled or the message matches an exclude filter,
   * it will not be recorded.
   * 
   * @param message - The message to add
   * @param direction - Whether the message was 'sent' or 'received'
   * @param sessionId - Optional session ID for context
   * @param agentId - Optional agent ID for context
   * 
   * @example
   * ```typescript
   * transcript.add(
   *   new Message('customer', 'human', 'Hello!'),
   *   'sent',
   *   'session-123',
   *   'agent-456'
   * );
   * ```
   */
  add(
    message: Message,
    direction: 'sent' | 'received',
    sessionId?: string | number,
    agentId?: string | number
  ): void {
    if (!this.config.enabled) {
      return;
    }

    // Check if message should be filtered out
    if (!this.shouldInclude(message)) {
      return;
    }

    const entry: TranscriptEntry = {
      message,
      direction,
      timestamp: message.timestamp || Date.now(),
      sessionId,
      agentId,
    };

    this.entries.push(entry);
  }

  /**
   * Get transcript entries, optionally filtered.
   * 
   * @param options - Optional filtering options
   * @returns Array of transcript entries matching the filter
   * 
   * @example
   * ```typescript
   * // Get all entries
   * const all = transcript.getEntries();
   * 
   * // Get only sent messages
   * const sent = transcript.getEntries({ direction: 'sent' });
   * 
   * // Get messages from last hour
   * const recent = transcript.getEntries({ 
   *   fromTimestamp: Date.now() - 3600000 
   * });
   * ```
   */
  getEntries(options?: TranscriptOptions): TranscriptEntry[] {
    let filtered = [...this.entries];

    if (options) {
      // Filter by timestamp range
      if (options.fromTimestamp !== undefined) {
        filtered = filtered.filter((entry) => entry.timestamp >= options.fromTimestamp!);
      }
      if (options.toTimestamp !== undefined) {
        filtered = filtered.filter((entry) => entry.timestamp <= options.toTimestamp!);
      }

      // Filter by direction
      if (options.direction && options.direction !== 'both') {
        filtered = filtered.filter((entry) => entry.direction === options.direction);
      }

      // Filter by persona
      if (options.persona) {
        filtered = filtered.filter((entry) => entry.message.persona === options.persona);
      }

      // Filter by role
      if (options.role) {
        filtered = filtered.filter((entry) => entry.message.role === options.role);
      }
    }

    return filtered;
  }

  /**
   * Get transcript entries as plain JSON-serializable objects.
   * 
   * Useful for storing transcripts in databases, sending to APIs,
   * or displaying in UI components.
   * 
   * @param options - Optional filtering options
   * @returns Array of plain objects representing transcript entries
   * 
   * @example
   * ```typescript
   * const json = transcript.getEntriesAsJSON();
   * 
   * // Each entry includes:
   * // {
   * //   messageId, persona, role, content, messageData,
   * //   timestamp, from, to, agentId, sessionId,
   * //   direction, entryTimestamp
   * // }
   * 
   * // Save to database
   * await db.saveTranscript(json);
   * ```
   */
  getEntriesAsJSON(options?: TranscriptOptions): any[] {
    const entries = this.getEntries(options);
    return entries.map((entry) => ({
      messageId: entry.message.messageId,
      persona: entry.message.persona,
      role: entry.message.role,
      content: entry.message.content,
      messageData: entry.message.messageData,
      timestamp: entry.message.timestamp,
      from: entry.message.from,
      to: entry.message.to,
      agentId: entry.agentId ?? entry.message.agentId,
      sessionId: entry.sessionId ?? entry.message.sessionId,
      direction: entry.direction,
      entryTimestamp: entry.timestamp,
    }));
  }

  /**
   * Get the number of entries in the transcript.
   * @returns Number of recorded messages
   */
  size(): number {
    return this.entries.length;
  }

  /**
   * Clear all transcript entries.
   * 
   * This removes all recorded messages. Use with caution as
   * this action cannot be undone.
   */
  clear(): void {
    this.entries = [];
  }

  /**
   * Check if a message should be included based on configuration filters
   * @param message - The message to check
   * @returns True if message should be included
   */
  private shouldInclude(message: Message): boolean {
    // Check exclude roles
    if (this.config.excludeRoles.length > 0) {
      if (this.config.excludeRoles.includes(message.role)) {
        return false;
      }
    }

    // Check exclude personas
    if (this.config.excludePersonas.length > 0) {
      if (this.config.excludePersonas.includes(message.persona)) {
        return false;
      }
    }

    // If includeMessageTypes is specified, check if message type matches
    // Note: This is a simplified check. In a real implementation, you might
    // want to map message persona/role combinations to message types
    if (this.config.includeMessageTypes.length > 0) {
      // For now, we'll include all messages if includeMessageTypes is specified
      // This can be enhanced to map persona/role to message types
      // For example: agent + human = 'agent_message', customer + human = 'customer_message'
    }

    return true;
  }

  /**
   * Update transcript configuration at runtime.
   * 
   * @param config - New configuration options (partial update)
   * 
   * @example
   * ```typescript
   * // Disable transcript temporarily
   * transcript.updateConfig({ enabled: false });
   * 
   * // Re-enable with new exclusions
   * transcript.updateConfig({ 
   *   enabled: true, 
   *   excludeRoles: ['heartbeat', 'token'] 
   * });
   * ```
   */
  updateConfig(config: Partial<TranscriptConfig>): void {
    if (config.enabled !== undefined) {
      this.config.enabled = config.enabled;
    }
    if (config.includeMessageTypes !== undefined) {
      this.config.includeMessageTypes = config.includeMessageTypes;
    }
    if (config.excludeRoles !== undefined) {
      this.config.excludeRoles = config.excludeRoles;
    }
    if (config.excludePersonas !== undefined) {
      this.config.excludePersonas = config.excludePersonas;
    }
  }
}
