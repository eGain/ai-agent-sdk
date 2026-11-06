/**
 * Client actions: things the server asks the browser to do on its behalf.
 *
 * Every action arrives in the same envelope and, when the server is waiting on it, is answered
 * with the same result shape; only the payload and the result's `data` are specific to a type.
 * The SDK supplies handlers for some types (see {@link createPkceUserAuthHandler}) and a host can
 * supply its own for others. An action of a type nobody registered a handler for is answered
 * `unsupported` straight away, so the server is never left waiting on this client.
 */

/**
 * How an action ended. One vocabulary for every type, so the server and the host can treat them
 * alike; the type-specific detail goes in {@link ClientActionOutcome.reason}.
 *
 * `cancelled` (the person typed instead) and `superseded` (a newer action replaced this one) are
 * decided here and never sent: the typed message is itself the server's signal, and a superseded
 * action's server-side wait has already been replaced.
 */
export type ClientActionStatus =
  | 'completed'
  | 'failed'
  | 'declined'
  | 'cancelled'
  | 'superseded'
  | 'unsupported'
  | 'timeout';

/**
 * Whether an action needs the person to do something.
 *
 * `user-gesture` actions wait for the host to call {@link AiAgent.performClientAction} from a click
 * handler -- browsers only let a page open a popup while a click is being handled. `none` actions
 * run as soon as they arrive.
 */
export type ClientActionInteraction = 'none' | 'user-gesture';

/**
 * Where an action is, for whatever renders it. The same states for every type, so one card
 * component can follow any action.
 */
export type ClientActionLifecycle = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'expired';

/** The action as it arrives from the server, on a `client action` message. */
export interface ClientActionEnvelope {
  type: string;
  /** Echoed back on the result; for an action a tool call asked for, that call's id. */
  actionId: string;
  /** True when the server is waiting for the result. A UI-only action leaves it false. */
  awaitsResult: boolean;
  /** Epoch milliseconds after which the server stops waiting. */
  expiresAt?: number;
  payload: unknown;
}

/** What a handler reports when an action ends. */
export interface ClientActionOutcome {
  status: ClientActionStatus;
  /** Type-specific detail for anything but `completed` (`popup_blocked`, ...). */
  reason?: string;
  /** Type-specific data sent back on success. */
  data?: Record<string, unknown>;
}

/** Handed to a handler for one run of one action. */
export interface ClientActionContext {
  actionId: string;
  /** Epoch milliseconds after which the action is no longer wanted, if the server set one. */
  expiresAt?: number;
  /** Aborted when the action is cancelled, superseded or expires; a handler stops on it. */
  signal: AbortSignal;
  /** Report a type-specific step (`refreshing`, `prompting`, ...) to whatever renders the action. */
  progress(detail: string): void;
}

/**
 * Carries out one action type.
 *
 * Registering a handler is how a host opts in to a type. Without one, an action of that type is
 * answered `unsupported` at once, and the agent carries on without it.
 */
export interface ClientActionHandler<P = unknown> {
  readonly type: string;
  readonly interaction: ClientActionInteraction;
  /** Validate the server's payload. `null` means it is unusable, and the action fails. */
  parse(payload: unknown): P | null;
  /**
   * Try to finish without the person, before a `user-gesture` action waits for a click -- a
   * cached sign-in, say. `null` means the person is needed after all.
   */
  tryWithoutUser?(payload: P, context: ClientActionContext): Promise<ClientActionOutcome | null>;
  /**
   * Carry the action out. For a `user-gesture` handler this runs synchronously inside the click
   * that triggered it, up to its first `await`, so anything that needs the gesture comes first.
   */
  perform(payload: P, context: ClientActionContext): Promise<ClientActionOutcome>;
}

/** An action as the host sees it, on the `clientAction` event. */
export interface ClientAction<P = unknown> {
  actionId: string;
  type: string;
  interaction: ClientActionInteraction;
  awaitsResult: boolean;
  expiresAt?: number;
  /** The payload as the handler parsed it. */
  payload: P;
  lifecycle: ClientActionLifecycle;
}

/** A change in an action's state, on the `clientActionUpdate` event. */
export interface ClientActionUpdate {
  actionId: string;
  type: string;
  lifecycle: ClientActionLifecycle;
  /** Set once the action has ended. */
  status?: ClientActionStatus;
  reason?: string;
  /** The handler's latest step, while it is in progress. */
  progress?: string;
}

/** What goes back to the server for an action it is waiting on. */
export interface ClientActionResult {
  actionId: string;
  type: string;
  status: ClientActionStatus;
  reason?: string;
  data?: Record<string, unknown>;
}
