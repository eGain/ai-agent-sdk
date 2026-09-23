[@egain/ai-agent-sdk API Reference - v0.2.5](../README.md) / AiAgentConnectorConfig

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

[core/AiAgent.ts:33](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L33)

___

### connectorUrl

• `Optional` **connectorUrl**: `string`

Full URL of the platform connector script to load during initialize().

#### Defined in

[core/AiAgent.ts:35](https://github.com/eGainDev/ai-agent/blob/master/ai-agent-sdk/src/core/AiAgent.ts#L35)
