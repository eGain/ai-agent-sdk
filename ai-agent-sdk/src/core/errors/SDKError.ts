import type { AgentListItem, Portal } from '../types/PortalTypes.js';

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

/** Stage of the CC initialization pipeline when an {@link InitializationPipelineError} is thrown. */
export type InitializationPipelineStage = 'start' | 'portal' | 'agent' | 'profile';

/** Stable codes for CC initialization pipeline failures. */
export const InitializationPipelineErrorCode = {
  AUTH_TOKEN_REQUIRED: 'AUTH_TOKEN_REQUIRED',
  NO_PORTALS: 'NO_PORTALS',
  PORTAL_FETCH_FAILED: 'PORTAL_FETCH_FAILED',
  PORTAL_DETAILS_FAILED: 'PORTAL_DETAILS_FAILED',
  PROFILE_FETCH_FAILED: 'PROFILE_FETCH_FAILED',
  PROFILE_PERSIST_FAILED: 'PROFILE_PERSIST_FAILED',
  NO_AGENTS_FOR_PORTAL: 'NO_AGENTS_FOR_PORTAL',
  DEPARTMENT_ID_REQUIRED: 'DEPARTMENT_ID_REQUIRED',
  INVALID_SELECTION: 'INVALID_SELECTION',
} as const;

export type InitializationPipelineErrorCode =
  (typeof InitializationPipelineErrorCode)[keyof typeof InitializationPipelineErrorCode];

export type InitializationPipelineErrorOptions = {
  cause?: Error;
  stage?: InitializationPipelineStage;
  portal?: Portal;
  agent?: AgentListItem;
};

/**
 * Thrown when the CC portal initialization pipeline fails.
 * Consumers should catch this type and branch on {@link pipelineCode} (also on `error.code`).
 */
export class InitializationPipelineError extends SDKError {
  public readonly stage?: InitializationPipelineStage;
  public readonly portal?: Portal;
  public readonly agent?: AgentListItem;

  constructor(
    message: string,
    public readonly pipelineCode: InitializationPipelineErrorCode,
    causeOrOptions?: Error | InitializationPipelineErrorOptions
  ) {
    const options =
      causeOrOptions instanceof Error
        ? { cause: causeOrOptions }
        : causeOrOptions;
    super(message, pipelineCode, options?.cause);
    this.name = 'InitializationPipelineError';
    this.stage = options?.stage;
    this.portal = options?.portal;
    this.agent = options?.agent;
    Object.setPrototypeOf(this, InitializationPipelineError.prototype);
  }
}

