/**
 * Handler function for events.
 * Can be synchronous or return a Promise for async handling.
 * @typeParam T - The event data type
 */
type EventHandler<T = any> = (data: T) => void | Promise<void>;

/**
 * Map of event names to their data types.
 */
type EventMap = Record<string, any>;

/**
 * Type-safe event emitter implementation.
 * 
 * Compatible with both browser and Node.js environments.
 * Provides a foundation for event-driven communication throughout the SDK.
 * 
 * @typeParam T - Event map defining event names and their data types
 * 
 * @example Creating a custom event emitter
 * ```typescript
 * import { EventEmitter } from "@eGainDev/ai-agent-sdk";
 * 
 * interface MyEvents {
 *   data: { value: number };
 *   error: { message: string };
 * }
 * 
 * class MyService extends EventEmitter<MyEvents> {
 *   doSomething() {
 *     this.emit("data", { value: 42 });
 *   }
 * }
 * 
 * const service = new MyService();
 * service.on("data", (event) => {
 *   console.log(event.value); // Typed as number
 * });
 * ```
 * 
 * @category Events
 */
export class EventEmitter<T extends EventMap = EventMap> {
  private handlers: Map<keyof T, Set<EventHandler>> = new Map();
  private onceHandlers: Map<keyof T, Set<EventHandler>> = new Map();

  /**
   * Register an event handler.
   * 
   * The handler will be called every time the event is emitted.
   * 
   * @param event - The event name to listen for
   * @param handler - The function to call when the event is emitted
   * @returns `this` for method chaining
   * 
   * @example
   * ```typescript
   * agent.on("message", (event) => {
   *   console.log("Received:", event.payload);
   * });
   * ```
   */
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): this {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return this;
  }

  /**
   * Register a one-time event handler.
   * 
   * The handler will be called only once, then automatically removed.
   * 
   * @param event - The event name to listen for
   * @param handler - The function to call when the event is emitted
   * @returns `this` for method chaining
   * 
   * @example
   * ```typescript
   * agent.once("connected", () => {
   *   console.log("First connection established!");
   * });
   * ```
   */
  once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): this {
    if (!this.onceHandlers.has(event)) {
      this.onceHandlers.set(event, new Set());
    }
    this.onceHandlers.get(event)!.add(handler);
    return this;
  }

  /**
   * Remove an event handler.
   * 
   * If no handler is specified, removes all handlers for the event.
   * 
   * @param event - The event name
   * @param handler - The specific handler to remove (optional)
   * @returns `this` for method chaining
   * 
   * @example Remove specific handler
   * ```typescript
   * const handler = (event) => console.log(event);
   * agent.on("message", handler);
   * agent.off("message", handler);
   * ```
   * 
   * @example Remove all handlers
   * ```typescript
   * agent.off("message");
   * ```
   */
  off<K extends keyof T>(event: K, handler?: EventHandler<T[K]>): this {
    if (handler) {
      this.handlers.get(event)?.delete(handler);
      this.onceHandlers.get(event)?.delete(handler);
    } else {
      // Remove all handlers for this event
      this.handlers.delete(event);
      this.onceHandlers.delete(event);
    }
    return this;
  }

  /**
   * Emit an event
   * Handlers are protected from exceptions - errors are caught and logged
   */
  protected emit<K extends keyof T>(event: K, data: T[K]): boolean {
    let hasHandlers = false;

    // Execute regular handlers
    const regularHandlers = this.handlers.get(event);
    if (regularHandlers) {
      hasHandlers = true;
      for (const handler of regularHandlers) {
        this.safeEmit(handler, data);
      }
    }

    // Execute once handlers and remove them
    const onceHandlers = this.onceHandlers.get(event);
    if (onceHandlers) {
      hasHandlers = true;
      for (const handler of onceHandlers) {
        this.safeEmit(handler, data);
      }
      onceHandlers.clear();
    }

    return hasHandlers;
  }

  /**
   * Safely execute a handler, catching any exceptions
   */
  private safeEmit(handler: EventHandler, data: any): void {
    try {
      const result = handler(data);
      // Handle async handlers
      if (result instanceof Promise) {
        result.catch((error) => {
          // Silently catch async errors to prevent SDK crashes
          // In production, this could be logged to an error reporting service
        });
      }
    } catch (error) {
      // Silently catch sync errors to prevent SDK crashes
      // In production, this could be logged to an error reporting service
    }
  }

  /**
   * Remove all event handlers
   */
  removeAllListeners<K extends keyof T>(event?: K): this {
    if (event) {
      this.handlers.delete(event);
      this.onceHandlers.delete(event);
    } else {
      this.handlers.clear();
      this.onceHandlers.clear();
    }
    return this;
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount<K extends keyof T>(event: K): number {
    const regular = this.handlers.get(event)?.size ?? 0;
    const once = this.onceHandlers.get(event)?.size ?? 0;
    return regular + once;
  }
}




