import { describe, it, expect, vi, beforeEach } from "vitest";
import { Preloader } from "./Preloader";
import { Scene, GameObjects } from "phaser";

// Mock Phaser's BlendModes
vi.mock("phaser", () => ({
  default: {
    BlendModes: {
      ADD: 1,
    },
  },
  Scene: class {},
  GameObjects: {},
}));

describe("Preloader Scene", () => {
  let preloader: Preloader;
  let mockLoad: any;
  let mockScene: any;
  let mockGraphics: any;
  let mockAdd: any;
  let mockScale: any;
  let mockTweens: any;
  let mockGraphicsGenerator: any;

  beforeEach(() => {
    mockGraphics = {
      clear: vi.fn().mockReturnThis(),
      fillStyle: vi.fn().mockReturnThis(),
      fillRect: vi.fn().mockReturnThis(),
      lineStyle: vi.fn().mockReturnThis(),
      strokeRect: vi.fn().mockReturnThis(),
      beginPath: vi.fn().mockReturnThis(),
      arc: vi.fn().mockReturnThis(),
      closePath: vi.fn().mockReturnThis(),
      fill: vi.fn().mockReturnThis(),
      stroke: vi.fn().mockReturnThis(),
      generateTexture: vi.fn().mockReturnThis(),
      destroy: vi.fn(),
      moveTo: vi.fn().mockReturnThis(),
      lineTo: vi.fn().mockReturnThis(),
      lineBetween: vi.fn().mockReturnThis(),
    };

    mockAdd = {
      graphics: vi.fn().mockReturnValue(mockGraphics),
      image: vi.fn(),
      rectangle: vi.fn().mockReturnValue({
        setStrokeStyle: vi.fn().mockReturnThis(),
      }),
      spritesheet: vi.fn(),
      particles: vi.fn().mockReturnValue({
        createEmitter: vi.fn(),
      }),
    } as unknown as GameObjects.GameObjectFactory;

    mockLoad = {
      image: vi.fn(),
      spritesheet: vi.fn(),
      audio: vi.fn(),
      on: vi.fn(),
    };

    mockScale = {
      width: 800,
      height: 600,
    };

    mockTweens = {
      add: vi.fn().mockImplementation(({ onComplete }) => {
        if (onComplete) {
          onComplete();
        }
      }),
    };

    mockScene = {
      start: vi.fn(),
      registry: {
        set: vi.fn(),
        get: vi.fn(),
      },
    };

    mockGraphicsGenerator = {
      generatePlayerTexture: vi.fn(),
      generateEnemyTexture: vi.fn(),
      generateTowerTexture: vi.fn(),
      generateParticleTexture: vi.fn(),
      setupParticleEffects: vi.fn(),
    };

    preloader = new Preloader();
    preloader.load = mockLoad;
    preloader.add = mockAdd;
    preloader.scale = mockScale;
    preloader.tweens = mockTweens;
    preloader.scene = {
      ...mockScene,
      key: "Preloader",
    };
    preloader.registry = {
      set: vi.fn(),
      get: vi.fn(),
      events: {
        on: vi.fn(),
        emit: vi.fn(),
      },
      list: {},
      values: {},
      remove: vi.fn(),
      removeAll: vi.fn(),
      destroy: vi.fn(),
    } as unknown as Phaser.Data.DataManager;

    // Mock the GraphicsGenerator instance
    (preloader as any).graphicsGenerator = mockGraphicsGenerator;
  });

  it("should be a Phaser Scene", () => {
    expect(preloader).toBeInstanceOf(Preloader);
    expect(preloader.scene.key).toBe("Preloader");
  });

  it("should generate all required textures and load audio assets", () => {
    preloader.preload();

    // Check texture generation
    expect(mockGraphicsGenerator.generatePlayerTexture).toHaveBeenCalled();
    expect(mockGraphicsGenerator.generateEnemyTexture).toHaveBeenCalled();
    expect(mockGraphicsGenerator.generateTowerTexture).toHaveBeenCalled();
    expect(mockGraphicsGenerator.generateParticleTexture).toHaveBeenCalledWith(
      "particle",
      4,
      0xffffff,
      1
    );
    expect(mockGraphicsGenerator.setupParticleEffects).toHaveBeenCalled();

    // Check audio assets
    expect(mockLoad.audio).toHaveBeenCalledWith("hit", expect.any(String));
    expect(mockLoad.audio).toHaveBeenCalledWith("shoot", expect.any(String));
    expect(mockLoad.audio).toHaveBeenCalledWith("build", expect.any(String));
    expect(mockLoad.audio).toHaveBeenCalledWith("collect", expect.any(String));
    expect(mockLoad.audio).toHaveBeenCalledWith("death", expect.any(String));
  });

  it("should start the Game scene when loading is complete", () => {
    preloader.create();
    expect(mockScene.start).toHaveBeenCalledWith("Game");
  });

  it("should handle loading progress", () => {
    const mockProgressCallback = vi.fn();
    mockLoad.on.mockImplementation((event: string, callback: Function) => {
      if (event === "progress") {
        callback(0.5);
      }
    });

    preloader.preload();
    expect(mockLoad.on).toHaveBeenCalledWith("progress", expect.any(Function));
  });
});
