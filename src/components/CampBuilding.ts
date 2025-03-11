import { Scene } from "phaser";
import { BaseComponent } from "./BaseComponent";

export enum BuildingSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export interface BuildingConfig {
  size: BuildingSize;
  health: number;
  enemyType: string;
  spawnRate: number;
}

const BUILDING_CONFIGS: Record<BuildingSize, BuildingConfig> = {
  [BuildingSize.SMALL]: {
    size: BuildingSize.SMALL,
    health: 100,
    enemyType: "small",
    spawnRate: 1.5, // multiplier for camp's base spawn rate
  },
  [BuildingSize.MEDIUM]: {
    size: BuildingSize.MEDIUM,
    health: 200,
    enemyType: "medium",
    spawnRate: 2,
  },
  [BuildingSize.LARGE]: {
    size: BuildingSize.LARGE,
    health: 300,
    enemyType: "large",
    spawnRate: 2.5,
  },
};

export class CampBuilding extends BaseComponent {
  private config: BuildingConfig;
  private health: number;
  private sprite: Phaser.GameObjects.Rectangle;
  private healthBar: Phaser.GameObjects.Rectangle;
  private healthBarBackground: Phaser.GameObjects.Rectangle;
  private isDestroyed: boolean = false;

  constructor(scene: Scene, x: number, y: number, size: BuildingSize) {
    super({ scene, x, y });
    this.config = BUILDING_CONFIGS[size];
    this.health = this.config.health;

    // Create building sprite
    const width =
      size === BuildingSize.SMALL ? 30 : size === BuildingSize.MEDIUM ? 45 : 60;
    const height =
      size === BuildingSize.SMALL ? 30 : size === BuildingSize.MEDIUM ? 45 : 60;

    this.sprite = scene.add.rectangle(x, y, width, height, 0x666666);

    // Add physics
    scene.physics.add.existing(this.sprite, true);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(width, height);

    // Create health bar
    const barWidth = width;
    const barHeight = 5;
    const barY = y - height / 2 - barHeight - 2;

    this.healthBarBackground = scene.add.rectangle(
      x,
      barY,
      barWidth,
      barHeight,
      0x000000
    );
    this.healthBar = scene.add.rectangle(
      x,
      barY,
      barWidth,
      barHeight,
      0x00ff00
    );
    this.updateHealthBar();
  }

  public takeDamage(amount: number): void {
    if (this.isDestroyed) return;

    this.health = Math.max(0, this.health - amount);
    this.updateHealthBar();

    // Play hit sound
    this.scene.registry.get("audioManager").playSound("hit");

    // Flash red
    this.sprite.setFillStyle(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (!this.isDestroyed) {
        this.sprite.setFillStyle(0x666666);
      }
    });

    if (this.health <= 0) {
      this.destroy();
    }
  }

  private updateHealthBar(): void {
    const healthPercent = this.health / this.config.health;
    const width = this.healthBarBackground.width;
    this.healthBar.setDisplaySize(width * healthPercent, this.healthBar.height);
    this.healthBar.setX(
      this.healthBarBackground.x - (width - this.healthBar.displayWidth) / 2
    );
  }

  public getConfig(): BuildingConfig {
    return this.config;
  }

  public getSprite(): Phaser.GameObjects.Rectangle {
    return this.sprite;
  }

  public isDestroyedState(): boolean {
    return this.isDestroyed;
  }

  public update(): void {
    // Update health bar position and scale
    if (this.healthBar && this.healthBarBackground) {
      this.healthBarBackground.setPosition(this.sprite.x, this.sprite.y - 30);
      this.healthBar.setPosition(this.sprite.x, this.sprite.y - 30);
      this.healthBar.setScale(this.health / this.config.health, 1);
    }
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    // Play destroy sound
    this.scene.registry.get("audioManager").playSound("destroy");

    // Create simple destroy effect
    const numParticles = 20;
    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2;
      const particle = this.scene.add.circle(
        this.sprite.x,
        this.sprite.y,
        3,
        0xff0000
      );

      this.scene.tweens.add({
        targets: particle,
        x: this.sprite.x + Math.cos(angle) * 50,
        y: this.sprite.y + Math.sin(angle) * 50,
        alpha: 0,
        scale: 0,
        duration: 500,
        onComplete: () => {
          particle.destroy();
        },
      });
    }

    // Clean up game objects
    this.sprite.destroy();
    this.healthBar.destroy();
    this.healthBarBackground.destroy();
    super.destroy();
  }
}
