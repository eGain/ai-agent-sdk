[@eGainDev/ai-agent-sdk API Reference - v0.0.13](../README.md) / EventEmitter

# Class: EventEmitter\<T\>

Type-safe event emitter implementation.

Compatible with both browser and Node.js environments.
Provides a foundation for event-driven communication throughout the SDK.

**`Example`**

```typescript
import { EventEmitter } from "@eGainDev/ai-agent-sdk";

interface MyEvents {
  data: { value: number };
  error: { message: string };
}

class MyService extends EventEmitter<MyEvents> {
  doSomething() {
    this.emit("data", { value: 42 });
  }
}

const service = new MyService();
service.on("data", (event) => {
  console.log(event.value); // Typed as number
});
```

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends `EventMap` = `EventMap` | Event map defining event names and their data types |

## Hierarchy

- **`EventEmitter`**

  ↳ [`AiAgent`](AiAgent.md)

  ↳ [`Connection`](Connection.md)

  ↳ [`Transport`](Transport.md)

  ↳ [`Logger`](Logger.md)

## Table of contents

### Constructors

- [constructor](EventEmitter.md#constructor)

### Methods

- [on](EventEmitter.md#on)
- [once](EventEmitter.md#once)
- [off](EventEmitter.md#off)
- [removeAllListeners](EventEmitter.md#removealllisteners)
- [listenerCount](EventEmitter.md#listenercount)

## Constructors

### constructor

• **new EventEmitter**\<`T`\>(): [`EventEmitter`](EventEmitter.md)\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `EventMap` = `EventMap` |

#### Returns

[`EventEmitter`](EventEmitter.md)\<`T`\>

## Methods

### on

▸ **on**\<`K`\>(`event`, `handler`): `this`

Register an event handler.

The handler will be called every time the event is emitted.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name to listen for |
| `handler` | `EventHandler`\<`T`[`K`]\> | The function to call when the event is emitted |

#### Returns

`this`

`this` for method chaining

**`Example`**

```typescript
agent.on("message", (event) => {
  console.log("Received:", event.payload);
});
```

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
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name to listen for |
| `handler` | `EventHandler`\<`T`[`K`]\> | The function to call when the event is emitted |

#### Returns

`this`

`this` for method chaining

**`Example`**

```typescript
agent.once("connected", () => {
  console.log("First connection established!");
});
```

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
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name |
| `handler?` | `EventHandler`\<`T`[`K`]\> | The specific handler to remove (optional) |

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

#### Defined in

[core/events/EventEmitter.ts:117](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/events/EventEmitter.ts#L117)

___

### removeAllListeners

▸ **removeAllListeners**\<`K`\>(`event?`): `this`

Remove all event handlers

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `K` |

#### Returns

`this`

#### Defined in

[core/events/EventEmitter.ts:180](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/events/EventEmitter.ts#L180)

___

### listenerCount

▸ **listenerCount**\<`K`\>(`event`): `number`

Get the number of listeners for an event

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `K` |

#### Returns

`number`

#### Defined in

[core/events/EventEmitter.ts:194](https://github.com/eGainDev/ai-agent/blob/main/ai-agent-sdk/src/core/events/EventEmitter.ts#L194)
