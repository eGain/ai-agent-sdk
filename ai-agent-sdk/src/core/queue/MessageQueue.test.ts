import { describe, it, expect } from 'vitest';
import { MessageQueue } from './MessageQueue.js';
import { MessageError } from '../errors/SDKError.js';

describe('MessageQueue', () => {
  describe('enqueue', () => {
    it('should enqueue a message', () => {
      const queue = new MessageQueue();
      const id = queue.enqueue({ text: 'hello' });
      expect(id).toBeDefined();
      expect(queue.size()).toBe(1);
    });

    it('should use provided ID', () => {
      const queue = new MessageQueue();
      const id = queue.enqueue({ text: 'hello' }, 'custom-id');
      expect(id).toBe('custom-id');
    });

    it('should throw when queue is full', () => {
      const queue = new MessageQueue(2);
      queue.enqueue({ text: '1' });
      queue.enqueue({ text: '2' });
      expect(() => queue.enqueue({ text: '3' })).toThrow(MessageError);
    });
  });

  describe('peek', () => {
    it('should return null for empty queue', () => {
      const queue = new MessageQueue();
      expect(queue.peek()).toBeNull();
    });

    it('should return first message without removing', () => {
      const queue = new MessageQueue();
      queue.enqueue({ text: 'first' });
      queue.enqueue({ text: 'second' });
      const message = queue.peek();
      expect(message?.data.text).toBe('first');
      expect(queue.size()).toBe(2);
    });
  });

  describe('dequeue', () => {
    it('should return null for empty queue', () => {
      const queue = new MessageQueue();
      expect(queue.dequeue()).toBeNull();
    });

    it('should remove and return first message', () => {
      const queue = new MessageQueue();
      queue.enqueue({ text: 'first' });
      queue.enqueue({ text: 'second' });
      const message = queue.dequeue();
      expect(message?.data.text).toBe('first');
      expect(queue.size()).toBe(1);
      expect(queue.peek()?.data.text).toBe('second');
    });
  });

  describe('markAttempted', () => {
    it('should increment attempts and return true if under max', () => {
      const queue = new MessageQueue(1000, 3);
      const id = queue.enqueue({ text: 'test' });
      expect(queue.markAttempted(id)).toBe(true);
      const message = queue.peek();
      expect(message?.attempts).toBe(1);
    });

    it('should return false when max attempts reached', () => {
      const queue = new MessageQueue(1000, 2);
      const id = queue.enqueue({ text: 'test' });
      queue.markAttempted(id);
      expect(queue.markAttempted(id)).toBe(false);
      const message = queue.peek();
      expect(message?.attempts).toBe(2);
    });

    it('should return false for non-existent message', () => {
      const queue = new MessageQueue();
      expect(queue.markAttempted('non-existent')).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove message by ID', () => {
      const queue = new MessageQueue();
      const id = queue.enqueue({ text: 'test' });
      expect(queue.remove(id)).toBe(true);
      expect(queue.size()).toBe(0);
    });

    it('should return false for non-existent ID', () => {
      const queue = new MessageQueue();
      expect(queue.remove('non-existent')).toBe(false);
    });
  });

  describe('size and isEmpty', () => {
    it('should return correct size', () => {
      const queue = new MessageQueue();
      expect(queue.size()).toBe(0);
      expect(queue.isEmpty()).toBe(true);
      queue.enqueue({ text: '1' });
      expect(queue.size()).toBe(1);
      expect(queue.isEmpty()).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all messages', () => {
      const queue = new MessageQueue();
      queue.enqueue({ text: '1' });
      queue.enqueue({ text: '2' });
      queue.clear();
      expect(queue.size()).toBe(0);
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('getAll', () => {
    it('should return all messages', () => {
      const queue = new MessageQueue();
      queue.enqueue({ text: '1' });
      queue.enqueue({ text: '2' });
      const all = queue.getAll();
      expect(all.length).toBe(2);
      expect(all[0].data.text).toBe('1');
      expect(all[1].data.text).toBe('2');
    });
  });
});




