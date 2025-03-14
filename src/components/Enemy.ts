import { Scene, Physics } from "phaser";
import { GameEvents } from "../events/GameEvents";
import { assert } from "../utils/assert";

export class Enemy {
  protected scene: Scene;
  private sprite: Physics.Arcade.Sprite;
  private health: number;
  private maxHealth: number;
  private damage: number;
  private speed: number;
  private target: Phaser.Math.Vector2 | null;
  private healthBar: Phaser.GameObjects.Graphics;
  private type: string;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    config: {
      health?: number;
      damage?: number;
      speed?: number;
      type?: string;
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
    this.type = config.type || "basic";

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, "enemy");
    this.sprite.setScale(0.8);

    // Create health bar
    this.healthBar = scene.add.graphics();
    this.updateHealthBar();

    // TODO: Implement enemy pooling integration with PerformanceOptimizer
    // Enemies should be created from and returned to object pools, not instantiated directly

    // TODO: Add different enemy types with unique visuals and behaviors
    // Current implementation only has generic enemies
  }

  public getType(): string {
    return this.type;
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

    // TODO: Add damage feedback effects and sound
    // Enemies should flash, play hit sounds, and show damage numbers when hit
  }

  public setTarget(target: Phaser.Math.Vector2): void {
    assert(target instanceof Phaser.Math.Vector2, "Target must be a Vector2");
    this.target = target;

    // TODO: Implement target priority system
    // Enemies should prioritize targets based on distance, type, and threat level
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

    // TODO: Implement pathfinding for enemies to navigate around obstacles
    // Current movement is direct line to target with no obstacle avoidance

    // TODO: Add enemy attack behaviors and animations
    // Enemies should have attack animations and behaviors when near targets
  }

  public destroy(): void {
    this.healthBar.destroy();
    this.sprite.destroy();

    // TODO: Return to object pool instead of destroying
  }
}
