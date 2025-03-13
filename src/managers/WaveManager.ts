import { Scene } from "phaser";
import { Enemy } from "../components/Enemy";
import { ObjectiveMarker } from "../components/GameProgressUI";
import { Player } from "../components/Player";

export interface CampStatus {
  id: string;
  position: { x: number; y: number };
  isSpawning: boolean;
  isQuestTarget: boolean;
  isDestroyed: boolean;
  isCooperating: boolean;
}

export class WaveManager {
  private scene: Scene;
  private currentWave: number = 0;
  private nextWaveTime: number = 30; // 30 seconds between waves
  private waveTimer: number = 0;
  private camps: Map<string, CampStatus> = new Map();
  private enemies: Enemy[] = [];
  private player: Player;

  constructor(scene: Scene) {
    this.scene = scene;
    this.player = scene.registry.get("player") as Player;
  }

  public addCamp(camp: CampStatus): void {
    this.camps.set(camp.id, camp);
  }

  public startWave(campId: string): void {
    const camp = this.camps.get(campId);
    if (!camp) return;

    camp.isSpawning = true;
    this.currentWave++;
    this.waveTimer = 0;

    // Emit wave start event
    this.scene.events.emit("waveStart", {
      wave: this.currentWave,
      camp: camp,
    });
  }

  public update(time: number, delta: number): void {
    // Update wave timer
    this.waveTimer += delta / 1000; // Convert to seconds
    const timeToNext = Math.max(0, this.nextWaveTime - this.waveTimer);

    // Emit wave info update
    this.scene.events.emit("waveUpdate", {
      wave: this.currentWave,
      timeToNext: timeToNext,
    });

    // Update enemy positions and states
    this.enemies.forEach((enemy) => enemy.update(time, delta));

    // Clean up destroyed enemies
    this.enemies = this.enemies.filter((enemy) => !enemy.isDestroyed());

    // Get objectives for UI
    const objectives = this.getObjectives();
    this.scene.events.emit("objectivesUpdate", objectives);
  }

  private getObjectives(): ObjectiveMarker[] {
    const objectives: ObjectiveMarker[] = [];
    const playerSprite = this.player.getSprite();
    const playerPosition = {
      x: playerSprite.x,
      y: playerSprite.y,
    };

    // Add camps as objectives
    this.camps.forEach((camp, id) => {
      if (!camp.isDestroyed) {
        const distance = Phaser.Math.Distance.Between(
          playerPosition.x,
          playerPosition.y,
          camp.position.x,
          camp.position.y
        );

        objectives.push({
          id,
          position: new Phaser.Math.Vector2(camp.position.x, camp.position.y),
          type: camp.isQuestTarget ? "quest" : "camp",
          distance,
        });
      }
    });

    // Add active enemies as objectives
    this.enemies.forEach((enemy, index) => {
      const enemySprite = enemy.getSprite();
      const distance = Phaser.Math.Distance.Between(
        playerPosition.x,
        playerPosition.y,
        enemySprite.x,
        enemySprite.y
      );

      objectives.push({
        id: `enemy_${index}`,
        position: new Phaser.Math.Vector2(enemySprite.x, enemySprite.y),
        type: "enemy",
        distance,
      });
    });

    return objectives;
  }

  public getEnemies(): Enemy[] {
    return this.enemies;
  }

  public getCurrentWave(): number {
    return this.currentWave;
  }

  public getTimeToNextWave(): number {
    return Math.max(0, this.nextWaveTime - this.waveTimer);
  }

  public destroy(): void {
    this.enemies.forEach((enemy) => enemy.destroy());
    this.enemies = [];
  }
}
