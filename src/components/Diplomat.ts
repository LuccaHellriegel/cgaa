import { Scene } from "phaser";
import { GameEvents } from "../events/GameEvents";
import { CampBuilding } from "./CampBuilding";

export interface DiplomatConfig {
  scene: Scene;
  x: number;
  y: number;
  camp: CampBuilding;
}

export interface Quest {
  id: string;
  targetCamp: CampBuilding;
  isCompleted: boolean;
  isActive: boolean;
}

export class Diplomat extends Phaser.GameObjects.Arc {
  private targetCamp: CampBuilding | null = null;
  private interactionIndicator: Phaser.GameObjects.Text;
  private movementSpeed: number = 100;
  private hasCompletedQuest: boolean = false;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 15, 0, 360, false, 0xffffff, 0.8);

    // Set up diplomat appearance
    this.setDepth(5);

    // Create interaction indicator
    this.interactionIndicator = this.scene.add.text(
      this.x,
      this.y - 30,
      "[E] Talk",
      {
        fontSize: "14px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 4, y: 2 },
      }
    );
    this.interactionIndicator.setOrigin(0.5);
    this.interactionIndicator.setDepth(6);
    this.interactionIndicator.setVisible(false);

    // Add to scene
    this.scene.add.existing(this);
  }

  public setTarget(camp: CampBuilding): void {
    this.targetCamp = camp;
  }

  public hasReachedTarget(): boolean {
    if (!this.targetCamp) return false;

    const targetSprite = this.targetCamp.getSprite();
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      targetSprite.x,
      targetSprite.y
    );

    return distance <= 20; // Within 20 pixels of target
  }

  public completeQuest(): void {
    this.targetCamp = null;
    this.hasCompletedQuest = true;
  }

  public update(_time: number, delta: number): void {
    // Update interaction indicator position to follow diplomat
    if (this.interactionIndicator) {
      this.interactionIndicator.setPosition(this.x, this.y - 30);
    }

    if (this.targetCamp) {
      // Calculate distance to target
      const targetSprite = this.targetCamp.getSprite();
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        targetSprite.x,
        targetSprite.y
      );

      // Move towards target if not at destination
      if (distance > 10) {
        // Calculate velocity based on delta time for smooth movement
        const speed = (this.movementSpeed * delta) / 1000;
        const angle = Phaser.Math.Angle.Between(
          this.x,
          this.y,
          targetSprite.x,
          targetSprite.y
        );

        this.x += Math.cos(angle) * speed;
        this.y += Math.sin(angle) * speed;
      } else if (!this.hasCompletedQuest) {
        // Mark quest as complete when reaching target
        this.hasCompletedQuest = true;
        this.scene.events.emit(GameEvents.CAMP_DESTROYED, this.targetCamp);
      }
    }
  }

  public destroy(fromScene?: boolean): void {
    // Clean up game objects
    if (this.interactionIndicator) {
      this.interactionIndicator.destroy();
    }

    super.destroy(fromScene);
  }
}
