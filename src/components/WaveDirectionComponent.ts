import { Scene } from "phaser";
import { CampBuilding } from "./CampBuilding";
import { Component } from "./Component";

export class WaveDirectionComponent implements Component {
  private scene: Scene;
  private camp: CampBuilding;
  private targetCamp: CampBuilding | null = null;
  private directionIndicator: Phaser.GameObjects.Container | null = null;

  constructor(scene: Scene, camp: CampBuilding) {
    this.scene = scene;
    this.camp = camp;
  }

  public setTargetCamp(camp: CampBuilding | null): void {
    this.targetCamp = camp;
    this.updateDirectionIndicator();
  }

  private updateDirectionIndicator(): void {
    // Clean up existing indicator
    if (this.directionIndicator) {
      this.directionIndicator.destroy();
      this.directionIndicator = null;
    }

    // Create new indicator if there's a target
    if (this.targetCamp && this.camp.isCooperatingState()) {
      const sourceSprite = this.camp.getSprite();
      const targetSprite = this.targetCamp.getSprite();

      // Create container for the indicator
      this.directionIndicator = this.scene.add.container(
        sourceSprite.x,
        sourceSprite.y
      );

      // Create arrow line
      const graphics = this.scene.add.graphics();
      graphics.lineStyle(2, 0x44ff44); // Green line for cooperation
      graphics.beginPath();
      graphics.moveTo(0, 0);

      // Calculate direction
      const angle = Phaser.Math.Angle.Between(
        sourceSprite.x,
        sourceSprite.y,
        targetSprite.x,
        targetSprite.y
      );
      const distance = Phaser.Math.Distance.Between(
        sourceSprite.x,
        sourceSprite.y,
        targetSprite.x,
        targetSprite.y
      );

      // Draw arrow line
      graphics.lineTo(Math.cos(angle) * distance, Math.sin(angle) * distance);

      // Draw arrowhead
      const arrowHeadSize = 10;
      const arrowHeadAngle = 0.5; // Angle in radians
      graphics.save();
      graphics.lineStyle(2, 0x44ff44);
      graphics.lineTo(
        Math.cos(angle + Math.PI + arrowHeadAngle) * arrowHeadSize +
          Math.cos(angle) * distance,
        Math.sin(angle + Math.PI + arrowHeadAngle) * arrowHeadSize +
          Math.sin(angle) * distance
      );
      graphics.moveTo(Math.cos(angle) * distance, Math.sin(angle) * distance);
      graphics.lineTo(
        Math.cos(angle + Math.PI - arrowHeadAngle) * arrowHeadSize +
          Math.cos(angle) * distance,
        Math.sin(angle + Math.PI - arrowHeadAngle) * arrowHeadSize +
          Math.sin(angle) * distance
      );
      graphics.strokePath();

      this.directionIndicator.add(graphics);
      this.directionIndicator.setDepth(1); // Ensure it's above the camps but below UI
    }
  }

  public getTargetCamp(): CampBuilding | null {
    return this.targetCamp;
  }

  public update(_time: number, _delta: number): void {
    if (this.directionIndicator && this.targetCamp) {
      // Update indicator position if camps move
      const sourceSprite = this.camp.getSprite();
      this.directionIndicator.setPosition(sourceSprite.x, sourceSprite.y);
      this.updateDirectionIndicator();
    }
  }

  public destroy(): void {
    if (this.directionIndicator) {
      this.directionIndicator.destroy();
      this.directionIndicator = null;
    }
  }
}
