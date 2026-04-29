import { EventEmitter } from '../events/EventEmitter.js';
import { Logger } from '../logging/Logger.js';
import { globalLogger } from '../logging/globalLogger.js';

/**
 * Transport event map - events that any transport must emit
 */
export interface TransportEvents {
  /**
   * Emitted when transport connection is established
   */
  connected: { timestamp: number };

  /**
   * Emitted when a message is received
   */
  message: { data: any; timestamp: number };

  /**
   * Emitted when an error occurs
   */
  error: { error: Error; timestamp: number };

  /**
   * Emitted when connection is closed
   */
  closed: { code?: number; reason?: string; timestamp: number };
}

/**
 * Transport configuration options
 */
export interface TransportConfig {
  /**
   * Connection endpoint URL
   */
  endpoint: string;

  /**
   * Connection timeout in milliseconds
   * @default 10000
   */
  connectionTimeout?: number;

  /**
   * Logger instance (optional)
   * If not provided, uses globalLogger
   */
  logger?: Logger;
}

/**
 * Abstract base class for transport implementations.
 * 
 * Any transport mechanism (WebSocket, SSE, HTTP polling, etc.) should extend
 * this class and implement the abstract methods.
 * 
 * @example
 * ```typescript
 * class MyCustomTransport extends Transport {
 *   async connect(): Promise<void> { ... }
 *   disconnect(): void { ... }
 *   async send(data: any): Promise<void> { ... }
 *   isConnected(): boolean { ... }
 * }
 * ```
 */
export abstract class Transport extends EventEmitter<TransportEvents> {
  protected readonly endpoint: string;
  protected readonly connectionTimeout: number;
  protected readonly logger: Logger;

  constructor(config: TransportConfig) {
    super();
    this.endpoint = config.endpoint;
    this.connectionTimeout = config.connectionTimeout ?? 10000;
    this.logger = config.logger ?? globalLogger;
  }

  /**
   * Establish the transport connection
   */
  abstract connect(): Promise<void>;

  /**
   * Close the transport connection
   */
  abstract disconnect(): void;

  /**
   * Send data through the transport
   * @param data - The data to send
   */
  abstract send(data: any): Promise<void>;

  /**
   * Check if the transport is currently connected
   */
  abstract isConnected(): boolean;

  /**
   * Get the transport type identifier
   */
  abstract getType(): string;
}

