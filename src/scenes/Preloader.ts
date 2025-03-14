import { Scene } from "phaser";
import { GraphicsGenerator } from "../graphics/GraphicsGenerator";
import { AudioManager } from "../managers/audio/AudioManager";

export class Preloader extends Scene {
  private graphicsGenerator: GraphicsGenerator;
  private audioManager: AudioManager | null = null;
  private loadingText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "Preloader" });
    this.graphicsGenerator = new GraphicsGenerator(this);
    // We'll initialize the AudioManager in the create method instead
  }

  init() {
    // Add a black background to ensure proper contrast
    this.cameras.main.setBackgroundColor("#000000");

    // Add loading text
    this.loadingText = this.add
      .text(512, 340, "Loading...", {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Create a loading bar container with proper styling
    this.add.rectangle(512, 384, 468, 32, 0x111111).setStrokeStyle(2, 0x444444);

    // This is the progress bar itself with a more visible color
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0x4287f5);

    // Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      // Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
      bar.x = 512 - 230 + (460 * progress) / 2;

      // Update loading text with percentage
      this.loadingText.setText(`Loading... ${Math.floor(progress * 100)}%`);
    });
  }

  preload() {
    // All UI assets are generated programmatically, no image loading required

    // Generate UI assets
    this.graphicsGenerator.generateUIAssets();

    // Generate game textures
    this.graphicsGenerator.generatePlayerTexture();
    this.graphicsGenerator.generateEnemyTexture();
    this.graphicsGenerator.generateTowerTexture();

    // Set up particle effects (this internally generates the particle texture)
    this.graphicsGenerator.setupParticleEffects();

    // We'll handle audio loading in create() since it returns a Promise
  }

  create() {
    // Initialize AudioManager now that the scene is fully initialized
    this.audioManager = new AudioManager(this);

    // Update loading text
    this.loadingText.setText("Loading audio...");

    // Initialize audio and load all sounds
    this.audioManager
      .loadAudio()
      .then(() => {
        // Store the audio manager in the registry for global access
        this.registry.set("audioManager", this.audioManager);

        // Log audio loading status
        if (this.audioManager) {
          const status = this.audioManager.getLoadingStatus();
          console.log(
            `Audio loading complete. Loaded ${status.loaded}/${status.total} sounds.`
          );
          if (status.missing.length > 0) {
            console.warn("Missing sounds:", status.missing);
          }
        }

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
            this.scene.start("MainMenu");
          },
        });
      })
      .catch((error: Error) => {
        console.error("Failed to load audio:", error);
        // Continue to main menu even if audio loading fails
        this.registry.set("audioManager", this.audioManager);
        this.scene.start("MainMenu");
      });
  }
}
