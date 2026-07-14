[@egain/ai-agent-sdk API Reference - v0.1.3](../README.md) / Logger

# Class: Logger

Logger class that extends EventEmitter for log subscription
Supports log level filtering and console output

## Hierarchy

- [`EventEmitter`](EventEmitter.md)\<[`LoggerEvents`](../interfaces/LoggerEvents.md)\>

  ↳ **`Logger`**

## Table of contents

### Constructors

- [constructor](Logger.md#constructor)

### Methods

- [on](Logger.md#on)
- [once](Logger.md#once)
- [off](Logger.md#off)
- [removeAllListeners](Logger.md#removealllisteners)
- [listenerCount](Logger.md#listenercount)
- [setLevel](Logger.md#setlevel)
- [getLevel](Logger.md#getlevel)
- [enableConsoleOutput](Logger.md#enableconsoleoutput)
- [isConsoleOutputEnabled](Logger.md#isconsoleoutputenabled)
- [trace](Logger.md#trace)
- [debug](Logger.md#debug)
- [info](Logger.md#info)
- [warn](Logger.md#warn)
- [error](Logger.md#error)
- [fatal](Logger.md#fatal)
- [createChild](Logger.md#createchild)

## Constructors

### constructor

• **new Logger**(`config?`): [`Logger`](Logger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`LoggerConfig`](../interfaces/LoggerConfig.md) |

#### Returns

[`Logger`](Logger.md)

#### Overrides

[EventEmitter](EventEmitter.md).[constructor](EventEmitter.md#constructor)

#### Defined in

[core/logging/Logger.ts:45](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L45)

## Methods

### on

▸ **on**\<`K`\>(`event`, `handler`): `this`

Register an event handler.

The handler will be called every time the event is emitted.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"log"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name to listen for |
| `handler` | `EventHandler`\<[`LoggerEvents`](../interfaces/LoggerEvents.md)[`K`]\> | The function to call when the event is emitted |

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
| `K` | extends ``"log"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name to listen for |
| `handler` | `EventHandler`\<[`LoggerEvents`](../interfaces/LoggerEvents.md)[`K`]\> | The function to call when the event is emitted |

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
| `K` | extends ``"log"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `K` | The event name |
| `handler?` | `EventHandler`\<[`LoggerEvents`](../interfaces/LoggerEvents.md)[`K`]\> | The specific handler to remove (optional) |

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
| `K` | extends ``"log"`` |

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
| `K` | extends ``"log"`` |

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

___

### setLevel

▸ **setLevel**(`level`): `void`

Set the minimum log level threshold

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `level` | [`LogLevel`](../enums/LogLevel.md) | The minimum log level to log |

#### Returns

`void`

#### Defined in

[core/logging/Logger.ts:57](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L57)

___

### getLevel

▸ **getLevel**(): [`LogLevel`](../enums/LogLevel.md)

Get the current log level threshold

#### Returns

[`LogLevel`](../enums/LogLevel.md)

The current log level

#### Defined in

[core/logging/Logger.ts:65](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L65)

___

### enableConsoleOutput

▸ **enableConsoleOutput**(`enabled`): `void`

Enable or disable console output

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `enabled` | `boolean` | Whether to enable console output |

#### Returns

`void`

#### Defined in

[core/logging/Logger.ts:73](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L73)

___

### isConsoleOutputEnabled

▸ **isConsoleOutputEnabled**(): `boolean`

Check if console output is enabled

#### Returns

`boolean`

True if console output is enabled

#### Defined in

[core/logging/Logger.ts:81](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L81)

___

### trace

▸ **trace**(`message`, `context?`): `void`

Log a TRACE level message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | The log message |
| `context?` | `Record`\<`string`, `any`\> | Optional context/metadata |

#### Returns

`void`

#### Defined in

[core/logging/Logger.ts:90](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L90)

___

### debug

▸ **debug**(`message`, `context?`): `void`

Log a DEBUG level message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | The log message |
| `context?` | `Record`\<`string`, `any`\> | Optional context/metadata |

#### Returns

`void`

#### Defined in

[core/logging/Logger.ts:99](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L99)

___

### info

▸ **info**(`message`, `context?`): `void`

Log an INFO level message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | The log message |
| `context?` | `Record`\<`string`, `any`\> | Optional context/metadata |

#### Returns

`void`

#### Defined in

[core/logging/Logger.ts:108](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L108)

___

### warn

▸ **warn**(`message`, `context?`): `void`

Log a WARN level message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | The log message |
| `context?` | `Record`\<`string`, `any`\> | Optional context/metadata |

#### Returns

`void`

#### Defined in

[core/logging/Logger.ts:117](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L117)

___

### error

▸ **error**(`message`, `error?`, `context?`): `void`

Log an ERROR level message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | The log message |
| `error?` | `Error` | Optional error object |
| `context?` | `Record`\<`string`, `any`\> | Optional context/metadata |

#### Returns

`void`

#### Defined in

[core/logging/Logger.ts:127](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L127)

___

### fatal

▸ **fatal**(`message`, `error?`, `context?`): `void`

Log a FATAL level message

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | The log message |
| `error?` | `Error` | Optional error object |
| `context?` | `Record`\<`string`, `any`\> | Optional context/metadata |

#### Returns

`void`

#### Defined in

[core/logging/Logger.ts:137](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L137)

___

### createChild

▸ **createChild**(`name`, `context?`): [`Logger`](Logger.md)

Create a child logger with additional context

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name for the child logger |
| `context?` | `Record`\<`string`, `any`\> | Additional context to include in all logs |

#### Returns

[`Logger`](Logger.md)

A new logger instance with merged context

#### Defined in

[core/logging/Logger.ts:250](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L250)
