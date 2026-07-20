[@egain/ai-agent-sdk API Reference - v0.1.4](../README.md) / CacheEntry

# Interface: CacheEntry\<T\>

Cache entry with timestamp for TTL support.

**`Example`**

```typescript
const entry: CacheEntry<UserData> = {
  value: { userId: "123", name: "John" },
  timestamp: Date.now()
};
```

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [value](CacheEntry.md#value)
- [timestamp](CacheEntry.md#timestamp)

## Properties

### value

• **value**: `T`

The cached value

#### Defined in

[core/api/CacheAdapter.ts:111](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/CacheAdapter.ts#L111)

___

### timestamp

• **timestamp**: `number`

Timestamp when the entry was created (ms since epoch)

#### Defined in

[core/api/CacheAdapter.ts:113](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/api/CacheAdapter.ts#L113)
