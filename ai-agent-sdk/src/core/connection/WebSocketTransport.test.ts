import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebSocketTransport } from './WebSocketTransport.js';
import { ConnectionError } from '../errors/SDKError.js';

// Mock WebSocket for Node.js environment
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  url: string;
  protocols?: string | string[];
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;

  constructor(url: string, protocols?: string | string[]) {
    this.url = url;
    this.protocols = protocols;
    // Simulate async connection
    setTimeout(() => {
      if (this.readyState === MockWebSocket.CONNECTING) {
        this.readyState = MockWebSocket.OPEN;
        if (this.onopen) {
          this.onopen(new Event('open'));
        }
      }
    }, 10);
  }

  send(data: string | ArrayBuffer | Blob): void {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }
  }

  close(code?: number, reason?: string): void {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      const event = {
        code: code ?? 1000,
        reason: reason ?? '',
        wasClean: code === 1000,
      } as CloseEvent;
      this.onclose(event);
    }
  }

  // Test helpers
  simulateMessage(data: string): void {
    if (this.onmessage) {
      const event = {
        data,
        type: 'message',
      } as MessageEvent;
      this.onmessage(event);
    }
  }

  simulateError(): void {
    if (this.onerror) {
      this.onerror(new Event('error'));
    }
  }

  simulateClose(code?: number, reason?: string): void {
    this.close(code, reason);
  }
}

// Replace global WebSocket with mock and preserve static constants
const MockWebSocketClass = MockWebSocket as any;
MockWebSocketClass.CONNECTING = 0;
MockWebSocketClass.OPEN = 1;
MockWebSocketClass.CLOSING = 2;
MockWebSocketClass.CLOSED = 3;
(global as any).WebSocket = MockWebSocketClass;

