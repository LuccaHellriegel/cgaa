import { describe, it, expect, beforeEach, vi } from "vitest";
import { UIController, GameMode } from "./UIController";
import { Scene } from "phaser";

describe("UIController", () => {
  let uiController: UIController;
  let mockScene: Scene;
  let keydownFHandler: Function;
  let pointerdownHandler: Function;

  beforeEach(() => {
    // Store handlers when they're registered
    keydownFHandler = vi.fn();
    pointerdownHandler = vi.fn();

    // Create mock scene
    mockScene = {
      add: {
        text: vi.fn().mockReturnValue({
          setScrollFactor: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
          setText: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
        }),
      },
      input: {
        keyboard: {
          on: vi.fn((event: string, handler: Function) => {
            if (event === "keydown-F") {
              keydownFHandler = handler;
            }
            return mockScene.input.keyboard;
          }),
          off: vi.fn(),
        },
        on: vi.fn((event: string, handler: Function) => {
          if (event === "pointerdown") {
            pointerdownHandler = handler;
          }
          return mockScene.input;
        }),
        off: vi.fn(),
      },
      events: {
        emit: vi.fn(),
      },
      cameras: {
        main: {
          getWorldPoint: vi.fn().mockReturnValue({ x: 100, y: 100 }),
        },
      },
    } as unknown as Scene;

    uiController = new UIController(mockScene);
  });

  it("should initialize with attack mode", () => {
    expect(uiController.getCurrentMode()).toBe(GameMode.ATTACK);
  });

  it("should toggle mode when F key is pressed", () => {
    // Initial mode is ATTACK
    expect(uiController.getCurrentMode()).toBe(GameMode.ATTACK);

    // Simulate F key press
    keydownFHandler();
    expect(uiController.getCurrentMode()).toBe(GameMode.INTERACTION);

    // Press F again
    keydownFHandler();
    expect(uiController.getCurrentMode()).toBe(GameMode.ATTACK);
  });

  it("should handle clicks in attack mode", () => {
    // Simulate click in attack mode
    pointerdownHandler({ x: 50, y: 50 });
    expect(mockScene.events.emit).toHaveBeenCalledWith(
      "playerAttack",
      expect.any(Object)
    );
  });

  it("should handle clicks in interaction mode", () => {
    // Switch to interaction mode
    keydownFHandler();

    // Simulate click in interaction mode
    pointerdownHandler({ x: 50, y: 50 });
    expect(mockScene.events.emit).toHaveBeenCalledWith(
      "playerInteract",
      expect.any(Object)
    );
  });

  it("should update souls count", () => {
    uiController.updateSouls(150);
    expect(mockScene.events.emit).toHaveBeenCalledWith("soulsUpdated", 150);
  });

  it("should return current state", () => {
    const state = uiController.getState();
    expect(state).toEqual({
      currentMode: GameMode.ATTACK,
      souls: 0,
      selectedTower: null,
      showBuildMenu: false,
      showTowerMenu: false,
      showDiplomatMenu: false,
    });
  });

  it("should clean up resources on destroy", () => {
    uiController.destroy();
    expect(mockScene.input.keyboard?.off).toHaveBeenCalledWith("keydown-F");
    expect(mockScene.input.off).toHaveBeenCalledWith("pointerdown");
  });
});
