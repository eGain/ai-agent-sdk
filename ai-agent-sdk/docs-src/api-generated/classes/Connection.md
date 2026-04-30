[@eGainDev/ai-agent-sdk API Reference - v0.0.14](../README.md) / Connection

# Class: Connection

Connection manager with automatic reconnection.

This class wraps a Transport implementation and adds:
- Connection state management
- Automatic reconnection with exponential backoff
- Event forwarding and normalization

The Connection class is transport-agnostic - it can work with any
transport that implements the Transport interface (WebSocket, SSE, etc.)

**`Example`**

```typescript
// Using default WebSocket transport
const conn = new Connection({
  endpoint: 'wss://api.example.com/ws'
});

// Using custom transport
const customTransport = new MyCustomTransport({ endpoint: '...' });
const conn = new Connection({ transport: customTransport });
```

## Hierarchy

- [`EventEmitter`](EventEmitter.md)\<[`ConnectionEvents`](../interfaces/ConnectionEvents.md)\>

  ↳ **`Connection`**

## Table of contents

### Constructors

- [constructor](Connection.md#constructor)

### Methods

- [getTransport](Connection.md#gettransport)
- [getTransportType](Connection.md#gettransporttype)
- [getState](Connection.md#getstate)
- [isConnected](Connection.md#isconnected)
- [connect](Connection.md#connect)
- [disconnect](Connection.md#disconnect)
- [send](Connection.md#send)
- [setMaxReconnectAttempts](Connection.md#setmaxreconnectattempts)
- [setReconnectDelays](Connection.md#setreconnectdelays)
- [on](Connection.md#on)
- [once](Connection.md#once)
- [off](Connection.md#off)
- [removeAllListeners](Connection.md#removealllisteners)
- [listenerCount](Connection.md#listenercount)

## Constructors

### constructor

• **new Connection**(`config`): [`Connection`](Connection.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`ConnectionConfig`](../interfaces/ConnectionConfig.md) |

#### Returns

[`Connection`](Connection.md)

#### Overrides

[EventEmitter](EventEmitter.md).[constructor](EventEmitter.md#constructor)

#### Defined in

[core/connection/Connection.ts:94](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L94)

• **new Connection**(`endpoint`): [`Connection`](Connection.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | `string` |

#### Returns

[`Connection`](Connection.md)

**`Deprecated`**

Use ConnectionConfig object instead

#### Overrides

EventEmitter\&lt;ConnectionEvents\&gt;.constructor

#### Defined in

[core/connection/Connection.ts:98](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L98)

## Methods

### getTransport

▸ **getTransport**(): [`Transport`](Transport.md)

Get the underlying transport instance

#### Returns

[`Transport`](Transport.md)

#### Defined in

[core/connection/Connection.ts:154](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L154)

___

### getTransportType

▸ **getTransportType**(): `string`

Get the transport type

#### Returns

`string`

#### Defined in

[core/connection/Connection.ts:161](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L161)

___

### getState

▸ **getState**(): [`ConnectionState`](../enums/ConnectionState.md)

Get current connection state

#### Returns

[`ConnectionState`](../enums/ConnectionState.md)

#### Defined in

[core/connection/Connection.ts:168](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L168)

___

### isConnected

▸ **isConnected**(): `boolean`

Check if connected

#### Returns

`boolean`

#### Defined in

[core/connection/Connection.ts:175](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L175)

___

### connect

▸ **connect**(): `Promise`\<`void`\>

Connect using the underlying transport

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/connection/Connection.ts:182](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L182)

___

### disconnect

▸ **disconnect**(): `void`

Disconnect and stop reconnecting

#### Returns

`void`

#### Defined in

[core/connection/Connection.ts:196](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L196)

___

### send

▸ **send**(`data`): `Promise`\<`void`\>

Send a message through the transport

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/connection/Connection.ts:207](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L207)

___

### setMaxReconnectAttempts

▸ **setMaxReconnectAttempts**(`maxAttempts`): `void`

Set maximum reconnection attempts

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxAttempts` | `number` |

#### Returns

`void`

#### Defined in

[core/connection/Connection.ts:221](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L221)

___

### setReconnectDelays

▸ **setReconnectDelays**(`baseDelay`, `maxDelay`): `void`

Set reconnection delay parameters

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseDelay` | `number` |
| `maxDelay` | `number` |

#### Returns

`void`

#### Defined in

[core/connection/Connection.ts:228](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/connection/Connection.ts#L228)

___

### on

▸ **on**\<`K`\>(`event`, `handler`): `this`

Register an event handler.

The handler will be called every time the event is emitted.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`ConnectionEvents`](../interfaces/ConnectionEvents.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name to listen for |
| `handler` | `EventHandler`\<[`ConnectionEvents`](../interfaces/ConnectionEvents.md)[`K`]\> | The function to call when the event is emitted |

#### Returns

`this`

`this` for method chaining

**`Example`**

```typescript
agent.on("message", (event) => {
  console.log("Received:", event.payload);
});
```

#### Inherited from

[EventEmitter](EventEmitter.md).[on](EventEmitter.md#on)

#### Defined in

[core/events/EventEmitter.ts:64](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/events/EventEmitter.ts#L64)

___

### once

▸ **once**\<`K`\>(`event`, `handler`): `this`

Register a one-time event handler.

The handler will be called only once, then automatically removed.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`ConnectionEvents`](../interfaces/ConnectionEvents.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name to listen for |
| `handler` | `EventHandler`\<[`ConnectionEvents`](../interfaces/ConnectionEvents.md)[`K`]\> | The function to call when the event is emitted |

#### Returns

`this`

`this` for method chaining

**`Example`**

```typescript
agent.once("connected", () => {
  console.log("First connection established!");
});
```

#### Inherited from

[EventEmitter](EventEmitter.md).[once](EventEmitter.md#once)

#### Defined in

[core/events/EventEmitter.ts:88](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/events/EventEmitter.ts#L88)

___

### off

▸ **off**\<`K`\>(`event`, `handler?`): `this`

Remove an event handler.

If no handler is specified, removes all handlers for the event.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`ConnectionEvents`](../interfaces/ConnectionEvents.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name |
| `handler?` | `EventHandler`\<[`ConnectionEvents`](../interfaces/ConnectionEvents.md)[`K`]\> | The specific handler to remove (optional) |

#### Returns

`this`

`this` for method chaining

**`Example`**

```typescript
const handler = (event) => console.log(event);
agent.on("message", handler);
agent.off("message", handler);
```

**`Example`**

```typescript
agent.off("message");
```

#### Inherited from

[EventEmitter](EventEmitter.md).[off](EventEmitter.md#off)

#### Defined in

[core/events/EventEmitter.ts:117](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/events/EventEmitter.ts#L117)

___

### removeAllListeners

▸ **removeAllListeners**\<`K`\>(`event?`): `this`

Remove all event handlers

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`ConnectionEvents`](../interfaces/ConnectionEvents.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `K` |

#### Returns

`this`

#### Inherited from

[EventEmitter](EventEmitter.md).[removeAllListeners](EventEmitter.md#removealllisteners)

#### Defined in

[core/events/EventEmitter.ts:180](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/events/EventEmitter.ts#L180)

___

### listenerCount

▸ **listenerCount**\<`K`\>(`event`): `number`

Get the number of listeners for an event

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`ConnectionEvents`](../interfaces/ConnectionEvents.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `K` |

#### Returns

`number`

#### Inherited from

[EventEmitter](EventEmitter.md).[listenerCount](EventEmitter.md#listenercount)

#### Defined in

[core/events/EventEmitter.ts:194](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/events/EventEmitter.ts#L194)
