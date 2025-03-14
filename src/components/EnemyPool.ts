import { Scene } from "phaser";
import { Component } from "./Component";
import { Enemy } from "./Enemy";

export interface EnemyPoolConfig {
  initialSize: number;
  maxSize: number;
  types: string[];
}

export class EnemyPool implements Component {
  private pools: Map<string, Phaser.GameObjects.Group>;

  constructor(scene: Scene, config: EnemyPoolConfig) {
    this.pools = new Map();

    // Initialize pools for each enemy type
    config.types.forEach((type) => {
      const pool = scene.add.group({
        maxSize: config.maxSize,
        runChildUpdate: true,
        defaultKey: undefined,
        defaultFrame: undefined,
        active: false,
        visible: false,
        createCallback: (item: Phaser.GameObjects.GameObject) => {
          if (item instanceof Enemy) {
            item.getSprite().setActive(false).setVisible(false);
          }
        },
      });

      // Pre-populate pool with initial size
      for (let i = 0; i < config.initialSize; i++) {
        const enemy = new Enemy(scene, 0, 0, { type });
        enemy.getSprite().setActive(false).setVisible(false);
        pool.add(enemy);
      }

      this.pools.set(type, pool);
    });
  }

  public spawn(
    type: string,
    x: number,
    y: number,
    config: {
      health?: number;
      damage?: number;
      speed?: number;
    } = {}
  ): Enemy | null {
    const pool = this.pools.get(type);
    if (!pool) return null;

    // Get an enemy from the pool
    const enemy = pool.get(x, y) as Enemy | undefined;
    if (!enemy) return null;

    // Reset and initialize the enemy
    const sprite = enemy.getSprite();
    sprite.setActive(true).setVisible(true);
    sprite.setPosition(x, y);

    // Apply configuration
    if (config.health) enemy.takeDamage(0); // Reset health
    if (config.speed) sprite.setVelocity(0, 0); // Reset velocity

    return enemy;
  }

  public despawn(enemy: Enemy): void {
    const type = enemy.getType();
    const pool = this.pools.get(type);
    if (!pool) return;

    // Reset enemy state
    const sprite = enemy.getSprite();
    sprite.setActive(false).setVisible(false);
    sprite.setPosition(0, 0);
    sprite.setVelocity(0, 0);

    // Return to pool
    pool.killAndHide(enemy);
  }

  public update(): void {
    // Update all active enemies in pools
    this.pools.forEach((pool) => {
      pool.getChildren().forEach((enemy) => {
        if (enemy.active) {
          (enemy as Enemy).update();
        }
      });
    });
  }

  public destroy(): void {
    // Clean up all pools
    this.pools.forEach((pool) => {
      pool.destroy(true);
    });
    this.pools.clear();
  }
}
