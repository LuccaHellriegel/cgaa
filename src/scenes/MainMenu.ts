import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    // Display basic title
    this.add
      .text(512, 384, "Circle Gladiator Army Arena", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    // Start game on click/tap
    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
