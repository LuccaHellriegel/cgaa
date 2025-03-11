import { describe, it, expect, beforeEach, vi } from "vitest";
import { GraphicsGenerator } from "./GraphicsGenerator";

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

describe("GraphicsGenerator", () => {
  let mockScene: any;
  let mockGraphics: any;
  let mockAnims: any;
  let generator: GraphicsGenerator;

  beforeEach(() => {
    mockGraphics = {
      lineStyle: vi.fn(),
      fillStyle: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      generateTexture: vi.fn(),
      destroy: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      clear: vi.fn(),
    };

    mockAnims = {
      create: vi.fn(),
    };

    mockScene = {
      add: {
        graphics: () => mockGraphics,
        particles: vi.fn().mockReturnValue({
          createEmitter: vi.fn(),
        }),
      },
      anims: mockAnims,
      registry: {
        set: vi.fn(),
        get: vi.fn(),
      },
    };

    generator = new GraphicsGenerator(mockScene as any);
  });

  describe("generatePlayerTexture", () => {
    it("should generate player textures with default key", () => {
      generator.generatePlayerTexture();

      // Check idle frame generation
      expect(mockGraphics.lineStyle).toHaveBeenCalledWith(2, 0x000000);
      expect(mockGraphics.fillStyle).toHaveBeenCalledWith(
        GraphicsGenerator.Colors.PLAYER
      );
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "player",
        32,
        32
      );

      // Check move frame generation
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "player_move",
        32,
        32
      );

      // Check attack frame generation
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "player_attack",
        32,
        32
      );

      // Check animations creation
      expect(mockAnims.create).toHaveBeenCalledWith({
        key: "player_idle",
        frames: [{ key: "player" }],
        frameRate: 1,
        repeat: -1,
      });

      expect(mockAnims.create).toHaveBeenCalledWith({
        key: "player_move",
        frames: [{ key: "player" }, { key: "player_move" }],
        frameRate: 8,
        repeat: -1,
      });

      expect(mockAnims.create).toHaveBeenCalledWith({
        key: "player_attack",
        frames: [
          { key: "player" },
          { key: "player_attack" },
          { key: "player" },
        ],
        frameRate: 12,
        repeat: 0,
      });
    });

    it("should generate player textures with custom key", () => {
      generator.generatePlayerTexture("custom_player");

      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "custom_player",
        32,
        32
      );
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "custom_player_move",
        32,
        32
      );
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "custom_player_attack",
        32,
        32
      );
    });

    it("should handle scene without animations", () => {
      mockScene.anims = undefined;
      generator = new GraphicsGenerator(mockScene as any);

      expect(() => {
        generator.generatePlayerTexture();
      }).not.toThrow();
    });
  });

  describe("generateCircleTexture", () => {
    it("should generate a circle texture with stroke", () => {
      generator.generateCircleTexture("circle", 10, 0xff0000, 0x000000, 2);

      expect(mockGraphics.lineStyle).toHaveBeenCalledWith(2, 0x000000);
      expect(mockGraphics.fillStyle).toHaveBeenCalledWith(0xff0000);
      expect(mockGraphics.arc).toHaveBeenCalledWith(10, 10, 10, 0, Math.PI * 2);
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "circle",
        20,
        20
      );
      expect(mockGraphics.destroy).toHaveBeenCalled();
    });

    it("should generate a circle texture without stroke", () => {
      generator.generateCircleTexture("circle", 10, 0xff0000);

      expect(mockGraphics.lineStyle).not.toHaveBeenCalled();
      expect(mockGraphics.stroke).not.toHaveBeenCalled();
    });
  });

  describe("generateRectangleTexture", () => {
    it("should generate a rectangle texture with stroke", () => {
      generator.generateRectangleTexture("rect", 20, 10, 0xff0000, 0x000000, 2);

      expect(mockGraphics.lineStyle).toHaveBeenCalledWith(2, 0x000000);
      expect(mockGraphics.fillStyle).toHaveBeenCalledWith(0xff0000);
      expect(mockGraphics.fillRect).toHaveBeenCalledWith(0, 0, 20, 10);
      expect(mockGraphics.strokeRect).toHaveBeenCalledWith(0, 0, 20, 10);
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith("rect", 20, 10);
      expect(mockGraphics.destroy).toHaveBeenCalled();
    });

    it("should generate a rectangle texture without stroke", () => {
      generator.generateRectangleTexture("rect", 20, 10, 0xff0000);

      expect(mockGraphics.lineStyle).not.toHaveBeenCalled();
      expect(mockGraphics.strokeRect).not.toHaveBeenCalled();
    });
  });

  describe("generateTriangleTexture", () => {
    it("should generate a triangle texture with stroke", () => {
      generator.generateTriangleTexture("triangle", 20, 0xff0000, 0x000000, 2);

      expect(mockGraphics.lineStyle).toHaveBeenCalledWith(2, 0x000000);
      expect(mockGraphics.fillStyle).toHaveBeenCalledWith(0xff0000);
      expect(mockGraphics.moveTo).toHaveBeenCalledWith(10, 0);
      expect(mockGraphics.lineTo).toHaveBeenCalledWith(20, 20);
      expect(mockGraphics.lineTo).toHaveBeenCalledWith(0, 20);
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "triangle",
        20,
        20
      );
      expect(mockGraphics.destroy).toHaveBeenCalled();
    });

    it("should generate a triangle texture without stroke", () => {
      generator.generateTriangleTexture("triangle", 20, 0xff0000);

      expect(mockGraphics.lineStyle).not.toHaveBeenCalled();
      expect(mockGraphics.stroke).not.toHaveBeenCalled();
    });
  });

  describe("generateParticleTexture", () => {
    it("should generate a particle texture with default alpha", () => {
      generator.generateParticleTexture("particle", 5, 0xff0000);

      expect(mockGraphics.fillStyle).toHaveBeenCalledWith(0xff0000, 1);
      expect(mockGraphics.arc).toHaveBeenCalledWith(5, 5, 5, 0, Math.PI * 2);
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "particle",
        10,
        10
      );
      expect(mockGraphics.destroy).toHaveBeenCalled();
    });

    it("should generate a particle texture with custom alpha", () => {
      generator.generateParticleTexture("particle", 5, 0xff0000, 0.5);

      expect(mockGraphics.fillStyle).toHaveBeenCalledWith(0xff0000, 0.5);
    });
  });

  describe("setupParticleEffects", () => {
    it("should generate particle textures with default alpha", () => {
      generator.setupParticleEffects();

      expect(mockGraphics.fillStyle).toHaveBeenCalledWith(0xffffff, 1);
      expect(mockGraphics.arc).toHaveBeenCalledWith(4, 4, 4, 0, Math.PI * 2);
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith(
        "particle",
        8,
        8
      );
      expect(mockGraphics.destroy).toHaveBeenCalled();
    });

    it("should store particle emitters in the registry", () => {
      generator.setupParticleEffects();

      expect(mockScene.registry.set).toHaveBeenCalledWith(
        "particles",
        expect.any(Object)
      );
    });
  });

  describe("Colors", () => {
    it("should have the correct color constants", () => {
      expect(GraphicsGenerator.Colors.PLAYER).toBe(0x800080);
      expect(GraphicsGenerator.Colors.ALLIES).toBe(0x0000ff);
      expect(GraphicsGenerator.Colors.ENEMY).toBe(0xff0000);
      expect(GraphicsGenerator.Colors.NEUTRAL).toBe(0x808080);
      expect(GraphicsGenerator.Colors.WARNING).toBe(0xff0000);
      expect(GraphicsGenerator.Colors.SUCCESS).toBe(0x00ff00);
      expect(GraphicsGenerator.Colors.UI).toBe(0x00ffff);
    });
  });
});
