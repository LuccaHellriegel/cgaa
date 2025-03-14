import { Scene } from "phaser";

// Utility function for assertions
function assert(
  condition: boolean,
  message: string,
  context?: any
): asserts condition {
  if (!condition) {
    const contextStr = context ? ` Context: ${JSON.stringify(context)}` : "";
    const errorMsg = `Assertion failed: ${message}.${contextStr}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export interface ComponentConfig {
  scene: Scene;
  x?: number;
  y?: number;
  texture?: string;
}

export abstract class BaseComponent {
  protected scene: Scene;
  protected eventListeners: Map<string, Function[]>;

  constructor(config: ComponentConfig) {
    assert(config !== undefined, "ComponentConfig must be provided", {
      config,
    });
    assert(
      config.scene instanceof Scene,
      "Valid Phaser Scene must be provided",
      {
        providedScene: config.scene,
        sceneType: config.scene ? typeof config.scene : "undefined",
      }
    );

    this.scene = config.scene;
    this.eventListeners = new Map();
  }

  protected addListener(event: string, callback: Function): void {
    assert(
      typeof event === "string" && event.length > 0,
      "Event name must be a non-empty string",
      { event }
    );
    assert(typeof callback === "function", "Callback must be a function", {
      callbackType: typeof callback,
    });

    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }

    const listeners = this.eventListeners.get(event);
    assert(listeners !== undefined, "Listeners array should be initialized", {
      event,
    });

    listeners.push(callback);

    // Post-condition: ensure callback was added
    assert(
      this.eventListeners.get(event)?.includes(callback) === true,
      "Callback must be successfully added to listeners",
      { event, listenersCount: this.eventListeners.get(event)?.length }
    );
  }

  protected removeListener(event: string, callback: Function): void {
    assert(typeof event === "string", "Event name must be a string", { event });
    assert(typeof callback === "function", "Callback must be a function", {
      callbackType: typeof callback,
    });

    const listeners = this.eventListeners.get(event);

    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        const oldLength = listeners.length;
        listeners.splice(index, 1);

        // Post-condition: verify callback was removed
        assert(
          listeners.length === oldLength - 1,
          "Callback removal must reduce listeners array by exactly one",
          { event, oldLength, newLength: listeners.length }
        );
        assert(
          !listeners.includes(callback),
          "Callback must be fully removed from listeners array",
          { event }
        );
      }
    }
  }

  protected emit(event: string, ...args: any[]): void {
    assert(typeof event === "string", "Event name must be a string", { event });

    const listeners = this.eventListeners.get(event);
    if (listeners) {
      assert(Array.isArray(listeners), "Listeners must be an array", {
        event,
        listenersType: typeof listeners,
      });

      listeners.forEach((callback) => callback(...args));
    }
  }

  public destroy(): void {
    // Precondition
    assert(this.eventListeners instanceof Map, "eventListeners must be a Map", {
      type: typeof this.eventListeners,
    });

    const listenersBefore = this.eventListeners.size;
    this.eventListeners.clear();

    // Postcondition
    assert(
      this.eventListeners.size === 0,
      "All event listeners must be cleared",
      {
        beforeCount: listenersBefore,
        afterCount: this.eventListeners.size,
      }
    );
  }

  public abstract update(time: number, delta: number): void;
}
