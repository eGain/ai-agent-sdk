[@egain/ai-agent-sdk API Reference - v0.5.0](../README.md) / AiAgentConnectorConfig

# Interface: AiAgentConnectorConfig

Platform connector hosting configuration supplied by the host application.

## Table of contents

### Properties

- [env](AiAgentConnectorConfig.md#env)
- [connectorUrl](AiAgentConnectorConfig.md#connectorurl)

## Properties

### env

• `Optional` **env**: `string`

Deployment environment label exposed on [HookContract.getEnvironment](HookContract.md#getenvironment).

#### Defined in

[core/AiAgent.ts:44](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L44)

___

### connectorUrl

• `Optional` **connectorUrl**: `string`

Full URL of the platform connector script to load during initialize().

#### Defined in

[core/AiAgent.ts:46](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L46)
