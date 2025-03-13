import { Scene } from "phaser";

export class AudioManager {
  private scene: Scene;
  private sounds: Map<string, Phaser.Sound.BaseSound>;
  private soundsEnabled: boolean = true;
  private loadedSounds: Set<string> = new Set();
  private fallbackSound: Phaser.Sound.BaseSound | null = null;
  private soundPools: Map<string, Phaser.Sound.BaseSound[]> = new Map();
  private frequentSounds: string[] = ["hit", "shoot"]; // Sounds that should be pooled

  constructor(scene: Scene) {
    this.scene = scene;
    this.sounds = new Map();

    // We'll set up event listeners in the loadAudio method instead
    // This avoids trying to access scene.events before it's fully initialized
  }

  public loadAudio(): Promise<void> {
    // Set up event listeners for game pause/resume
    // Only set them up if the events object exists
    if (this.scene.events) {
      this.scene.events.on("pause", () => this.handlePause());
      this.scene.events.on("resume", () => this.handleResume());
      this.scene.events.once("shutdown", () => this.destroy());
    }

    // Load audio with both MP3 and OGG formats for better browser compatibility
    const soundConfigs = {
      hit: { volume: 0.5, rate: 1 },
      shoot: { volume: 0.4, rate: 1 },
      build: { volume: 0.6, rate: 1 },
      collect: { volume: 0.5, rate: 1 },
      death: { volume: 0.7, rate: 1 },
      ui_hover: { volume: 0.3, rate: 1 },
      ui_click: { volume: 0.4, rate: 1 },
      wave_start: { volume: 0.5, rate: 1 },
    };

    // Create a promise to track when all sounds are loaded
    return new Promise<void>((resolve) => {
      // Ensure the loader exists
      if (!this.scene.load) {
        console.warn("Scene loader not available, skipping audio loading");
        resolve();
        return;
      }

      // Check which audio files actually exist
      const fileCheckPromises = Object.keys(soundConfigs).map((key) => {
        return fetch(`assets/audio/${key}.mp3`)
          .then((response) => {
            if (response.ok) {
              return { key, exists: true };
            }
            return { key, exists: false };
          })
          .catch(() => {
            return { key, exists: false };
          });
      });

      // Track existence of files
      const existingFiles = new Set<string>();

      // Process file checks and then load audio
      Promise.all(fileCheckPromises).then((results) => {
        results.forEach((result) => {
          if (result.exists) {
            existingFiles.add(result.key);
          } else {
            console.warn(
              `Audio file '${result.key}' not found, will use fallback if needed.`
            );
          }
        });

        // Skip loading if no files exist
        if (existingFiles.size === 0) {
          console.warn("No audio files found, skipping audio loading");
          resolve();
          return;
        }

        // Add a safety timeout to ensure loading doesn't hang forever
        const safetyTimeout = setTimeout(() => {
          console.warn("Audio loading timed out, continuing without audio");
          resolve();
        }, 10000); // 10 second timeout

        // Now load only the files that exist
        existingFiles.forEach((key) => {
          try {
            this.scene.load.audio(key, [
              `assets/audio/${key}.mp3`,
              `assets/audio/${key}.ogg`,
            ]);

            // Add success handler
            this.scene.load.on(`filecomplete-audio-${key}`, () => {
              this.loadedSounds.add(key);
              console.log(`Successfully loaded audio: ${key}`);
            });
          } catch (error) {
            console.warn(`Error setting up audio load for ${key}:`, error);
          }
        });

        // Start the loading process
        this.scene.load.start();

        // Set up complete handler to resolve the promise
        this.scene.load.on("complete", () => {
          // Clear the safety timeout
          clearTimeout(safetyTimeout);

          // Create a fallback sound if at least one sound loaded successfully
          if (existingFiles.size > 0) {
            const firstSoundKey = Array.from(existingFiles)[0];
            try {
              this.fallbackSound = this.scene.sound.add(firstSoundKey, {
                volume: 0.3,
              });
            } catch (error) {
              console.warn("Failed to create fallback sound:", error);
            }
          }

          // Create regular sounds
          Object.entries(soundConfigs).forEach(([key, config]) => {
            try {
              if (this.loadedSounds.has(key)) {
                if (this.frequentSounds.includes(key)) {
                  // Create a pool for frequently used sounds
                  this.createSoundPool(key, config, 3);
                } else {
                  // Create a single instance for less frequent sounds
                  const sound = this.scene.sound.add(key, config);
                  this.sounds.set(key, sound);
                }
              } else {
                console.warn(
                  `Skipping creation of sound ${key} as it was not loaded successfully`
                );
              }
            } catch (error) {
              console.warn(`Failed to create sound: ${key}`, error);
            }
          });

          console.log("All audio loaded successfully");
          resolve();
        });

        // Handle loading error
        this.scene.load.on("loaderror", (fileObj: any) => {
          console.error(`Error loading audio file: ${fileObj.key}`);
          // Do not reject the entire promise for a single file failure
        });
      });
    });
  }

