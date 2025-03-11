import { Scene } from "phaser";

export interface CampStatus {
  id: string;
  position: { x: number; y: number };
  isSpawning: boolean;
  isQuestTarget: boolean;
  isDestroyed: boolean;
  isCooperating: boolean;
}

export class GameStatusUI {
  private scene: Scene;
  private container: Phaser.GameObjects.Container;
  private circles: Phaser.GameObjects.Arc[];

  constructor(scene: Scene) {
    this.scene = scene;
    this.container = this.scene.add.container(0, 0);
    this.circles = [];
  }

  public updateCampStatus(camps: CampStatus[]): void {
    // Clear existing circles
    this.circles.forEach((circle) => circle.destroy());
    this.circles = [];

    // Create or update circles for each camp
    camps.forEach((camp) => {
      const circle = this.scene.add.circle(
        camp.position.x,
        camp.position.y,
        20,
        0x000000,
        0.5
      );

      if (camp.isDestroyed) {
        circle.setFillStyle(0xff0000, 0.5);
      } else if (camp.isCooperating) {
        circle.setFillStyle(0x00ff00, 0.5);
      } else {
        circle.setFillStyle(0x000000, 0.5);
      }

      this.circles.push(circle);
      this.container.add(circle);
    });
  }

  public destroy(): void {
    this.circles.forEach((circle) => circle.destroy());
    this.container.destroy();
  }
}
