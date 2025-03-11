import { Scene } from "phaser";
import { BaseComponent } from "./BaseComponent";
import { Enemy } from "./Enemy";

export enum TowerType {
  SHOOTER = "shooter",
  HEALER = "healer",
}

export interface TowerConfig {
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
    damage: 10,
    fireRate: 1000, // ms between shots
    cost: 100,
  },
  [TowerType.HEALER]: {
    type: TowerType.HEALER,
    range: 150,
    damage: -5, // negative damage = healing
    fireRate: 2000,
    cost: 200,
  },
};

export class Tower extends BaseComponent {
  private config: TowerConfig;
  private lastFireTime: number = 0;
  private rangeCircle: Phaser.GameObjects.Arc;
  private targets: Enemy[] = [];
  private towerSprite: Phaser.GameObjects.Arc;
  private container: Phaser.GameObjects.Container;

  constructor(scene: Scene, x: number, y: number, type: TowerType) {
    super({ scene, x, y });
    this.config = TOWER_CONFIGS[type];

    // Create container for tower components
    this.container = scene.add.container(x, y);

    // Create tower sprite
    this.towerSprite = scene.add.circle(
      0,
      0,
      15,
      type === TowerType.SHOOTER ? 0xff0000 : 0x00ff00
    );
    this.container.add(this.towerSprite);

    // Create range indicator (initially invisible)
    this.rangeCircle = scene.add.circle(0, 0, this.config.range, 0xffffff, 0.2);
    this.rangeCircle.setVisible(false);
    this.container.add(this.rangeCircle);

    // Add physics
    scene.physics.add.existing(this.container, true);
    const body = this.container.body as Phaser.Physics.Arcade.Body;
    body.setCircle(15);

    // Setup update loop
    scene.events.on("update", this.update, this);
  }

  showRange(show: boolean): void {
    this.rangeCircle.setVisible(show);
  }

  setTargets(enemies: Enemy[]): void {
    this.targets = enemies.filter((enemy) => {
      const enemySprite = enemy.getSprite();
      return (
        Phaser.Math.Distance.Between(
          this.container.x,
          this.container.y,
          enemySprite.x,
          enemySprite.y
        ) <= this.config.range
      );
    });
  }

  public update(time: number): void {
    if (time - this.lastFireTime >= this.config.fireRate) {
      this.fire();
      this.lastFireTime = time;
    }
  }

  private fire(): void {
    if (this.targets.length === 0) return;

    if (this.config.type === TowerType.SHOOTER) {
      // Play shoot sound
      this.scene.registry.get("audioManager").playSound("shoot");

      // Create projectile
      const projectile = this.scene.add.circle(
        this.container.x,
        this.container.y,
        3,
        0xff0000
      );

      // Add physics to projectile
      this.scene.physics.add.existing(projectile);
      const body = projectile.body as Phaser.Physics.Arcade.Body;

      // Calculate direction to target
      const targetSprite = this.targets[0].getSprite();
      const angle = Phaser.Math.Angle.Between(
        this.container.x,
        this.container.y,
        targetSprite.x,
        targetSprite.y
      );

      // Set velocity based on angle
      const speed = 300;
      body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

      // Add collision with target
      this.scene.physics.add.overlap(
        projectile,
        targetSprite,
        () => {
          // Deal damage to enemy
          this.targets[0].takeDamage(this.config.damage);
          // Destroy projectile
          projectile.destroy();
        },
        undefined,
        this
      );

      // Destroy projectile after a delay
      this.scene.time.delayedCall(1000, () => {
        if (projectile.active) {
          projectile.destroy();
        }
      });
    } else if (this.config.type === TowerType.HEALER) {
      // Play heal sound
      this.scene.registry.get("audioManager").playSound("heal");

      // Create heal effect
      const healEffect = this.scene.add.circle(
        this.container.x,
        this.container.y,
        this.config.range,
        0x00ff00,
        0.2
      );

      // Heal all targets in range
      this.targets.forEach((target) => {
        target.takeDamage(this.config.damage); // Negative damage = healing
      });

      // Fade out and destroy heal effect
      this.scene.tweens.add({
        targets: healEffect,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          healEffect.destroy();
        },
      });
    }
  }

  destroy(): void {
    this.scene.events.off("update", this.update, this);
    this.container.destroy();
    super.destroy();
  }
}
