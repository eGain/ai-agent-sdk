import type { Logger } from '../logging/Logger.js';
import type {
  ClientAction,
  ClientActionContext,
  ClientActionEnvelope,
  ClientActionHandler,
  ClientActionLifecycle,
  ClientActionOutcome,
  ClientActionResult,
  ClientActionStatus,
  ClientActionUpdate,
} from './types.js';

/**
 * How long before the server's deadline the client gives up. The result still has to cross the
 * websocket and be processed, so stopping exactly at `expiresAt` would land it a moment too late.
 */
export const CLIENT_ACTION_EXPIRY_MARGIN_MS = 5_000;

/** Statuses decided in the browser that the server never hears about; see {@link ClientActionStatus}. */
const LOCAL_ONLY_STATUSES: ReadonlySet<ClientActionStatus> = new Set(['cancelled', 'superseded']);

interface ManagerOptions {
  logger: Logger;
  /** Send a result to the server. Never queued: see {@link AiAgent} for why. */
  sendResult: (result: ClientActionResult) => Promise<void>;
  onAction: (action: ClientAction) => void;
  onUpdate: (update: ClientActionUpdate) => void;
  now?: () => number;
}

interface Entry {
  envelope: ClientActionEnvelope;
  handler: ClientActionHandler<unknown>;
  payload: unknown;
  controller: AbortController;
  context: ClientActionContext;
  timer?: ReturnType<typeof setTimeout>;
  /** Set exactly once; every later outcome for this action is dropped. */
  outcome?: ClientActionOutcome;
  performing?: Promise<ClientActionOutcome>;
}

function lifecycleFor(status: ClientActionStatus): ClientActionLifecycle {
  switch (status) {
    case 'completed':
      return 'completed';
    case 'cancelled':
    case 'superseded':
      return 'cancelled';
    case 'timeout':
      return 'expired';
    default:
      return 'failed';
  }
}

/**
 * Runs the client actions the server sends, and answers the ones it waits on exactly once.
 *
 * The guarantees, which are the reason this is one class rather than each handler doing its own:
 * - **Opt-in.** Only registered types are carried out; anything else the server waits on is
 *   answered `unsupported` at once rather than left to time out.
 * - **One at a time.** The server waits on at most one action, so a new one supersedes the old.
 * - **Typing cancels.** A typed message is how a person says "never mind"; the server treats it
 *   as the answer, so the pending action ends here without sending anything.
 * - **Expiry.** The client stops when the server does, so a card never outlives its usefulness.
 * - **Exactly once.** However a run ends -- or ends twice, when a late popup races a cancel -- the
 *   first outcome is the one recorded and the only one sent.
 */
export class ClientActionManager {
  private readonly handlers = new Map<string, ClientActionHandler<unknown>>();
  private readonly entries = new Map<string, Entry>();
  /** The action the server is currently waiting on, if any. */
  private awaitedActionId?: string;
  private readonly now: () => number;

  constructor(private readonly options: ManagerOptions) {
    this.now = options.now ?? Date.now;
  }

  register(handler: ClientActionHandler<any>): void {
    if (this.handlers.has(handler.type)) {
      this.options.logger.warn('Replacing the client action handler already registered for this type', {
        type: handler.type,
      });
    }
    this.handlers.set(handler.type, handler);
  }

