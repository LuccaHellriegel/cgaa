import { Scene } from "phaser";

export class AudioManager {
  private scene: Scene;
  private sounds: Map<string, Phaser.Sound.BaseSound>;
  private soundsEnabled: boolean = true;
  private loadedSounds: Set<string> = new Set();

  constructor(scene: Scene) {
    this.scene = scene;
    this.sounds = new Map();
  }

  preload(): void {
    // Load audio with both MP3 and OGG formats for better browser compatibility
    const audioFiles = [
      "hit",
      "shoot",
      "build",
      "collect",
      "death",
      "ui_hover",
      "ui_click",
    ];

    audioFiles.forEach((key) => {
      try {
        this.scene.load.audio(key, [
          `assets/audio/${key}.mp3`,
          `assets/audio/${key}.ogg`,
        ]);

        // Add error handler for each audio file
        this.scene.load.on(`filecomplete-audio-${key}`, () => {
          this.loadedSounds.add(key);
          console.log(`Successfully loaded audio: ${key}`);
        });

        this.scene.load.on(`loaderror`, (file: any) => {
          if (file.key === key) {
            console.warn(`Failed to load audio file: ${key}`);
          }
        });
      } catch (error) {
        console.warn(`Error setting up audio load for ${key}:`, error);
      }
    });
  }

  create(): void {
    // Initialize sounds with proper configurations
    const soundConfigs = {
      hit: { volume: 0.5, rate: 1 },
      shoot: { volume: 0.4, rate: 1 },
      build: { volume: 0.6, rate: 1 },
      collect: { volume: 0.5, rate: 1 },
      death: { volume: 0.7, rate: 1 },
      ui_hover: { volume: 0.3, rate: 1 },
      ui_click: { volume: 0.4, rate: 1 },
    };

    // Create sound instances only for successfully loaded sounds
    Object.entries(soundConfigs).forEach(([key, config]) => {
      try {
        if (this.loadedSounds.has(key)) {
          const sound = this.scene.sound.add(key, config);
          this.sounds.set(key, sound);
        } else {
          console.warn(
            `Skipping creation of sound ${key} as it was not loaded successfully`
          );
        }
      } catch (error) {
        console.warn(`Failed to create sound: ${key}`, error);
      }
    });

    // Handle game pause/resume
    this.scene.events.on("pause", () => this.handlePause());
    this.scene.events.on("resume", () => this.handleResume());
  }

  playSound(key: string): void {
    if (!this.soundsEnabled) return;

    try {
      const sound = this.sounds.get(key);
      if (sound) {
        sound.play();
      } else {
        console.warn(`Attempted to play non-existent sound: ${key}`);
      }
    } catch (error) {
      console.warn(`Error playing sound ${key}:`, error);
    }
  }

  stopSound(key: string): void {
    try {
      const sound = this.sounds.get(key);
      if (sound) {
        sound.stop();
      }
    } catch (error) {
      console.warn(`Error stopping sound ${key}:`, error);
    }
  }

  stopAllSounds(): void {
    try {
      this.sounds.forEach((sound) => sound.stop());
    } catch (error) {
      console.warn("Error stopping all sounds:", error);
    }
  }

  private handlePause(): void {
    if (this.soundsEnabled) {
      this.stopAllSounds();
    }
  }

  private handleResume(): void {
    // Handle resume logic if needed
  }

  toggleSounds(): void {
    this.soundsEnabled = !this.soundsEnabled;
    if (!this.soundsEnabled) {
      this.stopAllSounds();
    }
  }

  destroy(): void {
    this.sounds.forEach((sound) => {
      sound.destroy();
    });
    this.sounds.clear();
    this.loadedSounds.clear();
    this.scene.events.off("pause", this.handlePause, this);
    this.scene.events.off("resume", this.handleResume, this);
  }
}
