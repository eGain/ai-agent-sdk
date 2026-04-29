import { describe, it, expect } from 'vitest';
import {
  createContextMessage,
  createEscalationMessage,
  createFeedbackMessage,
  createAgentMessage,
  createGracefulDisconnectMessage,
} from './MessageTypes.js';
import { PERSONA, ROLE } from './types.js';

describe('MessageTypes', () => {
  describe('createContextMessage', () => {
    it('should create a context message with required fields', () => {
      const message = createContextMessage({ context: 'test context' });
      
      expect(message.persona).toBe(PERSONA.SYSTEM);
      expect(message.role).toBe(ROLE.CONTEXT);
      expect(message.content).toBe('');
      expect(message.messageData?.context).toBe('test context');
    });

    it('should include optional fields', () => {
      const message = createContextMessage({
        context: 'test context',
        messageId: 'msg-123',
        from: 'user1',
        to: 'user2',
      });
      
      expect(message.messageId).toBe('msg-123');
      expect(message.from).toBe('user1');
      expect(message.to).toBe('user2');
    });
  });

  describe('createEscalationMessage', () => {
    it('should create an escalation message with required fields', () => {
      const escalationEvent = { type: 'escalate', reason: 'timeout' };
      const message = createEscalationMessage({ escalationEvent });
      
      expect(message.persona).toBe(PERSONA.SYSTEM);
      expect(message.role).toBe(ROLE.ESCALATION);
      expect(message.content).toBe('');
      expect(message.messageData?.escalationEvent).toEqual(escalationEvent);
    });

    it('should include optional fields', () => {
      const escalationEvent = { type: 'escalate' };
      const message = createEscalationMessage({
        escalationEvent,
        messageId: 'msg-123',
        from: 'user1',
        to: 'user2',
      });
      
      expect(message.messageId).toBe('msg-123');
      expect(message.from).toBe('user1');
      expect(message.to).toBe('user2');
    });
  });

  describe('createFeedbackMessage', () => {
    it('should create a feedback message with required fields', () => {
      const message = createFeedbackMessage({
        rating: 'up',
        answerMessageId: 'answer-123',
      });
      
      expect(message.persona).toBe(PERSONA.SYSTEM);
      expect(message.role).toBe(ROLE.FEEDBACK);
      expect(message.content).toBeUndefined();
      expect(message.messageData?.feedback?.rating).toBe('up');
      expect(message.messageData?.feedback?.answerMessageId).toBe('answer-123');
    });

    it('should include optional fields', () => {
      const message = createFeedbackMessage({
        rating: 'down',
        answerMessageId: 'answer-123',
        messageId: 'msg-123',
        from: 'user1',
        to: 'user2',
      });
      
      expect(message.messageId).toBe('msg-123');
      expect(message.from).toBe('user1');
      expect(message.to).toBe('user2');
    });
  });

  describe('createAgentMessage', () => {
    it('should create an agent message with required fields', () => {
      const message = createAgentMessage({ content: 'Hello' });
      
      expect(message.persona).toBe(PERSONA.CUSTOMER);
      expect(message.role).toBe(ROLE.HUMAN);
      expect(message.content).toBe('Hello');
    });

    it('should use custom persona and role', () => {
      const message = createAgentMessage({
        content: 'Hello',
        persona: PERSONA.AGENT,
        role: 'assistant',
      });
      
      expect(message.persona).toBe(PERSONA.AGENT);
      expect(message.role).toBe('assistant');
      expect(message.content).toBe('Hello');
    });

    it('should include optional fields', () => {
      const message = createAgentMessage({
        content: 'Hello',
        messageId: 'msg-123',
        from: 'user1',
        to: 'user2',
      });
      
      expect(message.messageId).toBe('msg-123');
      expect(message.from).toBe('user1');
      expect(message.to).toBe('user2');
    });
  });

  describe('createGracefulDisconnectMessage', () => {
    it('should create a graceful disconnect message without params', () => {
      const message = createGracefulDisconnectMessage();
      
      expect(message.persona).toBe(PERSONA.SYSTEM);
      expect(message.role).toBe(ROLE.GRACEFUL_DISCONNECT);
      expect(message.content).toBeUndefined();
    });

    it('should include optional fields when provided', () => {
      const message = createGracefulDisconnectMessage({
        messageId: 'msg-123',
        from: 'user1',
        to: 'user2',
      });
      
      expect(message.messageId).toBe('msg-123');
      expect(message.from).toBe('user1');
      expect(message.to).toBe('user2');
    });
  });
});
