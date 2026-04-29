import { describe, it, expect, beforeEach } from 'vitest';
import { Transcript } from './Transcript.js';
import { Message } from './Message.js';
import { PERSONA, ROLE } from './types.js';

describe('Transcript', () => {
  let transcript: Transcript;
  let message1: Message;
  let message2: Message;
  let message3: Message;

  beforeEach(() => {
    transcript = new Transcript();
    const timestamp = Date.now();
    message1 = new Message(PERSONA.CUSTOMER, ROLE.HUMAN, 'Hello', {
      messageId: 'msg-1',
      timestamp: timestamp,
    });
    message2 = new Message(PERSONA.AGENT, ROLE.HUMAN, 'Hi there', {
      messageId: 'msg-2',
      timestamp: timestamp + 1000,
    });
    message3 = new Message(PERSONA.CUSTOMER, ROLE.HUMAN, 'How are you?', {
      messageId: 'msg-3',
      timestamp: timestamp + 2000,
    });
  });

  describe('constructor', () => {
    it('should create transcript with default config', () => {
      const t = new Transcript();
      expect(t.size()).toBe(0);
    });

    it('should create transcript with custom config', () => {
      const t = new Transcript({
        enabled: false,
        excludeRoles: [ROLE.HEARTBEAT],
        excludePersonas: [PERSONA.SYSTEM],
      });
      expect(t.size()).toBe(0);
    });
  });

  describe('add', () => {
    it('should add a message to transcript', () => {
      transcript.add(message1, 'sent');
      expect(transcript.size()).toBe(1);
    });

    it('should add multiple messages', () => {
      transcript.add(message1, 'sent');
      transcript.add(message2, 'received');
      transcript.add(message3, 'sent');
      expect(transcript.size()).toBe(3);
    });

    it('should store direction correctly', () => {
      transcript.add(message1, 'sent');
      transcript.add(message2, 'received');
      const entries = transcript.getEntries();
      expect(entries[0].direction).toBe('sent');
      expect(entries[1].direction).toBe('received');
    });

    it('should store sessionId and agentId', () => {
      transcript.add(message1, 'sent', 'session-1', 'agent-1');
      const entries = transcript.getEntries();
      expect(entries[0].sessionId).toBe('session-1');
      expect(entries[0].agentId).toBe('agent-1');
    });

    it('should not add message when disabled', () => {
      const t = new Transcript({ enabled: false });
      t.add(message1, 'sent');
      expect(t.size()).toBe(0);
    });

    it('should filter out excluded roles', () => {
      const t = new Transcript({ excludeRoles: [ROLE.HEARTBEAT] });
      const heartbeatMessage = new Message(PERSONA.SYSTEM, ROLE.HEARTBEAT, 'ping');
      t.add(heartbeatMessage, 'received');
      expect(t.size()).toBe(0);
    });

    it('should filter out excluded personas', () => {
      const t = new Transcript({ excludePersonas: [PERSONA.SYSTEM] });
      const systemMessage = new Message(PERSONA.SYSTEM, ROLE.CONTEXT, 'context');
      t.add(systemMessage, 'received');
      expect(t.size()).toBe(0);
    });
  });

  describe('getEntries', () => {
    beforeEach(() => {
      transcript.add(message1, 'sent', 'session-1', 'agent-1');
      transcript.add(message2, 'received', 'session-1', 'agent-1');
      transcript.add(message3, 'sent', 'session-1', 'agent-1');
    });

    it('should return all entries when no options provided', () => {
      const entries = transcript.getEntries();
      expect(entries.length).toBe(3);
    });

    it('should filter by timestamp range', () => {
      const entries = transcript.getEntries({
        fromTimestamp: message1.timestamp + 500,
        toTimestamp: message2.timestamp + 500,
      });
      expect(entries.length).toBe(1);
      expect(entries[0].message.messageId).toBe('msg-2');
    });

    it('should filter by direction', () => {
      const sentEntries = transcript.getEntries({ direction: 'sent' });
      const receivedEntries = transcript.getEntries({ direction: 'received' });
      
      expect(sentEntries.length).toBe(2);
      expect(receivedEntries.length).toBe(1);
      expect(receivedEntries[0].message.messageId).toBe('msg-2');
    });

    it('should filter by persona', () => {
      const customerEntries = transcript.getEntries({ persona: PERSONA.CUSTOMER });
      const agentEntries = transcript.getEntries({ persona: PERSONA.AGENT });
      
      expect(customerEntries.length).toBe(2);
      expect(agentEntries.length).toBe(1);
    });

    it('should filter by role', () => {
      const humanEntries = transcript.getEntries({ role: ROLE.HUMAN });
      expect(humanEntries.length).toBe(3);
    });

    it('should combine multiple filters', () => {
      const entries = transcript.getEntries({
        direction: 'sent',
        persona: PERSONA.CUSTOMER,
      });
      expect(entries.length).toBe(2);
    });
  });

  describe('getEntriesAsJSON', () => {
    beforeEach(() => {
      transcript.add(message1, 'sent', 'session-1', 'agent-1');
    });

    it('should return entries as plain objects', () => {
      const entries = transcript.getEntriesAsJSON();
      expect(entries.length).toBe(1);
      expect(entries[0]).toHaveProperty('messageId');
      expect(entries[0]).toHaveProperty('persona');
      expect(entries[0]).toHaveProperty('role');
      expect(entries[0]).toHaveProperty('content');
      expect(entries[0]).toHaveProperty('direction');
      expect(entries[0]).toHaveProperty('entryTimestamp');
    });

    it('should include sessionId and agentId', () => {
      const entries = transcript.getEntriesAsJSON();
      expect(entries[0].sessionId).toBe('session-1');
      expect(entries[0].agentId).toBe('agent-1');
    });

    it('should respect filter options', () => {
      transcript.add(message2, 'received');
      const entries = transcript.getEntriesAsJSON({ direction: 'sent' });
      expect(entries.length).toBe(1);
      expect(entries[0].messageId).toBe('msg-1');
    });
  });

  describe('size', () => {
    it('should return 0 for empty transcript', () => {
      expect(transcript.size()).toBe(0);
    });

    it('should return correct size', () => {
      transcript.add(message1, 'sent');
      expect(transcript.size()).toBe(1);
      transcript.add(message2, 'received');
      expect(transcript.size()).toBe(2);
    });
  });

  describe('clear', () => {
    it('should clear all entries', () => {
      transcript.add(message1, 'sent');
      transcript.add(message2, 'received');
      expect(transcript.size()).toBe(2);
      transcript.clear();
      expect(transcript.size()).toBe(0);
    });
  });

  describe('updateConfig', () => {
    it('should update enabled state', () => {
      transcript.updateConfig({ enabled: false });
      transcript.add(message1, 'sent');
      expect(transcript.size()).toBe(0);
    });

    it('should update excludeRoles', () => {
      transcript.updateConfig({ excludeRoles: [ROLE.HEARTBEAT] });
      const heartbeatMessage = new Message(PERSONA.SYSTEM, ROLE.HEARTBEAT, 'ping');
      transcript.add(heartbeatMessage, 'received');
      expect(transcript.size()).toBe(0);
    });

    it('should update excludePersonas', () => {
      transcript.updateConfig({ excludePersonas: [PERSONA.SYSTEM] });
      const systemMessage = new Message(PERSONA.SYSTEM, ROLE.CONTEXT, 'context');
      transcript.add(systemMessage, 'received');
      expect(transcript.size()).toBe(0);
    });
  });
});
