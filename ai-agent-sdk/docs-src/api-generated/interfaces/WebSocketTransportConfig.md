[@eGainDev/ai-agent-sdk API Reference - v0.0.13](../README.md) / WebSocketTransportConfig

# Interface: WebSocketTransportConfig

WebSocket transport configuration

## Hierarchy

- [`TransportConfig`](TransportConfig.md)

  ↳ **`WebSocketTransportConfig`**

## Table of contents

### Properties

- [endpoint](WebSocketTransportConfig.md#endpoint)
- [connectionTimeout](WebSocketTransportConfig.md#connectiontimeout)
- [logger](WebSocketTransportConfig.md#logger)
- [protocols](WebSocketTransportConfig.md#protocols)

## Properties

### endpoint

• **endpoint**: `string`

Connection endpoint URL

#### Inherited from

[TransportConfig](TransportConfig.md).[endpoint](TransportConfig.md#endpoint)

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

#### Inherited from

[TransportConfig](TransportConfig.md).[connectionTimeout](TransportConfig.md#connectiontimeout)

#### Defined in

[core/connection/Transport.ts:43](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Transport.ts#L43)

___

### logger

• `Optional` **logger**: [`Logger`](../classes/Logger.md)

Logger instance (optional)
If not provided, uses globalLogger

#### Inherited from

[TransportConfig](TransportConfig.md).[logger](TransportConfig.md#logger)

#### Defined in

[core/connection/Transport.ts:49](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Transport.ts#L49)

___

### protocols

• `Optional` **protocols**: `string` \| `string`[]

WebSocket protocols (optional)

#### Defined in

[core/connection/WebSocketTransport.ts:11](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/WebSocketTransport.ts#L11)
