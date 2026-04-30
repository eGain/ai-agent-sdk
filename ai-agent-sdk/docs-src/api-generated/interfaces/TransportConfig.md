[@eGain/ai-agent-sdk API Reference - v0.0.14](../README.md) / TransportConfig

# Interface: TransportConfig

Transport configuration options

## Hierarchy

- **`TransportConfig`**

  ↳ [`WebSocketTransportConfig`](WebSocketTransportConfig.md)

## Table of contents

### Properties

- [endpoint](TransportConfig.md#endpoint)
- [connectionTimeout](TransportConfig.md#connectiontimeout)
- [logger](TransportConfig.md#logger)

## Properties

### endpoint

• **endpoint**: `string`

Connection endpoint URL

#### Defined in

[core/connection/Transport.ts:37](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Transport.ts#L37)

___

### connectionTimeout

• `Optional` **connectionTimeout**: `number`

Connection timeout in milliseconds

**`Default`**

```ts
10000
```

#### Defined in

[core/connection/Transport.ts:43](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Transport.ts#L43)

___

### logger

• `Optional` **logger**: [`Logger`](../classes/Logger.md)

Logger instance (optional)
If not provided, uses globalLogger

#### Defined in

[core/connection/Transport.ts:49](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Transport.ts#L49)
