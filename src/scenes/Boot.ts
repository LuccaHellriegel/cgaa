import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Nothing to preload - just show a simple loading message
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "Starting game...",
        {
          fontFamily: "Arial",
          fontSize: "24px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);
  }

  create() {
    // Configure global game settings here
    this.scale.fullscreenTarget = document.getElementById("game-container");

    // Basic error handling setup
    window.addEventListener("error", (e) => {
      console.error("Game Error:", e);
    });

    // Continue to the Preloader scene
    this.scene.start("Preloader");
  }
}
