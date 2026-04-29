import { Persona, Role, MessageData, PERSONA, SessionContext } from './types.js';

/**
 * Message class representing both incoming and outgoing messages
 */
export class Message {
  public readonly messageId?: string;
  public readonly persona: Persona;
  public readonly role: Role;
  public readonly content?: string;
  public readonly messageData?: MessageData;
  public readonly timestamp: number;
  public readonly from?: string;
  public readonly to?: string;
  public readonly agentId?: any;
  public readonly sessionId?: any;

  /**
   * Create a new Message instance
   */
  constructor(
    persona: Persona,
    role: Role,
    content?: string,
    options?: {
      messageId?: string;
      messageData?: MessageData;
      timestamp?: number;
      from?: string;
      to?: string;
      agentId?: string;
      sessionId?: string;
    }
  ) {
    this.persona = persona;
    this.role = role;
    this.content = content;
    this.messageId = options?.messageId;
    this.messageData = options?.messageData;
    this.timestamp = options?.timestamp ?? Date.now();
    this.from = options?.from;
    this.to = options?.to;
    this.agentId = options?.agentId;
    this.sessionId = options?.sessionId;
  }

  /**
   * Validate message structure
   * @throws {Error} If message is invalid
   */
  validate(): void {
    if (!this.persona) {
      throw new Error('Message must have a persona');
    }
    if (!this.role) {
      throw new Error('Message must have a role');
    }
    if (this.content !== undefined && typeof this.content !== 'string') {
      throw new Error('Message content must be a string');
    }
  }

  /**
   * Convert message to payload string (JSON) for transmission
   * Outgoing payload is configured here
   * @returns JSON string
   */
  toPayloadString(): string {
    this.validate();
    const payload: any = {
      persona: this.persona,
      role: this.role,
    };

    // Only include content if it's defined
    if (this.content !== undefined) {
      payload.content = this.content;
    }
    
    // Include messageData if present (for context, escalation, feedback, etc.)
    if (this.messageData) {
      payload.messageData = this.messageData;
    }
    
    return JSON.stringify(payload);
  }

  /**
   * Create a Message instance from JSON data (typically from WebSocket)
   */
  static fromJSON(data: any, sessionContext: SessionContext): Message {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    if (!sessionContext) {
      throw new Error('Session context is required');
    }

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid message data: must be an object');
    }

    const message = new Message(
      data.persona,
      data.role,
      data.content || '',
      {
        messageId: data.messageId,
        messageData: data.messageData,
        timestamp: data.timestamp,
        from: sessionContext.agentName,
        to: sessionContext.customerName,
        agentId: sessionContext.agentId,
        sessionId: sessionContext.sessionId,
      }
    );

    message.validate();
    return message;
  }

  /**
   * Check if this is an incoming message
   * Incoming messages come from the server (agent, system, or metadata)
   * Can also be identified by the 'from' field if it's set to an agent ID
   */
  isIncoming(): boolean {
    // If 'from' field is set and persona is agent/system/metadata, it's incoming
    if (this.from && (this.persona === PERSONA.AGENT || this.persona === PERSONA.SYSTEM || this.persona === PERSONA.METADATA)) {
      return true;
    }
    // Fallback to checking persona (server-side personas are incoming)
    if (this.persona === PERSONA.AGENT || this.persona === PERSONA.SYSTEM || this.persona === PERSONA.METADATA) {
      return true;
    }
    // If messageId is set, it's likely incoming (set by server)
    return !!this.messageId;
  }

  /**
   * Check if this is an outgoing message
   * Outgoing messages are sent by the client (customer)
   * Can also be identified by the 'from' field if it's set to a customer/client ID
   */
  isOutgoing(): boolean {
    // Customer persona messages are always outgoing
    if (this.persona === PERSONA.CUSTOMER) {
      return true;
    }
    // If 'from' field indicates a customer/client and persona is system, it's outgoing
    // (e.g., context messages, escalation, feedback sent by client)
    if (this.persona === PERSONA.SYSTEM && this.from && !this.messageId) {
      // System messages without messageId and with 'from' are likely outgoing
      return true;
    }
    // Default: if no messageId and persona is customer, it's outgoing
    return false;
  }

  /**
   * Create a copy of this message with updated fields
   */
  clone(updates?: Partial<{
    persona: Persona;
    role: Role;
    content: string;
    messageId: string;
    messageData: MessageData;
    timestamp: number;
    from: string;
    to: string;
  }>): Message {
    return new Message(
      updates?.persona ?? this.persona,
      updates?.role ?? this.role,
      updates?.content ?? this.content,
      {
        messageId: updates?.messageId ?? this.messageId,
        messageData: updates?.messageData ?? this.messageData,
        timestamp: updates?.timestamp ?? this.timestamp,
        from: updates?.from ?? this.from,
        to: updates?.to ?? this.to,
      }
    );
  }
}

