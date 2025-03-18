import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    // Get the canvas dimensions for proper centering
    const width = this.scale.width;
    const height = this.scale.height;

    // Display basic title
    this.add
      .text(width / 2, height / 3, "Circle Gladiator Army Arena", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    // Add instructions
    this.add
      .text(width / 2, height / 2, "Click/Tap to Start", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Start game on click/tap
    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
