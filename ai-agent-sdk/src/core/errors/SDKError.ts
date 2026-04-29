/**
 * Base error class for all SDK errors
 */
export class SDKError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'SDKError';
    Object.setPrototypeOf(this, SDKError.prototype);
  }
}

/**
 * Authentication-related errors
 */
export class AuthError extends SDKError {
  constructor(message: string, cause?: Error) {
    super(message, 'AUTH_ERROR', cause);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * Connection-related errors
 */
export class ConnectionError extends SDKError {
  constructor(message: string, cause?: Error) {
    super(message, 'CONNECTION_ERROR', cause);
    this.name = 'ConnectionError';
    Object.setPrototypeOf(this, ConnectionError.prototype);
  }
}

/**
 * Message-related errors
 */
export class MessageError extends SDKError {
  constructor(message: string, cause?: Error) {
    super(message, 'MESSAGE_ERROR', cause);
    this.name = 'MessageError';
    Object.setPrototypeOf(this, MessageError.prototype);
  }
}




