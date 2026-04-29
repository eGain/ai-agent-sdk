import { EventEmitter } from '../events/EventEmitter.js';
import { ConnectionState } from './ConnectionState.js';
import { ConnectionError } from '../errors/SDKError.js';
import { Transport } from './Transport.js';
import { WebSocketTransport } from './WebSocketTransport.js';
import { Logger } from '../logging/Logger.js';
import { globalLogger } from '../logging/globalLogger.js';

/**
 * Connection event map
 */
export interface ConnectionEvents {
  connected: { timestamp: number };
  message: { data: any; timestamp: number };
  error: { error: Error; timestamp: number };
  closed: { code?: number; reason?: string; timestamp: number };
  stateChanged: { state: ConnectionState; previousState: ConnectionState };
}

/**
 * Connection configuration options
 */
export interface ConnectionConfig {
  /**
   * The transport instance to use for communication.
   * If not provided, a WebSocketTransport will be created using the endpoint.
   */
  transport?: Transport;

  /**
   * WebSocket endpoint URL (used when transport is not provided)
   */
  endpoint?: string;

  /**
   * Maximum reconnection attempts
   * @default Infinity
   */
  maxReconnectAttempts?: number;

  /**
   * Base reconnection delay in milliseconds
   * @default 1000
   */
  baseReconnectDelay?: number;

  /**
   * Maximum reconnection delay in milliseconds
   * @default 30000
   */
  maxReconnectDelay?: number;

  /**
   * Logger instance (optional)
   * If not provided, uses globalLogger
   */
  logger?: Logger;
}

/**
 * Connection manager with automatic reconnection.
 * 
 * This class wraps a Transport implementation and adds:
 * - Connection state management
 * - Automatic reconnection with exponential backoff
 * - Event forwarding and normalization
 * 
 * The Connection class is transport-agnostic - it can work with any
 * transport that implements the Transport interface (WebSocket, SSE, etc.)
 * 
 * @example
 * ```typescript
 * // Using default WebSocket transport
 * const conn = new Connection({
 *   endpoint: 'wss://api.example.com/ws'
 * });
 * 
 * // Using custom transport
 * const customTransport = new MyCustomTransport({ endpoint: '...' });
 * const conn = new Connection({ transport: customTransport });
 * ```
 */
export class Connection extends EventEmitter<ConnectionEvents> {
  private transport: Transport;
  private state: ConnectionState = ConnectionState.IDLE;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = false;
  private maxReconnectAttempts = Infinity;
  private baseReconnectDelay = 1000; // 1 second
  private maxReconnectDelay = 30000; // 30 seconds
  private logger: Logger;

  constructor(config: ConnectionConfig);
  /**
   * @deprecated Use ConnectionConfig object instead
   */
  constructor(endpoint: string);
  constructor(
    configOrEndpoint: ConnectionConfig | string
  ) {
    super();

    // Handle legacy constructor signature
    if (typeof configOrEndpoint === 'string') {
      // Legacy constructor - use global logger
      this.logger = globalLogger;
      this.transport = this.createDefaultTransport(configOrEndpoint);
    } else {
      const config = configOrEndpoint;
      
      // Set logger first (needed for createDefaultTransport)
      this.logger = config.logger ?? globalLogger;
      
      if (config.transport) {
        // Use provided transport
        this.transport = config.transport;
      } else if (config.endpoint) {
        // Create default WebSocket transport
        this.transport = this.createDefaultTransport(config.endpoint);
      } else {
        throw new Error('Either transport or endpoint must be provided');
      }

      // Apply configuration
      if (config.maxReconnectAttempts !== undefined) {
        this.maxReconnectAttempts = config.maxReconnectAttempts;
      }
      if (config.baseReconnectDelay !== undefined) {
        this.baseReconnectDelay = config.baseReconnectDelay;
      }
      if (config.maxReconnectDelay !== undefined) {
        this.maxReconnectDelay = config.maxReconnectDelay;
      }
    }

    // Set up transport event forwarding
    this.setupTransportEvents();
  }

  /**
   * Create default WebSocket transport
   */
  private createDefaultTransport(endpoint: string): WebSocketTransport {
    return new WebSocketTransport({
      endpoint,
      logger: this.logger,
    });
  }

  /**
   * Get the underlying transport instance
   */
  getTransport(): Transport {
    return this.transport;
  }

  /**
   * Get the transport type
   */
  getTransportType(): string {
    return this.transport.getType();
  }

  /**
   * Get current connection state
   */
  getState(): ConnectionState {
    return this.state;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.state === ConnectionState.CONNECTED && this.transport.isConnected();
  }

  /**
   * Connect using the underlying transport
   */
  async connect(): Promise<void> {
    if (this.state === ConnectionState.CONNECTED || this.state === ConnectionState.CONNECTING) {
      this.logger.debug('Connection already connected or connecting', { state: this.state });
      return;
    }

    this.logger.debug('Initiating connection', { endpoint: this.transport.getType() });
    this.shouldReconnect = true;
    await this.attemptConnect(true); // Initial attempt - throw on failure
  }

