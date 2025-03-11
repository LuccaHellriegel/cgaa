import { Scene, Physics } from "phaser";
import { BaseComponent, ComponentConfig } from "./BaseComponent";

export interface PlayerConfig extends ComponentConfig {
  speed?: number;
}

export class Player extends BaseComponent {
  private sprite: Physics.Arcade.Sprite;
  private speed: number;
  private isDead: boolean = false;

  constructor(config: PlayerConfig) {
    super(config);
    this.speed = config.speed || 200;

    // Create player sprite
    this.sprite = this.scene.physics.add.sprite(
      config.x || 0,
      config.y || 0,
      config.texture || "player"
    );

    // Setup physics
    this.sprite.setCollideWorldBounds(true);
    this.setupAnimations();
  }

  private setupAnimations(): void {
    // Add animations if they don't exist
    if (!this.scene.anims.exists("player-idle")) {
      this.scene.anims.create({
        key: "player-idle",
        frames: this.scene.anims.generateFrameNumbers("player", {
          start: 0,
          end: 0,
        }),
        frameRate: 1,
      });
    }

    if (!this.scene.anims.exists("player-move")) {
      this.scene.anims.create({
        key: "player-move",
        frames: this.scene.anims.generateFrameNumbers("player", {
          start: 0,
          end: 3,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }
  }

  public setVelocity(x: number, y: number): void {
    if (this.isDead) return;
    this.sprite.setVelocity(x * this.speed, y * this.speed);

    // Update animation based on movement
    if (x !== 0 || y !== 0) {
      this.sprite.anims.play("player-move", true);
      this.sprite.setFlipX(x < 0);
    } else {
      this.sprite.anims.play("player-idle", true);
    }
  }

  public die(): void {
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
    // Handle any per-frame updates
  }

  public destroy(): void {
    super.destroy();
    this.sprite.destroy();
  }
}
