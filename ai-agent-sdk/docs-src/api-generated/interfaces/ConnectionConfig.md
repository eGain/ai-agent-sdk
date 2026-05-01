[@egain/ai-agent-sdk API Reference - v0.1.0](../README.md) / ConnectionConfig

# Interface: ConnectionConfig

Connection configuration options

## Table of contents

### Properties

- [transport](ConnectionConfig.md#transport)
- [endpoint](ConnectionConfig.md#endpoint)
- [maxReconnectAttempts](ConnectionConfig.md#maxreconnectattempts)
- [baseReconnectDelay](ConnectionConfig.md#basereconnectdelay)
- [maxReconnectDelay](ConnectionConfig.md#maxreconnectdelay)
- [logger](ConnectionConfig.md#logger)

## Properties

### transport

• `Optional` **transport**: [`Transport`](../classes/Transport.md)

The transport instance to use for communication.
If not provided, a WebSocketTransport will be created using the endpoint.

#### Defined in

[core/connection/Connection.ts:28](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Connection.ts#L28)

___

### endpoint

• `Optional` **endpoint**: `string`

WebSocket endpoint URL (used when transport is not provided)

#### Defined in

[core/connection/Connection.ts:33](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Connection.ts#L33)

___

### maxReconnectAttempts

• `Optional` **maxReconnectAttempts**: `number`

Maximum reconnection attempts

**`Default`**

```ts
Infinity
```

#### Defined in

[core/connection/Connection.ts:39](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Connection.ts#L39)

___

### baseReconnectDelay

• `Optional` **baseReconnectDelay**: `number`

Base reconnection delay in milliseconds

**`Default`**

```ts
1000
```

#### Defined in

[core/connection/Connection.ts:45](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Connection.ts#L45)

___

### maxReconnectDelay

• `Optional` **maxReconnectDelay**: `number`

Maximum reconnection delay in milliseconds

**`Default`**

```ts
30000
```

#### Defined in

[core/connection/Connection.ts:51](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Connection.ts#L51)

___

### logger

• `Optional` **logger**: [`Logger`](../classes/Logger.md)

Logger instance (optional)
If not provided, uses globalLogger

#### Defined in

[core/connection/Connection.ts:57](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Connection.ts#L57)
