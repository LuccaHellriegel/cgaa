import { Scene } from "phaser";

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
    this.scene = config.scene;
    this.eventListeners = new Map();
  }

  protected addListener(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  protected removeListener(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  protected emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(...args));
    }
  }

  public destroy(): void {
    this.eventListeners.clear();
  }

  public abstract update(time: number, delta: number): void;
}
