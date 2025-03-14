import { Scene } from "phaser";
import { assert } from "../../utils/assert";

interface SoundConfig {
  volume: number;
  rate: number;
}

export class SoundPool {
  private scene: Scene;
  private pools: Map<string, Phaser.Sound.BaseSound[]> = new Map();
  private configs: Map<string, SoundConfig> = new Map();

  constructor(scene: Scene) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene", {
      providedType: typeof scene,
      isScene: scene instanceof Scene,
    });
    this.scene = scene;
  }

  public createPool(key: string, config: SoundConfig, size: number): void {
    assert(typeof key === "string", "Key must be a string", { key });
    assert(typeof config === "object", "Config must be an object", { config });
    assert(
      typeof size === "number" && size > 0,
      "Size must be a positive number",
      { size }
    );

    try {
      const pool: Phaser.Sound.BaseSound[] = [];
      for (let i = 0; i < size; i++) {
        const sound = this.scene.sound.add(key, config);
        assert(sound !== undefined, "Failed to create sound", {
          key,
          index: i,
        });
        pool.push(sound);
      }
      this.pools.set(key, pool);
      this.configs.set(key, config);
    } catch (error) {
      console.error(`Failed to create sound pool for ${key}:`, error);
      throw error;
    }
  }

  public playFromPool(key: string): boolean {
    assert(typeof key === "string", "Key must be a string", { key });
    assert(this.pools.has(key), `No pool exists for sound key: ${key}`, {
      existingPools: Array.from(this.pools.keys()),
    });

    const pool = this.pools.get(key);
    assert(pool !== undefined, "Pool must be defined", { key });

    // Find an available (stopped) sound in the pool
    for (const sound of pool) {
      assert(sound !== undefined, "Sound in pool must be defined", { key });
      if (!sound.isPlaying) {
        try {
          sound.play();
          return true;
        } catch (error) {
          console.warn(`Failed to play sound ${key} from pool:`, error);
          continue;
        }
      }
    }

    // If no stopped sound was found, try to create a new one
    try {
      const config = this.configs.get(key);
      assert(config !== undefined, "Config must be defined for key", { key });
      const newSound = this.scene.sound.add(key, config);
      pool.push(newSound);
      newSound.play();
      return true;
    } catch (error) {
      console.error(`Failed to create new sound for pool ${key}:`, error);
      return false;
    }
  }

  public stopAll(key: string): void {
    assert(typeof key === "string", "Key must be a string", { key });
    const pool = this.pools.get(key);
    if (pool) {
      pool.forEach((sound) => {
        try {
          if (sound.isPlaying) {
            sound.stop();
          }
        } catch (error) {
          console.warn(`Failed to stop sound in pool ${key}:`, error);
        }
      });
    }
  }

  public destroy(): void {
    this.pools.forEach((pool, key) => {
      pool.forEach((sound) => {
        try {
          sound.destroy();
        } catch (error) {
          console.warn(`Failed to destroy sound in pool ${key}:`, error);
        }
      });
    });
    this.pools.clear();
    this.configs.clear();
  }
}
