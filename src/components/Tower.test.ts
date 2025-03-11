import { describe, it, expect, beforeEach, vi } from "vitest";
import { Scene } from "phaser";
import { Tower, TowerType } from "./Tower";
import { Enemy } from "./Enemy";

// Mock Phaser.Math.Distance.Between
const mockDistanceBetween = vi.fn();
(global as any).Phaser = {
  Math: {
    Distance: {
      Between: mockDistanceBetween,
    },
  },
};

describe("Tower", () => {
  let scene: Scene;
  let tower: Tower;
  let rangeCircle: Phaser.GameObjects.Arc;
  let container: Phaser.GameObjects.Container;
  let physicsBody: Phaser.Physics.Arcade.Body;

  beforeEach(() => {
    // Reset mock function
    mockDistanceBetween.mockReset();

    // Create mock objects
    rangeCircle = {
      setVisible: vi.fn(),
    } as unknown as Phaser.GameObjects.Arc;

    physicsBody = {
      setCircle: vi.fn(),
    } as unknown as Phaser.Physics.Arcade.Body;

    container = {
      add: vi.fn(),
      destroy: vi.fn(),
      body: physicsBody,
      x: 100,
      y: 100,
    } as unknown as Phaser.GameObjects.Container;

    // Mock Phaser scene
    scene = {
      add: {
        container: vi.fn().mockReturnValue(container),
        circle: vi.fn().mockImplementation(() => rangeCircle),
        line: vi.fn().mockReturnValue({
          destroy: vi.fn(),
        }),
      },
      physics: {
        add: {
          existing: vi.fn().mockImplementation((obj) => {
            obj.body = physicsBody;
            return obj;
          }),
        },
      },
      tweens: {
        add: vi.fn(),
      },
      events: {
        on: vi.fn(),
        off: vi.fn(),
      },
    } as unknown as Scene;

    tower = new Tower(scene, 100, 100, TowerType.SHOOTER);
  });

  it("should create a tower with correct type and position", () => {
    expect(scene.add.container).toHaveBeenCalledWith(100, 100);
    expect(scene.add.circle).toHaveBeenCalledTimes(2); // Tower sprite and range indicator
    expect(scene.physics.add.existing).toHaveBeenCalledWith(container, true);
    expect(physicsBody.setCircle).toHaveBeenCalledWith(15);
    expect(scene.events.on).toHaveBeenCalledWith(
      "update",
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should show/hide range indicator", () => {
    tower.showRange(true);
    expect(rangeCircle.setVisible).toHaveBeenCalledWith(true);

    tower.showRange(false);
    expect(rangeCircle.setVisible).toHaveBeenCalledWith(false);
  });

  it("should target enemies within range", () => {
    const enemy1 = {
      getSprite: vi.fn().mockReturnValue({ x: 150, y: 150 }), // Within range
      takeDamage: vi.fn(),
    } as unknown as Enemy;

    const enemy2 = {
      getSprite: vi.fn().mockReturnValue({ x: 500, y: 500 }), // Out of range
      takeDamage: vi.fn(),
    } as unknown as Enemy;

    // Mock distance calculations
    mockDistanceBetween
      .mockReturnValueOnce(70) // enemy1 distance (within range)
      .mockReturnValueOnce(500); // enemy2 distance (out of range)

    tower.setTargets([enemy1, enemy2]);
    tower.update(1100, 16); // After fire rate cooldown

    expect(enemy1.getSprite).toHaveBeenCalled();
    expect(enemy2.getSprite).toHaveBeenCalled();
    expect(mockDistanceBetween).toHaveBeenCalledTimes(2);
    expect(enemy1.takeDamage).toHaveBeenCalledWith(10);
    expect(enemy2.takeDamage).not.toHaveBeenCalled();
  });

  it("should fire at closest enemy", () => {
    const enemy1 = {
      getSprite: vi.fn().mockReturnValue({ x: 150, y: 150 }), // Closer
      takeDamage: vi.fn(),
    } as unknown as Enemy;

    const enemy2 = {
      getSprite: vi.fn().mockReturnValue({ x: 200, y: 200 }), // Further
      takeDamage: vi.fn(),
    } as unknown as Enemy;

    // Mock distance calculations for initial target filtering
    mockDistanceBetween
      .mockReturnValueOnce(70) // enemy1 initial check
      .mockReturnValueOnce(100) // enemy2 initial check
      // Mock distances for sorting during fire
      .mockReturnValueOnce(70) // enemy1 sorting check
      .mockReturnValueOnce(100); // enemy2 sorting check

    tower.setTargets([enemy2, enemy1]); // Add further enemy first
    tower.update(1100, 16); // After fire rate cooldown

    expect(enemy1.takeDamage).toHaveBeenCalledWith(10); // Shooter tower damage
    expect(enemy2.takeDamage).not.toHaveBeenCalled();
    expect(mockDistanceBetween).toHaveBeenCalledTimes(4);
  });

  it("should respect fire rate cooldown", () => {
    const enemy = {
      getSprite: vi.fn().mockReturnValue({ x: 150, y: 150 }),
      takeDamage: vi.fn(),
    } as unknown as Enemy;

    // Mock distance calculations
    mockDistanceBetween.mockReturnValue(70); // Always within range

    tower.setTargets([enemy]);
    tower.update(500, 16); // Before cooldown
    expect(enemy.takeDamage).not.toHaveBeenCalled();

    tower.setTargets([enemy]); // Need to set targets again to trigger distance calculations
    tower.update(1100, 16); // After cooldown
    expect(enemy.takeDamage).toHaveBeenCalledWith(10);
    expect(mockDistanceBetween).toHaveBeenCalledTimes(2);
  });

  it("should clean up resources on destroy", () => {
    tower.destroy();
    expect(container.destroy).toHaveBeenCalled();
    expect(scene.events.off).toHaveBeenCalledWith(
      "update",
      expect.any(Function),
      expect.any(Object)
    );
  });
});
