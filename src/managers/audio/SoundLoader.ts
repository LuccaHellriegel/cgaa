import { Scene } from "phaser";
import { assert } from "../../utils/assert";

interface SoundConfig {
  volume: number;
  rate: number;
}

export class SoundLoader {
  private scene: Scene;
  private loadedSounds: Set<string> = new Set();

  constructor(scene: Scene) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene", {
      providedType: typeof scene,
      isScene: scene instanceof Scene,
    });
    this.scene = scene;
  }

  public async loadAudio(
    soundConfigs: Record<string, SoundConfig>
  ): Promise<Set<string>> {
    assert(
      this.scene !== undefined,
      "Scene must be defined before loading audio",
      { sceneType: typeof this.scene }
    );

    // Verify sound configurations
    Object.entries(soundConfigs).forEach(([key, config]) => {
      assert(
        typeof key === "string" && key.length > 0,
        "Sound key must be a non-empty string",
        { key }
      );
      assert(typeof config === "object", "Sound config must be an object", {
        key,
        config,
      });
      assert(
        typeof config.volume === "number",
        "Sound volume must be a number",
        { key, volume: config.volume }
      );
      assert(
        config.volume >= 0 && config.volume <= 1,
        "Sound volume must be between 0 and 1",
        { key, volume: config.volume }
      );
      assert(typeof config.rate === "number", "Sound rate must be a number", {
        key,
        rate: config.rate,
      });
      assert(config.rate > 0, "Sound rate must be positive", {
        key,
        rate: config.rate,
      });
    });

    // Create a promise to track when all sounds are loaded
    return new Promise<Set<string>>((resolve) => {
      // Ensure the loader exists
      if (!this.scene.load) {
        console.warn("Scene loader not available, skipping audio loading");
        resolve(new Set());
        return;
      }

      // Check which audio files actually exist
      const fileCheckPromises = Object.keys(soundConfigs).map((key) => {
        assert(typeof key === "string", "Sound key must be a string", { key });

        return fetch(`assets/audio/${key}.mp3`)
          .then((response) => {
            assert(response !== undefined, "Fetch response must be defined", {
              key,
            });
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
        assert(Array.isArray(results), "File check results must be an array", {
          resultsLength: results.length,
        });

        results.forEach((result) => {
          assert(result !== undefined, "File check result must be defined", {
            result,
          });
          assert(
            typeof result.key === "string",
            "Result key must be a string",
            { result }
          );
          assert(
            typeof result.exists === "boolean",
            "Result exists must be a boolean",
            { result }
          );

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
          resolve(new Set());
          return;
        }

        // Add a safety timeout to ensure loading doesn't hang forever
        const safetyTimeout = setTimeout(() => {
          console.warn("Audio loading timed out, continuing without audio");
          resolve(this.loadedSounds);
        }, 10000); // 10 second timeout

        // Now load only the files that exist
        existingFiles.forEach((key) => {
          try {
            assert(
              this.scene.load !== undefined,
              "Scene loader must be defined",
              { sceneKey: this.scene.sys.settings.key }
            );

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
          console.log("All audio loaded successfully");
          resolve(this.loadedSounds);
        });

        // Handle loading error
        this.scene.load.on("loaderror", (fileObj: any) => {
          console.error(`Error loading audio file: ${fileObj.key}`);
          // Do not reject the entire promise for a single file failure
        });
      });
    });
  }

  public getLoadedSounds(): Set<string> {
    return new Set(this.loadedSounds);
  }
}
