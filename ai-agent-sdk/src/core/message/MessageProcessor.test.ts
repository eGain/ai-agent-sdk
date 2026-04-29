import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MessageProcessor } from './MessageProcessor.js';
import { Message } from './Message.js';
import { BaseMessageHandler } from './BaseMessageHandler.js';
import { PERSONA, ROLE, MessageHandlerResult } from './types.js';

// Mock handler for testing
class MockHandler extends BaseMessageHandler {
  private canHandleFn: (message: Message) => boolean;
  private handleFn: (message: Message) => MessageHandlerResult | null | Promise<MessageHandlerResult | null>;

  constructor(
    canHandleFn: (message: Message) => boolean,
    handleFn: (message: Message) => MessageHandlerResult | null | Promise<MessageHandlerResult | null>
  ) {
    super();
    this.canHandleFn = canHandleFn;
    this.handleFn = handleFn;
  }

  canHandle(message: Message): boolean {
    return this.canHandleFn(message);
  }

  handle(message: Message): MessageHandlerResult | null | Promise<MessageHandlerResult | null> {
    return this.handleFn(message);
  }
}

describe('MessageProcessor', () => {
  let processor: MessageProcessor;
  let testMessage: Message;

  beforeEach(() => {
    processor = new MessageProcessor();
    testMessage = new Message(PERSONA.CUSTOMER, ROLE.HUMAN, 'Test message', {
      messageId: 'msg-1',
    });
  });

  describe('constructor', () => {
    it('should create processor with default handlers', () => {
      const p = new MessageProcessor();
      const handlers = p.getHandlers();
      expect(handlers.length).toBeGreaterThan(0);
    });

    it('should accept custom logger', () => {
      const logger = { debug: vi.fn(), warn: vi.fn() } as any;
      const p = new MessageProcessor(logger);
      expect(p).toBeDefined();
    });
  });

  describe('process', () => {
    it('should process message with matching handler', async () => {
      const handler = new MockHandler(
        (msg) => msg.messageId === 'msg-1',
        (msg) => ({
          type: 'agent_message',
          message: msg,
        })
      );
      processor.addHandler(handler);

      const result = await processor.process(testMessage);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('agent_message');
    });

    it('should use first matching handler', async () => {
      const handler1 = new MockHandler(
        (msg) => true,
        (msg) => ({ type: 'agent_message', message: msg })
      );
      const handler2 = new MockHandler(
        (msg) => true,
        (msg) => ({ type: 'error_message', message: msg })
      );

      processor.addHandler(handler1, 0);
      processor.addHandler(handler2, 1);

      const result = await processor.process(testMessage);
      expect(result?.type).toBe('agent_message');
    });

    it('should return null if no handler matches', async () => {
      const handler = new MockHandler(
        (msg) => false,
        (msg) => null
      );
      processor.reset();
      processor.addHandler(handler);

      const result = await processor.process(testMessage);
      expect(result).toBeNull();
    });

    it('should handle async handlers', async () => {
      const handler = new MockHandler(
        (msg) => true,
        async (msg) => {
          await new Promise(resolve => setTimeout(resolve, 10));
          return { type: 'agent_message', message: msg };
        }
      );
      processor.addHandler(handler);

      const result = await processor.process(testMessage);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('agent_message');
    });

    it('should handle sync handlers', async () => {
      const handler = new MockHandler(
        (msg) => true,
        (msg) => ({ type: 'agent_message', message: msg })
      );
      processor.addHandler(handler);

      const result = await processor.process(testMessage);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('agent_message');
    });
  });

  describe('addHandler', () => {
    it('should add handler at end by default', () => {
      const handler = new MockHandler(() => false, () => null);
      const initialCount = processor.getHandlers().length;
      processor.addHandler(handler);
      expect(processor.getHandlers().length).toBe(initialCount + 1);
    });

    it('should add handler at specified priority', () => {
      const handler = new MockHandler(() => false, () => null);
      processor.addHandler(handler, 0);
      const handlers = processor.getHandlers();
      expect(handlers[0]).toBe(handler);
    });

    it('should throw if handler does not extend BaseMessageHandler', () => {
      const invalidHandler = {} as any;
      expect(() => processor.addHandler(invalidHandler)).toThrow('Handler must extend BaseMessageHandler');
    });
  });

  describe('removeHandler', () => {
    it('should remove handler', () => {
      const handler = new MockHandler(() => false, () => null);
      processor.addHandler(handler);
      const initialCount = processor.getHandlers().length;
      processor.removeHandler(handler);
      expect(processor.getHandlers().length).toBe(initialCount - 1);
    });

    it('should not throw if handler not found', () => {
      const handler = new MockHandler(() => false, () => null);
      expect(() => processor.removeHandler(handler)).not.toThrow();
    });
  });

  describe('getHandlers', () => {
    it('should return copy of handlers array', () => {
      const handlers1 = processor.getHandlers();
      const handlers2 = processor.getHandlers();
      expect(handlers1).not.toBe(handlers2);
      expect(handlers1).toEqual(handlers2);
    });
  });

  describe('reset', () => {
    it('should clear handlers and re-register defaults', () => {
      const handler = new MockHandler(() => false, () => null);
      processor.addHandler(handler);
      processor.reset();
      const handlers = processor.getHandlers();
      expect(handlers).not.toContain(handler);
      expect(handlers.length).toBeGreaterThan(0);
    });
  });
});
