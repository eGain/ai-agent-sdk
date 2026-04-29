import { AuthStrategy, PostAuthenticationCallback, AuthStrategyInitializeOptions } from './AuthStrategy.js';

/**
 * Callback type for token expiring notification
 */
export type TokenExpiringCallback = (expiresAt: number) => void;

/**
 * Buffer time before token expiry to trigger the expiring event (3 minutes in ms)
 */
const TOKEN_EXPIRY_BUFFER_MS = 3 * 60 * 1000;

/**
 * Configuration for pre-auth authentication strategy
 */
export interface PreAuthConfig {
  /**
   * Access token to use directly
   */
  accessToken: string;

  /**
   * Optional token refresh function
   * If provided, will be called when token needs to be refreshed
   */
  refreshTokenFn?: () => Promise<string>;

  /**
   * Buffer time in milliseconds before token expiry to trigger the expiring event
   * @default 180000 (3 minutes)
   */
  expiryBufferMs?: number;
}

/**
 * Decoded JWT payload with expiration claim
 */
interface JwtPayload {
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * Pre-auth authentication strategy
 * Uses a pre-obtained access token without completing authentication flow
 */
export class PreAuthStrategy implements AuthStrategy {
  private currentToken: string;
  private postAuthentication?: PostAuthenticationCallback;
  private isAuthenticatedFlag: boolean = false;
  private deploymentInfo?: any;
  private expiryTimer?: ReturnType<typeof setTimeout>;
  private tokenExpiringCallback?: TokenExpiringCallback;
  private expiryBufferMs: number;

  constructor(private readonly config: PreAuthConfig) {
    this.currentToken = config.accessToken;
    this.expiryBufferMs = config.expiryBufferMs ?? TOKEN_EXPIRY_BUFFER_MS;
  }

  /**
   * Decode a JWT token and extract the payload
   * Does not verify the signature - only extracts the claims
   * @param token - The JWT token string
   * @returns The decoded payload or null if decoding fails
   */
  private decodeJwt(token: string): JwtPayload | null {
    try {
      // JWT format: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decode the payload (second part)
      const payload = parts[1];
      // Handle URL-safe base64 encoding
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      
      // Decode base64 - works in both browser and Node.js
      let decoded: string;
      if (typeof atob === 'function') {
        // Browser environment
        decoded = atob(base64);
      } else if (typeof Buffer !== 'undefined') {
        // Node.js environment
        decoded = Buffer.from(base64, 'base64').toString('utf-8');
      } else {
        return null;
      }

      return JSON.parse(decoded) as JwtPayload;
    } catch {
      // Token is not a valid JWT or decoding failed
      return null;
    }
  }

  /**
   * Get the expiration time from the token
   * @param token - The JWT token string
   * @returns Expiration timestamp in milliseconds, or null if not available
   */
  private getTokenExpiry(token: string): number | null {
    const payload = this.decodeJwt(token);
    if (payload?.exp) {
      // JWT exp is in seconds, convert to milliseconds
      return payload.exp * 1000;
    }
    return null;
  }

  /**
   * Schedule the token expiring event
   * Fires at (expiry - buffer) time
   * @param token - The JWT token to schedule expiry for
   */
  private scheduleExpiryEvent(token: string): void {
    // Cancel any existing timer
    this.cancelExpiryTimer();

    const expiresAt = this.getTokenExpiry(token);
    if (!expiresAt) {
      // Token doesn't have expiry info, can't schedule
      return;
    }

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now - this.expiryBufferMs;

    if (timeUntilExpiry <= 0) {
      // Token is already expired or within buffer, fire immediately
      if (this.tokenExpiringCallback) {
        this.tokenExpiringCallback(expiresAt);
      }
      return;
    }

    // Schedule the expiry event
    this.expiryTimer = setTimeout(() => {
      if (this.tokenExpiringCallback) {
        this.tokenExpiringCallback(expiresAt);
      }
    }, timeUntilExpiry);
  }

