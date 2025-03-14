import { Scene } from "phaser";
import { Component } from "./Component";
import { CampBuilding } from "./CampBuilding";
import { Enemy } from "./Enemy";
import {
  WaveCompositionComponent,
  WaveConfig,
} from "./WaveCompositionComponent";

export class WaveSpawningComponent implements Component {
  private scene: Scene;
  private camp: CampBuilding;
  private waveComposition: WaveCompositionComponent;
  private spawnPoint: Phaser.Math.Vector2;
  private isActive: boolean = false;
  private enemyPool: Enemy[] = [];
  private maxPoolSize: number = 50;

  constructor(scene: Scene, camp: CampBuilding) {
    this.scene = scene;
    this.camp = camp;

    // Initialize wave composition with default config
    const config: WaveConfig = {
      baseEnemyCount: 5,
      enemyTypes: ["small", "medium", "large"],
      spawnInterval: 2000,
      difficultyMultiplier: 1.2,
    };
    this.waveComposition = new WaveCompositionComponent(scene, config);

    // Set initial spawn point at camp position
    const sprite = camp.getSprite();
    this.spawnPoint = new Phaser.Math.Vector2(sprite.x, sprite.y);

    // Listen for wave events
    this.scene.events.on("waveStart", this.handleWaveStart, this);
    this.scene.events.on("spawnEnemy", this.handleSpawnEnemy, this);

    // Initialize enemy pool
    this.initializeEnemyPool();
  }

  private initializeEnemyPool(): void {
    for (let i = 0; i < this.maxPoolSize; i++) {
      const enemy = new Enemy(this.scene, 0, 0, {
        type: "small", // Default type, will be updated when spawned
        speed: 100,
        health: 100,
        damage: 10,
      });
      enemy.getSprite().setActive(false).setVisible(false);
      this.enemyPool.push(enemy);
    }
  }

  private getEnemyFromPool(type: string): Enemy | null {
    for (const enemy of this.enemyPool) {
      if (!enemy.getSprite().active) {
        // Configure enemy based on type
        enemy.setType(type);
        enemy.getSprite().setActive(true).setVisible(true);
        return enemy;
      }
    }
    return null; // Pool is exhausted
  }

  private handleWaveStart = (_data: { wave: number }) => {
    if (this.camp.isCooperatingState()) {
      // Only spawn waves if the camp is cooperating and has a target
      const targetCamp = this.camp.getWaveTarget();
      if (targetCamp) {
        this.isActive = true;
        this.waveComposition.startWave();
      }
    }
  };

  private handleSpawnEnemy = (data: { type: string; wave: number }) => {
    if (!this.isActive) return;

    // Get target camp if any
    const targetCamp = this.camp.getWaveTarget();
    if (!targetCamp) {
      this.isActive = false;
      return;
    }

    // Get enemy from pool
    const enemy = this.getEnemyFromPool(data.type);
    if (!enemy) {
      console.warn("Enemy pool exhausted!");
      return;
    }

    // Calculate spawn position and direction
    const targetSprite = targetCamp.getSprite();
    const angle = Phaser.Math.Angle.Between(
      this.spawnPoint.x,
      this.spawnPoint.y,
      targetSprite.x,
      targetSprite.y
    );

    // Position enemy at spawn point
    enemy.getSprite().setPosition(this.spawnPoint.x, this.spawnPoint.y);

    // Set enemy target using a Vector2
    const targetPos = new Phaser.Math.Vector2(targetSprite.x, targetSprite.y);
    enemy.setTarget(targetPos);

    // Set velocity for movement direction
    const sprite = enemy.getSprite();
    const speed = enemy.getSpeed(); // Use proper speed from enemy configuration
    sprite.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    // Add to wave composition tracking
    this.waveComposition.addEnemy(enemy);

    // Create spawn effect
    this.scene.events.emit("createEffect", {
      type: "waveSpawn",
      x: this.spawnPoint.x,
      y: this.spawnPoint.y,
    });

    // Play spawn sound if available
    const audioManager = this.scene.registry.get("audioManager");
    if (audioManager) {
      audioManager.playSound("enemy_spawn");
    }
  };

  public update(time: number, delta: number): void {
    if (!this.isActive) return;

    // Update spawn point position to follow camp
    const sprite = this.camp.getSprite();
    this.spawnPoint.set(sprite.x, sprite.y);

    // Update wave composition
    this.waveComposition.update(time, delta);

    // Check if wave is complete
    if (!this.waveComposition.isWaveInProgress()) {
      this.isActive = false;
    }

    // Update active enemies' targets
    this.enemyPool.forEach((enemy) => {
      if (enemy.getSprite().active) {
        const targetCamp = this.camp.getWaveTarget();
        if (targetCamp) {
          const targetSprite = targetCamp.getSprite();
          const targetPos = new Phaser.Math.Vector2(
            targetSprite.x,
            targetSprite.y
          );
          enemy.setTarget(targetPos);
        }
      }
    });
  }

  public destroy(): void {
    // Clean up event listeners
    this.scene.events.off("waveStart", this.handleWaveStart);
    this.scene.events.off("spawnEnemy", this.handleSpawnEnemy);

    // Clean up enemy pool
    this.enemyPool.forEach((enemy) => {
      enemy.destroy();
    });
    this.enemyPool = [];
  }
}
