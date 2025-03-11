import { Scene } from "phaser";
import { AudioManager } from "../managers/AudioManager";
import { GraphicsGenerator } from "../graphics/GraphicsGenerator";

export class LoadingScene extends Scene {
  private loadingBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;
  private audioManager: AudioManager;
  private graphicsGenerator: GraphicsGenerator;

  constructor() {
    super("Loading");
  }

  preload(): void {
    // Create loading bar
    this.createLoadingBar();

    // Initialize managers
    this.audioManager = new AudioManager(this);
    this.graphicsGenerator = new GraphicsGenerator(this);

    // Load assets
    this.loadAssets();

    // Loading progress events
    this.load.on("progress", (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x00ff00, 1);
      this.progressBar.fillRect(
        this.scale.width / 4,
        this.scale.height / 2 - 16,
        (this.scale.width / 2) * value,
        32
      );
    });

    this.load.on("complete", () => {
      // Generate game textures and animations
      this.graphicsGenerator.generatePlayerTexture();
      this.graphicsGenerator.generateEnemyTexture();
      this.graphicsGenerator.generateTowerTexture();

      this.progressBar.destroy();
      this.loadingBar.destroy();
      this.scene.start("Game");
    });
  }

  private createLoadingBar(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x222222, 0.8);
    this.loadingBar.fillRect(
      this.scale.width / 4,
      this.scale.height / 2 - 16,
      this.scale.width / 2,
      32
    );

    this.progressBar = this.add.graphics();
  }

  private loadAssets(): void {
    // Load audio assets
    this.audioManager.loadAudio();

    // Note: We don't need to load image assets here since we're generating them
    // But we'll keep the UI assets loading
    this.load.image("button", "assets/ui/button.png");
    this.load.image("button_hover", "assets/ui/button_hover.png");
    this.load.image("icon_shooter", "assets/ui/icon_shooter.png");
    this.load.image("icon_healer", "assets/ui/icon_healer.png");
    this.load.image("health_bar", "assets/ui/health_bar.png");
    this.load.image("health_bar_bg", "assets/ui/health_bar_bg.png");
  }
}