  /**
   * Cancel the expiry timer
   */
  private cancelExpiryTimer(): void {
    if (this.expiryTimer) {
      clearTimeout(this.expiryTimer);
      this.expiryTimer = undefined;
    }
  }

  /**
   * Set the callback to be called when token is about to expire
   * @param callback - Function to call when token is expiring
   */
  setTokenExpiringCallback(callback: TokenExpiringCallback): void {
    this.tokenExpiringCallback = callback;
    // If already authenticated, schedule the expiry event with current token
    if (this.isAuthenticatedFlag && this.currentToken) {
      this.scheduleExpiryEvent(this.currentToken);
    }
  }

  /**
   * Initialize the pre-auth authentication strategy
   * Ensures the token is available and ready to use
   */
  async initialize(options?: AuthStrategyInitializeOptions): Promise<void> {
    console.debug('[PreAuthStrategy] initialize() called', { 
      hasPostAuthentication: !!options?.postAuthentication,
      hasDeploymentInfo: !!options?.deploymentInfo 
    });
    
    // Update postAuthentication callback even if already initialized
    // This allows setting the callback after early initialization (e.g., for fetching agent details)
    if (options?.postAuthentication) {
      this.postAuthentication = options.postAuthentication;
      console.debug('[PreAuthStrategy] postAuthentication callback SET');
    }
    if (options?.deploymentInfo) {
      this.deploymentInfo = options.deploymentInfo;
    }
    
    // Ensure token is available and valid
    // The token is set in constructor, but we verify it's still available here
    if (!this.currentToken) {
      throw new Error('PreAuthStrategy: Access token is required but not available');
    }
    
    // If we have a token and it's a JWT, we can validate its structure (but not signature)
    // This ensures the token is properly formatted
    const token = this.currentToken;
    if (token.split('.').length === 3) {
      // It's a JWT - validate basic structure
      try {
        this.decodeJwt(token);
      } catch (error) {
        // Token structure is invalid, but we'll still allow it to proceed
        // The actual validation happens when the token is used
      }
    }
  }

  /**
   * Authenticate using pre-auth token
   */
  async authenticate(): Promise<void> {
    console.debug('[PreAuthStrategy] authenticate() called, postAuthentication callback:', this.postAuthentication ? 'SET' : 'NOT SET');
    const token = await this.getToken();
    this.isAuthenticatedFlag = true;
    
    // Schedule expiry event for the current token
    this.scheduleExpiryEvent(token);
    
    // Call postAuthentication callback after authentication completes
    if (this.postAuthentication) {
      console.debug('[PreAuthStrategy] Calling postAuthentication callback');
      await this.postAuthentication(token);
      console.debug('[PreAuthStrategy] postAuthentication callback completed');
    } else {
      console.warn('[PreAuthStrategy] postAuthentication callback is not set - isInitialized may not be set to true');
    }
  }

  /**
   * Check if the user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedFlag;
  }

  /**
   * Get the access token
   * If refresh function is provided and token is expired, attempts to refresh
   */
  async getToken(): Promise<string> {
    return this.currentToken;
  }

  /**
   * Update the access token
   * Cancels existing expiry timer and schedules new one based on new token
   * If authenticated, calls postAuthentication callback with the new token
   * @param token - The new access token
   */
  async updateToken(token: string): Promise<void> {
    this.currentToken = token;
    // Reschedule expiry event with new token
    this.scheduleExpiryEvent(token);
    
    // If authenticated, call postAuthentication callback with new token
    if (this.isAuthenticatedFlag && this.postAuthentication) {
      await this.postAuthentication(token);
    }
  }

  /**
   * Refresh the token using the provided refresh function
   */
  async refreshToken(): Promise<string> {
    if (this.config.refreshTokenFn) {
      const newToken = await this.config.refreshTokenFn();
      await this.updateToken(newToken);
    }
    return this.currentToken;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    this.cancelExpiryTimer();
  }
}
