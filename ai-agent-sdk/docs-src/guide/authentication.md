# Authentication

The SDK supports multiple authentication strategies through a unified `AuthenticationService`. Choose the strategy that fits your security requirements.

## Authentication Types

| Type | Use Case | Requires Server |
|------|----------|-----------------|
| `anonymous` | Public access, demos | No |
| `pre-auth` | API keys, static tokens, server-provided tokens | No |
| `pkce` | OAuth 2.0 browser flow | No |
| `client-credentials` | Server-to-server | Yes |

## Anonymous Authentication (Default)

When no `auth` configuration is provided, the SDK automatically uses anonymous authentication:

```typescript
// These are equivalent:
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com"
  // No auth = anonymous session
});

const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  auth: { type: "anonymous" }
});
```

::: warning Security Note
Anonymous authentication should only be used for public-facing agents. The agent configuration must allow anonymous access.
:::

## Pre-Auth Authentication

The most common authentication method. Use for API keys, static tokens, or server-provided JWTs:

```typescript
import { AiAgent } from "@eGain/ai-agent-sdk";

const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  auth: {
    type: "pre-auth",
    accessToken: "your-access-token"
  }
});

await agent.initialize();
```

### Server-Provided Tokens

When your server manages authentication:

```typescript
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  auth: {
    type: "pre-auth",
    accessToken: "token-from-your-server"
  }
});
```

### With Token Refresh

Handle token expiration with a refresh function:

```typescript
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  auth: {
    type: "pre-auth",
    accessToken: initialToken,
    refreshTokenFn: async () => {
      // Called when token is about to expire
      const response = await fetch("/api/refresh-token");
      const { token } = await response.json();
      return token;
    }
  }
});
```

### Getting the Current Token

Retrieve the current access token for use in external API calls:

```typescript
// Get the current access token
const token = await agent.getAccessToken();

if (token) {
  // Use the token for external API calls
  const response = await fetch('https://api.example.com/data', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
```

### Manual Token Updates

Update the token at runtime:

```typescript
// Listen for token expiring event
agent.on("tokenExpiring", async (event) => {
  console.log("Token expiring:", event.payload.reason);
  
  // Fetch new token from your server
  const newToken = await fetchNewToken();
  
  // Update the agent's token
  await agent.updateAccessToken(newToken);
});
```

## PKCE Authentication (OAuth 2.0)

For browser-based OAuth 2.0 with PKCE:

```typescript
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  auth: {
    type: "pkce",
    config: {
      authorizationUrl: "https://auth.example.com/authorize",
      tokenUrl: "https://auth.example.com/token",
      clientId: "your-client-id",
      redirectUri: "https://your-app.com/callback",
      scope: "openid profile" // optional
    }
  }
});
```

### PKCE Flow

1. User initiates login
2. SDK redirects to authorization URL with PKCE challenge
3. User authenticates with identity provider
4. Redirect back to your app with authorization code
5. SDK exchanges code for tokens

### CC / auto-built PKCE options (`AiAgentConfig`)

When you do **not** pass a full `PKCEAuthConfig` and the SDK builds PKCE settings from deployment info (typical contact center flows), these top-level `AiAgent` options apply:

| Option | Description |
|--------|-------------|
| `authScheme` | `'popup'` (default) opens a login popup; `'redirect'` sends the full page to the IdP |
| `scopes` | Custom OAuth **resource** scopes; defaults add customer scope when the user is a customer |
| `initParams.scopes` | Comma-separated scopes; when non-empty after parsing, **overrides** `config.scopes` and defaults |

### `PKCEAuthConfig` extras

When you supply `auth: { type: 'pkce', config: { ... } }`, you can also use:

| Field | Description |
|-------|-------------|
| `localLogin` | When `true`, adds `localLogin: 'true'` to MSAL extra query parameters to force local login vs federated SSO |

### Custom client id from init params

Host apps can pass **`egclientid`** (and related variants supported by the SDK) inside `initParams` so the built PKCE config uses your Azure AD / app registration client id instead of the deployment default.

### Domain hint

When deployment info includes a **domain hint**, the SDK passes it as MSAL **`domain_hint`** to steer the IdP login experience.

## Client Credentials (Server-to-Server)

For backend services:

```typescript
const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  auth: {
    type: "client-credentials",
    config: {
      tokenUrl: "https://auth.example.com/token",
      clientId: "your-client-id",
      clientSecret: "your-client-secret"
    }
  }
});
```

::: danger Security Warning
Never expose client secrets in browser code. Use this strategy only in server-side applications.
:::

## Custom Authentication

Implement custom authentication by providing an `AuthProvider`:

```typescript
import { AuthProvider, AiAgent } from "@eGain/ai-agent-sdk";

class CustomAuth implements AuthProvider {
  async getToken(): Promise<string> {
    // Your custom token retrieval logic
    const response = await fetch("/api/custom-auth");
    const { token } = await response.json();
    return token;
  }
}

const agent = new AiAgent({
  id: "agent-id",
  endpoint: "https://your-endpoint.com",
  auth: new CustomAuth()
});
```

### Full AuthStrategy Implementation

For complete control over the authentication lifecycle:

```typescript
import { AuthStrategy } from "@eGain/ai-agent-sdk";

class CustomAuthStrategy implements AuthStrategy {
  private token: string | null = null;

  async initialize(options?: { deploymentInfo?: any }): Promise<void> {
    // Setup, e.g., load cached tokens
    this.token = localStorage.getItem("auth_token");
  }

  async authenticate(): Promise<void> {
    // Perform authentication
    const response = await fetch("/api/authenticate");
    const { token } = await response.json();
    this.token = token;
  }

  async getToken(): Promise<string | null> {
    return this.token;
  }

  async cleanup(): Promise<void> {
    // Cleanup resources
    this.token = null;
  }
}
```

## Best Practices

### 1. Never Hardcode Credentials

```typescript
// ❌ Bad
auth: { type: "pre-auth", accessToken: "sk-abc123..." }

// ✅ Good
auth: { type: "pre-auth", accessToken: process.env.AI_AGENT_TOKEN }
```

### 2. Use Environment-Appropriate Strategies

```typescript
const auth = typeof window !== "undefined"
  ? { type: "pkce", config: pkceConfig }  // Browser
  : { type: "client-credentials", config: ccConfig }; // Server
```

### 3. Handle Token Expiration

```typescript
agent.on("tokenExpiring", async (event) => {
  try {
    const newToken = await refreshToken();
    await agent.updateAccessToken(newToken);
  } catch (error) {
    // Handle refresh failure (e.g., redirect to login)
    window.location.href = "/login";
  }
});
```

### 4. Secure Token Storage

```typescript
// Browser: Use secure, httpOnly cookies managed by your server
// Node.js: Use environment variables or secret managers
```

## API Reference

- [AuthProvider](/api-generated/interfaces/AuthProvider)
- [AuthStrategy](/api-generated/interfaces/AuthStrategy)
- [AuthenticationService](/api-generated/classes/AuthenticationService)
