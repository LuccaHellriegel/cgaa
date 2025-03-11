import { Scene, Physics } from "phaser";
import { BaseComponent, ComponentConfig } from "./BaseComponent";

export interface EnemyConfig extends ComponentConfig {
  speed?: number;
  health?: number;
  damage?: number;
  target?: { x: number; y: number } | null;
}

export class Enemy extends BaseComponent {
  private sprite: Physics.Arcade.Sprite;
  private speed: number;
  private health: number;
  private damage: number;
  private target: { x: number; y: number } | null = null;
  private isDead: boolean = false;

  constructor(config: EnemyConfig) {
    super(config);
    this.speed = config.speed || 100;
    this.health = config.health || 100;
    this.damage = config.damage || 10;
    this.target = config.target || null;

    // Create enemy sprite
    this.sprite = this.scene.physics.add.sprite(
      config.x || 0,
      config.y || 0,
      config.texture || "enemy"
    );

    // Setup physics
    this.sprite.setCollideWorldBounds(true);
    this.setupAnimations();
  }

  private setupAnimations(): void {
    // Add animations if they don't exist
    if (!this.scene.anims.exists("enemy-idle")) {
      this.scene.anims.create({
        key: "enemy-idle",
        frames: this.scene.anims.generateFrameNumbers("enemy", {
          start: 0,
          end: 0,
        }),
        frameRate: 1,
      });
    }

    if (!this.scene.anims.exists("enemy-move")) {
      this.scene.anims.create({
        key: "enemy-move",
        frames: this.scene.anims.generateFrameNumbers("enemy", {
          start: 0,
          end: 3,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }
  }

  public setTarget(target: { x: number; y: number } | null): void {
    this.target = target;
  }

  public takeDamage(amount: number): void {
    if (this.isDead) return;

    this.health -= amount;
    this.sprite.setTint(0xff0000);

    // Flash red briefly
    this.scene.time.delayedCall(100, () => {
      if (!this.isDead) {
        this.sprite.clearTint();
      }
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  public getDamage(): number {
    return this.damage;
  }

  private die(): void {
    this.isDead = true;
    this.sprite.setVelocity(0, 0);
    this.sprite.setTint(0xff0000);
    this.emit("died");
  }

  public isCollidingWith(object: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): boolean {
    return (
      this.sprite.x < object.x + object.width &&
      this.sprite.x + this.sprite.width > object.x &&
      this.sprite.y < object.y + object.height &&
      this.sprite.y + this.sprite.height > object.y
    );
  }

  public getSprite(): Physics.Arcade.Sprite {
    return this.sprite;
  }

  public update(time: number, delta: number): void {
    if (this.isDead || !this.target) {
      this.sprite.setVelocity(0, 0);
      this.sprite.anims.play("enemy-idle", true);
      return;
    }

    // Calculate direction to target
    const dx = this.target.x - this.sprite.x;
    const dy = this.target.y - this.sprite.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      // Normalize and apply speed
      const vx = (dx / distance) * this.speed;
      const vy = (dy / distance) * this.speed;

      this.sprite.setVelocity(vx, vy);
      this.sprite.setFlipX(vx < 0);
      this.sprite.anims.play("enemy-move", true);
    } else {
      this.sprite.setVelocity(0, 0);
      this.sprite.anims.play("enemy-idle", true);
    }
  }

  public destroy(): void {
    super.destroy();
    this.sprite.destroy();
  }
}
