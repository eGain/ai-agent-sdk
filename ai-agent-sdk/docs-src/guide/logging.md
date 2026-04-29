# Logging

The SDK includes a comprehensive logging system for debugging and monitoring.

## Log Levels

```typescript
import { LogLevel } from "@eGainDev/ai-agent-sdk";

LogLevel.TRACE  // 0 - Most verbose
LogLevel.DEBUG  // 1 - Debug information
LogLevel.INFO   // 2 - General information (default)
LogLevel.WARN   // 3 - Warnings
LogLevel.ERROR  // 4 - Errors only
```

## Configuring Logging

```typescript
import { AiAgent, LogLevel } from "@eGainDev/ai-agent-sdk";

const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://endpoint.com",
  auth: { type: "pre-auth", accessToken: "your-access-token" },
  
  logLevel: LogLevel.DEBUG,  // Set log level
  enableLogging: true        // Enable console output
});
```

## Disabling Logging

```typescript
const agent = new AiAgent({
  // ...
  enableLogging: false  // No console output
});
```

## Custom Logger

Provide your own logger instance:

```typescript
import { Logger, LogLevel, AiAgent } from "@eGainDev/ai-agent-sdk";

const logger = new Logger({
  level: LogLevel.DEBUG,
  enableConsole: true,
  name: "MyApp"
});

const agent = new AiAgent({
  // ...
  logger: logger
});
```

## Logger Events

Subscribe to log events:

```typescript
agent.logger.on("log", (entry) => {
  console.log(`[${entry.level}] ${entry.message}`, entry.context);
  
  // Send to external logging service
  if (entry.level >= LogLevel.WARN) {
    sendToLogService(entry);
  }
});
```

## Log Entry Structure

```typescript
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  name?: string;
  context?: Record<string, any>;
}
```

## Accessing the Logger

```typescript
// Use agent's logger
agent.logger.debug("Custom debug message");
agent.logger.info("Info message", { userId: "123" });
agent.logger.warn("Warning message");
agent.logger.error("Error message", { error: someError });
```

## Log Level Utilities

```typescript
import { 
  getLevelName, 
  getLevelValue, 
  isLevelEnabled 
} from "@eGainDev/ai-agent-sdk";

getLevelName(LogLevel.INFO);  // "INFO"
getLevelValue("INFO");        // LogLevel.INFO
isLevelEnabled(LogLevel.DEBUG, LogLevel.INFO);  // false
```

## Production Configuration

```typescript
const isProd = process.env.NODE_ENV === "production";

const agent = new AiAgent({
  // ...
  logLevel: isProd ? LogLevel.WARN : LogLevel.DEBUG,
  enableLogging: !isProd  // Disable console in production
});

// In production, use event-based logging
if (isProd) {
  agent.logger.on("log", (entry) => {
    if (entry.level >= LogLevel.WARN) {
      sendToLoggingService(entry);
    }
  });
}
```

## Best Practices

1. **Use DEBUG in development** for detailed information
2. **Use INFO or WARN in production** to reduce noise
3. **Subscribe to log events** for external logging services
4. **Disable console output** in production for performance
