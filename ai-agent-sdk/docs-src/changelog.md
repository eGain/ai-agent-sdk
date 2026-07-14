# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2026-07-14

### Added

- `HookContract.getQueryParams()` — legacy alias for `getInitParams()`, restoring compatibility with platform connectors (e.g. Genesys) that still call `getQueryParams()` after the queryParam → initParam rename

## [0.1.2] - 2026-06-04

### Documentation

- Added instructions for generating an access token (PKCE flow) as a prerequisite for the pre-auth authentication option, including required OAuth scopes (`core.aiservices.read`, `knowledge.portalmgr.manage`, `core.customermgr.read`)
- Updated README, Quick Start guide, and Authentication guide

## [0.1.0] - 2026-04-30 & [0.1.1] - 2026-05-01

### First beta release of the AI Agent SDK

## [0.0.13] & [0.0.14] - 2026-04-XX

### Changed
- README documentation links

## [0.0.12] - 2026-04-XX

### Added

- Contact center (CC) **portal initialization** flow: chained REST pipeline (portals → optional agents → user profiles) before WebSocket connect, aligned with cc-widget behavior
- **Platform script loading** for CC connectors (e.g. Genesys, Amazon Connect): loads connector script and wires `PlatformComponentService` / `HookContract`
- New `AiAgent` methods: `selectPortal()`, `selectAgent()`, `selectUserProfile()`, `getInitParams()`, `getIsInitialized()`, `restartPortalInitializer()`, `updateUserProfile()`, `getUserDetails()`, `getCallTranscript()`, `getCallerInfo()`, `getConversationId()`, `clearCallTranscript()`
- New `ApiHelper` methods: `getMyPortals()`, `getAgentsByPortal()`, `getUserProfiles()`, `selectUserProfile()`, `getUserDetails()`, `getCustomerDetails()`
- `getToken` callback on `ApiHelperConfig` so API calls can omit per-method `authToken` when a token provider is configured
- New `AiAgentConfig` options: `initParams`, `scopes`, `platformScriptUrl`, `authScheme` (`popup` | `redirect` for auto-built PKCE)
- New events: `initialized` (expanded payload), `portalsAvailable`, `agentsAvailable`, `profilesAvailable`, `callTranscriptUpdate`, `callerInfoUpdate`, `conversationIdUpdate`, `userContextUpdate`, `filterTagsUpdate`
- Exported types for CC and connectors: `Portal`, `UserProfile`, `AgentListItem`, `UserDetails`, `HookContract`, `CallerInfo`, `CallTranscriptEntry`, `PlatformComponentService`, and new `Get*` / `Select*` API option types

### Changed

- PKCE: `localLogin` on `PKCEAuthConfig`, improved redirect/popup behavior, `domain_hint` / `localLogin` extra query parameters, and MSAL options aligned with CC flows
- Several `ApiHelper` option types now allow optional `authToken` when `getToken` is set on `ApiHelperConfig`

### Deprecated

- `restartCcWidgetInitializer()` — use `restartPortalInitializer()` instead

## [0.0.11] - 2025-01-XX

### Added
- Browser UMD build support with `./browser` export
- Browser build script (`build:browser`) for standalone browser bundle
- MSAL copy script for browser compatibility
- Comprehensive build pipeline with `build:all` command
- Documentation generation scripts (`docs:api`, `docs:build`, `docs:dev`)
- Publishing scripts for GitHub Packages

### Changed
- Updated build process to include browser bundle generation
- Enhanced package exports to support both Node.js and browser environments
- Improved build scripts organization

## [0.0.10] - 2025-01-XX

### Added
- Browser build configuration
- Rollup bundler integration for browser builds
- Browser-specific exports in package.json

### Changed
- Build process now generates both Node.js and browser bundles

## [0.0.9] - 2025-01-09

### Added
- `transcriptUpdate` event - emitted whenever the transcript is updated (message sent or received)
  - Provides `TranscriptEntry` with message, direction, timestamp, sessionId, and agentId
  - Useful for tracking all message activity in real-time
- GitHub Actions workflow for automated SDK documentation deployment

### Changed
- Improved VitePress documentation site structure
- Moved docs folder for better organization

## [0.0.8] - 2025-01-08

### Changed
- Removed empty content attribute from message payload
- Added 5ms delay in queue flushing for improved reliability
- Cached anonymous token for better performance
- Added partial initialization when agent details are fetched before init

### Fixed
- Fixed test browser UMD build

## [0.0.7] - 2025-01-08

### Added
- VitePress documentation site
- Enhanced JSDoc comments throughout the codebase
- TypeDoc configuration for API reference generation
- Context persistence with automatic restoration on reconnect
- Custom cache adapter support
- `tokenExpiring` event for proactive token refresh
- `updateAccessToken()` method for runtime token updates

### Changed
- Improved error messages for better debugging
- Enhanced TypeScript type definitions
- Updated documentation to use `pre-auth` instead of deprecated `token` auth type

### Fixed
- Various bug fixes and stability improvements

## [0.0.6] - 2025-01-06

### Added
- `restartConnection()` method for fresh sessions
- Automatic context caching and restoration
- `getContext()` and `removeContext()` methods
- Transcript filtering options

### Changed
- Improved reconnection logic with exponential backoff

## [0.0.5] - 2025-01-03

### Added
- `ApiHelper` class for REST API interactions
- Caching for API responses
- `getAgentDetails()` and `getDeploymentInfo()` methods

### Changed
- Refactored authentication to use `AuthenticationService`

## [0.0.4] - 2024-12-20

### Added
- Multiple authentication strategies (Anonymous, PKCE, Pre-Auth, Client Credentials)
- Message type helpers (`createContextMessage`, `createFeedbackMessage`, etc.)
- Transcript management with filtering

## [0.0.3] - 2024-12-15

### Added
- Message queuing when offline
- Automatic queue flushing on reconnect
- `queueFlushed` event

## [0.0.2] - 2024-12-10

### Added
- WebSocket connection management
- Automatic reconnection with exponential backoff
- Event-driven architecture
- TypeScript type definitions

## [0.0.1] - 2024-12-01

### Added
- Initial release
- Basic WebSocket communication
- Pre-auth token authentication
- Message sending and receiving
