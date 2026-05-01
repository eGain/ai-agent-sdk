[@egain/ai-agent-sdk API Reference - v0.1.0](../README.md) / CallTranscriptEntry

# Interface: CallTranscriptEntry

A single entry in the call transcript — the live customer-agent
conversation on the telephony platform (Genesys, Amazon Connect, etc.).

This is distinct from the AiAgent chat transcript (`Transcript` /
`TranscriptEntry`), which tracks WebSocket messages between the SDK
and the AI Agent backend.

## Table of contents

### Properties

- [sender](CallTranscriptEntry.md#sender)
- [content](CallTranscriptEntry.md#content)
- [timestamp](CallTranscriptEntry.md#timestamp)

## Properties

### sender

• **sender**: `string`

#### Defined in

[core/platform/HookContract.ts:24](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/platform/HookContract.ts#L24)

___

### content

• **content**: `string`

#### Defined in

[core/platform/HookContract.ts:25](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/platform/HookContract.ts#L25)

___

### timestamp

• **timestamp**: `Date`

#### Defined in

[core/platform/HookContract.ts:26](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/platform/HookContract.ts#L26)
