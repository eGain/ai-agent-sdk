/**
 * Log levels in order of severity
 * Lower numbers = more verbose, higher numbers = more severe
 */
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
}

/**
 * Get the string name of a log level
 * @param level - The log level
 * @returns The string name of the level
 */
export function getLevelName(level: LogLevel): string {
  return LogLevel[level] || 'UNKNOWN';
}

/**
 * Get the numeric value of a log level
 * @param level - The log level
 * @returns The numeric value
 */
export function getLevelValue(level: LogLevel): number {
  return level;
}

/**
 * Check if a log level is enabled based on the current threshold
 * A level is enabled if it is greater than or equal to the threshold
 * @param level - The log level to check
 * @param threshold - The minimum log level threshold
 * @returns True if the level should be logged
 */
export function isLevelEnabled(level: LogLevel, threshold: LogLevel): boolean {
  return level >= threshold;
}
