import { describe, it, expect, beforeEach, vi } from "vitest";
import { GameStatusUI, CampStatus } from "./GameStatusUI";
import { Scene } from "phaser";

describe("GameStatusUI", () => {
  let gameStatusUI: GameStatusUI;
  let mockScene: Scene;
  let mockCircles: any[];
  let mockContainer: any;

  beforeEach(() => {
    mockCircles = [];
    mockContainer = {
      setScrollFactor: vi.fn().mockReturnThis(),
      setDepth: vi.fn().mockReturnThis(),
      add: vi.fn().mockReturnThis(),
      destroy: vi.fn(),
    };

    mockScene = {
      add: {
        container: vi.fn().mockReturnValue(mockContainer),
        circle: vi.fn().mockImplementation(() => {
          const circle = {
            setFillStyle: vi.fn().mockReturnThis(),
            setStrokeStyle: vi.fn().mockReturnThis(),
            destroy: vi.fn(),
          };
          mockCircles.push(circle);
          return circle;
        }),
      },
      scale: {
        width: 800,
        height: 600,
      },
    } as unknown as Scene;

    gameStatusUI = new GameStatusUI(mockScene);
  });

  it("should create base circles for each camp", () => {
    const camps: CampStatus[] = [
      {
        id: "camp1",
        position: { x: 100, y: 100 },
        isSpawning: false,
        isQuestTarget: false,
        isDestroyed: false,
        isCooperating: false,
      },
      {
        id: "camp2",
        position: { x: 200, y: 200 },
        isSpawning: false,
        isQuestTarget: false,
        isDestroyed: false,
        isCooperating: false,
      },
      {
        id: "camp3",
        position: { x: 300, y: 300 },
        isSpawning: false,
        isQuestTarget: false,
        isDestroyed: false,
        isCooperating: false,
      },
    ];

    gameStatusUI.updateCampStatus(camps);
    expect(mockScene.add.circle).toHaveBeenCalledTimes(3);
    expect(mockCircles).toHaveLength(3);
    mockCircles.forEach((circle) => {
      expect(circle.setFillStyle).toHaveBeenCalledWith(0x000000, 0.5);
    });
  });

  it("should update camp status for different states", () => {
    // First create some initial circles
    const initialCamps: CampStatus[] = [
      {
        id: "camp1",
        position: { x: 100, y: 100 },
        isSpawning: false,
        isQuestTarget: false,
        isDestroyed: false,
        isCooperating: false,
      },
    ];
    gameStatusUI.updateCampStatus(initialCamps);

    // Test neutral camp
    const neutralCamp: CampStatus[] = [
      {
        id: "camp1",
        position: { x: 100, y: 100 },
        isSpawning: false,
        isQuestTarget: false,
        isDestroyed: false,
        isCooperating: false,
      },
    ];
    gameStatusUI.updateCampStatus(neutralCamp);
    expect(mockCircles[1].setFillStyle).toHaveBeenCalledWith(0x000000, 0.5);

    // Test destroyed camp
    const destroyedCamp: CampStatus[] = [
      {
        id: "camp1",
        position: { x: 100, y: 100 },
        isSpawning: false,
        isQuestTarget: false,
        isDestroyed: true,
        isCooperating: false,
      },
    ];
    gameStatusUI.updateCampStatus(destroyedCamp);
    expect(mockCircles[2].setFillStyle).toHaveBeenCalledWith(0xff0000, 0.5);

    // Test cooperating camp
    const cooperatingCamp: CampStatus[] = [
      {
        id: "camp1",
        position: { x: 100, y: 100 },
        isSpawning: false,
        isQuestTarget: false,
        isDestroyed: false,
        isCooperating: true,
      },
    ];
    gameStatusUI.updateCampStatus(cooperatingCamp);
    expect(mockCircles[3].setFillStyle).toHaveBeenCalledWith(0x00ff00, 0.5);
  });

  it("should clean up resources on destroy", () => {
    const camps: CampStatus[] = [
      {
        id: "camp1",
        position: { x: 100, y: 100 },
        isSpawning: false,
        isQuestTarget: false,
        isDestroyed: false,
        isCooperating: false,
      },
    ];
    gameStatusUI.updateCampStatus(camps);

    gameStatusUI.destroy();
    expect(mockContainer.destroy).toHaveBeenCalled();
    mockCircles.forEach((circle) => {
      expect(circle.destroy).toHaveBeenCalled();
    });
  });
});
