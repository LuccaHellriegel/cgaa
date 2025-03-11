import { describe, it, expect, beforeEach, vi } from "vitest";
import { Enemy, EnemyConfig } from "./Enemy";
import { Scene, Physics, GameObjects, Animations } from "phaser";

// Helper function to create a mock scene
const createMockScene = () => {
  const mockSprite = {
    setCollideWorldBounds: vi.fn().mockReturnThis(),
    anims: {
      create: vi.fn(),
      play: vi.fn(),
      currentAnim: { key: "enemy-idle" },
      isPlaying: false,
    },
    x: 0,
    y: 0,
    setVelocity: vi.fn(),
    setVelocityX: vi.fn(),
    setVelocityY: vi.fn(),
    setDepth: vi.fn(),
    setOrigin: vi.fn(),
    setTint: vi.fn(),
    setFlipX: vi.fn(),
    clearTint: vi.fn(),
    play: vi.fn(),
    on: vi.fn().mockReturnThis(),
    once: vi.fn(),
    destroy: vi.fn(),
    body: {
      velocity: { x: 0, y: 0 } as unknown as Phaser.Math.Vector2,
    },
    width: 32,
    height: 32,
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
    time: {
      delayedCall: vi.fn().mockImplementation((delay, callback) => {
        callback();
        return {};
      }),
    },
    registry: {
      get: vi.fn().mockReturnValue({
        impact: {
          emitParticleAt: vi.fn(),
        },
        death: {
          emitParticleAt: vi.fn(),
        },
      }),
    },
  } as unknown as Scene;
};

