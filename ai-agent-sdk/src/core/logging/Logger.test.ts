import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Logger } from './Logger.js';
import { LogLevel } from './LogLevel.js';

describe('Logger', () => {
  let logger: Logger;
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logger = new Logger({ enableConsole: true });
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create logger with default config', () => {
      const l = new Logger();
      expect(l.getLevel()).toBe(LogLevel.INFO);
      expect(l.isConsoleOutputEnabled()).toBe(true);
    });

    it('should create logger with custom config', () => {
      const l = new Logger({
        level: LogLevel.DEBUG,
        enableConsole: false,
        name: 'TestLogger',
      });
      expect(l.getLevel()).toBe(LogLevel.DEBUG);
      expect(l.isConsoleOutputEnabled()).toBe(false);
    });
  });

  describe('setLevel and getLevel', () => {
    it('should set and get log level', () => {
      logger.setLevel(LogLevel.DEBUG);
      expect(logger.getLevel()).toBe(LogLevel.DEBUG);
      logger.setLevel(LogLevel.ERROR);
      expect(logger.getLevel()).toBe(LogLevel.ERROR);
    });
  });

  describe('enableConsoleOutput and isConsoleOutputEnabled', () => {
    it('should enable and disable console output', () => {
      logger.enableConsoleOutput(false);
      expect(logger.isConsoleOutputEnabled()).toBe(false);
      logger.enableConsoleOutput(true);
      expect(logger.isConsoleOutputEnabled()).toBe(true);
    });
  });

  describe('log levels', () => {
    it('should log trace messages when level allows', () => {
      logger.setLevel(LogLevel.TRACE);
      logger.trace('Trace message');
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should not log trace messages when level is higher', () => {
      logger.setLevel(LogLevel.INFO);
      logger.trace('Trace message');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should log debug messages when level allows', () => {
      logger.setLevel(LogLevel.DEBUG);
      logger.debug('Debug message');
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should log info messages', () => {
      logger.info('Info message');
      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should log warn messages', () => {
      logger.warn('Warn message');
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should log error messages', () => {
      const error = new Error('Test error');
      logger.error('Error message', error);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log fatal messages', () => {
      const error = new Error('Fatal error');
      logger.fatal('Fatal message', error);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('context', () => {
    it('should include context in log entry', () => {
      const logHandler = vi.fn();
      logger.on('log', logHandler);
      logger.info('Test message', { key: 'value' });
      
      expect(logHandler).toHaveBeenCalled();
      const entry = logHandler.mock.calls[0][0];
      expect(entry.context).toEqual({ key: 'value' });
    });
  });

  describe('error handling', () => {
    it('should include error in log entry', () => {
      const logHandler = vi.fn();
      logger.on('log', logHandler);
      const error = new Error('Test error');
      logger.error('Error message', error);
      
      expect(logHandler).toHaveBeenCalled();
      const entry = logHandler.mock.calls[0][0];
      expect(entry.error).toBe(error);
    });
  });

  describe('event emission', () => {
    it('should emit log events', () => {
      const logHandler = vi.fn();
      logger.on('log', logHandler);
      logger.info('Test message');
      
      expect(logHandler).toHaveBeenCalledTimes(1);
      const entry = logHandler.mock.calls[0][0];
      expect(entry.level).toBe(LogLevel.INFO);
      expect(entry.message).toBe('Test message');
    });

    it('should include timestamp in log entry', () => {
      const logHandler = vi.fn();
      logger.on('log', logHandler);
      const before = Date.now();
      logger.info('Test message');
      const after = Date.now();
      
      const entry = logHandler.mock.calls[0][0];
      expect(entry.timestamp).toBeGreaterThanOrEqual(before);
      expect(entry.timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('console output control', () => {
    it('should not output to console when disabled', () => {
      logger.enableConsoleOutput(false);
      logger.info('Test message');
      expect(consoleInfoSpy).not.toHaveBeenCalled();
    });

    it('should still emit events when console disabled', () => {
      const logHandler = vi.fn();
      logger.on('log', logHandler);
      logger.enableConsoleOutput(false);
      logger.info('Test message');
      
      expect(logHandler).toHaveBeenCalled();
    });
  });

  describe('createChild', () => {
    it('should create child logger', () => {
      const childLogger = logger.createChild('ChildLogger');
      expect(childLogger).toBeInstanceOf(Logger);
      expect(childLogger).not.toBe(logger);
    });

    it('should inherit parent logger level', () => {
      logger.setLevel(LogLevel.DEBUG);
      const childLogger = logger.createChild('ChildLogger');
      expect(childLogger.getLevel()).toBe(LogLevel.DEBUG);
    });

    it('should accept optional context', () => {
      const childLogger = logger.createChild('ChildLogger', { key: 'value' });
      expect(childLogger).toBeInstanceOf(Logger);
    });
  });

  describe('contextProvider', () => {
    it('should include sessionId from contextProvider in log entry', () => {
      const sessionId = 'session-123';
      const loggerWithProvider = new Logger({
        contextProvider: () => ({ sessionId }),
      });

      const logHandler = vi.fn();
      loggerWithProvider.on('log', logHandler);
      loggerWithProvider.info('Test message');

      expect(logHandler).toHaveBeenCalled();
      const entry = logHandler.mock.calls[0][0];
      expect(entry.sessionId).toBe(sessionId);
    });

    it('should not include sessionId when contextProvider returns undefined', () => {
      const loggerWithProvider = new Logger({
        contextProvider: () => ({}),
      });

      const logHandler = vi.fn();
      loggerWithProvider.on('log', logHandler);
      loggerWithProvider.info('Test message');

      expect(logHandler).toHaveBeenCalled();
      const entry = logHandler.mock.calls[0][0];
      expect(entry.sessionId).toBeUndefined();
    });

    it('should update sessionId when contextProvider returns different values', () => {
      let sessionId = 'session-123';
      const loggerWithProvider = new Logger({
        contextProvider: () => ({ sessionId }),
      });

      const logHandler = vi.fn();
      loggerWithProvider.on('log', logHandler);

      loggerWithProvider.info('First message');
      expect(logHandler.mock.calls[0][0].sessionId).toBe('session-123');

      sessionId = 'session-456';
      loggerWithProvider.info('Second message');
      expect(logHandler.mock.calls[1][0].sessionId).toBe('session-456');
    });

    it('should include sessionId in console output when present', () => {
      const sessionId = 'session-123';
      const loggerWithProvider = new Logger({
        enableConsole: true,
        contextProvider: () => ({ sessionId }),
      });

      loggerWithProvider.info('Test message');

      expect(consoleInfoSpy).toHaveBeenCalled();
      const consoleCall = consoleInfoSpy.mock.calls[0][0];
      expect(consoleCall).toContain('sessionId:session-123');
    });

    it('should not include sessionId in console output when not present', () => {
      const loggerWithoutProvider = new Logger({
        enableConsole: true,
      });

      loggerWithoutProvider.info('Test message');

      expect(consoleInfoSpy).toHaveBeenCalled();
      const consoleCall = consoleInfoSpy.mock.calls[0][0];
      expect(consoleCall).not.toContain('sessionId:');
    });

    it('should merge contextProvider context with explicit context', () => {
      const loggerWithProvider = new Logger({
        contextProvider: () => ({ sessionId: 'session-123', dynamicKey: 'dynamicValue' }),
      });

      const logHandler = vi.fn();
      loggerWithProvider.on('log', logHandler);
      loggerWithProvider.info('Test message', { explicitKey: 'explicitValue' });

      expect(logHandler).toHaveBeenCalled();
      const entry = logHandler.mock.calls[0][0];
      expect(entry.sessionId).toBe('session-123');
      expect(entry.context).toEqual({
        dynamicKey: 'dynamicValue',
        explicitKey: 'explicitValue',
      });
      // sessionId should not be in context, only in sessionId field
      expect(entry.context?.sessionId).toBeUndefined();
    });

    it('should prioritize explicit context over contextProvider context', () => {
      const loggerWithProvider = new Logger({
        contextProvider: () => ({ sessionId: 'session-123', key: 'providerValue' }),
      });

      const logHandler = vi.fn();
      loggerWithProvider.on('log', logHandler);
      loggerWithProvider.info('Test message', { key: 'explicitValue' });

      expect(logHandler).toHaveBeenCalled();
      const entry = logHandler.mock.calls[0][0];
      expect(entry.context?.key).toBe('explicitValue');
    });

    it('should handle contextProvider errors gracefully', () => {
      const loggerWithProvider = new Logger({
        contextProvider: () => {
          throw new Error('Provider error');
        },
      });

      const logHandler = vi.fn();
      loggerWithProvider.on('log', logHandler);
      
      // Should not throw, should log normally
      expect(() => loggerWithProvider.info('Test message')).not.toThrow();
      expect(logHandler).toHaveBeenCalled();
    });

    it('should inherit contextProvider in child loggers', () => {
      const sessionId = 'session-123';
      const parentLogger = new Logger({
        contextProvider: () => ({ sessionId }),
      });

      const childLogger = parentLogger.createChild('ChildLogger');

      const logHandler = vi.fn();
      childLogger.on('log', logHandler);
      childLogger.info('Test message');

      expect(logHandler).toHaveBeenCalled();
      const entry = logHandler.mock.calls[0][0];
      expect(entry.sessionId).toBe(sessionId);
    });

    it('should include sessionId in child logger console output', () => {
      const sessionId = 'session-123';
      const parentLogger = new Logger({
        enableConsole: true,
        contextProvider: () => ({ sessionId }),
      });

      const childLogger = parentLogger.createChild('ChildLogger');
      childLogger.info('Test message');

      expect(consoleInfoSpy).toHaveBeenCalled();
      const consoleCall = consoleInfoSpy.mock.calls[0][0];
      expect(consoleCall).toContain('sessionId:session-123');
    });
  });
});
