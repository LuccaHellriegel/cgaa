import { Scene } from "phaser";
import { assert } from "../../utils/assert";

interface SoundConfig {
  volume: number;
  rate: number;
}

// Extended config with additional options
interface PlaySoundConfig {
  loop?: boolean;
  volume?: number;
  rate?: number;
  detune?: number;
  seek?: number;
}

export class SoundPlayer {
  private scene: Scene;
  private sounds: Map<string, Phaser.Sound.BaseSound> = new Map();
  private fallbackSound: Phaser.Sound.BaseSound | null = null;
  private soundsEnabled: boolean = true;
  private tweens: Map<string, Phaser.Tweens.Tween> = new Map();
  private soundVolumes: Map<string, number> = new Map();

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

      // Store the initial volume
      this.soundVolumes.set(key, config.volume);

      // Set up fallback sound if we don't have one yet
      if (!this.fallbackSound) {
        this.fallbackSound = sound;
      }
    } catch (error) {
      console.error(`Failed to create sound: ${key}`, error);
      throw error;
    }
  }

  public playSound(key: string, config?: PlaySoundConfig): void {
    if (!this.soundsEnabled) {
      return;
    }

    assert(typeof key === "string", "Key must be a string", { key });

    const sound = this.sounds.get(key);
    if (sound) {
      try {
        sound.play(config);
      } catch (error) {
        console.warn(`Failed to play sound ${key}:`, error);
        this.tryPlayFallback();
      }
    } else {
      console.warn(`Sound not found: ${key}`);
      this.tryPlayFallback();
    }
  }

  public fadeInSound(
    key: string,
    duration: number,
    config?: PlaySoundConfig
  ): void {
    if (!this.soundsEnabled) {
      return;
    }

    assert(typeof key === "string", "Key must be a string", { key });
    assert(typeof duration === "number", "Duration must be a number", {
      duration,
    });

    const sound = this.sounds.get(key);
    if (!sound) {
      console.warn(`Sound not found for fade in: ${key}`);
      return;
    }

    try {
      // Get target volume (either stored or from config)
      const targetVolume = config?.volume ?? this.soundVolumes.get(key) ?? 0.5;

      // Start with volume at 0
      const soundConfig = { ...config, volume: 0 };
      sound.play(soundConfig);

      // Create a dummy target object for the tween
      const volumeTarget = { value: 0 };

      // Create a tween to fade in the volume
      this.stopActiveTween(key);
      const tween = this.scene.tweens.add({
        targets: volumeTarget,
        value: targetVolume,
        duration: duration,
        ease: "Linear",
        onUpdate: () => {
          if (sound.isPlaying) {
            (sound as any).setVolume(volumeTarget.value);
          }
        },
        onComplete: () => {
          this.tweens.delete(key);
        },
      });

      this.tweens.set(key, tween);
    } catch (error) {
      console.warn(`Failed to fade in sound ${key}:`, error);
    }
  }

  public fadeOutSound(key: string, duration: number): void {
    assert(typeof key === "string", "Key must be a string", { key });
    assert(typeof duration === "number", "Duration must be a number", {
      duration,
    });

    const sound = this.sounds.get(key);
    if (!sound || !sound.isPlaying) {
      return;
    }

    try {
      // Get current volume - use stored volume as fallback
      const currentVolume = this.soundVolumes.get(key) ?? 0.5;

      // Create a dummy target object for the tween
      const volumeTarget = { value: currentVolume };

      // Create a tween to fade out the volume
      this.stopActiveTween(key);
      const tween = this.scene.tweens.add({
        targets: volumeTarget,
        value: 0,
        duration: duration,
        ease: "Linear",
        onUpdate: () => {
          if (sound.isPlaying) {
            (sound as any).setVolume(volumeTarget.value);
          }
        },
        onComplete: () => {
          sound.stop();
          this.tweens.delete(key);
        },
      });

      this.tweens.set(key, tween);
    } catch (error) {
      console.warn(`Failed to fade out sound ${key}:`, error);
      sound.stop();
    }
  }

  private stopActiveTween(key: string): void {
    const existingTween = this.tweens.get(key);
    if (existingTween) {
      existingTween.stop();
      this.tweens.delete(key);
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
        this.stopActiveTween(key);
        sound.stop();
      } catch (error) {
        console.warn(`Failed to stop sound ${key}:`, error);
      }
    }
  }

  public stopAllSounds(): void {
    this.sounds.forEach((sound, key) => {
      try {
        this.stopActiveTween(key);
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
    // Stop all tweens
    this.tweens.forEach((tween) => {
      tween.stop();
    });
    this.tweens.clear();

    // Stop and destroy all sounds
    this.stopAllSounds();
    this.sounds.forEach((sound, key) => {
      try {
        sound.destroy();
      } catch (error) {
        console.warn(`Failed to destroy sound ${key}:`, error);
      }
    });
    this.sounds.clear();
    this.soundVolumes.clear();
    this.fallbackSound = null;
  }
}
