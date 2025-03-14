import { Scene, Physics, GameObjects } from "phaser";
import { Enemy } from "./Enemy";
import { GameEvents } from "../events/GameEvents";
import { TowerRange } from "../types/game";

// Add assertion utility function
function assert(
  condition: boolean,
  message: string,
  context?: any
): asserts condition {
  if (!condition) {
    const contextStr = context ? ` Context: ${JSON.stringify(context)}` : "";
    const errorMsg = `Assertion failed: ${message}.${contextStr}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export enum TowerType {
  SHOOTER = "shooter",
  HEALER = "healer",
  SLOW = "slow",
}

interface TowerConfig {
  type: TowerType;
  range: number;
  damage: number;
  fireRate: number;
  cost: number;
}

export const TOWER_CONFIGS: Record<TowerType, TowerConfig> = {
  [TowerType.SHOOTER]: {
    type: TowerType.SHOOTER,
    range: 200,
    damage: 20,
    fireRate: 1000,
    cost: 100,
  },
  [TowerType.HEALER]: {
    type: TowerType.HEALER,
    range: 150,
    damage: -10, // Negative damage = healing
    fireRate: 2000,
    cost: 150,
  },
  [TowerType.SLOW]: {
    type: TowerType.SLOW,
    range: 175,
    damage: 5,
    fireRate: 500,
    cost: 125,
  },
};

export class Tower {
  private scene: Scene;
  private sprite: Physics.Arcade.Sprite;
  private rangeCircle: GameObjects.Arc;
  private type: TowerType;
  private config: TowerConfig;
  private currentTarget: Enemy | null;
  private lastFireTime: number;

  constructor(scene: Scene, x: number, y: number, type: TowerType) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene", {
      providedType: typeof scene,
      isScene: scene instanceof Scene,
    });
    assert(typeof x === "number", "X position must be a number");
    assert(typeof y === "number", "Y position must be a number");
    assert(Object.values(TowerType).includes(type), "Invalid tower type");

    this.scene = scene;
    this.type = type;
    this.config = TOWER_CONFIGS[type];
    this.currentTarget = null;
    this.lastFireTime = 0;

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, `tower_${type}`);
    this.sprite.setImmovable(true);

    // Create range circle
    this.rangeCircle = scene.add.circle(x, y, this.config.range, 0x00ff00, 0.1);
    this.rangeCircle.setVisible(false);
  }

  public getSprite(): Physics.Arcade.Sprite {
    return this.sprite;
  }

  public getRange(): TowerRange {
    return {
      x: this.sprite.x,
      y: this.sprite.y,
      radius: this.config.range,
    };
  }

  public showRange(): void {
    this.rangeCircle.setVisible(true);
  }

  public hideRange(): void {
    this.rangeCircle.setVisible(false);
  }

  public targetEnemy(enemy: Enemy): void {
    assert(enemy instanceof Enemy, "Must provide a valid Enemy instance");

    const currentTime = this.scene.time.now;
    if (currentTime - this.lastFireTime >= this.config.fireRate) {
      this.currentTarget = enemy;
      this.fire();
      this.lastFireTime = currentTime;
    }
  }

  private fire(): void {
    if (!this.currentTarget) return;

    // Create projectile effect
    const line = this.scene.add.line(
      0,
      0,
      this.sprite.x,
      this.sprite.y,
      this.currentTarget.getSprite().x,
      this.currentTarget.getSprite().y,
      this.type === TowerType.HEALER ? 0x00ff00 : 0xff0000
    );

    // Fade out and destroy line
    this.scene.tweens.add({
      targets: line,
      alpha: 0,
      duration: 200,
      onComplete: () => line.destroy(),
    });

    // Apply effect to target
    this.currentTarget.takeDamage(this.config.damage);
  }

  public destroy(): void {
    this.rangeCircle.destroy();
    this.sprite.destroy();
    this.scene.events.emit(GameEvents.TOWER_REMOVED, this);
  }
}
