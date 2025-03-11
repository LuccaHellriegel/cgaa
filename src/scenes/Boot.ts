import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Load minimal assets required for the loading screen
    // We'll load game assets in the Preloader scene
  }

  create() {
    this.scene.start("Preloader");
  }
}
