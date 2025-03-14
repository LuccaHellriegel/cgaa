import { Scene } from "phaser";
import { SoundLoader } from "./SoundLoader";
import { SoundPool } from "./SoundPool";
import { SoundPlayer } from "./SoundPlayer";
import { assert } from "../../utils/assert";

interface SoundConfig {
  volume: number;
  rate: number;
}

export enum GameState {
  MENU = "menu",
  EXPLORATION = "exploration",
  COMBAT = "combat",
  DIPLOMACY = "diplomacy",
  VICTORY = "victory",
  DEFEAT = "defeat",
}

export class AudioManager {
  private loader: SoundLoader;
  private pool: SoundPool;
  private player: SoundPlayer;
  private frequentSounds: string[] = ["hit", "shoot"]; // Sounds that should be pooled
  private currentGameState: GameState = GameState.MENU;
  private currentMusic: string | null = null;
  private musicFadeTime: number = 1000; // ms
  private soundConfigs: Record<string, SoundConfig>;

  constructor(scene: Scene) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene", {
      providedType: typeof scene,
      isScene: scene instanceof Scene,
    });

    this.loader = new SoundLoader(scene);
    this.pool = new SoundPool(scene);
    this.player = new SoundPlayer(scene);

    // Initialize sound configurations
    this.soundConfigs = {
      // Combat sounds
      hit: { volume: 0.5, rate: 1 },
      shoot: { volume: 0.4, rate: 1 },
      death: { volume: 0.7, rate: 1 },

      // Building sounds
      build: { volume: 0.6, rate: 1 },

      // UI sounds
      ui_hover: { volume: 0.3, rate: 1 },
      ui_click: { volume: 0.4, rate: 1 },

      // Game event sounds
      wave_start: { volume: 0.5, rate: 1 },
      collect: { volume: 0.5, rate: 1 },

      // Ambient sounds
      ambient_wind: { volume: 0.2, rate: 1 },
      ambient_crowd: { volume: 0.2, rate: 1 },

      // Music tracks
      music_menu: { volume: 0.3, rate: 1 },
      music_exploration: { volume: 0.3, rate: 1 },
      music_combat: { volume: 0.4, rate: 1 },
      music_diplomacy: { volume: 0.3, rate: 1 },
      music_victory: { volume: 0.4, rate: 1 },
      music_defeat: { volume: 0.4, rate: 1 },
    };

    // TODO: Connect sound triggers with game events
    // Currently most sound effects are defined but not triggered by game events

    // Listen for game state changes
    scene.events.on("gameStateChanged", this.handleGameStateChange, this);
  }

  public async loadAudio(): Promise<void> {
    // Load all sounds
    const loadedSounds = await this.loader.loadAudio(this.soundConfigs);

    // Set up pools for frequent sounds and regular sounds for others
    loadedSounds.forEach((key) => {
      const config = this.soundConfigs[key];
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

    // Start with menu music
    this.playMusic(GameState.MENU);

    // TODO: Add error handling for missing audio files
    // Current implementation silently fails if audio files aren't available
  }

  private handleGameStateChange(newState: GameState): void {
    assert(Object.values(GameState).includes(newState), "Invalid game state", {
      newState,
      validStates: Object.values(GameState),
    });

    this.currentGameState = newState;
    this.playMusic(newState);

    // Handle ambient sounds based on state
    if (newState === GameState.EXPLORATION) {
      this.player.playSound("ambient_wind", { loop: true });
    } else if (newState === GameState.DIPLOMACY) {
      this.player.playSound("ambient_crowd", { loop: true });
    }

    // TODO: Implement transitions between game states
    // Need smoother transitions with cross-fading and state-specific audio
  }

  public getCurrentGameState(): GameState {
    return this.currentGameState;
  }

  private playMusic(state: GameState): void {
    const musicKey = `music_${state.toLowerCase()}`;
    if (this.currentMusic === musicKey) return;

    // Fade out current music if playing
    if (this.currentMusic) {
      this.player.fadeOutSound(this.currentMusic, this.musicFadeTime);
    }

    // Update current state and music
    this.currentGameState = state;
    this.currentMusic = musicKey;
    this.player.fadeInSound(musicKey, this.musicFadeTime, { loop: true });

    // TODO: Implement dynamic music system based on gameplay intensity
    // Music should change based on factors like number of enemies, player health, etc.
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
    const allSoundKeys = Object.keys(this.soundConfigs);
    const missing = allSoundKeys.filter((key) => !loadedSounds.has(key));

    return {
      total: allSoundKeys.length,
      loaded: loadedSounds.size,
      missing,
    };
  }
}
