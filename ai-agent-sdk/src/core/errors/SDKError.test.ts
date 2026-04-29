import { describe, it, expect } from 'vitest';
import {
  SDKError,
  AuthError,
  ConnectionError,
  MessageError,
} from './SDKError.js';

describe('SDKError', () => {
  it('should create SDKError with message', () => {
    const error = new SDKError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('SDKError');
    expect(error.code).toBeUndefined();
  });

  it('should create SDKError with code', () => {
    const error = new SDKError('Test error', 'TEST_CODE');
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
  });

  it('should create SDKError with cause', () => {
    const cause = new Error('Original error');
    const error = new SDKError('Test error', undefined, cause);
    expect(error.cause).toBe(cause);
  });
});

describe('AuthError', () => {
  it('should create AuthError', () => {
    const error = new AuthError('Auth failed');
    expect(error.message).toBe('Auth failed');
    expect(error.name).toBe('AuthError');
    expect(error.code).toBe('AUTH_ERROR');
  });

  it('should create AuthError with cause', () => {
    const cause = new Error('Network error');
    const error = new AuthError('Auth failed', cause);
    expect(error.cause).toBe(cause);
  });
});

describe('ConnectionError', () => {
  it('should create ConnectionError', () => {
    const error = new ConnectionError('Connection failed');
    expect(error.message).toBe('Connection failed');
    expect(error.name).toBe('ConnectionError');
    expect(error.code).toBe('CONNECTION_ERROR');
  });
});

describe('MessageError', () => {
  it('should create MessageError', () => {
    const error = new MessageError('Message failed');
    expect(error.message).toBe('Message failed');
    expect(error.name).toBe('MessageError');
    expect(error.code).toBe('MESSAGE_ERROR');
  });
});




