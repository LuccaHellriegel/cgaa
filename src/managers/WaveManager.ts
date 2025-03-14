import { Scene } from "phaser";
import { Enemy } from "../components/Enemy";
import { ObjectiveMarker } from "../components/GameProgressUI";
import { Player } from "../components/Player";
import { GameEvents } from "../events/GameEvents";
import { assert } from "../utils/assert";

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
  private isSpawning: boolean = false;

  constructor(scene: Scene) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene", {
      providedType: typeof scene,
      isScene: scene instanceof Scene,
    });

    this.scene = scene;
    this.initializePlayer();

    // Listen for player updates
    this.scene.events.on("playerUpdated", this.initializePlayer, this);

    // Also listen for player-ready event
    this.scene.events.on("player-ready", (player: Player) => {
      assert(
        player instanceof Player,
        "player-ready event must provide a Player instance",
        {
          providedType: typeof player,
          isPlayer: player instanceof Player,
        }
      );

      if (player && !this.player) {
        this.player = player;
        console.log("Player initialized from player-ready event");
      }
    });
  }

  private initializePlayer(): void {
    // Try to get player from registry
    if (!this.player) {
      this.player = this.scene.registry.get("player") as Player;
      if (this.player) {
        assert(
          this.player instanceof Player,
          "Registry player must be a Player instance",
          {
            providedType: typeof this.player,
            isPlayer: this.player instanceof Player,
          }
        );

        console.log("Player initialized from registry");
      } else {
        console.warn("Player not found in registry");
      }
    }
  }

  public addCamp(camp: CampStatus): void {
    assert(
      camp !== null && camp !== undefined,
      "Camp cannot be null or undefined",
      { camp }
    );
    assert(
      typeof camp.id === "string" && camp.id.length > 0,
      "Camp ID must be a non-empty string",
      { campId: camp.id }
    );
    assert(
      typeof camp.position === "object",
      "Camp position must be an object",
      { position: camp.position }
    );
    assert(
      typeof camp.position.x === "number",
      "Camp position.x must be a number",
      { x: camp.position.x }
    );
    assert(
      typeof camp.position.y === "number",
      "Camp position.y must be a number",
      { y: camp.position.y }
    );
    assert(
      typeof camp.isSpawning === "boolean",
      "isSpawning must be a boolean",
      { isSpawning: camp.isSpawning }
    );
    assert(
      typeof camp.isQuestTarget === "boolean",
      "isQuestTarget must be a boolean",
      { isQuestTarget: camp.isQuestTarget }
    );
    assert(
      typeof camp.isDestroyed === "boolean",
      "isDestroyed must be a boolean",
      { isDestroyed: camp.isDestroyed }
    );
    assert(
      typeof camp.isCooperating === "boolean",
      "isCooperating must be a boolean",
      { isCooperating: camp.isCooperating }
    );

    // Verify camp ID is unique
    assert(!this.camps.has(camp.id), "Camp ID must be unique", {
      campId: camp.id,
      existingCamps: Array.from(this.camps.keys()),
    });

    this.camps.set(camp.id, camp);

    // Post-condition: verify camp was added
    assert(this.camps.has(camp.id), "Camp must be added to camps map", {
      campId: camp.id,
    });
    assert(
      this.camps.get(camp.id) === camp,
      "Camp reference in map must match the provided camp",
      {
        campId: camp.id,
        isMatch: this.camps.get(camp.id) === camp,
      }
    );
  }

  public startWave(campId: string): void {
    assert(
      typeof campId === "string" && campId.length > 0,
      "Camp ID must be a non-empty string",
      { campId }
    );

    const camp = this.camps.get(campId);
    assert(camp !== undefined, "Camp must exist to start a wave", {
      campId,
      existingCamps: Array.from(this.camps.keys()),
    });

    if (!camp) return; // Redundant but needed for TypeScript

    const previousSpawningState = camp.isSpawning;
    camp.isSpawning = true;

    const previousWave = this.currentWave;
    this.currentWave++;
    this.waveTimer = 0;

    // Verify state changes
    assert(camp.isSpawning, "Camp must be set to spawning", {
      campId,
      wasSpawning: previousSpawningState,
      isSpawning: camp.isSpawning,
    });
    assert(
      this.currentWave === previousWave + 1,
      "Current wave must increment by 1",
      {
        previousWave,
        currentWave: this.currentWave,
      }
    );
    assert(this.waveTimer === 0, "Wave timer must reset to 0", {
      waveTimer: this.waveTimer,
    });

    // Emit wave start event
    this.scene.events.emit("waveStart", {
      wave: this.currentWave,
      camp: camp,
    });
  }

  public update(time: number, delta: number): void {
    assert(typeof time === "number", "Time must be a number", { time });
    assert(typeof delta === "number", "Delta must be a number", { delta });
    assert(delta >= 0, "Delta must be non-negative", { delta });

    // Update wave timer
    const previousTimer = this.waveTimer;
    this.waveTimer += delta / 1000; // Convert to seconds

    // Verify timer increased correctly
    assert(
      this.waveTimer === previousTimer + delta / 1000 ||
        Math.abs(this.waveTimer - (previousTimer + delta / 1000)) < 0.00001,
      "Wave timer must increase by delta/1000",
      {
        previousTimer,
        delta,
        expectedIncrease: delta / 1000,
        actualTimer: this.waveTimer,
      }
    );

    const timeToNext = Math.max(0, this.nextWaveTime - this.waveTimer);

    // Emit wave info update
    this.scene.events.emit("waveUpdate", {
      wave: this.currentWave,
      timeToNext: timeToNext,
    });

    // Update enemy positions and states
    this.updateEnemies();

    // Get objectives for UI
    const objectives = this.getObjectives();
    assert(Array.isArray(objectives), "Objectives must be an array", {
      objectives,
    });

    this.scene.events.emit("objectivesUpdate", objectives);
  }

  private updateEnemies(): void {
    this.enemies.forEach((enemy) => {
      enemy.update();
    });

    // Remove destroyed enemies
    this.enemies = this.enemies.filter((enemy) => enemy.getSprite().active);

    // Check if wave is complete
    if (this.enemies.length === 0 && !this.isSpawning) {
      this.scene.events.emit(GameEvents.WAVE_END);
    }
  }

  private getObjectives(): ObjectiveMarker[] {
    const objectives: ObjectiveMarker[] = [];
    if (!this.player) {
      this.initializePlayer(); // Try one more time
      assert(
        this.player !== undefined || !this.scene.registry.has("player"),
        "Player must be defined after initialization if in registry",
        {
          hasPlayerInRegistry: this.scene.registry.has("player"),
        }
      );

      if (!this.player) {
        console.warn("Cannot get objectives: Player not initialized");
        return objectives;
      }
    }

    // Return empty array for now
    return objectives;
  }

  public getEnemies(): Enemy[] {
    return [...this.enemies]; // Return a copy to prevent external modification
  }

  public getCurrentWave(): number {
    return this.currentWave;
  }

  public getTimeToNextWave(): number {
    const timeToNext = Math.max(0, this.nextWaveTime - this.waveTimer);
    assert(timeToNext >= 0, "Time to next wave must be non-negative", {
      timeToNext,
    });
    return timeToNext;
  }

  public destroy(): void {
    // Verify we have a valid scene before destruction
    assert(this.scene instanceof Scene, "Scene must be valid during destroy", {
      sceneType: typeof this.scene,
      isScene: this.scene instanceof Scene,
    });

    // Clean up event listeners
    this.scene.events.off("playerUpdated", this.initializePlayer, this);
    this.scene.events.off("player-ready");

    // Destroy all enemies
    const enemyCount = this.enemies.length;
    this.enemies.forEach((enemy) => enemy.destroy());
    this.enemies = [];

    // Verify cleanup
    assert(
      this.enemies.length === 0,
      "Enemies array must be empty after destroy",
      {
        previousCount: enemyCount,
        currentCount: this.enemies.length,
      }
    );
  }
}
