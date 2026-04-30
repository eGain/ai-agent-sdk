[@eGain/ai-agent-sdk API Reference - v0.1.0](../README.md) / WebSocketTransport

# Class: WebSocketTransport

WebSocket-based transport implementation.

This transport uses the native WebSocket API to establish
bidirectional communication with the server.

**`Example`**

```typescript
const transport = new WebSocketTransport({
  endpoint: 'wss://api.example.com/ws'
});

transport.on('message', ({ data }) => {
  console.log('Received:', data);
});

await transport.connect();
await transport.send({ text: 'Hello' });
```

## Hierarchy

- [`Transport`](Transport.md)

  ↳ **`WebSocketTransport`**

## Table of contents

### Constructors

- [constructor](WebSocketTransport.md#constructor)

### Methods

- [getType](WebSocketTransport.md#gettype)
- [isConnected](WebSocketTransport.md#isconnected)
- [connect](WebSocketTransport.md#connect)
- [disconnect](WebSocketTransport.md#disconnect)
- [send](WebSocketTransport.md#send)
- [on](WebSocketTransport.md#on)
- [once](WebSocketTransport.md#once)
- [off](WebSocketTransport.md#off)
- [removeAllListeners](WebSocketTransport.md#removealllisteners)
- [listenerCount](WebSocketTransport.md#listenercount)

## Constructors

### constructor

• **new WebSocketTransport**(`config`): [`WebSocketTransport`](WebSocketTransport.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`WebSocketTransportConfig`](../interfaces/WebSocketTransportConfig.md) |

#### Returns

[`WebSocketTransport`](WebSocketTransport.md)

#### Overrides

[Transport](Transport.md).[constructor](Transport.md#constructor)

#### Defined in

[core/connection/WebSocketTransport.ts:39](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/WebSocketTransport.ts#L39)

## Methods

### getType

▸ **getType**(): `string`

Get the transport type identifier

#### Returns

`string`

#### Overrides

[Transport](Transport.md).[getType](Transport.md#gettype)

#### Defined in

[core/connection/WebSocketTransport.ts:47](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/WebSocketTransport.ts#L47)

___

### isConnected

▸ **isConnected**(): `boolean`

Check if the WebSocket is currently connected

#### Returns

`boolean`

#### Overrides

[Transport](Transport.md).[isConnected](Transport.md#isconnected)

#### Defined in

[core/connection/WebSocketTransport.ts:54](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/WebSocketTransport.ts#L54)

___

### connect

▸ **connect**(): `Promise`\<`void`\>

Establish the WebSocket connection

#### Returns

`Promise`\<`void`\>

#### Overrides

[Transport](Transport.md).[connect](Transport.md#connect)

#### Defined in

[core/connection/WebSocketTransport.ts:61](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/WebSocketTransport.ts#L61)

___

### disconnect

▸ **disconnect**(): `void`

Close the WebSocket connection

#### Returns

`void`

#### Overrides

[Transport](Transport.md).[disconnect](Transport.md#disconnect)

#### Defined in

[core/connection/WebSocketTransport.ts:137](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/WebSocketTransport.ts#L137)

___

### send

▸ **send**(`data`): `Promise`\<`void`\>

Send data through the WebSocket

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[Transport](Transport.md).[send](Transport.md#send)

#### Defined in

[core/connection/WebSocketTransport.ts:150](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/WebSocketTransport.ts#L150)

___

### on

▸ **on**\<`K`\>(`event`, `handler`): `this`

Register an event handler.

The handler will be called every time the event is emitted.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`TransportEvents`](../interfaces/TransportEvents.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name to listen for |
| `handler` | `EventHandler`\<[`TransportEvents`](../interfaces/TransportEvents.md)[`K`]\> | The function to call when the event is emitted |

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

[Transport](Transport.md).[on](Transport.md#on)

#### Defined in

[core/events/EventEmitter.ts:64](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/events/EventEmitter.ts#L64)

___

### once

▸ **once**\<`K`\>(`event`, `handler`): `this`

Register a one-time event handler.

The handler will be called only once, then automatically removed.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`TransportEvents`](../interfaces/TransportEvents.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name to listen for |
| `handler` | `EventHandler`\<[`TransportEvents`](../interfaces/TransportEvents.md)[`K`]\> | The function to call when the event is emitted |

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

[Transport](Transport.md).[once](Transport.md#once)

#### Defined in

[core/events/EventEmitter.ts:88](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/events/EventEmitter.ts#L88)

___

### off

▸ **off**\<`K`\>(`event`, `handler?`): `this`

Remove an event handler.

If no handler is specified, removes all handlers for the event.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`TransportEvents`](../interfaces/TransportEvents.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name |
| `handler?` | `EventHandler`\<[`TransportEvents`](../interfaces/TransportEvents.md)[`K`]\> | The specific handler to remove (optional) |

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

[Transport](Transport.md).[off](Transport.md#off)

#### Defined in

[core/events/EventEmitter.ts:117](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/events/EventEmitter.ts#L117)

___

### removeAllListeners

▸ **removeAllListeners**\<`K`\>(`event?`): `this`

Remove all event handlers

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`TransportEvents`](../interfaces/TransportEvents.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `K` |

#### Returns

`this`

#### Inherited from

[Transport](Transport.md).[removeAllListeners](Transport.md#removealllisteners)

#### Defined in

[core/events/EventEmitter.ts:180](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/events/EventEmitter.ts#L180)

___

### listenerCount

▸ **listenerCount**\<`K`\>(`event`): `number`

Get the number of listeners for an event

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`TransportEvents`](../interfaces/TransportEvents.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `K` |

#### Returns

`number`

#### Inherited from

[Transport](Transport.md).[listenerCount](Transport.md#listenercount)

#### Defined in

[core/events/EventEmitter.ts:194](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/events/EventEmitter.ts#L194)
