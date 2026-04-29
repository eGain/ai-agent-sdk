import { describe, it, expect } from 'vitest';
import { Message } from './Message.js';
import { PERSONA, ROLE } from './types.js';

describe('Message', () => {
  describe('constructor', () => {
    it('should create a message with required fields', () => {
      const message = new Message(PERSONA.CUSTOMER, ROLE.HUMAN, 'Hello');
      expect(message.persona).toBe(PERSONA.CUSTOMER);
      expect(message.role).toBe(ROLE.HUMAN);
      expect(message.content).toBe('Hello');
      expect(message.timestamp).toBeGreaterThan(0);
    });

    it('should create a message with optional fields', () => {
      const timestamp = Date.now();
      const message = new Message(PERSONA.AGENT, ROLE.HUMAN, 'Hi', {
        messageId: 'msg-123',
        timestamp,
        from: 'user1',
        to: 'user2',
        agentId: 'agent-1',
        sessionId: 'session-1',
      });

      expect(message.messageId).toBe('msg-123');
      expect(message.timestamp).toBe(timestamp);
      expect(message.from).toBe('user1');
      expect(message.to).toBe('user2');
      expect(message.agentId).toBe('agent-1');
      expect(message.sessionId).toBe('session-1');
    });

    it('should use current timestamp if not provided', () => {
      const before = Date.now();
      const message = new Message(PERSONA.CUSTOMER, ROLE.HUMAN, 'Test');
      const after = Date.now();
      expect(message.timestamp).toBeGreaterThanOrEqual(before);
      expect(message.timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('validate', () => {
    it('should validate a valid message', () => {
      const message = new Message(PERSONA.CUSTOMER, ROLE.HUMAN, 'Hello');
      expect(() => message.validate()).not.toThrow();
    });

    it('should throw if persona is missing', () => {
      const message = new Message('' as any, ROLE.HUMAN, 'Hello');
      expect(() => message.validate()).toThrow('Message must have a persona');
    });

    it('should throw if role is missing', () => {
      const message = new Message(PERSONA.CUSTOMER, '' as any, 'Hello');
      expect(() => message.validate()).toThrow('Message must have a role');
    });

    it('should throw if content is not a string', () => {
      const message = new Message(PERSONA.CUSTOMER, ROLE.HUMAN, 123 as any);
      expect(() => message.validate()).toThrow('Message content must be a string');
    });
  });

  describe('toPayloadString', () => {
    it('should convert message to JSON payload', () => {
      const message = new Message(PERSONA.CUSTOMER, ROLE.HUMAN, 'Hello');
      const payload = message.toPayloadString();
      const parsed = JSON.parse(payload);
      
      expect(parsed.persona).toBe(PERSONA.CUSTOMER);
      expect(parsed.role).toBe(ROLE.HUMAN);
      expect(parsed.content).toBe('Hello');
    });

    it('should include messageData in payload', () => {
      const messageData = { context: 'test context' };
      const message = new Message(PERSONA.SYSTEM, ROLE.CONTEXT, '', {
        messageData,
      });
      const payload = message.toPayloadString();
      const parsed = JSON.parse(payload);
      
      expect(parsed.messageData).toEqual(messageData);
    });

    it('should validate before converting', () => {
      const message = new Message(PERSONA.CUSTOMER, ROLE.HUMAN, 123 as any);
      expect(() => message.toPayloadString()).toThrow();
    });
  });

  describe('fromJSON', () => {
    it('should create message from JSON object', () => {
      const data = {
        persona: PERSONA.CUSTOMER,
        role: ROLE.HUMAN,
        content: 'Hello',
      };
      const sessionContext = { agentId: 'agent-1', sessionId: 'session-1' };
      const message = Message.fromJSON(data, sessionContext);
      
      expect(message.persona).toBe(PERSONA.CUSTOMER);
      expect(message.role).toBe(ROLE.HUMAN);
      expect(message.content).toBe('Hello');
      expect(message.agentId).toBe('agent-1');
      expect(message.sessionId).toBe('session-1');
    });

    it('should create message from JSON string', () => {
      const jsonString = JSON.stringify({
        persona: PERSONA.AGENT,
        role: ROLE.HUMAN,
        content: 'Hi there',
      });
      const sessionContext = { agentId: 'agent-1', sessionId: 'session-1' };
      const message = Message.fromJSON(jsonString, sessionContext);
      
      expect(message.persona).toBe(PERSONA.AGENT);
      expect(message.role).toBe(ROLE.HUMAN);
      expect(message.content).toBe('Hi there');
    });

    it('should include optional fields from JSON', () => {
      const data = {
        persona: PERSONA.CUSTOMER,
        role: ROLE.HUMAN,
        content: 'Hello',
        messageId: 'msg-123',
        messageData: { context: 'test' },
        timestamp: 1234567890,
      };
      const sessionContext = { agentId: 'agent-1', sessionId: 'session-1', agentName: 'Agent', customerName: 'Customer' };
      const message = Message.fromJSON(data, sessionContext);
      
      expect(message.messageId).toBe('msg-123');
      expect(message.messageData).toEqual({ context: 'test' });
      expect(message.timestamp).toBe(1234567890);
      // from/to are derived from sessionContext, not from data
      expect(message.from).toBe('Agent');
      expect(message.to).toBe('Customer');
    });

    it('should throw if sessionContext is missing', () => {
      const data = {
        persona: PERSONA.CUSTOMER,
        role: ROLE.HUMAN,
        content: 'Hello',
      };
      expect(() => Message.fromJSON(data, null as any)).toThrow('Session context is required');
    });

    it('should throw if data is invalid', () => {
      const sessionContext = { agentId: 'agent-1', sessionId: 'session-1' };
      expect(() => Message.fromJSON(null, sessionContext)).toThrow('Invalid message data: must be an object');
      expect(() => Message.fromJSON('invalid', sessionContext)).toThrow();
    });

    it('should throw if required fields are missing', () => {
      const sessionContext = { agentId: 'agent-1', sessionId: 'session-1' };
      expect(() => Message.fromJSON({}, sessionContext)).toThrow();
      expect(() => Message.fromJSON({ persona: PERSONA.CUSTOMER }, sessionContext)).toThrow();
      // Note: content defaults to empty string if missing, so only persona and role are required
    });
  });
});
