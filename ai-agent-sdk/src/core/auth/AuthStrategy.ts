import { AuthProvider } from './AuthProvider.js';

/**
 * Callback function called after authentication is complete
 * This is called after authenticate() completes successfully
 * @param result The authentication result (e.g., token, auth data) of any type
 */
export type PostAuthenticationCallback = (result: any) => void | Promise<void>;

/**
 * Options for initializing an authentication strategy
 */
export interface AuthServiceInitializeOptions {
    /**
     * The scopes for the authentication strategy
     */
    scopes?: string[];
    /**
     * The deployment information for the authentication strategy
     */
    deploymentInfo?: any;

    /**
     * Callback to be called after authentication completes
     */
    postAuthentication?: PostAuthenticationCallback;

    /**
     * The user type for the authentication strategy
     * Used to determine scopes - 'customer' adds core.customermgr.read scope
     */
    userType?: 'agent' | 'customer';
}

/**
 * Options for initializing an authentication strategy
 */
export interface AuthStrategyInitializeOptions {
    /**
     * The deployment information for the authentication strategy
     */
    deploymentInfo: any;
    /**
     * The scopes for the authentication strategy
     */
    scopes?: string[];
    /**
     * Callback to be called after authentication completes
     */
    postAuthentication?: PostAuthenticationCallback;
}

/**
 * Base interface for authentication strategies
 * All authentication strategies must implement this interface
 */
export interface AuthStrategy extends AuthProvider {

    /**
     * Initialize the authentication strategy
     * This method sets up the strategy but does not perform authentication
     * Called when the strategy is set on the agent
     * @param options Initialize options including postAuthentication callback
     */
    initialize(options?: AuthStrategyInitializeOptions): Promise<void>;

    /**
     * Authenticate the user
     * This method performs the actual authentication flow
     * The postAuthentication callback registered during initialize() will be called after authentication completes
     */
    authenticate(): Promise<void>;

    /**
     * Cleanup resources when the strategy is no longer needed
     */
    cleanup?(): Promise<void>;

    /**
     * Get the domain for authentication
     */
    getDomain?(): string;
}

