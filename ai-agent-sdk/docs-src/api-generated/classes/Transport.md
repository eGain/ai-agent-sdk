[@eGain/ai-agent-sdk API Reference - v0.1.0](../README.md) / Transport

# Class: Transport

Abstract base class for transport implementations.

Any transport mechanism (WebSocket, SSE, HTTP polling, etc.) should extend
this class and implement the abstract methods.

**`Example`**

```typescript
class MyCustomTransport extends Transport {
  async connect(): Promise<void> { ... }
  disconnect(): void { ... }
  async send(data: any): Promise<void> { ... }
  isConnected(): boolean { ... }
}
```

## Hierarchy

- [`EventEmitter`](EventEmitter.md)\<[`TransportEvents`](../interfaces/TransportEvents.md)\>

  ↳ **`Transport`**

  ↳↳ [`WebSocketTransport`](WebSocketTransport.md)

## Table of contents

### Constructors

- [constructor](Transport.md#constructor)

### Methods

- [connect](Transport.md#connect)
- [disconnect](Transport.md#disconnect)
- [send](Transport.md#send)
- [isConnected](Transport.md#isconnected)
- [getType](Transport.md#gettype)
- [on](Transport.md#on)
- [once](Transport.md#once)
- [off](Transport.md#off)
- [removeAllListeners](Transport.md#removealllisteners)
- [listenerCount](Transport.md#listenercount)

## Constructors

### constructor

• **new Transport**(`config`): [`Transport`](Transport.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`TransportConfig`](../interfaces/TransportConfig.md) |

#### Returns

[`Transport`](Transport.md)

#### Overrides

[EventEmitter](EventEmitter.md).[constructor](EventEmitter.md#constructor)

#### Defined in

[core/connection/Transport.ts:73](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Transport.ts#L73)

## Methods

### connect

▸ **connect**(): `Promise`\<`void`\>

Establish the transport connection

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/connection/Transport.ts:83](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Transport.ts#L83)

___

### disconnect

▸ **disconnect**(): `void`

Close the transport connection

#### Returns

`void`

#### Defined in

[core/connection/Transport.ts:88](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Transport.ts#L88)

___

### send

▸ **send**(`data`): `Promise`\<`void`\>

Send data through the transport

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` | The data to send |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/connection/Transport.ts:94](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Transport.ts#L94)

___

### isConnected

▸ **isConnected**(): `boolean`

Check if the transport is currently connected

#### Returns

`boolean`

#### Defined in

[core/connection/Transport.ts:99](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Transport.ts#L99)

___

### getType

▸ **getType**(): `string`

Get the transport type identifier

#### Returns

`string`

#### Defined in

[core/connection/Transport.ts:104](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/connection/Transport.ts#L104)

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

[EventEmitter](EventEmitter.md).[on](EventEmitter.md#on)

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

[EventEmitter](EventEmitter.md).[once](EventEmitter.md#once)

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

[EventEmitter](EventEmitter.md).[off](EventEmitter.md#off)

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

[EventEmitter](EventEmitter.md).[removeAllListeners](EventEmitter.md#removealllisteners)

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

[EventEmitter](EventEmitter.md).[listenerCount](EventEmitter.md#listenercount)

#### Defined in

[core/events/EventEmitter.ts:194](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/events/EventEmitter.ts#L194)
