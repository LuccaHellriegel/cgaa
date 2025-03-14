import { Scene } from "phaser";
import { CampBuilding } from "../../../components/CampBuilding";
import { QuestSystem } from "../../../systems/QuestSystem";

export interface DiplomatMenuConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class DiplomatMenu {
  private scene: Scene;
  private questSystem: QuestSystem;
  private menuContainer: Phaser.GameObjects.Container;
  private config: DiplomatMenuConfig;

  constructor(
    scene: Scene,
    config: DiplomatMenuConfig,
    questSystem: QuestSystem
  ) {
    this.scene = scene;
    this.config = config;
    this.questSystem = questSystem;
    this.menuContainer = this.scene.add.container(config.x, config.y);
  }

  public show(camp: CampBuilding, nearbyCamps: CampBuilding[]): void {
    // Clear existing menu items
    this.menuContainer.removeAll(true);

    // Create background
    const background = this.scene.add.rectangle(
      0,
      0,
      this.config.width,
      this.config.height,
      0x000000,
      0.8
    );
    this.menuContainer.add(background);

    // Add title
    const title = this.scene.add.text(
      -this.config.width / 2 + 10,
      -this.config.height / 2 + 10,
      "Diplomat Menu",
      {
        fontSize: "20px",
        color: "#ffffff",
      }
    );
    this.menuContainer.add(title);

    // Add nearby camps list
    let yOffset = -this.config.height / 2 + 50;
    nearbyCamps.forEach((nearCamp, index) => {
      const campButton = this.scene.add
        .text(-this.config.width / 2 + 10, yOffset, `Camp ${index + 1}`, {
          fontSize: "16px",
          color: "#ffffff",
        })
        .setInteractive();

      campButton.on("pointerdown", () => {
        this.questSystem.startQuest(camp, nearCamp);
        this.destroy();
      });

      this.menuContainer.add(campButton);
      yOffset += 30;
    });

    // Add close button
    const closeButton = this.scene.add
      .text(this.config.width / 2 - 40, -this.config.height / 2 + 10, "X", {
        fontSize: "20px",
        color: "#ff0000",
      })
      .setInteractive();

    closeButton.on("pointerdown", () => {
      this.destroy();
    });

    this.menuContainer.add(closeButton);
  }

  public destroy(): void {
    this.menuContainer.destroy();
  }
}