  /** Take an action the server sent. */
  handle(envelope: ClientActionEnvelope): void {
    const { logger } = this.options;
    const handler = this.handlers.get(envelope.type);
    if (!handler) {
      if (envelope.awaitsResult) {
        logger.warn('Answering a client action of an unregistered type as unsupported', { type: envelope.type });
        void this.send(envelope, { status: 'unsupported' });
      } else {
        logger.debug('Ignoring a client action of an unregistered type', { type: envelope.type });
      }
      return;
    }

    if (this.entries.has(envelope.actionId)) {
      // A redelivery of something already running; the run in progress will answer it.
      logger.debug('Ignoring a client action that is already in progress', { actionId: envelope.actionId });
      return;
    }

    let payload: unknown;
    try {
      payload = handler.parse(envelope.payload);
    } catch (error) {
      // A parser that throws has said the same thing as one that returns null. Left uncaught, it
      // would escape `handle` with nothing sent, and the server would wait out its whole deadline.
      logger.warn('Client action payload could not be parsed', {
        type: envelope.type,
        actionId: envelope.actionId,
        error: error instanceof Error ? error.message : String(error),
      });
      payload = null;
    }
    if (payload === null) {
      logger.warn('Client action payload is unusable', { type: envelope.type, actionId: envelope.actionId });
      const outcome: ClientActionOutcome = { status: 'failed', reason: 'invalid_payload' };
      // Over before it started, so there is no entry -- but the host may already show the action
      // (cc-widget renders its card from the message itself), and that needs telling it has ended.
      this.options.onUpdate({
        actionId: envelope.actionId,
        type: envelope.type,
        lifecycle: lifecycleFor(outcome.status),
        status: outcome.status,
        reason: outcome.reason,
      });
      if (envelope.awaitsResult) {
        void this.send(envelope, outcome);
      }
      return;
    }

    if (envelope.awaitsResult && this.awaitedActionId) {
      const previous = this.entries.get(this.awaitedActionId);
      if (previous) {
        this.settle(previous, { status: 'superseded' });
      }
    }

    const entry = this.createEntry(envelope, handler, payload);
    if (envelope.awaitsResult) {
      this.awaitedActionId = envelope.actionId;
    }

    const deadline = this.deadline(envelope);
    if (deadline !== undefined) {
      const remaining = deadline - this.now();
      if (remaining <= 0) {
        this.settle(entry, { status: 'timeout' });
        return;
      }
      entry.timer = setTimeout(() => this.settle(entry, { status: 'timeout' }), remaining);
    }

    const startsAutomatically = handler.interaction === 'none' || Boolean(handler.tryWithoutUser);
    this.options.onAction(this.describe(entry, startsAutomatically ? 'in_progress' : 'pending'));

    if (handler.interaction === 'none') {
      this.run(entry, () => handler.perform(payload, entry.context));
    } else if (handler.tryWithoutUser) {
      this.trySilently(entry, handler, payload);
    }
  }

  /**
   * Carry out a `user-gesture` action. **Call it synchronously from the click handler**: the
   * handler runs inside this call up to its first `await`, which is what keeps the gesture.
   *
   * Resolves with how the action ended -- for an action that had already ended, how it ended then.
   */
  perform(actionId: string): Promise<ClientActionOutcome> {
    const entry = this.entries.get(actionId);
    if (!entry) {
      return Promise.resolve({ status: 'failed', reason: 'not_pending' });
    }
    if (entry.outcome) {
      return Promise.resolve(entry.outcome);
    }
    if (entry.performing) {
      return entry.performing;
    }
    this.update(entry, { lifecycle: 'in_progress' });
    return this.run(entry, () => entry.handler.perform(entry.payload, entry.context));
  }

  /** The person turned the action down. */
  decline(actionId: string): void {
    const entry = this.entries.get(actionId);
    if (entry) {
      this.settle(entry, { status: 'declined' });
    }
  }

  /** The person typed a message. The pending action the server waits on ends without a reply. */
  cancelPending(): void {
    const entry = this.awaitedActionId ? this.entries.get(this.awaitedActionId) : undefined;
    if (entry) {
      this.settle(entry, { status: 'cancelled' });
    }
  }

  /**
   * Stop every timer and run; nothing is sent. For when the agent is torn down.
   *
   * Each action still ends with an update (`cancelled`, reason `disconnected`), so whatever shows
   * it stops offering buttons this manager can no longer act on.
   */
  clear(): void {
    const cleared = [...this.entries.values()];
    for (const entry of cleared) {
      // Settled, not just aborted: a run that ignores the signal still resolves, and `settle`
      // would otherwise send its result -- token included -- on whatever socket is open by then.
      entry.outcome = { status: 'cancelled', reason: 'disconnected' };
      clearTimeout(entry.timer);
      entry.controller.abort();
    }
    this.entries.clear();
    this.awaitedActionId = undefined;
    // Told only once nothing is left, so a listener that calls back in finds no action to touch.
    for (const entry of cleared) {
      this.update(entry, { lifecycle: 'cancelled', status: 'cancelled', reason: 'disconnected' });
    }
  }

