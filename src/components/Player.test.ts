import { describe, it, expect, beforeEach, vi } from "vitest";
import { Player, PlayerConfig } from "./Player";
import { Scene, Physics } from "phaser";

// Helper function to create a mock scene
const createMockScene = () => {
  const mockSprite = {
    setCollideWorldBounds: vi.fn().mockReturnThis(),
    anims: {
      create: vi.fn(),
      play: vi.fn(),
    },
    x: 0,
    y: 0,
  };

  return {
    physics: {
      add: {
        sprite: vi.fn().mockReturnValue(mockSprite),
      },
    },
    anims: {
      create: vi.fn(),
      exists: vi.fn().mockReturnValue(false),
      generateFrameNumbers: vi.fn().mockReturnValue([]),
    },
  } as unknown as Scene;
};

describe("Player", () => {
  let player: Player;
  let mockScene: Scene;
  let mockSprite: Physics.Arcade.Sprite;

  beforeEach(() => {
    mockSprite = {
      setCollideWorldBounds: vi.fn().mockReturnThis(),
      setVelocity: vi.fn().mockReturnThis(),
      anims: {
        play: vi.fn().mockReturnThis(),
      },
      setFlipX: vi.fn().mockReturnThis(),
      setTint: vi.fn().mockReturnThis(),
      destroy: vi.fn(),
      x: 100,
      y: 100,
      width: 32,
      height: 32,
    } as unknown as Physics.Arcade.Sprite;

    mockScene = {
      physics: {
        add: {
          sprite: vi.fn().mockReturnValue(mockSprite),
        },
      },
      anims: {
        create: vi.fn(),
        exists: vi.fn().mockReturnValue(false),
        generateFrameNumbers: vi.fn().mockReturnValue([]),
      },
    } as unknown as Scene;

    player = new Player({
      scene: mockScene,
      x: 100,
      y: 100,
      texture: "player",
      speed: 200,
    });
  });

  it("should create player sprite with correct configuration", () => {
    expect(mockScene.physics.add.sprite).toHaveBeenCalledWith(
      100,
      100,
      "player"
    );
    expect(mockSprite.setCollideWorldBounds).toHaveBeenCalled();
  });

  it("should handle movement correctly", () => {
    player.setVelocity(1, 0);
    expect(mockSprite.setVelocity).toHaveBeenCalledWith(200, 0);
    expect(mockSprite.anims.play).toHaveBeenCalledWith("player-move", true);
    expect(mockSprite.setFlipX).toHaveBeenCalledWith(false);

    player.setVelocity(-1, 0);
    expect(mockSprite.setFlipX).toHaveBeenCalledWith(true);

    player.setVelocity(0, 0);
    expect(mockSprite.anims.play).toHaveBeenCalledWith("player-idle", true);
  });

  it("should handle death correctly", () => {
    const onDeath = vi.fn();
    player["addListener"]("died", onDeath);

    player.die();
    expect(mockSprite.setVelocity).toHaveBeenCalledWith(0, 0);
    expect(mockSprite.setTint).toHaveBeenCalledWith(0xff0000);
    expect(onDeath).toHaveBeenCalled();

    // Should not move after death
    player.setVelocity(1, 0);
    expect(mockSprite.setVelocity).toHaveBeenCalledTimes(1);
  });

  it("should detect collisions correctly", () => {
    const object = { x: 110, y: 110, width: 32, height: 32 };
    expect(player.isCollidingWith(object)).toBe(true);

    object.x = 200;
    expect(player.isCollidingWith(object)).toBe(false);
  });

  it("should clean up resources on destroy", () => {
    player.destroy();
    expect(mockSprite.destroy).toHaveBeenCalled();
  });

  it("should get sprite instance", () => {
    expect(player.getSprite()).toBe(mockSprite);
  });

  it("should handle update", () => {
    player.update(0, 16);
    // Since update is currently empty, we just verify it doesn't throw
    expect(true).toBe(true);
  });

  it("should use default values when not provided", () => {
    const mockScene = createMockScene();
    const player = new Player({
      scene: mockScene,
    });

    // Test default values
    expect(player["speed"]).toBe(200); // Default speed

    // Test default position and texture
    expect(mockScene.physics.add.sprite).toHaveBeenCalledWith(0, 0, "player");
  });

  describe("constructor", () => {
    it("should use default position when not provided", () => {
      const mockScene = createMockScene();
      const player = new Player({
        scene: mockScene,
        texture: "player",
      });

      // Test default position
      const sprite = player.getSprite();
      expect(sprite.x).toBe(0);
      expect(sprite.y).toBe(0);
    });
  });
});
