import { Scene, Physics, GameObjects } from "phaser";
import { Enemy } from "./Enemy";
import { GameEvents } from "../events/GameEvents";
import { TowerRange } from "../types/game";
import { assert } from "../utils/assert";
import { TOWER_UPGRADES } from "../types/TowerTypes";

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
  private level: number;
  private damageBonus: number;
  private rangeBonus: number;
  private attackSpeedBonus: number;

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
    this.level = 1;
    this.damageBonus = 0;
    this.rangeBonus = 0;
    this.attackSpeedBonus = 0;

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, `tower_${type}`);
    this.sprite.setImmovable(true);

    // Create range circle
    this.rangeCircle = scene.add.circle(
      x,
      y,
      this.getEffectiveRange(),
      0x00ff00,
      0.1
    );
    this.rangeCircle.setVisible(false);

    // Listen for upgrade events
    this.scene.events.on(
      GameEvents.UI_TOWER_UPGRADED,
      this.handleUpgrade,
      this
    );
  }

  public getSprite(): Physics.Arcade.Sprite {
    return this.sprite;
  }

  public getRange(): TowerRange {
    return {
      x: this.sprite.x,
      y: this.sprite.y,
      radius: this.getEffectiveRange(),
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
    if (currentTime - this.lastFireTime >= this.getEffectiveFireRate()) {
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
    this.currentTarget.takeDamage(this.getEffectiveDamage());
  }

  private getEffectiveRange(): number {
    return this.config.range + this.rangeBonus;
  }

  private getEffectiveDamage(): number {
    return this.config.damage + this.damageBonus;
  }

  private getEffectiveFireRate(): number {
    return this.config.fireRate * (1 - this.attackSpeedBonus); // Lower is faster
  }

  private handleUpgrade(upgradedTowerType: TowerType): void {
    if (upgradedTowerType === this.type) {
      const upgrade = TOWER_UPGRADES[this.level + 1];
      if (upgrade) {
        // Apply upgrades
        this.damageBonus += upgrade.damageIncrease;
        this.rangeBonus += upgrade.rangeIncrease;
        this.attackSpeedBonus += upgrade.attackSpeedIncrease;
        this.level++;

        // Update range circle
        this.rangeCircle.setRadius(this.getEffectiveRange());

        // Emit event for UI update
        this.scene.events.emit(GameEvents.TOWER_STATS_UPDATED, {
          type: this.type,
          level: this.level,
          damage: this.getEffectiveDamage(),
          range: this.getEffectiveRange(),
          attackSpeed: 1000 / this.getEffectiveFireRate(), // Convert to attacks per second
        });
      }
    }
  }

  public update(): void {
    if (this.currentTarget) {
      const now = this.scene.time.now;
      if (now - this.lastFireTime >= this.getEffectiveFireRate()) {
        // Fire at target
        this.scene.events.emit(GameEvents.DAMAGE_DEALT, {
          target: this.currentTarget,
          amount: this.getEffectiveDamage(),
          source: this,
        });
        this.lastFireTime = now;
      }
    }
  }

  public destroy(): void {
    // Clean up event listeners
    this.scene.events.off(
      GameEvents.UI_TOWER_UPGRADED,
      this.handleUpgrade,
      this
    );

    this.rangeCircle.destroy();
    this.sprite.destroy();
    this.scene.events.emit(GameEvents.TOWER_REMOVED, this);
  }
}
