import { Scene } from "phaser";
import { King } from "../components/King";
import { GameEvents } from "../events/GameEvents";
import { CampBuilding } from "../components/CampBuilding";

interface KingChamberData {
  playerHealth: number;
  playerPosition: Phaser.Math.Vector2;
}

export class KingChamber extends Scene {
  private king: King | null = null;
  private barrier: Phaser.GameObjects.Rectangle | null = null;
  private isBarrierOpen: boolean = false;

  constructor() {
    super({ key: "KingChamber" });
  }

  init(data: KingChamberData): void {
    // Store initial data for player setup
    this.registry.set("playerHealth", data.playerHealth);
    this.registry.set("playerPosition", data.playerPosition);
  }

  create(): void {
    // Create chamber background
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
      .setOrigin(0, 0)
      .setAlpha(0.3);

    // Create barrier
    this.barrier = this.add
      .rectangle(this.scale.width / 2, 0, 20, this.scale.height, 0xff0000)
      .setOrigin(0.5, 0);

    // Create king behind barrier
    this.king = new King(this, this.scale.width * 0.75, this.scale.height / 2);

    // Listen for camp status changes
    this.events.on(GameEvents.CAMP_DESTROYED, this.checkBarrierCondition, this);
    this.events.on(
      GameEvents.QUEST_COMPLETED,
      this.checkBarrierCondition,
      this
    );

    // Listen for king defeat
    this.events.on(GameEvents.KING_DEFEATED, this.handleVictory, this);

    // Set up initial barrier state
    this.checkBarrierCondition();
  }

  private checkBarrierCondition(): void {
    // Get all camps
    const camps = this.registry.get("camps") as CampBuilding[];

    // Check if all camps are either destroyed or cooperating
    const allCampsDefeated = camps.every(
      (camp) => camp.isDestroyedState() || camp.isCooperatingState()
    );

    if (allCampsDefeated && !this.isBarrierOpen) {
      this.openBarrier();
    }
  }

  private openBarrier(): void {
    if (!this.barrier) return;

    this.isBarrierOpen = true;

    // Animate barrier disappearing
    this.tweens.add({
      targets: this.barrier,
      alpha: 0,
      duration: 1000,
      ease: "Power2",
      onComplete: () => {
        this.barrier?.destroy();
        this.barrier = null;
      },
    });

    // Play barrier break sound
    this.registry.get("audioManager").playSound("barrier_break");
  }

  private handleVictory(): void {
    // Stop all gameplay
    this.physics.pause();

    // Show victory text
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Victory!", {
        fontSize: "64px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Add victory particles
    this.add.particles(0, 0, "particle", {
      x: { min: 0, max: this.scale.width },
      y: this.scale.height + 10,
      lifespan: { min: 1000, max: 1100 },
      speedY: { min: -300, max: -200 },
      scale: { start: 0.5, end: 2.5 },
      alpha: { start: 1, end: 0 },
      rotate: { min: -180, max: 180 },
      frequency: 110,
      blendMode: "ADD",
    });

    // After a delay, emit game win event
    this.time.delayedCall(3000, () => {
      this.events.emit(GameEvents.GAME_WIN);
    });
  }

  update(): void {
    // Update king if it exists
    if (this.king) {
      this.king.update();
    }
  }

  destroy(): void {
    // Clean up event listeners
    this.events.off(
      GameEvents.CAMP_DESTROYED,
      this.checkBarrierCondition,
      this
    );
    this.events.off(
      GameEvents.QUEST_COMPLETED,
      this.checkBarrierCondition,
      this
    );
    this.events.off(GameEvents.KING_DEFEATED, this.handleVictory, this);
  }
}
