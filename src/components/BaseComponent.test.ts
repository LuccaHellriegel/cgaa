import { describe, it, expect, beforeEach, vi } from "vitest";
import { BaseComponent, ComponentConfig } from "./BaseComponent";
import { Scene } from "phaser";

class TestComponent extends BaseComponent {
  update(time: number, delta: number): void {}
}

describe("BaseComponent", () => {
  let component: TestComponent;
  let mockScene: Scene;

  beforeEach(() => {
    mockScene = {
      add: {
        sprite: vi.fn(),
      },
    } as unknown as Scene;

    component = new TestComponent({ scene: mockScene });
  });

  it("should initialize with a scene", () => {
    expect(component["scene"]).toBe(mockScene);
  });

  it("should handle event listeners", () => {
    const callback = vi.fn();
    const event = "test-event";
    const eventData = { test: "data" };

    // Add listener
    component["addListener"](event, callback);
    component["emit"](event, eventData);
    expect(callback).toHaveBeenCalledWith(eventData);

    // Remove listener
    component["removeListener"](event, callback);
    component["emit"](event, eventData);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should clear all event listeners on destroy", () => {
    const callback = vi.fn();
    const event = "test-event";

    component["addListener"](event, callback);
    component.destroy();
    component["emit"](event);
    expect(callback).not.toHaveBeenCalled();
  });
});
