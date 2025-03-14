import { Scene } from "phaser";
import { CampBuilding } from "./CampBuilding";

export class DiplomatMenu {
  private scene: Scene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Rectangle;
  private title: Phaser.GameObjects.Text;
  private closeButton: Phaser.GameObjects.Text;
  private campButtons: Phaser.GameObjects.Text[] = [];
  private isVisible: boolean = false;

  constructor(scene: Scene) {
    this.scene = scene;

    // Create container for menu elements
    this.container = scene.add.container(0, 0);
    this.container.setDepth(10);

    // Create background
    this.background = scene.add.rectangle(0, 0, 300, 400, 0x000000, 0.8);
    this.background.setOrigin(0);
    this.container.add(this.background);

    // Create title
    this.title = scene.add.text(10, 10, "Diplomacy Menu", {
      fontSize: "24px",
      color: "#ffffff",
    });
    this.container.add(this.title);

    // Create close button
    this.closeButton = scene.add.text(270, 10, "X", {
      fontSize: "20px",
      color: "#ff0000",
    });
    this.closeButton.setInteractive();
    this.closeButton.on("pointerdown", () => this.hide());
    this.container.add(this.closeButton);

    // Hide menu initially
    this.container.setVisible(false);
  }

  public show(sourceCamp: CampBuilding, nearbyCamps: CampBuilding[]): void {
    // Position menu near source camp
    const campSprite = sourceCamp.getSprite();
    this.container.setPosition(campSprite.x + 50, campSprite.y - 200);

    // Clear existing camp buttons
    this.campButtons.forEach((button) => button.destroy());
    this.campButtons = [];

    // Create buttons for each nearby camp
    nearbyCamps.forEach((camp, index) => {
      const button = this.scene.add.text(
        10,
        50 + index * 40,
        `Camp at (${Math.round(camp.getSprite().x)}, ${Math.round(
          camp.getSprite().y
        )})`,
        {
          fontSize: "16px",
          color: "#ffffff",
          backgroundColor: "#333333",
          padding: { x: 10, y: 5 },
        }
      );
      button.setInteractive();
      button.on("pointerdown", () => {
        this.scene.events.emit("setCampTarget", {
          sourceCamp,
          targetCamp: camp,
        });
        this.hide();
      });
      this.container.add(button);
      this.campButtons.push(button);
    });

    // Update background height based on content
    const contentHeight = 60 + nearbyCamps.length * 40;
    this.background.setSize(300, contentHeight);

    // Show menu
    this.container.setVisible(true);
    this.isVisible = true;
  }

  public hide(): void {
    this.container.setVisible(false);
    this.isVisible = false;
  }

  public update(): void {
    // Update menu position if needed
  }

  public isMenuVisible(): boolean {
    return this.isVisible;
  }

  public destroy(): void {
    // Clean up event listeners
    this.closeButton.removeAllListeners();
    this.campButtons.forEach((button) => button.removeAllListeners());

    // Destroy game objects
    this.container.destroy();
  }
}
