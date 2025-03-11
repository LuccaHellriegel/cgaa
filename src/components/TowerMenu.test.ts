import { describe, it, expect, beforeEach, vi } from "vitest";
import { TowerMenu, TowerData } from "./TowerMenu";
import { Scene } from "phaser";
import { UIState, GameMode } from "../controllers/UIController";

describe("TowerMenu", () => {
  let towerMenu: TowerMenu;
  let mockScene: Scene;
  let mockContainer: any;
  let mockRectangle: any;
  let mockText: any;
  let sellButtonHandler: Function;

  beforeEach(() => {
    sellButtonHandler = vi.fn();

    mockContainer = {
      setScrollFactor: vi.fn().mockReturnThis(),
      setDepth: vi.fn().mockReturnThis(),
      setVisible: vi.fn().mockReturnThis(),
      setPosition: vi.fn().mockReturnThis(),
      add: vi.fn().mockReturnThis(),
      destroy: vi.fn(),
    };

    mockRectangle = {
      setOrigin: vi.fn().mockReturnThis(),
      setFillStyle: vi.fn().mockReturnThis(),
      setInteractive: vi.fn().mockReturnThis(),
      on: vi.fn((event: string, handler: Function) => {
        if (event === "pointerdown") {
          sellButtonHandler = handler;
        }
      }),
    };

    mockText = {
      setOrigin: vi.fn().mockReturnThis(),
      setText: vi.fn().mockReturnThis(),
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

    towerMenu = new TowerMenu(mockScene);
  });

  const mockTowerData: TowerData = {
    key: "basic",
    name: "Basic Tower",
    level: 1,
    damage: 10,
    range: 150,
    attackSpeed: 1,
    cost: 100,
    sellValue: 50,
    position: { x: 400, y: 300 },
  };

  it("should initialize with default state", () => {
    expect(mockContainer.setScrollFactor).toHaveBeenCalledWith(0);
    expect(mockContainer.setDepth).toHaveBeenCalledWith(100);
    expect(mockContainer.setVisible).toHaveBeenCalledWith(false);
  });

  it("should update visibility based on state", () => {
    const state: UIState = {
      currentMode: GameMode.ATTACK,
      souls: 0,
      selectedTower: null,
      showBuildMenu: false,
      showTowerMenu: true,
      showDiplomatMenu: false,
    };

    towerMenu.updateState(state);
    expect(mockContainer.setVisible).toHaveBeenCalledWith(true);

    state.showTowerMenu = false;
    towerMenu.updateState(state);
    expect(mockContainer.setVisible).toHaveBeenCalledWith(false);
  });

  it("should update tower stats when tower is selected", () => {
    const state: UIState = {
      currentMode: GameMode.ATTACK,
      souls: 0,
      selectedTower: "basic",
      showBuildMenu: false,
      showTowerMenu: true,
      showDiplomatMenu: false,
    };

    towerMenu.updateState(state);
    expect(mockText.setText).toHaveBeenCalled();
    expect(mockContainer.setVisible).toHaveBeenCalledWith(true);
  });

  it("should handle sell button click", () => {
    const state: UIState = {
      currentMode: GameMode.ATTACK,
      souls: 0,
      selectedTower: "basic",
      showBuildMenu: false,
      showTowerMenu: true,
      showDiplomatMenu: false,
    };

    towerMenu.updateState(state);
    sellButtonHandler();
    expect(mockScene.events.emit).toHaveBeenCalledWith("sellTower", "basic");
  });

  it("should clean up resources on destroy", () => {
    towerMenu.destroy();
    expect(mockContainer.destroy).toHaveBeenCalled();
  });
});
