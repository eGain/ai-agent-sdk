/**
 * Portal types for the CC (Contact Center) widget initialization flow.
 * Derived from the cc-widget's portalService and store types.
 *
 * @module PortalTypes
 */

/**
 * Represents a knowledge portal accessible to the user.
 *
 * @interface Portal
 */
export interface Portal {
  /** Unique identifier (string or number) */
  id: string | number;
  /** Display name of the portal */
  name: string;
  /** Optional description */
  description?: string;
  /** Optional department association */
  department?: { id: number; name: string };
}

/**
 * Represents a user profile within a portal.
 *
 * @interface UserProfile
 */
export interface UserProfile {
  /** Unique identifier (string or number) */
  id: string | number;
  /** Display name of the profile */
  name: string;
  /** Whether this profile was last used in the current portal */
  isLastUsedInPortal?: boolean;
}

/**
 * Represents an AI agent in the agent selection list.
 *
 * @interface AgentListItem
 */
export interface AgentListItem {
  /** Unique agent identifier */
  agentId: string;
  /** Display name of the agent */
  name: string;
  /** Optional description */
  description?: string;
}
