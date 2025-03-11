import { Scene } from "phaser";
import { BaseComponent, ComponentConfig } from "./BaseComponent";
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

const TOWER_CONFIGS: Record<TowerType, TowerConfig> = {
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

  public update(time: number, delta: number): void {
    if (
      time > this.lastFireTime + this.config.fireRate &&
      this.targets.length > 0
    ) {
      this.fire();
      this.lastFireTime = time;
    }
  }

  private fire(): void {
    // Sort targets by distance and get closest
    const target = this.targets.sort((a, b) => {
      const spriteA = a.getSprite();
      const spriteB = b.getSprite();
      const distA = Phaser.Math.Distance.Between(
        this.container.x,
        this.container.y,
        spriteA.x,
        spriteA.y
      );
      const distB = Phaser.Math.Distance.Between(
        this.container.x,
        this.container.y,
        spriteB.x,
        spriteB.y
      );
      return distA - distB;
    })[0];

    if (target) {
      const targetSprite = target.getSprite();
      // Visual effect
      const line = this.scene.add.line(
        0,
        0,
        this.container.x,
        this.container.y,
        targetSprite.x,
        targetSprite.y,
        this.config.type === TowerType.SHOOTER ? 0xff0000 : 0x00ff00
      );

      // Apply damage/healing
      target.takeDamage(this.config.damage);

      // Fade out effect
      this.scene.tweens.add({
        targets: line,
        alpha: 0,
        duration: 200,
        onComplete: () => line.destroy(),
      });
    }
  }

  destroy(): void {
    this.scene.events.off("update", this.update, this);
    this.container.destroy();
    super.destroy();
  }
}
