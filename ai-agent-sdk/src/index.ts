/**
 * # @egain/ai-agent-sdk
 * 
 * TypeScript-first SDK for eGain's AI Agent platform.
 * 
 * ## Features
 * - 🔌 WebSocket-based real-time communication
 * - 📬 Automatic message queuing when offline
 * - 🔐 Multiple authentication strategies
 * - 🎯 Type-safe events with full TypeScript support
 * - 📝 Built-in transcript management
 * - 🛡️ Comprehensive error handling
 * 
 * ## Quick Start
 * 
 * ```typescript
 * import { AiAgent } from "@egain/ai-agent-sdk";
 * 
 * const agent = new AiAgent({
 *   id: "your-agent-id",
 *   endpoint: "https://your-endpoint.com",
 *   auth: { type: "pre-auth", accessToken: "your-access-token" },
 *   autoConnect: true
 * });
 * 
 * await agent.initialize();
 * 
 * agent.on("agentMessage", (event) => {
 *   console.log("Agent:", event.payload.message?.content);
 * });
 * 
 * await agent.send("Hello!");
 * ```
 * 
 * @packageDocumentation
 * @module @egain/ai-agent-sdk
 */

// Initialize polyfills for Node.js environment (WebSocket, fetch)
// This must be imported first to ensure polyfills are set up before any SDK code runs
import './core/polyfills.js';

// Main class
export { AiAgent } from './core/AiAgent.js';
export type {
  AiAgentConfig,
  AgentEvents,
  AgentEvent,
  AgentEventType,
  AgentEventPayloadMap,
  UserDetails,
} from './core/AiAgent.js';
export type { Portal, UserProfile, AgentListItem } from './core/types/PortalTypes.js';

// Platform connector types (for connector authors, not SDK consumers)
export type { HookContract, CallerInfo, CallTranscriptEntry } from './core/platform/HookContract.js';
export type { PlatformComponentService } from './core/platform/PlatformComponentService.js';

// Authentication
export type { AuthProvider } from './core/auth/AuthProvider.js';
export type { AuthStrategy, PostAuthenticationCallback, AuthStrategyInitializeOptions } from './core/auth/AuthStrategy.js';
export { AnonymousAuthStrategy } from './core/auth/AnonymousAuthStrategy.js';
export type { AnonymousAuthConfig, AnonymousAuthCacheConfig } from './core/auth/AnonymousAuthStrategy.js';
export { PKCEAuthStrategy } from './core/auth/PKCEAuthStrategy.js';
export type { PKCEAuthConfig } from './core/auth/PKCEAuthStrategy.js';
export { ClientCredentialsAuthStrategy } from './core/auth/ClientCredentialsAuthStrategy.js';
export type { ClientCredentialsAuthConfig } from './core/auth/ClientCredentialsAuthStrategy.js';
export { PreAuthStrategy } from './core/auth/PreAuthStrategy.js';
export type { PreAuthConfig, TokenExpiringCallback } from './core/auth/PreAuthStrategy.js';

// Authentication Service (unified authentication layer)
export { AuthenticationService } from './core/auth/AuthenticationService.js';
export type {
  AuthenticationServiceConfig,
  AuthenticationInput,
  AuthenticationType,
  AnonymousAuthServiceConfig,
  PKCEAuthServiceConfig,
  PreAuthServiceConfig,
  ClientCredentialsAuthServiceConfig,
} from './core/auth/AuthenticationService.js';

// Connection
export { Connection } from './core/connection/Connection.js';
export type { ConnectionEvents, ConnectionConfig } from './core/connection/Connection.js';
export { ConnectionState } from './core/connection/ConnectionState.js';

// Transport
export { Transport } from './core/connection/Transport.js';
export type { TransportEvents, TransportConfig } from './core/connection/Transport.js';
export { WebSocketTransport } from './core/connection/WebSocketTransport.js';
export type { WebSocketTransportConfig } from './core/connection/WebSocketTransport.js';

// Queue
export { MessageQueue } from './core/queue/MessageQueue.js';
export type { QueuedMessage } from './core/queue/MessageQueue.js';

// Events
export { EventEmitter } from './core/events/EventEmitter.js';

// Logging
export { Logger } from './core/logging/Logger.js';
export type { LoggerConfig } from './core/logging/Logger.js';
export { LogLevel, getLevelName, getLevelValue, isLevelEnabled } from './core/logging/LogLevel.js';
export type { LogEntry, LoggerEvents } from './core/logging/types.js';
export { globalLogger } from './core/logging/globalLogger.js';

// Errors
export {
  SDKError,
  AuthError,
  ConnectionError,
  MessageError,
} from './core/errors/SDKError.js';

// API Helper
export { ApiHelper } from './core/api/ApiHelper.js';
export type {
  ApiHelperConfig,
  CacheConfig,
  GetAiAgentDetailsOptions,
  GetAiAgentSessionOptions,
  GetPortalDetailsOptions,
  GetConnectedAppsOptions,
  GetPreviousTranscriptOptions,
  GetMaskingPatternsOptions,
  GetMyPortalsOptions,
  GetAgentsByPortalOptions,
  GetUserProfilesOptions,
  SelectUserProfileOptions,
  GetUserDetailsOptions,
  GetCustomerDetailsOptions,
} from './core/api/ApiHelper.js';
export type { CacheStorageType, CacheAdapter, CacheEntry } from './core/api/CacheAdapter.js';
export { MemoryCacheAdapter, StorageCacheAdapter, createCacheAdapter } from './core/api/CacheAdapter.js';

// Message
export { Message } from './core/message/Message.js';
export { MessageProcessor } from './core/message/MessageProcessor.js';
export { BaseMessageHandler } from './core/message/BaseMessageHandler.js';
export { AgentMessageHandler } from './core/message/handlers/AgentMessageHandler.js';
export { ChatHistoryHandler } from './core/message/handlers/ChatHistoryHandler.js';
export { TokenRefreshHandler } from './core/message/handlers/TokenRefreshHandler.js';
export type { TokenRefreshHandlerOptions } from './core/message/handlers/TokenRefreshHandler.js';
export { HeartbeatHandler } from './core/message/handlers/HeartbeatHandler.js';
export { ErrorMessageHandler } from './core/message/handlers/ErrorMessageHandler.js';
export {
  PERSONA,
  ROLE,
  ERROR_CODES,
} from './core/message/types.js';
export type {
  Persona,
  Role,
  MessageData,
  MessageHandlerResult,
} from './core/message/types.js';

// Message type helpers
export {
  createContextMessage,
  createEscalationMessage,
  createFeedbackMessage,
  createAgentMessage,
  createGracefulDisconnectMessage,
  createTokenMessage,
} from './core/message/MessageTypes.js';
export type {
  ContextMessageParams,
  EscalationMessageParams,
  FeedbackMessageParams,
  AgentMessageParams,
  GracefulDisconnectParams,
  TokenMessageParams,
  MessageObject,
} from './core/message/MessageTypes.js';

// Transcript
export { Transcript } from './core/message/Transcript.js';
export type {
  TranscriptEntry,
  TranscriptConfig,
  TranscriptOptions,
} from './core/message/Transcript.js';
