import { EventEmitter } from '../events/EventEmitter.js';
import { LogLevel, isLevelEnabled, getLevelName } from './LogLevel.js';
import { LogEntry, LoggerEvents } from './types.js';

/**
 * Logger configuration options
 */
export interface LoggerConfig {
  /**
   * Minimum log level threshold
   * @default LogLevel.INFO
   */
  level?: LogLevel;

  /**
   * Enable console output
   * @default true
   */
  enableConsole?: boolean;

  /**
   * Logger name for identification
   * @default undefined
   */
  name?: string;

  /**
   * Context provider function that returns dynamic context at log time
   * This allows including dynamic values like sessionId in all log entries
   * @default undefined
   */
  contextProvider?: () => Record<string, any>;
}

/**
 * Logger class that extends EventEmitter for log subscription
 * Supports log level filtering and console output
 */
export class Logger extends EventEmitter<LoggerEvents> {
  private level: LogLevel;
  private enableConsole: boolean;
  private name?: string;
  private contextProvider?: () => Record<string, any>;

  constructor(config: LoggerConfig = {}) {
    super();
    this.level = config.level ?? LogLevel.INFO;
    this.enableConsole = config.enableConsole ?? true;
    this.name = config.name;
    this.contextProvider = config.contextProvider;
  }

  /**
   * Set the minimum log level threshold
   * @param level - The minimum log level to log
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Get the current log level threshold
   * @returns The current log level
   */
  getLevel(): LogLevel {
    return this.level;
  }

  /**
   * Enable or disable console output
   * @param enabled - Whether to enable console output
   */
  enableConsoleOutput(enabled: boolean): void {
    this.enableConsole = enabled;
  }

  /**
   * Check if console output is enabled
   * @returns True if console output is enabled
   */
  isConsoleOutputEnabled(): boolean {
    return this.enableConsole;
  }

  /**
   * Log a TRACE level message
   * @param message - The log message
   * @param context - Optional context/metadata
   */
  trace(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.TRACE, message, undefined, context);
  }

  /**
   * Log a DEBUG level message
   * @param message - The log message
   * @param context - Optional context/metadata
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, undefined, context);
  }

  /**
   * Log an INFO level message
   * @param message - The log message
   * @param context - Optional context/metadata
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, undefined, context);
  }

  /**
   * Log a WARN level message
   * @param message - The log message
   * @param context - Optional context/metadata
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, undefined, context);
  }

  /**
   * Log an ERROR level message
   * @param message - The log message
   * @param error - Optional error object
   * @param context - Optional context/metadata
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, error, context);
  }

  /**
   * Log a FATAL level message
   * @param message - The log message
   * @param error - Optional error object
   * @param context - Optional context/metadata
   */
  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, error, context);
  }

  /**
   * Internal logging method
   * Checks level threshold, creates log entry, emits event, and outputs to console
   * @param level - The log level
   * @param message - The log message
   * @param error - Optional error object
   * @param context - Optional context/metadata
   */
  private log(
    level: LogLevel,
    message: string,
    error?: Error,
    context?: Record<string, any>
  ): void {
    // Check if this level should be logged
    if (!isLevelEnabled(level, this.level)) {
      return;
    }

    // Get dynamic context from provider if available
    let dynamicContext: Record<string, any> = {};
    if (this.contextProvider) {
      try {
        dynamicContext = this.contextProvider() || {};
      } catch (err) {
        // Silently ignore errors in context provider to avoid breaking logging
      }
    }

    // Extract sessionId from dynamic context if present
    const sessionId = dynamicContext.sessionId;

    // Merge contexts: dynamic context first, then explicit context (explicit takes precedence)
    const mergedContext = { ...dynamicContext, ...context };
    // Remove sessionId from merged context since it's stored separately in LogEntry
    if (sessionId !== undefined) {
      delete mergedContext.sessionId;
    }

    // Create log entry
    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context: Object.keys(mergedContext).length > 0 ? mergedContext : undefined,
      error,
      loggerName: this.name,
      sessionId,
    };

    // Emit log event for subscribers
    this.emit('log', entry);

    // Output to console if enabled
    if (this.enableConsole) {
      this.outputToConsole(entry);
    }
  }

  /**
   * Output log entry to console based on level
   * @param entry - The log entry to output
   */
  private outputToConsole(entry: LogEntry): void {
    const levelName = getLevelName(entry.level);
    const timestamp = new Date(entry.timestamp).toISOString();
    const sessionIdPart = entry.sessionId ? ` [sessionId:${entry.sessionId}]` : '';
    const prefix = entry.loggerName
      ? `[${levelName}] [${timestamp}] [${entry.loggerName}]${sessionIdPart}`
      : `[${levelName}] [${timestamp}]${sessionIdPart}`;
    const message = `${prefix} ${entry.message}`;

    // Include context if present
    const logArgs: any[] = [message];
    if (entry.context) {
      logArgs.push(entry.context);
    }
    if (entry.error) {
      logArgs.push(entry.error);
    }

    // Use appropriate console method based on level
    switch (entry.level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        console.debug(...logArgs);
        break;
      case LogLevel.INFO:
        console.info(...logArgs);
        break;
      case LogLevel.WARN:
        console.warn(...logArgs);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(...logArgs);
        if (entry.error?.stack) {
          console.error(entry.error.stack);
        }
        break;
    }
  }

  /**
   * Create a child logger with additional context
   * @param name - Name for the child logger
   * @param context - Additional context to include in all logs
   * @returns A new logger instance with merged context
   */
  createChild(name: string, context?: Record<string, any>): Logger {
    const childLogger = new Logger({
      level: this.level,
      enableConsole: this.enableConsole,
      name: name,
      contextProvider: this.contextProvider, // Inherit parent's context provider
    });

    // Override log method to include parent context
    const originalLog = childLogger['log'].bind(childLogger);
    childLogger['log'] = (
      level: LogLevel,
      message: string,
      error?: Error,
      childContext?: Record<string, any>
    ) => {
      const mergedContext = { ...context, ...childContext };
      originalLog(level, message, error, mergedContext);
    };

    return childLogger;
  }
}
