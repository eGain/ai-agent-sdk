[@egain/ai-agent-sdk API Reference - v0.3.0](../README.md) / AiAgentConnectorConfig

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

[core/AiAgent.ts:34](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L34)

___

### connectorUrl

• `Optional` **connectorUrl**: `string`

Full URL of the platform connector script to load during initialize().

#### Defined in

[core/AiAgent.ts:36](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L36)
