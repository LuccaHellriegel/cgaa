import { Scene } from "phaser";
import { GraphicsGenerator } from "../graphics/GraphicsGenerator";
import { AudioManager } from "../managers/AudioManager";

export class Preloader extends Scene {
  private graphicsGenerator: GraphicsGenerator;
  private audioManager: AudioManager;

  constructor() {
    super({ key: "Preloader" });
    this.graphicsGenerator = new GraphicsGenerator(this);
    this.audioManager = new AudioManager(this);
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    // Display loading progress
    const progress = this.add.graphics();

    this.load.on("progress", (value: number) => {
      progress.clear();
      progress.fillStyle(0xffffff, 1);
      progress.fillRect(0, this.scale.height / 2, this.scale.width * value, 60);
    });

    this.load.on("complete", () => {
      progress.destroy();
    });

    // Generate game textures
    this.graphicsGenerator.generatePlayerTexture();
    this.graphicsGenerator.generateEnemyTexture();
    this.graphicsGenerator.generateTowerTexture();

    // Set up particle effects (this internally generates the particle texture)
    this.graphicsGenerator.setupParticleEffects();

    // Load audio assets using AudioManager
    this.audioManager.loadAudio();
  }

  create() {
    // Initialize audio
    this.registry.set("audioManager", this.audioManager);

    // Add transition effect
    const transitionGraphics = this.add.graphics();
    transitionGraphics.fillStyle(0x000000, 1);
    transitionGraphics.fillRect(0, 0, this.scale.width, this.scale.height);

    this.tweens.add({
      targets: transitionGraphics,
      alpha: 0,
      duration: 500,
      ease: "Power2",
      onComplete: () => {
        transitionGraphics.destroy();
        this.scene.start("Game");
      },
    });
  }
}