  /**
   * Disconnect and stop reconnecting
   */
  disconnect(): void {
    this.logger.debug('Disconnecting', { state: this.state });
    this.shouldReconnect = false;
    this.clearReconnectTimer();
    this.transport.disconnect();
    this.setState(ConnectionState.CLOSED);
  }

  /**
   * Send a message through the transport
   */
  async send(data: any): Promise<void> {
    if (!this.isConnected()) {
      const error = new ConnectionError('Cannot send message: not connected');
      this.logger.warn('Cannot send message: not connected', { state: this.state });
      throw error;
    }

    this.logger.debug('Sending message via transport', { transportType: this.transport.getType() });
    await this.transport.send(data);
  }

  /**
   * Set maximum reconnection attempts
   */
  setMaxReconnectAttempts(maxAttempts: number): void {
    this.maxReconnectAttempts = maxAttempts;
  }

  /**
   * Set reconnection delay parameters
   */
  setReconnectDelays(baseDelay: number, maxDelay: number): void {
    this.baseReconnectDelay = baseDelay;
    this.maxReconnectDelay = maxDelay;
  }

  /**
   * Set up event forwarding from transport
   */
  private setupTransportEvents(): void {
    this.transport.on('connected', (event) => {
      this.logger.info('Transport connected', { transportType: this.transport.getType() });
      this.reconnectAttempts = 0;
      this.setState(ConnectionState.CONNECTED);
      this.emit('connected', event);
    });

    this.transport.on('message', (event) => {
      this.logger.debug('Message received from transport', { transportType: this.transport.getType() });
      this.emit('message', event);
    });

    this.transport.on('error', (event) => {
      this.logger.error('Transport error', event.error, { transportType: this.transport.getType() });
      this.emit('error', event);
    });

    this.transport.on('closed', (event) => {
      this.logger.info('Transport closed', { 
        code: event.code, 
        reason: event.reason,
        transportType: this.transport.getType()
      });
      this.emit('closed', event);

      // Attempt reconnection if needed
      if (this.shouldReconnect && event.code !== 1000) {
        // Don't reconnect on normal closure
        this.scheduleReconnect();
      } else {
        this.setState(ConnectionState.CLOSED);
      }
    });
  }

  /**
   * Attempt to establish a connection
   * @param isInitialAttempt - If true, throw error on failure instead of scheduling reconnect
   */
  private async attemptConnect(isInitialAttempt = false): Promise<void> {
    if (this.state === ConnectionState.CONNECTING || this.state === ConnectionState.CONNECTED) {
      return;
    }

    this.setState(ConnectionState.CONNECTING);
    this.logger.debug('Attempting to connect', { transportType: this.transport.getType() });

    try {
      await this.transport.connect();
    } catch (error) {
      const connectionError = error instanceof ConnectionError
        ? error
        : new ConnectionError(
            'Failed to establish connection',
            error instanceof Error ? error : new Error(String(error))
          );
      
      // For initial connection attempt, throw the error so caller knows it failed
      if (isInitialAttempt) {
        this.handleConnectionFailure(connectionError);
        throw connectionError;
      }
      
      this.handleConnectionFailure(connectionError);
    }
  }

  /**
   * Handle connection failure
   */
  private handleConnectionFailure(error: ConnectionError): void {
    this.logger.warn('Connection attempt failed', { 
      error: error.message, 
      reconnectAttempts: this.reconnectAttempts,
      transportType: this.transport.getType()
    });
    this.emit('error', { error, timestamp: Date.now() });

    if (this.shouldReconnect) {
      this.scheduleReconnect();
    } else {
      this.setState(ConnectionState.CLOSED);
    }
  }

  /**
   * Schedule a reconnection attempt with exponential backoff
   */
  private scheduleReconnect(): void {
    if (!this.shouldReconnect) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.logger.error('Max reconnection attempts reached', 
        new ConnectionError('Max reconnection attempts reached'),
        { 
          maxAttempts: this.maxReconnectAttempts,
          transportType: this.transport.getType()
        }
      );
      this.setState(ConnectionState.CLOSED);
      this.emit('error', {
        error: new ConnectionError('Max reconnection attempts reached'),
        timestamp: Date.now(),
      });
      return;
    }

    this.setState(ConnectionState.RECONNECTING);

    // Calculate delay with exponential backoff
    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );

    this.reconnectAttempts++;
    this.logger.debug('Scheduling reconnection attempt', { 
      attempt: this.reconnectAttempts,
      delay,
      transportType: this.transport.getType()
    });
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.attemptConnect(false); // Reconnection attempt - don't throw, schedule next reconnect
    }, delay);
  }

  /**
   * Update connection state and emit event
   */
  private setState(newState: ConnectionState): void {
    if (this.state === newState) {
      return;
    }

    const previousState = this.state;
    this.state = newState;
    this.logger.debug('Connection state changed', { 
      previousState, 
      newState,
      transportType: this.transport.getType()
    });
    this.emit('stateChanged', { state: newState, previousState });
  }

  /**
   * Clear reconnect timer
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
