import { describe, it, expect, beforeEach, vi } from "vitest";
import { BuildMenu } from "./BuildMenu";
import { Scene } from "phaser";
import { GameState } from "../controllers/GameController";

describe("BuildMenu", () => {
  let buildMenu: BuildMenu;
  let mockScene: Scene;
  let mockContainer: any;
  let mockText: any;
  let mockRectangle: any;
  let buttonHandlers: Map<
    string,
    { over: Function; out: Function; down: Function }
  >;

  beforeEach(() => {
    buttonHandlers = new Map();
    mockText = {
      setText: vi.fn().mockReturnThis(),
      setOrigin: vi.fn().mockReturnThis(),
      setTint: vi.fn().mockReturnThis(),
    };

    mockRectangle = {
      setOrigin: vi.fn().mockReturnThis(),
      setFillStyle: vi.fn().mockReturnThis(),
      setInteractive: vi.fn().mockReturnThis(),
      on: vi.fn((event: string, handler: Function) => {
        const key = "1"; // Always use the same key for simplicity
        if (!buttonHandlers.has(key)) {
          buttonHandlers.set(key, {
            over: vi.fn(),
            out: vi.fn(),
            down: vi.fn(),
          });
        }
        const handlers = buttonHandlers.get(key)!;
        switch (event) {
          case "pointerover":
            handlers.over = handler;
            break;
          case "pointerout":
            handlers.out = handler;
            break;
          case "pointerdown":
            handlers.down = handler;
            break;
        }
        return mockRectangle;
      }),
    };

    mockContainer = {
      setScrollFactor: vi.fn().mockReturnThis(),
      setDepth: vi.fn().mockReturnThis(),
      setVisible: vi.fn().mockReturnThis(),
      add: vi.fn().mockReturnThis(),
      destroy: vi.fn(),
      list: [mockRectangle, mockText],
    };

    // Create mock scene
    mockScene = {
      add: {
        container: vi.fn().mockReturnValue(mockContainer),
        rectangle: vi.fn().mockReturnValue(mockRectangle),
        text: vi.fn().mockReturnValue(mockText),
      },
      events: {
        emit: vi.fn(),
      },
      scale: {
        width: 800,
        height: 600,
      },
    } as unknown as Scene;

    buildMenu = new BuildMenu(mockScene);
  });

  it("should initialize with default state", () => {
    expect(buildMenu.getSelectedTower()).toBeNull();
  });

  it("should update visibility based on state", () => {
    const state: GameState = {
      showBuildMenu: true,
      showTowerMenu: false,
      selectedTower: null,
      souls: 0,
    };

    buildMenu.updateState(state);
    expect(mockContainer.setVisible).toHaveBeenCalledWith(true);

    state.showBuildMenu = false;
    buildMenu.updateState(state);
    expect(mockContainer.setVisible).toHaveBeenCalledWith(false);
  });

  it("should update button states based on soul count", () => {
    const state: GameState = {
      showBuildMenu: true,
      showTowerMenu: false,
      selectedTower: null,
      souls: 150,
    };

    buildMenu.updateState(state);
    expect(mockRectangle.setFillStyle).toHaveBeenCalledWith(0x333333);

    state.souls = 0;
    buildMenu.updateState(state);
    expect(mockRectangle.setFillStyle).toHaveBeenCalledWith(0x222222);
  });

  it("should handle tower selection", () => {
    const handlers = buttonHandlers.get("1")!;

    // Simulate button interactions
    handlers.over();
    expect(mockRectangle.setFillStyle).toHaveBeenCalledWith(0x444444);

    handlers.out();
    expect(mockRectangle.setFillStyle).toHaveBeenCalledWith(0x333333);

    handlers.down();
    expect(mockScene.events.emit).toHaveBeenCalledWith(
      "towerSelected",
      "sniper"
    );
    expect(buildMenu.getSelectedTower()).toBe("sniper");
  });

  it("should clean up resources on destroy", () => {
    buildMenu.destroy();
    expect(mockContainer.destroy).toHaveBeenCalled();
  });
});
