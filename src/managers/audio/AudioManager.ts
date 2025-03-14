import { Scene } from "phaser";
import { SoundLoader } from "./SoundLoader";
import { SoundPool } from "./SoundPool";
import { SoundPlayer } from "./SoundPlayer";

// Add assert function
function assert(
  condition: boolean,
  message: string,
  context?: any
): asserts condition {
  if (!condition) {
    const contextStr = context ? ` Context: ${JSON.stringify(context)}` : "";
    const errorMsg = `Assertion failed: ${message}.${contextStr}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

interface SoundConfig {
  volume: number;
  rate: number;
}

export class AudioManager {
  private loader: SoundLoader;
  private pool: SoundPool;
  private player: SoundPlayer;
  private frequentSounds: string[] = ["hit", "shoot"]; // Sounds that should be pooled

  constructor(scene: Scene) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene", {
      providedType: typeof scene,
      isScene: scene instanceof Scene,
    });

    this.loader = new SoundLoader(scene);
    this.pool = new SoundPool(scene);
    this.player = new SoundPlayer(scene);
  }

  public async loadAudio(): Promise<void> {
    const soundConfigs: Record<string, SoundConfig> = {
      hit: { volume: 0.5, rate: 1 },
      shoot: { volume: 0.4, rate: 1 },
      build: { volume: 0.6, rate: 1 },
      collect: { volume: 0.5, rate: 1 },
      death: { volume: 0.7, rate: 1 },
      ui_hover: { volume: 0.3, rate: 1 },
      ui_click: { volume: 0.4, rate: 1 },
      wave_start: { volume: 0.5, rate: 1 },
    };

    // Load all sounds
    const loadedSounds = await this.loader.loadAudio(soundConfigs);

    // Set up pools for frequent sounds and regular sounds for others
    loadedSounds.forEach((key) => {
      const config = soundConfigs[key];
      assert(config !== undefined, "Config must exist for loaded sound", {
        key,
      });

      if (this.frequentSounds.includes(key)) {
        try {
          this.pool.createPool(key, config, 3);
        } catch (error) {
          console.warn(
            `Failed to create pool for ${key}, falling back to single sound:`,
            error
          );
          this.player.createSound(key, config);
        }
      } else {
        this.player.createSound(key, config);
      }
    });
  }

  public playSound(key: string): void {
    assert(typeof key === "string", "Key must be a string", { key });

    if (this.frequentSounds.includes(key)) {
      const success = this.pool.playFromPool(key);
      if (!success) {
        // Fallback to regular player if pool fails
        this.player.playSound(key);
      }
    } else {
      this.player.playSound(key);
    }
  }

  public stopSound(key: string): void {
    assert(typeof key === "string", "Key must be a string", { key });

    if (this.frequentSounds.includes(key)) {
      this.pool.stopAll(key);
    } else {
      this.player.stopSound(key);
    }
  }

  public stopAllSounds(): void {
    this.frequentSounds.forEach((key) => this.pool.stopAll(key));
    this.player.stopAllSounds();
  }

  public toggleSounds(): void {
    this.player.toggleSounds();
  }

  public destroy(): void {
    this.pool.destroy();
    this.player.destroy();
  }

  public getLoadingStatus(): {
    total: number;
    loaded: number;
    missing: string[];
  } {
    const loadedSounds = this.loader.getLoadedSounds();
    const allSoundKeys = [
      "hit",
      "shoot",
      "build",
      "collect",
      "death",
      "ui_hover",
      "ui_click",
      "wave_start",
    ];

    const missing = allSoundKeys.filter((key) => !loadedSounds.has(key));

    return {
      total: allSoundKeys.length,
      loaded: loadedSounds.size,
      missing,
    };
  }
}
