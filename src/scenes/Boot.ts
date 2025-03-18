import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Minimal preloading for the boot scene
    // We'll load most assets in the Preloader
  }

  create() {
    this.scene.start("Preloader");
  }
}
