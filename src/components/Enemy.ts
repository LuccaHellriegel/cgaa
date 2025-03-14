import { Scene, Physics } from "phaser";
import { GameEvents } from "../events/GameEvents";

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

export class Enemy {
  private scene: Scene;
  private sprite: Physics.Arcade.Sprite;
  private health: number;
  private maxHealth: number;
  private damage: number;
  private speed: number;
  private target: Phaser.Math.Vector2 | null;
  private healthBar: Phaser.GameObjects.Graphics;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    config: {
      health?: number;
      damage?: number;
      speed?: number;
    } = {}
  ) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene", {
      providedType: typeof scene,
      isScene: scene instanceof Scene,
    });
    assert(typeof x === "number", "X position must be a number");
    assert(typeof y === "number", "Y position must be a number");

    this.scene = scene;
    this.maxHealth = config.health || 100;
    this.health = this.maxHealth;
    this.damage = config.damage || 10;
    this.speed = config.speed || 100;
    this.target = null;

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, "enemy");
    this.sprite.setScale(0.8);

    // Create health bar
    this.healthBar = scene.add.graphics();
    this.updateHealthBar();
  }

  public getSprite(): Physics.Arcade.Sprite {
    return this.sprite;
  }

  public getDamage(): number {
    return this.damage;
  }

  public takeDamage(amount: number): void {
    assert(
      typeof amount === "number" && amount > 0,
      "Damage amount must be a positive number"
    );

    this.health = Math.max(0, this.health - amount);
    this.updateHealthBar();

    if (this.health === 0) {
      this.scene.events.emit(GameEvents.ENEMY_KILLED, this);
      this.destroy();
    }
  }

  public setTarget(target: Phaser.Math.Vector2): void {
    assert(target instanceof Phaser.Math.Vector2, "Target must be a Vector2");
    this.target = target;
  }

  private updateHealthBar(): void {
    this.healthBar.clear();

    // Draw background
    this.healthBar.fillStyle(0xff0000);
    this.healthBar.fillRect(this.sprite.x - 20, this.sprite.y - 30, 40, 5);

    // Draw health
    const healthPercentage = this.health / this.maxHealth;
    this.healthBar.fillStyle(0x00ff00);
    this.healthBar.fillRect(
      this.sprite.x - 20,
      this.sprite.y - 30,
      40 * healthPercentage,
      5
    );
  }

  public update(): void {
    if (this.target) {
      // Move towards target
      const angle = Phaser.Math.Angle.Between(
        this.sprite.x,
        this.sprite.y,
        this.target.x,
        this.target.y
      );

      this.sprite.setVelocity(
        Math.cos(angle) * this.speed,
        Math.sin(angle) * this.speed
      );

      // Update health bar position
      this.updateHealthBar();
    }
  }

  public destroy(): void {
    this.healthBar.destroy();
    this.sprite.destroy();
  }
}