describe("Enemy", () => {
  let enemy: Enemy;
  let mockScene: Scene;
  let mockSprite: Physics.Arcade.Sprite;
  let setTintSpy: ReturnType<typeof vi.fn>;
  let animationCompleteSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setTintSpy = vi.fn().mockReturnThis();
    animationCompleteSpy = vi.fn();

    mockSprite = {
      x: 100,
      y: 100,
      setVelocity: vi.fn(),
      setVelocityX: vi.fn(),
      setVelocityY: vi.fn(),
      setDepth: vi.fn(),
      setOrigin: vi.fn(),
      setTint: setTintSpy,
      setCollideWorldBounds: vi.fn(),
      setFlipX: vi.fn(),
      clearTint: vi.fn(),
      play: vi.fn(),
      anims: {
        currentAnim: { key: "enemy-idle" },
        isPlaying: false,
        play: vi.fn(),
      } as unknown as Phaser.Animations.AnimationState,
      on: vi.fn().mockImplementation((event, callback, context) => {
        if (event === "animationcomplete") {
          animationCompleteSpy = callback.bind(context);
        }
        return mockSprite;
      }),
      once: vi.fn(),
      destroy: vi.fn(),
      body: {
        velocity: { x: 0, y: 0 } as unknown as Phaser.Math.Vector2,
      },
      width: 32,
      height: 32,
    } as unknown as Phaser.Physics.Arcade.Sprite;

    mockScene = {
      add: {
        sprite: vi.fn().mockReturnValue(mockSprite),
      } as unknown as Phaser.GameObjects.GameObjectFactory,
      physics: {
        add: {
          sprite: vi.fn().mockReturnValue(mockSprite),
        },
      } as unknown as Phaser.Physics.Arcade.Factory,
      events: {
        emit: vi.fn(),
      } as unknown as Phaser.Events.EventEmitter,
      registry: {
        get: vi.fn().mockReturnValue({
          impact: {
            emitParticleAt: vi.fn(),
          },
          death: {
            emitParticleAt: vi.fn(),
          },
        }),
      },
      time: {
        delayedCall: vi.fn().mockImplementation((delay, callback) => {
          callback();
          return {};
        }),
      },
    } as unknown as Phaser.Scene;

    enemy = new Enemy({
      scene: mockScene,
      x: 100,
      y: 100,
      texture: "enemy",
      speed: 100,
      health: 100,
      damage: 10,
    });
  });

  it("should create enemy sprite with correct configuration", () => {
    expect(mockScene.physics.add.sprite).toHaveBeenCalledWith(
      100,
      100,
      "enemy"
    );
    expect(mockSprite.setCollideWorldBounds).toHaveBeenCalled();
  });

  it("should handle target setting and movement", () => {
    const target = { x: 200, y: 200 };
    enemy.setTarget(target);
    enemy.update(0, 16);

    expect(mockSprite.setVelocity).toHaveBeenCalled();
    expect(mockSprite.anims.play).toHaveBeenCalledWith("enemy-move", true);
  });

  it("should handle damage and death", () => {
    enemy.takeDamage(100);

    expect(setTintSpy).toHaveBeenCalledWith(0xff0000);
    expect(mockSprite.anims.play).toHaveBeenCalledWith("enemy-death", true);

    // Simulate death animation completion
    const animCompleteEvent = {
      key: "enemy-death",
    } as Phaser.Animations.Animation;
    animationCompleteSpy(animCompleteEvent);
    expect(mockSprite.destroy).toHaveBeenCalled();
  });

  it("should return correct damage amount", () => {
    expect(enemy.getDamage()).toBe(10);
  });

  it("should detect collisions correctly", () => {
    const otherSprite = {
      x: 100,
      y: 100,
      width: 32,
      height: 32,
    };

    expect(enemy.isCollidingWith(otherSprite)).toBe(true);
  });

  it("should clean up resources on destroy", () => {
    enemy.destroy();
    expect(mockSprite.destroy).toHaveBeenCalled();
  });

  it("should stop moving when target is null", () => {
    enemy.setTarget(null);
    enemy.update(0, 16);

    expect(mockSprite.setVelocity).toHaveBeenCalledWith(0, 0);
    expect(mockSprite.anims.play).toHaveBeenCalledWith("enemy-idle", true);
  });

  it("should stop moving when dead", () => {
    enemy.takeDamage(100);
    enemy.update(0, 16);

    expect(mockSprite.setVelocity).toHaveBeenCalledWith(0, 0);
  });

  it("should get sprite instance", () => {
    expect(enemy.getSprite()).toBe(mockSprite);
  });

  it("should update enemy movement when target is set", () => {
    const target = { x: 200, y: 200 };
    enemy.setTarget(target);
    enemy.update(0, 16);

    expect(mockSprite.setVelocity).toHaveBeenCalled();
    expect(mockSprite.anims.play).toHaveBeenCalledWith("enemy-move", true);
  });

  it("should stop enemy movement when no target is set", () => {
    enemy.update(0, 16);

    expect(mockSprite.setVelocity).toHaveBeenCalledWith(0, 0);
    expect(mockSprite.anims.play).toHaveBeenCalledWith("enemy-idle", true);
  });

  it("should stop moving when reaching target", () => {
    const target = { x: 100, y: 100 };
    enemy.setTarget(target);
    enemy.update(0, 16);

    expect(mockSprite.setVelocity).toHaveBeenCalledWith(0, 0);
    expect(mockSprite.anims.play).toHaveBeenCalledWith("enemy-idle", true);
  });

  it("constructor should use default values when not provided", () => {
    const defaultEnemy = new Enemy({
      scene: mockScene,
      x: 100,
      y: 100,
      texture: "enemy",
    });

    expect(defaultEnemy.getDamage()).toBe(10);
  });

  describe("constructor", () => {
    it("should use default values when not provided", () => {
      const mockScene = createMockScene();
      const enemy = new Enemy({
        scene: mockScene,
      });

      // Test default values
      expect(enemy["speed"]).toBe(100); // Default speed
      expect(enemy["health"]).toBe(100); // Default health
      expect(enemy["damage"]).toBe(10); // Default damage
      expect(enemy["target"]).toBeNull(); // Default target

      // Test default position and texture
      expect(mockScene.physics.add.sprite).toHaveBeenCalledWith(0, 0, "enemy");
    });
  });
});
