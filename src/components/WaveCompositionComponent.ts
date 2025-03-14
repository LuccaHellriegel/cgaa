import { Scene } from "phaser";
import { Component } from "./Component";
import { Enemy } from "./Enemy";

export interface WaveConfig {
  baseEnemyCount: number;
  enemyTypes: string[];
  spawnInterval: number;
  difficultyMultiplier: number;
}

export class WaveCompositionComponent implements Component {
  private scene: Scene;
  private currentWave: number = 0;
  private spawnedEnemies: number = 0;
  private activeEnemies: Enemy[] = [];
  private waveConfig: WaveConfig;
  private isSpawning: boolean = false;
  private spawnTimer: number = 0;

  constructor(scene: Scene, config: WaveConfig) {
    this.scene = scene;
    this.waveConfig = config;
  }

  public startWave(): void {
    this.currentWave++;
    this.spawnedEnemies = 0;
    this.isSpawning = true;
    this.spawnTimer = 0;

    // Calculate wave size based on progression
    const waveSize = Math.floor(
      this.waveConfig.baseEnemyCount *
        Math.pow(this.waveConfig.difficultyMultiplier, this.currentWave - 1)
    );

    // Emit wave start event with composition info
    this.scene.events.emit("waveStart", {
      wave: this.currentWave,
      size: waveSize,
      composition: this.getWaveComposition(waveSize),
    });
  }

  private getWaveComposition(waveSize: number): Record<string, number> {
    const composition: Record<string, number> = {};

    // As waves progress, introduce more difficult enemy types
    const availableTypes = this.waveConfig.enemyTypes.slice(
      0,
      Math.min(
        Math.floor(this.currentWave / 3) + 1,
        this.waveConfig.enemyTypes.length
      )
    );

    // Distribute enemies across available types
    availableTypes.forEach((type, index) => {
      // Later types (harder enemies) appear less frequently
      const portion = Math.pow(0.7, index);
      composition[type] = Math.floor(waveSize * portion);
    });

    return composition;
  }

  public update(_time: number, delta: number): void {
    if (!this.isSpawning) return;

    // Update spawn timer
    this.spawnTimer += delta;

    // Get current wave composition
    const composition = this.getWaveComposition(
      Math.floor(
        this.waveConfig.baseEnemyCount *
          Math.pow(this.waveConfig.difficultyMultiplier, this.currentWave - 1)
      )
    );

    // Check if it's time to spawn a new enemy
    if (this.spawnTimer >= this.waveConfig.spawnInterval) {
      this.spawnTimer = 0;

      // Find next enemy type to spawn
      const totalSpawned = Object.values(composition).reduce(
        (a, b) => a + b,
        0
      );
      if (this.spawnedEnemies < totalSpawned) {
        let remainingByType = { ...composition };
        this.activeEnemies.forEach((enemy) => {
          const type = enemy.getType();
          if (remainingByType[type]) {
            remainingByType[type]--;
          }
        });

        // Spawn next enemy type that still has remaining count
        const typeToSpawn = Object.entries(remainingByType).find(
          ([_, count]) => count > 0
        );

        if (typeToSpawn) {
          this.scene.events.emit("spawnEnemy", {
            type: typeToSpawn[0],
            wave: this.currentWave,
          });
          this.spawnedEnemies++;
        }
      } else {
        this.isSpawning = false;
      }
    }

    // Clean up destroyed enemies
    this.activeEnemies = this.activeEnemies.filter(
      (enemy) => enemy.getSprite().active
    );

    // Check if wave is complete
    if (!this.isSpawning && this.activeEnemies.length === 0) {
      this.scene.events.emit("waveComplete", {
        wave: this.currentWave,
      });
    }
  }

  public addEnemy(enemy: Enemy): void {
    this.activeEnemies.push(enemy);
  }

  public getCurrentWave(): number {
    return this.currentWave;
  }

  public isWaveInProgress(): boolean {
    return this.isSpawning || this.activeEnemies.length > 0;
  }

  public destroy(): void {
    this.activeEnemies.forEach((enemy) => enemy.destroy());
    this.activeEnemies = [];
  }
}
