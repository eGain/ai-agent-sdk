import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from './EventEmitter.js';

interface TestEvents {
  test: { value: string };
  data: { count: number };
}

describe('EventEmitter', () => {
  let emitter: EventEmitter<TestEvents>;

  beforeEach(() => {
    emitter = new EventEmitter<TestEvents>();
  });

  describe('on', () => {
    it('should register and call event handler', () => {
      const handler = vi.fn();
      emitter.on('test', handler);
      emitter.emit('test', { value: 'hello' });
      expect(handler).toHaveBeenCalledWith({ value: 'hello' });
    });

    it('should call multiple handlers', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      emitter.on('test', handler1);
      emitter.on('test', handler2);
      emitter.emit('test', { value: 'hello' });
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });
  });

  describe('once', () => {
    it('should call handler only once', () => {
      const handler = vi.fn();
      emitter.once('test', handler);
      emitter.emit('test', { value: 'hello' });
      emitter.emit('test', { value: 'world' });
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({ value: 'hello' });
    });
  });

  describe('off', () => {
    it('should remove specific handler', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      emitter.on('test', handler1);
      emitter.on('test', handler2);
      emitter.off('test', handler1);
      emitter.emit('test', { value: 'hello' });
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should remove all handlers for event when no handler specified', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      emitter.on('test', handler1);
      emitter.on('test', handler2);
      emitter.off('test');
      emitter.emit('test', { value: 'hello' });
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('removeAllListeners', () => {
    it('should remove all listeners for specific event', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      emitter.on('test', handler1);
      emitter.on('data', handler2);
      emitter.removeAllListeners('test');
      emitter.emit('test', { value: 'hello' });
      emitter.emit('data', { count: 1 });
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should remove all listeners when no event specified', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      emitter.on('test', handler1);
      emitter.on('data', handler2);
      emitter.removeAllListeners();
      emitter.emit('test', { value: 'hello' });
      emitter.emit('data', { count: 1 });
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('listenerCount', () => {
    it('should return correct listener count', () => {
      expect(emitter.listenerCount('test')).toBe(0);
      emitter.on('test', vi.fn());
      expect(emitter.listenerCount('test')).toBe(1);
      emitter.on('test', vi.fn());
      expect(emitter.listenerCount('test')).toBe(2);
    });

    it('should count once handlers', () => {
      emitter.once('test', vi.fn());
      expect(emitter.listenerCount('test')).toBe(1);
    });
  });

  describe('error handling', () => {
    it('should not throw when handler throws error', () => {
      const handler = vi.fn(() => {
        throw new Error('Handler error');
      });
      emitter.on('test', handler);
      expect(() => emitter.emit('test', { value: 'hello' })).not.toThrow();
    });

    it('should not throw when async handler rejects', async () => {
      const handler = vi.fn(async () => {
        throw new Error('Async error');
      });
      emitter.on('test', handler);
      expect(() => emitter.emit('test', { value: 'hello' })).not.toThrow();
      // Wait for promise to settle
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
  });
});




