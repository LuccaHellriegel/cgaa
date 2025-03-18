import { Scene } from "phaser";
import { TextureManager } from "../textures/TextureManager";

export class Preloader extends Scene {
  private bar!: Phaser.GameObjects.Rectangle;

  constructor() {
    super("Preloader");
  }

  init() {
    // Create a simple loading bar
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
    this.bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    // Update the progress bar as assets load
    this.load.on("progress", (progress: number) => {
      this.bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    // Create and initialize the TextureManager
    const textureManager = TextureManager.getInstance(this);

    // Generate all textures with progress callback
    textureManager.generateAllTextures((progress) => {
      // Update the progress bar for texture generation
      // This is separate from the asset loading progress
      this.bar.width = 4 + 460 * progress * 0.5; // Texture generation is 50% of loading
    });

    // Load other assets for Circle Gladiator Army Arena
    this.load.setPath("assets");

    // Add other game assets here
    // ...

    // Register the TextureManager in the registry for global access
    this.registry.set("textureManager", textureManager);
  }

  create() {
    // Move to the MainMenu
    this.scene.start("MainMenu");
  }
}
