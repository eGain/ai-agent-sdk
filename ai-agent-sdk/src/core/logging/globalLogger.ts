import { Logger } from './Logger.js';
import { LogLevel } from './LogLevel.js';

/**
 * Global logger instance for application-wide logging
 * Default level: INFO
 * Default console output: enabled
 */
export const globalLogger = new Logger({
  level: LogLevel.INFO,
  enableConsole: true,
});