  private createEntry(
    envelope: ClientActionEnvelope,
    handler: ClientActionHandler<unknown>,
    payload: unknown,
  ): Entry {
    const controller = new AbortController();
    const entry: Entry = {
      envelope,
      handler,
      payload,
      controller,
      context: {
        actionId: envelope.actionId,
        expiresAt: this.deadline(envelope),
        signal: controller.signal,
        progress: (detail) => {
          if (!entry.outcome) {
            this.update(entry, { lifecycle: 'in_progress', progress: detail });
          }
        },
      },
    };
    this.entries.set(envelope.actionId, entry);
    return entry;
  }

  private trySilently(entry: Entry, handler: ClientActionHandler<unknown>, payload: unknown): void {
    // Called directly rather than from a `.then`, so the attempt still starts the moment the action
    // arrives; a synchronous throw is turned into the rejection an async one would have been.
    let attempt: Promise<ClientActionOutcome | null>;
    try {
      attempt = handler.tryWithoutUser!(payload, entry.context);
    } catch (error) {
      attempt = Promise.reject(error);
    }
    attempt
      .then((outcome) => {
        if (entry.outcome || entry.performing) {
          return; // ended, or the person clicked while this was in flight
        }
        if (outcome) {
          this.settle(entry, outcome);
        } else {
          this.update(entry, { lifecycle: 'pending' });
        }
      })
      .catch((error) => {
        this.options.logger.warn('Silent attempt at a client action failed; waiting for the person', {
          type: entry.envelope.type,
          error: error instanceof Error ? error.message : String(error),
        });
        if (!entry.outcome && !entry.performing) {
          this.update(entry, { lifecycle: 'pending' });
        }
      });
  }

  private run(entry: Entry, start: () => Promise<ClientActionOutcome>): Promise<ClientActionOutcome> {
    let started: Promise<ClientActionOutcome>;
    try {
      started = start();
    } catch (error) {
      started = Promise.reject(error);
    }
    entry.performing = started
      .catch((error): ClientActionOutcome => {
        this.options.logger.error('Client action handler threw', error instanceof Error ? error : undefined, {
          type: entry.envelope.type,
        });
        return { status: 'failed', reason: 'unknown' };
      })
      .then((outcome) => {
        this.settle(entry, outcome);
        return entry.outcome ?? outcome;
      });
    return entry.performing;
  }

  private settle(entry: Entry, outcome: ClientActionOutcome): void {
    if (entry.outcome) {
      return;
    }
    entry.outcome = outcome;
    clearTimeout(entry.timer);
    if (outcome.status !== 'completed') {
      entry.controller.abort();
    }
    this.entries.delete(entry.envelope.actionId);
    if (this.awaitedActionId === entry.envelope.actionId) {
      this.awaitedActionId = undefined;
    }

    this.update(entry, { lifecycle: lifecycleFor(outcome.status), status: outcome.status, reason: outcome.reason });
    if (entry.envelope.awaitsResult && !LOCAL_ONLY_STATUSES.has(outcome.status)) {
      void this.send(entry.envelope, outcome);
    }
  }

  private async send(envelope: ClientActionEnvelope, outcome: ClientActionOutcome): Promise<void> {
    try {
      await this.options.sendResult({
        actionId: envelope.actionId,
        type: envelope.type,
        status: outcome.status,
        ...(outcome.reason && { reason: outcome.reason }),
        ...(outcome.data && { data: outcome.data }),
      });
    } catch (error) {
      this.options.logger.warn('Could not send a client action result', {
        type: envelope.type,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private deadline(envelope: ClientActionEnvelope): number | undefined {
    return typeof envelope.expiresAt === 'number' ? envelope.expiresAt - CLIENT_ACTION_EXPIRY_MARGIN_MS : undefined;
  }

  private describe(entry: Entry, lifecycle: ClientActionLifecycle): ClientAction {
    const { envelope, handler, payload } = entry;
    return {
      actionId: envelope.actionId,
      type: envelope.type,
      interaction: handler.interaction,
      awaitsResult: envelope.awaitsResult,
      expiresAt: envelope.expiresAt,
      payload,
      lifecycle,
    };
  }

  private update(entry: Entry, change: Omit<ClientActionUpdate, 'actionId' | 'type'>): void {
    this.options.onUpdate({ actionId: entry.envelope.actionId, type: entry.envelope.type, ...change });
  }
}
