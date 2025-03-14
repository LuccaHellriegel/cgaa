import { Scene } from "phaser";
import { assert } from "../../utils/assert";

interface SoundConfig {
  volume: number;
  rate: number;
}

export class SoundPlayer {
  private scene: Scene;
  private sounds: Map<string, Phaser.Sound.BaseSound> = new Map();
  private fallbackSound: Phaser.Sound.BaseSound | null = null;
  private soundsEnabled: boolean = true;

  constructor(scene: Scene) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene", {
      providedType: typeof scene,
      isScene: scene instanceof Scene,
    });
    this.scene = scene;

    // Set up event listeners for game pause/resume
    if (this.scene.events) {
      this.scene.events.on("pause", () => this.handlePause());
      this.scene.events.on("resume", () => this.handleResume());
      this.scene.events.once("shutdown", () => this.destroy());
    }
  }

  public createSound(key: string, config: SoundConfig): void {
    assert(typeof key === "string", "Key must be a string", { key });
    assert(typeof config === "object", "Config must be an object", { config });

    try {
      const sound = this.scene.sound.add(key, config);
      assert(sound !== undefined, "Failed to create sound", { key });
      this.sounds.set(key, sound);

      // Set up fallback sound if we don't have one yet
      if (!this.fallbackSound) {
        this.fallbackSound = sound;
      }
    } catch (error) {
      console.error(`Failed to create sound: ${key}`, error);
      throw error;
    }
  }

  public playSound(key: string): void {
    if (!this.soundsEnabled) {
      return;
    }

    assert(typeof key === "string", "Key must be a string", { key });

    const sound = this.sounds.get(key);
    if (sound) {
      try {
        sound.play();
      } catch (error) {
        console.warn(`Failed to play sound ${key}:`, error);
        this.tryPlayFallback();
      }
    } else {
      console.warn(`Sound not found: ${key}`);
      this.tryPlayFallback();
    }
  }

  private tryPlayFallback(): void {
    if (this.fallbackSound && this.soundsEnabled) {
      try {
        this.fallbackSound.play();
      } catch (error) {
        console.warn("Failed to play fallback sound:", error);
      }
    }
  }

  public stopSound(key: string): void {
    assert(typeof key === "string", "Key must be a string", { key });

    const sound = this.sounds.get(key);
    if (sound) {
      try {
        sound.stop();
      } catch (error) {
        console.warn(`Failed to stop sound ${key}:`, error);
      }
    }
  }

  public stopAllSounds(): void {
    this.sounds.forEach((sound, key) => {
      try {
        sound.stop();
      } catch (error) {
        console.warn(`Failed to stop sound ${key}:`, error);
      }
    });
  }

  private handlePause(): void {
    if (this.scene.sound.pauseOnBlur) {
      this.stopAllSounds();
    }
  }

  private handleResume(): void {
    // Implement if needed - currently just handles pause
  }

  public toggleSounds(): void {
    this.soundsEnabled = !this.soundsEnabled;
    if (!this.soundsEnabled) {
      this.stopAllSounds();
    }
  }

  public destroy(): void {
    this.stopAllSounds();
    this.sounds.forEach((sound, key) => {
      try {
        sound.destroy();
      } catch (error) {
        console.warn(`Failed to destroy sound ${key}:`, error);
      }
    });
    this.sounds.clear();
    this.fallbackSound = null;
  }
}
