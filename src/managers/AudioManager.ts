import { Scene } from "phaser";

export class AudioManager {
  private scene: Scene;
  private sounds: Map<string, Phaser.Sound.BaseSound>;
  private soundsEnabled: boolean = true;
  private loadedSounds: Set<string> = new Set();
  private fallbackSound: Phaser.Sound.BaseSound | null = null;

  constructor(scene: Scene) {
    this.scene = scene;
    this.sounds = new Map();
  }

  public loadAudio(): Promise<void> {
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
    return new Promise((resolve, reject) => {
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

        // Set up complete handler to resolve the promise
        this.scene.load.on("complete", () => {
          // Create a fallback sound if at least one sound loaded successfully
          if (existingFiles.size > 0) {
            const firstSoundKey = Array.from(existingFiles)[0];
            this.fallbackSound = this.scene.sound.add(firstSoundKey, {
              volume: 0.3,
            });
          }

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

    // Handle game pause/resume
    this.scene.events.on("pause", () => this.handlePause());
    this.scene.events.on("resume", () => this.handleResume());
  }

  public playSound(key: string): void {
    if (!this.soundsEnabled) return;

    try {
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
      const sound = this.sounds.get(key);
      if (sound) {
        sound.stop();
      }
    } catch (error) {
      console.warn(`Error stopping sound ${key}:`, error);
    }
  }

  public stopAllSounds(): void {
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

  public toggleSounds(): void {
    this.soundsEnabled = !this.soundsEnabled;
    if (!this.soundsEnabled) {
      this.stopAllSounds();
    }
  }

  public destroy(): void {
    this.sounds.forEach((sound) => {
      sound.destroy();
    });
    this.sounds.clear();
    this.loadedSounds.clear();
    this.scene.events.off("pause", this.handlePause, this);
    this.scene.events.off("resume", this.handleResume, this);
  }

  // Get loaded sound status
  public getLoadingStatus(): {
    total: number;
    loaded: number;
    missing: string[];
  } {
    const allSoundKeys = Array.from(this.sounds.keys());
    const loadedSoundKeys = Array.from(this.loadedSounds);
    const missingSounds = allSoundKeys.filter(
      (key) => !this.loadedSounds.has(key)
    );

    return {
      total: allSoundKeys.length,
      loaded: loadedSoundKeys.length,
      missing: missingSounds,
    };
  }
}
