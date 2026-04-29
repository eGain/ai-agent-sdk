import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Connection } from './Connection.js';
import { ConnectionState } from './ConnectionState.js';
import { ConnectionError } from '../errors/SDKError.js';
import { Transport } from './Transport.js';

// Mock Transport for testing
class MockTransport extends Transport {
  private connected = false;
  private shouldFailConnect = false;
  private shouldFailSend = false;

  constructor() {
    super({ endpoint: 'mock://test' });
  }

  getType(): string {
    return 'mock';
  }

  isConnected(): boolean {
    return this.connected;
  }

  async connect(): Promise<void> {
    if (this.shouldFailConnect) {
      throw new ConnectionError('Mock connection failure');
    }
    this.connected = true;
    this.emit('connected', { timestamp: Date.now() });
  }

  disconnect(): void {
    this.connected = false;
    this.emit('closed', { code: 1000, reason: 'Disconnected', timestamp: Date.now() });
  }

  async send(data: any): Promise<void> {
    if (this.shouldFailSend) {
      throw new ConnectionError('Mock send failure');
    }
    if (!this.connected) {
      throw new ConnectionError('Not connected');
    }
  }

  // Test helpers
  setShouldFailConnect(shouldFail: boolean): void {
    this.shouldFailConnect = shouldFail;
  }

  setShouldFailSend(shouldFail: boolean): void {
    this.shouldFailSend = shouldFail;
  }

  simulateError(error: Error): void {
    this.emit('error', { error, timestamp: Date.now() });
  }

  simulateClose(code?: number, reason?: string): void {
    this.connected = false;
    this.emit('closed', { code, reason, timestamp: Date.now() });
  }

  simulateMessage(data: any): void {
    this.emit('message', { data, timestamp: Date.now() });
  }
}

