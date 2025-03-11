import { describe, it, expect, beforeEach, vi } from "vitest";
import { Enemy, EnemyConfig } from "./Enemy";
import { Scene, Physics } from "phaser";

describe("Enemy", () => {
  let enemy: Enemy;
  let mockScene: Scene;
  let mockSprite: Physics.Arcade.Sprite;
  let setTintSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setTintSpy = vi.fn().mockReturnThis();
    mockSprite = {
      setCollideWorldBounds: vi.fn().mockReturnThis(),
      setVelocity: vi.fn().mockReturnThis(),
      anims: {
        play: vi.fn().mockReturnThis(),
      },
      setFlipX: vi.fn().mockReturnThis(),
      setTint: setTintSpy,
      clearTint: vi.fn().mockReturnThis(),
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
      time: {
        delayedCall: vi.fn().mockImplementation((delay, callback) => {
          callback();
          return {};
        }),
      },
    } as unknown as Scene;

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
    enemy.update(0, 0);

    // Calculate expected velocity (normalized * speed)
    const dx = target.x - mockSprite.x;
    const dy = target.y - mockSprite.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const expectedVx = (dx / distance) * 100;
    const expectedVy = (dy / distance) * 100;

    expect(mockSprite.setVelocity).toHaveBeenCalledWith(expectedVx, expectedVy);
    expect(mockSprite.anims.play).toHaveBeenCalledWith("enemy-move", true);
  });

  it("should handle damage and death", () => {
    const onDeath = vi.fn();
    enemy["addListener"]("died", onDeath);

    // Take damage but don't die
    enemy.takeDamage(50);
    expect(mockSprite.setTint).toHaveBeenCalledWith(0xff0000);
    expect(mockSprite.clearTint).toHaveBeenCalled();
    expect(onDeath).not.toHaveBeenCalled();

    // Take fatal damage
    enemy.takeDamage(60);
    expect(mockSprite.setVelocity).toHaveBeenCalledWith(0, 0);
    expect(onDeath).toHaveBeenCalled();

    // Verify dead enemy doesn't take more damage
    vi.clearAllMocks();
    enemy.takeDamage(10);
    expect(mockSprite.setTint).not.toHaveBeenCalled();
  });

  it("should return correct damage amount", () => {
    expect(enemy.getDamage()).toBe(10);
  });

  it("should detect collisions correctly", () => {
    const object = { x: 110, y: 110, width: 32, height: 32 };
    expect(enemy.isCollidingWith(object)).toBe(true);

    object.x = 200;
    expect(enemy.isCollidingWith(object)).toBe(false);
  });

  it("should clean up resources on destroy", () => {
    enemy.destroy();
    expect(mockSprite.destroy).toHaveBeenCalled();
  });

  it("should stop moving when target is null", () => {
    enemy.setTarget(null);
    enemy.update(0, 0);
    expect(mockSprite.setVelocity).toHaveBeenCalledWith(0, 0);
    expect(mockSprite.anims.play).toHaveBeenCalledWith("enemy-idle", true);
  });

  it("should stop moving when dead", () => {
    enemy.setTarget({ x: 200, y: 200 });
    enemy.takeDamage(100); // Kill the enemy
    enemy.update(0, 0);
    expect(mockSprite.setVelocity).toHaveBeenCalledWith(0, 0);
  });

  it("should get sprite instance", () => {
    expect(enemy.getSprite()).toBe(mockSprite);
  });

  it("should update enemy movement when target is set", () => {
    enemy.setTarget({ x: 200, y: 200 });
    enemy.update(0, 16);
    expect(mockSprite.setVelocity).toHaveBeenCalled();
    expect(mockSprite.anims.play).toHaveBeenCalledWith("enemy-move", true);
  });

  it("should stop enemy movement when no target is set", () => {
    enemy.setTarget(null);
    enemy.update(0, 16);
    expect(mockSprite.setVelocity).toHaveBeenCalledWith(0, 0);
    expect(mockSprite.anims.play).toHaveBeenCalledWith("enemy-idle", true);
  });

  it("should stop moving when reaching target", () => {
    enemy.setTarget({ x: 100, y: 100 }); // Same position as enemy
    enemy.update(0, 0);
    expect(mockSprite.setVelocity).toHaveBeenCalledWith(0, 0);
    expect(mockSprite.anims.play).toHaveBeenCalledWith("enemy-idle", true);
  });
});
