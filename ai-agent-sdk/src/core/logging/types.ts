import { LogLevel } from './LogLevel.js';

/**
 * Log entry structure emitted by the logger
 */
export interface LogEntry {
  /**
   * Log level
   */
  level: LogLevel;

  /**
   * Log message
   */
  message: string;

  /**
   * Timestamp when the log was created (milliseconds since epoch)
   */
  timestamp: number;

  /**
   * Optional context/metadata
   */
  context?: Record<string, any>;

  /**
   * Optional error object (for ERROR and FATAL levels)
   */
  error?: Error;

  /**
   * Optional agent identifier
   */
  agentId?: string | number;

  /**
   * Optional session identifier
   */
  sessionId?: string | number;

  /**
   * Optional logger name for identification
   */
  loggerName?: string;
}

/**
 * Logger event map for EventEmitter
 */
export interface LoggerEvents {
  log: LogEntry;
}
