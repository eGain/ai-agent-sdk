[@eGain/ai-agent-sdk API Reference - v0.0.14](../README.md) / LoggerConfig

# Interface: LoggerConfig

Logger configuration options

## Table of contents

### Properties

- [level](LoggerConfig.md#level)
- [enableConsole](LoggerConfig.md#enableconsole)
- [name](LoggerConfig.md#name)
- [contextProvider](LoggerConfig.md#contextprovider)

## Properties

### level

• `Optional` **level**: [`LogLevel`](../enums/LogLevel.md)

Minimum log level threshold

**`Default`**

```ts
LogLevel.INFO
```

#### Defined in

[core/logging/Logger.ts:13](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L13)

___

### enableConsole

• `Optional` **enableConsole**: `boolean`

Enable console output

**`Default`**

```ts
true
```

#### Defined in

[core/logging/Logger.ts:19](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L19)

___

### name

• `Optional` **name**: `string`

Logger name for identification

**`Default`**

```ts
undefined
```

#### Defined in

[core/logging/Logger.ts:25](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L25)

___

### contextProvider

• `Optional` **contextProvider**: () => `Record`\<`string`, `any`\>

Context provider function that returns dynamic context at log time
This allows including dynamic values like sessionId in all log entries

**`Default`**

```ts
undefined
```

#### Type declaration

▸ (): `Record`\<`string`, `any`\>

##### Returns

`Record`\<`string`, `any`\>

#### Defined in

[core/logging/Logger.ts:32](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/logging/Logger.ts#L32)
