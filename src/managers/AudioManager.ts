import { Scene } from "phaser";

export class AudioManager {
  private scene: Scene;
  private sounds: Map<string, Phaser.Sound.BaseSound>;
  private soundsEnabled: boolean = true;

  constructor(scene: Scene) {
    this.scene = scene;
    this.sounds = new Map();
  }

  preload(): void {
    // Load audio with both MP3 and OGG formats for better browser compatibility
    const audioFiles = ["hit", "shoot", "build", "collect", "death"];

    audioFiles.forEach((key) => {
      this.scene.load.audio(key, [
        `assets/audio/${key}.mp3`,
        `assets/audio/${key}.ogg`,
      ]);
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
    };

    // Create sound instances
    Object.entries(soundConfigs).forEach(([key, config]) => {
      try {
        const sound = this.scene.sound.add(key, config);
        this.sounds.set(key, sound);
      } catch (error) {
        console.warn(`Failed to create sound: ${key}`, error);
      }
    });

    // Handle game pause/resume
    this.scene.events.on("pause", () => this.handlePause());
    this.scene.events.on("resume", () => this.handleResume());
  }

  play(key: string): void {
    if (!this.soundsEnabled) return;

    const sound = this.sounds.get(key);
    if (sound) {
      try {
        sound.play();
      } catch (error) {
        console.warn(`Failed to play sound: ${key}`, error);
      }
    }
  }

  toggleSounds(): boolean {
    this.soundsEnabled = !this.soundsEnabled;
    return this.soundsEnabled;
  }

  private handlePause(): void {
    this.sounds.forEach((sound) => {
      if (sound.isPlaying) {
        sound.pause();
      }
    });
  }

  private handleResume(): void {
    if (this.soundsEnabled) {
      this.sounds.forEach((sound) => {
        if (sound.isPaused) {
          sound.resume();
        }
      });
    }
  }

  destroy(): void {
    this.sounds.forEach((sound) => {
      sound.destroy();
    });
    this.sounds.clear();
    this.scene.events.off("pause", this.handlePause, this);
    this.scene.events.off("resume", this.handleResume, this);
  }
}
