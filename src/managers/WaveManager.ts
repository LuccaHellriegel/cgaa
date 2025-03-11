import { Scene } from "phaser";
import { Enemy } from "../components/Enemy";
import { CampStatus } from "../components/GameStatusUI";

interface WaveConfig {
  campId: string;
  enemyCount: number;
  enemyTypes: string[];
  spawnInterval: number;
  targetCampId?: string; // For cooperating camps
}

export class WaveManager {
  private scene: Scene;
  private waves: Map<string, WaveConfig>;
  private activeWaves: Map<string, { timer: number; enemiesLeft: number }>;
  private camps: Map<string, CampStatus>;
  private enemies: Enemy[];

  constructor(scene: Scene) {
    this.scene = scene;
    this.waves = new Map();
    this.activeWaves = new Map();
    this.camps = new Map();
    this.enemies = [];
  }

  public addCamp(camp: CampStatus): void {
    this.camps.set(camp.id, camp);

    // Create a default wave config for this camp
    const waveConfig: WaveConfig = {
      campId: camp.id,
      enemyCount: 5,
      enemyTypes: ["basic"],
      spawnInterval: 2000, // 2 seconds
      targetCampId: camp.isCooperating ? undefined : undefined, // Will be set when cooperation is established
    };

    this.waves.set(camp.id, waveConfig);
  }

  public updateCamp(camp: CampStatus): void {
    this.camps.set(camp.id, camp);

    // Update wave config if camp is cooperating
    const waveConfig = this.waves.get(camp.id);
    if (waveConfig) {
      waveConfig.targetCampId = camp.isCooperating ? undefined : undefined;
    }
  }

  public startWave(campId: string): void {
    const camp = this.camps.get(campId);
    const waveConfig = this.waves.get(campId);

    if (!camp || !waveConfig || camp.isDestroyed) return;

    // Only spawn waves from active camps
    if (camp.isSpawning) {
      this.activeWaves.set(campId, {
        timer: 0,
        enemiesLeft: waveConfig.enemyCount,
      });
    }
  }

  public update(_time: number, delta: number): void {
    // Update active waves
    this.activeWaves.forEach((wave, campId) => {
      wave.timer += delta;

      const waveConfig = this.waves.get(campId);
      const camp = this.camps.get(campId);

      if (!waveConfig || !camp) return;

      // Spawn enemy if it's time and there are enemies left
      if (wave.timer >= waveConfig.spawnInterval && wave.enemiesLeft > 0) {
        this.spawnEnemy(waveConfig);
        wave.timer = 0;
        wave.enemiesLeft--;

        // Remove wave if all enemies are spawned
        if (wave.enemiesLeft <= 0) {
          this.activeWaves.delete(campId);
        }
      }
    });

    // Update enemies and remove dead ones
    this.enemies = this.enemies.filter((enemy) => !enemy.isDestroyed());
    this.enemies.forEach((enemy) => enemy.update());
  }

  private spawnEnemy(waveConfig: WaveConfig): void {
    const camp = this.camps.get(waveConfig.campId);
    if (!camp) return;

    // Get random enemy type from the wave config
    const enemyType =
      waveConfig.enemyTypes[
        Math.floor(Math.random() * waveConfig.enemyTypes.length)
      ];

    // Create enemy at camp position
    const enemy = new Enemy({
      scene: this.scene,
      x: camp.position.x,
      y: camp.position.y,
      texture: `enemy_${enemyType}`,
    });

    // Set target based on camp cooperation
    if (camp.isCooperating && waveConfig.targetCampId) {
      const targetCamp = this.camps.get(waveConfig.targetCampId);
      if (targetCamp) {
        enemy.setTarget(targetCamp.position);
      }
    }

    this.enemies.push(enemy);
  }

  public getEnemies(): Enemy[] {
    return this.enemies;
  }

  public destroy(): void {
    // Clean up enemies
    this.enemies.forEach((enemy) => enemy.destroy());
    this.enemies = [];

    // Clear maps
    this.waves.clear();
    this.activeWaves.clear();
    this.camps.clear();
  }
}