  private createSoundPool(key: string, config: any, size: number): void {
    const pool: Phaser.Sound.BaseSound[] = [];

    for (let i = 0; i < size; i++) {
      try {
        const sound = this.scene.sound.add(key, config);
        pool.push(sound);
      } catch (error) {
        console.warn(`Error creating pooled sound ${key}:`, error);
      }
    }

    if (pool.length > 0) {
      this.soundPools.set(key, pool);
    }
  }

  private playFromPool(key: string): boolean {
    const pool = this.soundPools.get(key);
    if (!pool || pool.length === 0) return false;

    // Find first sound that's not playing
    let sound = pool.find((s) => !s.isPlaying);

    // If all sounds are playing, use the oldest one
    if (!sound) {
      sound = pool[0];
      sound.stop(); // Stop it before playing again
    }

    // Move to end of pool (for round-robin)
    const index = pool.indexOf(sound);
    if (index !== -1) {
      pool.splice(index, 1);
      pool.push(sound);
    }

    // Play the sound
    sound.play();
    return true;
  }

  public playSound(key: string): void {
    if (!this.soundsEnabled) return;

    try {
      // First try to play from pool if it's a frequent sound
      if (this.soundPools.has(key)) {
        if (this.playFromPool(key)) {
          return;
        }
      }

      // Otherwise play from regular sounds
      const sound = this.sounds.get(key);
      if (sound) {
        sound.play();
      } else {
        // Use fallback sound if the requested sound doesn't exist
        if (this.fallbackSound && key === "wave_start") {
          console.warn(`Using fallback sound for missing audio: ${key}`);
          this.fallbackSound.play();
        } else {
          // Just log a warning but don't break the game flow
          console.warn(`Sound not available: ${key}`);
        }
      }
    } catch (error) {
      console.warn(`Error playing sound ${key}:`, error);
    }
  }

  public stopSound(key: string): void {
    try {
      // Stop regular sound
      const sound = this.sounds.get(key);
      if (sound) {
        sound.stop();
      }

      // Also stop any pooled instances
      const pool = this.soundPools.get(key);
      if (pool) {
        pool.forEach((sound) => sound.stop());
      }
    } catch (error) {
      console.warn(`Error stopping sound ${key}:`, error);
    }
  }

  public stopAllSounds(): void {
    try {
      // Stop regular sounds
      this.sounds.forEach((sound) => sound.stop());

      // Stop pooled sounds
      this.soundPools.forEach((pool) => {
        pool.forEach((sound) => sound.stop());
      });
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

  public toggleSounds(): void {
    this.soundsEnabled = !this.soundsEnabled;
    if (!this.soundsEnabled) {
      this.stopAllSounds();
    }
  }

  public destroy(): void {
    // Clean up regular sounds
    this.sounds.forEach((sound) => {
      sound.destroy();
    });
    this.sounds.clear();

    // Clean up pooled sounds
    this.soundPools.forEach((pool) => {
      pool.forEach((sound) => {
        sound.destroy();
      });
    });
    this.soundPools.clear();

    // Clean up other resources
    this.loadedSounds.clear();
    if (this.fallbackSound) {
      this.fallbackSound.destroy();
      this.fallbackSound = null;
    }

    // Remove event listeners
    if (this.scene.events) {
      this.scene.events.off("pause", this.handlePause, this);
      this.scene.events.off("resume", this.handleResume, this);
      this.scene.events.off("shutdown", this.destroy, this);
    }
  }

  // Get loaded sound status
  public getLoadingStatus(): {
    total: number;
    loaded: number;
    missing: string[];
  } {
    const allSoundKeys = Array.from(this.sounds.keys());
    const pooledSoundKeys = Array.from(this.soundPools.keys());
    const allKeys = [...new Set([...allSoundKeys, ...pooledSoundKeys])];

    const loadedSoundKeys = Array.from(this.loadedSounds);
    const missingSounds = allKeys.filter((key) => !this.loadedSounds.has(key));

    return {
      total: allKeys.length,
      loaded: loadedSoundKeys.length,
      missing: missingSounds,
    };
  }
}
