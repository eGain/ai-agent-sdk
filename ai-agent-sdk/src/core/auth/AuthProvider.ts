/**
 * Authentication provider interface
 * Implement this interface to provide custom authentication mechanisms
 */
export interface AuthProvider {
  /**
   * Get an authentication token
   * This method may be called multiple times, so implementations should
   * handle token refresh if needed
   */
  getToken(): Promise<string | null>;
}




