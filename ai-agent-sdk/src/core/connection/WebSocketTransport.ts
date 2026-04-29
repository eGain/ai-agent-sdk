import { Transport, TransportConfig } from './Transport.js';
import { ConnectionError } from '../errors/SDKError.js';

/**
 * WebSocket transport configuration
 */
export interface WebSocketTransportConfig extends TransportConfig {
  /**
   * WebSocket protocols (optional)
   */
  protocols?: string | string[];
}

/**
 * WebSocket-based transport implementation.
 * 
 * This transport uses the native WebSocket API to establish
 * bidirectional communication with the server.
 * 
 * @example
 * ```typescript
 * const transport = new WebSocketTransport({
 *   endpoint: 'wss://api.example.com/ws'
 * });
 * 
 * transport.on('message', ({ data }) => {
 *   console.log('Received:', data);
 * });
 * 
 * await transport.connect();
 * await transport.send({ text: 'Hello' });
 * ```
 */
export class WebSocketTransport extends Transport {
  private ws: WebSocket | null = null;
  private connectTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private protocols?: string | string[];

  constructor(config: WebSocketTransportConfig) {
    super(config);
    this.protocols = config.protocols;
  }

  /**
   * Get the transport type identifier
   */
  getType(): string {
    return 'websocket';
  }

  /**
   * Check if the WebSocket is currently connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Establish the WebSocket connection
   */
  async connect(): Promise<void> {
    if (this.isConnected()) {
      this.logger.debug('WebSocket already connected', { endpoint: this.endpoint });
      return;
    }

    this.logger.debug('Connecting WebSocket', { endpoint: this.endpoint, protocols: this.protocols });

    return new Promise<void>((resolve, reject) => {
      try {
        // Create WebSocket connection
        this.ws = new WebSocket(this.endpoint, this.protocols);

        // Set connection timeout
        this.connectTimeoutTimer = setTimeout(() => {
          if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
            this.ws.close();
            const error = new ConnectionError('Connection timeout');
            this.logger.error('WebSocket connection timeout', error, { endpoint: this.endpoint });
            this.emit('error', { error, timestamp: Date.now() });
            reject(error);
          }
        }, this.connectionTimeout);

        // Handle successful connection
        this.ws.onopen = () => {
          this.clearConnectTimeout();
          this.logger.info('WebSocket connected', { endpoint: this.endpoint });
          this.emit('connected', { timestamp: Date.now() });
          resolve();
        };

        // Handle incoming messages
        this.ws.onmessage = (event: MessageEvent) => {
          this.handleMessage(event);
        };

        // Handle errors
        this.ws.onerror = (event: Event) => {
          const error = new ConnectionError('WebSocket error');
          this.logger.error('WebSocket error', error, { endpoint: this.endpoint });
          this.emit('error', { error, timestamp: Date.now() });
        };

        // Handle connection close
        this.ws.onclose = (event: CloseEvent) => {
          this.clearConnectTimeout();
          this.ws = null;
          this.logger.info('WebSocket closed', { 
            endpoint: this.endpoint,
            code: event.code,
            reason: event.reason
          });
          this.emit('closed', {
            code: event.code,
            reason: event.reason,
            timestamp: Date.now(),
          });
        };

      } catch (error) {
        this.clearConnectTimeout();
        const connError = new ConnectionError(
          'Failed to establish WebSocket connection',
          error instanceof Error ? error : new Error(String(error))
        );
        this.logger.error('Failed to establish WebSocket connection', connError, { endpoint: this.endpoint });
        this.emit('error', { error: connError, timestamp: Date.now() });
        reject(connError);
      }
    });
  }

  /**
   * Close the WebSocket connection
   */
  disconnect(): void {
    this.clearConnectTimeout();
    
    if (this.ws) {
      this.logger.debug('Disconnecting WebSocket', { endpoint: this.endpoint });
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }

  /**
   * Send data through the WebSocket
   */
  async send(data: any): Promise<void> {
    if (!this.isConnected() || !this.ws) {
      const error = new ConnectionError('Cannot send message: not connected');
      this.logger.warn('Cannot send message: WebSocket not connected', { endpoint: this.endpoint });
      throw error;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.logger.debug('Sending WebSocket message', { endpoint: this.endpoint, messageLength: message.length });
      this.ws.send(message);
    } catch (error) {
      const connError = new ConnectionError(
        'Failed to send message',
        error instanceof Error ? error : new Error(String(error))
      );
      this.logger.error('Failed to send WebSocket message', connError, { endpoint: this.endpoint });
      throw connError;
    }
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(event: MessageEvent): void {
    try {
      let data: any;
      if (typeof event.data === 'string') {
        try {
          data = JSON.parse(event.data);
        } catch {
          data = event.data;
        }
      } else {
        data = event.data;
      }

      this.logger.debug('WebSocket message received', { endpoint: this.endpoint, dataType: typeof data });
      this.emit('message', { data, timestamp: Date.now() });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Failed to handle WebSocket message', err, { endpoint: this.endpoint });
      this.emit('error', {
        error: err,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Clear connection timeout timer
   */
  private clearConnectTimeout(): void {
    if (this.connectTimeoutTimer) {
      clearTimeout(this.connectTimeoutTimer);
      this.connectTimeoutTimer = null;
    }
  }
}