describe('WebSocketTransport', () => {
  let transport: WebSocketTransport;
  let mockWs: MockWebSocket;
  let originalWebSocket: any;

  beforeEach(() => {
    // Store reference to MockWebSocket class for later access
    originalWebSocket = global.WebSocket;
    
    // Create a spy that captures the mockWs instance while preserving static props
    const mockFn = vi.fn((url: string, protocols?: string | string[]) => {
      mockWs = new MockWebSocket(url, protocols);
      return mockWs as any;
    }) as any;
    
    // Copy static properties to the mock function
    mockFn.CONNECTING = 0;
    mockFn.OPEN = 1;
    mockFn.CLOSING = 2;
    mockFn.CLOSED = 3;
    
    (global as any).WebSocket = mockFn;
    transport = new WebSocketTransport({ endpoint: 'ws://test.com' });
  });

  afterEach(() => {
    transport.disconnect();
    // Restore the MockWebSocketClass for next test
    (global as any).WebSocket = MockWebSocketClass;
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create transport with endpoint', () => {
      const t = new WebSocketTransport({ endpoint: 'ws://test.com' });
      expect(t.getType()).toBe('websocket');
    });

    it('should accept protocols', () => {
      const t = new WebSocketTransport({
        endpoint: 'ws://test.com',
        protocols: ['protocol1', 'protocol2'],
      });
      expect(t).toBeDefined();
    });
  });

  describe('getType', () => {
    it('should return websocket type', () => {
      expect(transport.getType()).toBe('websocket');
    });
  });

  describe('isConnected', () => {
    it('should return false when not connected', () => {
      expect(transport.isConnected()).toBe(false);
    });

    it('should return true when connected', async () => {
      await transport.connect();
      await new Promise(resolve => setTimeout(resolve, 20));
      expect(transport.isConnected()).toBe(true);
    });
  });

  describe('connect', () => {
    it('should connect successfully', async () => {
      await transport.connect();
      await new Promise(resolve => setTimeout(resolve, 20));
      expect(transport.isConnected()).toBe(true);
    });

    it('should not connect if already connected', async () => {
      await transport.connect();
      await new Promise(resolve => setTimeout(resolve, 20));
      await transport.connect(); // Second call should be no-op
      expect(transport.isConnected()).toBe(true);
    });

    it('should emit connected event', async () => {
      const connectedHandler = vi.fn();
      transport.on('connected', connectedHandler);
      await transport.connect();
      await new Promise(resolve => setTimeout(resolve, 20));
      expect(connectedHandler).toHaveBeenCalled();
    });

    it('should handle connection timeout', async () => {
      // Create a WebSocket mock that never opens (doesn't call onopen)
      class NeverOpenWebSocket {
        static CONNECTING = 0;
        static OPEN = 1;
        static CLOSING = 2;
        static CLOSED = 3;
        readyState = NeverOpenWebSocket.CONNECTING;
        onopen: ((event: Event) => void) | null = null;
        onmessage: ((event: MessageEvent) => void) | null = null;
        onerror: ((event: Event) => void) | null = null;
        onclose: ((event: CloseEvent) => void) | null = null;
        close() {
          this.readyState = NeverOpenWebSocket.CLOSED;
          if (this.onclose) {
            this.onclose({ code: 1000, reason: 'timeout', wasClean: false } as CloseEvent);
          }
        }
        send() {}
      }
      
      const neverOpenMock = vi.fn(() => new NeverOpenWebSocket()) as any;
      neverOpenMock.CONNECTING = 0;
      neverOpenMock.OPEN = 1;
      neverOpenMock.CLOSING = 2;
      neverOpenMock.CLOSED = 3;
      (global as any).WebSocket = neverOpenMock;
      
      const t = new WebSocketTransport({
        endpoint: 'ws://test.com',
        connectionTimeout: 50, // Short timeout with real timers
      });

      // Add error listener to prevent unhandled error event
      t.on('error', () => {});

      await expect(t.connect()).rejects.toThrow(ConnectionError);
      
      // Cleanup
      t.disconnect();
    });
  });

  describe('disconnect', () => {
    it('should disconnect when connected', async () => {
      await transport.connect();
      await new Promise(resolve => setTimeout(resolve, 20));
      transport.disconnect();
      expect(transport.isConnected()).toBe(false);
    });

    it('should emit closed event', async () => {
      const closedHandler = vi.fn();
      transport.on('closed', closedHandler);
      await transport.connect();
      await new Promise(resolve => setTimeout(resolve, 20));
      transport.disconnect();
      expect(closedHandler).toHaveBeenCalled();
    });

    it('should not throw when not connected', () => {
      expect(() => transport.disconnect()).not.toThrow();
    });
  });

  describe('send', () => {
    it('should send string message', async () => {
      await transport.connect();
      await new Promise(resolve => setTimeout(resolve, 20));
      const sendSpy = vi.spyOn(mockWs, 'send');
      await transport.send('test message');
      expect(sendSpy).toHaveBeenCalledWith('test message');
    });

    it('should send object as JSON', async () => {
      await transport.connect();
      await new Promise(resolve => setTimeout(resolve, 20));
      const sendSpy = vi.spyOn(mockWs, 'send');
      await transport.send({ test: 'data' });
      expect(sendSpy).toHaveBeenCalledWith(JSON.stringify({ test: 'data' }));
    });

    it('should throw when not connected', async () => {
      await expect(transport.send('test')).rejects.toThrow(ConnectionError);
    });
  });

  describe('event handling', () => {
    it('should handle incoming messages', async () => {
      const messageHandler = vi.fn();
      transport.on('message', messageHandler);
      await transport.connect();
      await new Promise(resolve => setTimeout(resolve, 20));
      
      mockWs.simulateMessage(JSON.stringify({ test: 'data' }));
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(messageHandler).toHaveBeenCalled();
      const call = messageHandler.mock.calls[0][0];
      expect(call.data).toEqual({ test: 'data' });
    });

    it('should handle non-JSON messages', async () => {
      const messageHandler = vi.fn();
      transport.on('message', messageHandler);
      await transport.connect();
      await new Promise(resolve => setTimeout(resolve, 20));
      
      mockWs.simulateMessage('plain text');
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(messageHandler).toHaveBeenCalled();
      const call = messageHandler.mock.calls[0][0];
      expect(call.data).toBe('plain text');
    });

    it('should handle error events', async () => {
      const errorHandler = vi.fn();
      transport.on('error', errorHandler);
      await transport.connect();
      await new Promise(resolve => setTimeout(resolve, 20));
      
      mockWs.simulateError();
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(errorHandler).toHaveBeenCalled();
    });

    it('should handle close events', async () => {
      const closedHandler = vi.fn();
      transport.on('closed', closedHandler);
      await transport.connect();
      await new Promise(resolve => setTimeout(resolve, 20));
      
      mockWs.simulateClose(1000, 'Normal closure');
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(closedHandler).toHaveBeenCalled();
      const call = closedHandler.mock.calls[0][0];
      expect(call.code).toBe(1000);
      expect(call.reason).toBe('Normal closure');
    });
  });
});
