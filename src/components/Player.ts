import { Physics } from "phaser";
import { BaseComponent, ComponentConfig } from "./BaseComponent";

export interface PlayerConfig extends ComponentConfig {
  speed?: number;
  maxHealth?: number;
}

export class Player extends BaseComponent {
  private sprite: Physics.Arcade.Sprite;
  private speed: number;
  private isDead: boolean = false;
  private health: number;
  private maxHealth: number;

  constructor(config: PlayerConfig) {
    super(config);
    this.speed = config.speed || 200;
    this.maxHealth = config.maxHealth || 100;
    this.health = this.maxHealth;

    // Create player sprite
    this.sprite = this.scene.physics.add.sprite(
      config.x || 0,
      config.y || 0,
      config.texture || "player"
    );

    // Setup physics
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setScale(1.5); // Make the player a bit larger

    // Start with idle animation
    this.sprite.play("player_idle");
  }

  public setVelocity(x: number, y: number): void {
    if (this.isDead) return;
    this.sprite.setVelocity(x * this.speed, y * this.speed);

    // Update animation based on movement
    if (x !== 0 || y !== 0) {
      this.sprite.play("player_move", true);
      // Only flip if moving horizontally
      if (x !== 0) {
        this.sprite.setFlipX(x < 0);
      }
    } else {
      this.sprite.play("player_idle", true);
    }
  }

  public getHealth(): number {
    return this.health;
  }

  public getMaxHealth(): number {
    return this.maxHealth;
  }

  public takeDamage(amount: number): void {
    if (this.isDead) return;

    this.health = Math.max(0, this.health - amount);
    if (this.health === 0) {
      this.die();
    } else {
      // Flash red
      this.sprite.setTint(0xff0000);
      this.scene.time.delayedCall(100, () => {
        this.sprite.clearTint();
      });
    }
  }

  public heal(amount: number): void {
    if (this.isDead) return;

    this.health = Math.min(this.maxHealth, this.health + amount);
    // Flash green
    this.sprite.setTint(0x00ff00);
    this.scene.time.delayedCall(100, () => {
      this.sprite.clearTint();
    });
  }

  public die(): void {
    this.isDead = true;
    this.health = 0;
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
    if (this.isDead) {
      this.sprite.setVelocity(0, 0);
    }
  }

  public destroy(): void {
    super.destroy();
    this.sprite.destroy();
  }
}