describe('Connection', () => {
  let connection: Connection;
  let mockTransport: MockTransport;

  beforeEach(() => {
    mockTransport = new MockTransport();
    connection = new Connection({ transport: mockTransport });
  });

  afterEach(() => {
    connection.disconnect();
  });

  describe('constructor', () => {
    it('should create connection with transport', () => {
      const conn = new Connection({ transport: mockTransport });
      expect(conn.getTransport()).toBe(mockTransport);
      expect(conn.getTransportType()).toBe('mock');
    });

    it('should create connection with endpoint', () => {
      const conn = new Connection({ endpoint: 'wss://test.com' });
      expect(conn.getTransportType()).toBe('websocket');
    });

    it('should throw if neither transport nor endpoint provided', () => {
      expect(() => new Connection({} as any)).toThrow('Either transport or endpoint must be provided');
    });

    it('should accept legacy string endpoint', () => {
      const conn = new Connection('wss://test.com');
      expect(conn.getTransportType()).toBe('websocket');
    });

    it('should apply reconnection config', () => {
      const conn = new Connection({
        transport: mockTransport,
        maxReconnectAttempts: 5,
        baseReconnectDelay: 2000,
        maxReconnectDelay: 60000,
      });
      expect(conn).toBeDefined();
    });
  });

  describe('getState', () => {
    it('should return initial state', () => {
      expect(connection.getState()).toBe(ConnectionState.IDLE);
    });
  });

  describe('isConnected', () => {
    it('should return false when not connected', () => {
      expect(connection.isConnected()).toBe(false);
    });

    it('should return true when connected', async () => {
      await connection.connect();
      expect(connection.isConnected()).toBe(true);
    });
  });

  describe('connect', () => {
    it('should connect successfully', async () => {
      await connection.connect();
      expect(connection.isConnected()).toBe(true);
      expect(connection.getState()).toBe(ConnectionState.CONNECTED);
    });

    it('should not connect if already connected', async () => {
      await connection.connect();
      await connection.connect(); // Second call should be no-op
      expect(connection.isConnected()).toBe(true);
    });

    it('should not connect if already connecting', async () => {
      const connectPromise1 = connection.connect();
      const connectPromise2 = connection.connect();
      await Promise.all([connectPromise1, connectPromise2]);
      expect(connection.isConnected()).toBe(true);
    });

    it('should emit connected event', async () => {
      const connectedHandler = vi.fn();
      connection.on('connected', connectedHandler);
      await connection.connect();
      expect(connectedHandler).toHaveBeenCalled();
    });

    it('should handle connection failure', async () => {
      mockTransport.setShouldFailConnect(true);
      await expect(connection.connect()).rejects.toThrow(ConnectionError);
    });
  });

  describe('disconnect', () => {
    it('should disconnect when connected', async () => {
      await connection.connect();
      connection.disconnect();
      expect(connection.isConnected()).toBe(false);
      expect(connection.getState()).toBe(ConnectionState.CLOSED);
    });

    it('should stop reconnection attempts', async () => {
      await connection.connect();
      mockTransport.simulateClose(1006); // Abnormal closure
      connection.disconnect();
      // Wait a bit to ensure no reconnection happens
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(connection.getState()).toBe(ConnectionState.CLOSED);
    });

    it('should emit closed event', async () => {
      const closedHandler = vi.fn();
      connection.on('closed', closedHandler);
      await connection.connect();
      connection.disconnect();
      expect(closedHandler).toHaveBeenCalled();
    });
  });

  describe('send', () => {
    it('should send message when connected', async () => {
      await connection.connect();
      await expect(connection.send({ test: 'data' })).resolves.not.toThrow();
    });

    it('should throw when not connected', async () => {
      await expect(connection.send({ test: 'data' })).rejects.toThrow(ConnectionError);
    });

    it('should forward message to transport', async () => {
      await connection.connect();
      const sendSpy = vi.spyOn(mockTransport, 'send');
      await connection.send({ test: 'data' });
      expect(sendSpy).toHaveBeenCalledWith({ test: 'data' });
    });
  });

  describe('event forwarding', () => {
    it('should forward message events', async () => {
      const messageHandler = vi.fn();
      connection.on('message', messageHandler);
      await connection.connect();
      mockTransport.simulateMessage({ test: 'data' });
      expect(messageHandler).toHaveBeenCalled();
    });

    it('should forward error events', async () => {
      const errorHandler = vi.fn();
      connection.on('error', errorHandler);
      await connection.connect();
      mockTransport.simulateError(new Error('Test error'));
      expect(errorHandler).toHaveBeenCalled();
    });

    it('should forward closed events', async () => {
      const closedHandler = vi.fn();
      connection.on('closed', closedHandler);
      await connection.connect();
      mockTransport.simulateClose(1000, 'Normal closure');
      expect(closedHandler).toHaveBeenCalled();
    });

    it('should emit stateChanged event on state change', async () => {
      const stateChangedHandler = vi.fn();
      connection.on('stateChanged', stateChangedHandler);
      await connection.connect();
      expect(stateChangedHandler).toHaveBeenCalled();
    });
  });

  describe('reconnection', () => {
    it('should attempt reconnection on abnormal closure', async () => {
      vi.useFakeTimers();
      try {
        await connection.connect();
        const connectSpy = vi.spyOn(mockTransport, 'connect');
        mockTransport.simulateClose(1006); // Abnormal closure
        
        // Fast-forward time to trigger reconnection
        await vi.advanceTimersByTimeAsync(1100);
        
        // Should have attempted to reconnect (connect called again)
        expect(connectSpy).toHaveBeenCalled();
        // After successful reconnect, state should be CONNECTED
        expect(connection.getState()).toBe(ConnectionState.CONNECTED);
      } finally {
        vi.useRealTimers();
      }
    });

    it('should not reconnect on normal closure', async () => {
      await connection.connect();
      mockTransport.simulateClose(1000); // Normal closure
      // Small delay to ensure all sync handlers complete
      await Promise.resolve();
      expect(connection.getState()).toBe(ConnectionState.CLOSED);
    });

    it('should respect maxReconnectAttempts', async () => {
      vi.useFakeTimers();
      const conn = new Connection({
        transport: mockTransport,
        maxReconnectAttempts: 2,
        baseReconnectDelay: 100,
      });
      
      await conn.connect();
      mockTransport.setShouldFailConnect(true);
      mockTransport.simulateClose(1006);
      
      // Advance time to trigger reconnection attempts
      for (let i = 0; i < 5; i++) {
        await vi.advanceTimersByTimeAsync(200);
      }
      
      // Should stop reconnecting after max attempts
      expect(conn.getState()).toBe(ConnectionState.CLOSED);
      
      vi.useRealTimers();
    });
  });

  describe('setMaxReconnectAttempts', () => {
    it('should update max reconnect attempts', () => {
      connection.setMaxReconnectAttempts(5);
      // No direct getter, but should not throw
      expect(connection).toBeDefined();
    });
  });

  describe('setReconnectDelays', () => {
    it('should update reconnect delays', () => {
      connection.setReconnectDelays(2000, 60000);
      // No direct getter, but should not throw
      expect(connection).toBeDefined();
    });
  });
});
