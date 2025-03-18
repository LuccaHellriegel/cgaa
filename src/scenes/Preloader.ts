import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    // Create a simple loading bar
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    // Update the progress bar as assets load
    this.load.on("progress", (progress: number) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    // Load assets for Circle Gladiator Army Arena
    this.load.setPath("assets");

    // Game assets will be loaded here
  }

  create() {
    // Move to the MainMenu
    this.scene.start("MainMenu");
  }
}
