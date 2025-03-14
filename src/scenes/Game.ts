import { Scene } from "phaser";
import { Player } from "../components/Player";
import { InputSystem } from "./game/systems/InputSystem";
import { WorldSystem } from "./game/systems/WorldSystem";
import { CollisionSystem } from "./game/systems/CollisionSystem";
import { CampSystem } from "./game/systems/CampSystem";
import { GameState } from "../controllers/GameController";
import { GameEvents } from "../events/GameEvents";
import { Soul } from "../components/Soul";
import { assert, assertNotNull } from "../utils/assert";
import { BuildingSize, CampBuilding } from "../components/CampBuilding";
import { PerformanceOptimizer } from "../systems/PerformanceOptimizer";
import { AudioManager } from "../managers/audio/AudioManager";
import { WaveManager } from "../managers/WaveManager";

export class Game extends Scene {
  private player: Player | null = null;
  private inputSystem: InputSystem | null = null;
  private worldSystem: WorldSystem | null = null;
  private collisionSystem: CollisionSystem | null = null;
  private campSystem: CampSystem | null = null;
  private performanceOptimizer: PerformanceOptimizer | null = null;
  private gameState: GameState | null = null;
  private audioManager: AudioManager;
  private waveManager: WaveManager | null = null;
  private campStateChangeCallbacks: Map<CampBuilding, Function> = new Map();

  constructor() {
    super({ key: "Game" });
  }

  public init(data: { gameState: GameState }): void {
    assert(data.gameState !== undefined, "Game state must be provided");
    this.gameState = data.gameState;
  }

  public create(): void {
    // Validate preconditions once at the beginning
    this.gameState = assertNotNull(
      this.gameState,
      "Game state must be initialized"
    );

    // Initialize systems
    this.worldSystem = new WorldSystem(this);
    this.inputSystem = new InputSystem(this);
    this.collisionSystem = new CollisionSystem(this);
    this.campSystem = new CampSystem(this);
    this.performanceOptimizer = new PerformanceOptimizer(this);

    // Create player
    this.player = new Player(this);

    // Set up world and player positioning
    const worldCenter = this.worldSystem.getWorldDimensions();
    this.player.setPosition(worldCenter.width / 2, worldCenter.height / 2);

    // Set game state in registry for other systems
    this.registry.set("gameState", this.gameState);

    // Set WASD keys in registry for player movement
    const wasdKeys = this.inputSystem.getWASDKeys();
    this.registry.set("wasdKeys", wasdKeys);

    // Create initial camps
    this.createInitialCamps();

    // Initialize wave manager after player and camps are ready
    this.waveManager = new WaveManager(this);

    // Initialize wave system and connect with camps
    const waveManager = assertNotNull(
      this.waveManager,
      "Wave manager must be initialized"
    );
    const camps = this.registry.get("camps") as CampBuilding[];
    if (camps) {
      camps.forEach((camp) => {
        const campStatus = {
          id: camp.getId(),
          position: { x: camp.getSprite().x, y: camp.getSprite().y },
          isSpawning: false,
          isQuestTarget: camp.isQuestTargetState(),
          isDestroyed: camp.isDestroyedState(),
          isCooperating: camp.isCooperatingState(),
        };
        waveManager.addCamp(campStatus);
      });
    }

    // Emit player ready event for systems to register
    const player = assertNotNull(this.player, "Player must be initialized");
    this.events.emit(GameEvents.PLAYER_READY, player);

    // Setup event handlers
    this.setupEventHandlers();

    // Optimize static content after everything is created
    if (this.performanceOptimizer) {
      this.performanceOptimizer.optimizeStaticContent();
    }

    // Initialize audio manager
    this.audioManager = new AudioManager(this);
    this.registry.set("audioManager", this.audioManager);

    // Load audio and start with exploration state
    this.audioManager.loadAudio().then(() => {
      this.events.emit(GameEvents.GAME_STATE_CHANGED, "exploration");
    });

    // Set up event handlers for audio
    this.setupAudioEventHandlers();

    // Add in-game onboarding elements
    this.setupOnboarding();

    // Fixed TODO: Implemented wave system initialization and integration - 2024-03-21

    // Fixed TODO: Store camps list in registry for access in KingChamber scene - 2024-03-21
  }

  private createInitialCamps(): void {
    const worldSystem = assertNotNull(
      this.worldSystem,
      "World system must be initialized"
    );
    const campSystem = assertNotNull(
      this.campSystem,
      "Camp system must be initialized"
    );

    const worldDimensions = worldSystem.getWorldDimensions();
    const margin = 100;

    // Create camps at strategic positions
    const campPositions = [
      { x: margin, y: margin, size: BuildingSize.SMALL },
      {
        x: worldDimensions.width - margin,
        y: margin,
        size: BuildingSize.MEDIUM,
      },
      {
        x: margin,
        y: worldDimensions.height - margin,
        size: BuildingSize.MEDIUM,
      },
      {
        x: worldDimensions.width - margin,
        y: worldDimensions.height - margin,
        size: BuildingSize.LARGE,
      },
    ];

    // Create camps and store them in the registry
    const camps: CampBuilding[] = campPositions.map(({ x, y, size }) => {
      const camp = campSystem.createCamp(x, y, size);
      // Add camp to collision system and static layer
      if (this.collisionSystem) {
        this.collisionSystem.registerCamp(camp);
      }
      if (this.performanceOptimizer) {
        this.performanceOptimizer.addToStaticLayer("terrain", camp.getSprite());
      }
      return camp;
    });

    this.registry.set("camps", camps);

    // Set up listeners for camp state changes to keep registry updated
    camps.forEach((camp: CampBuilding) => {
      const stateChangeCallback = () => {
        this.registry.set("camps", camps);
      };
      camp.on("stateChanged", stateChangeCallback);
      this.campStateChangeCallbacks.set(camp, stateChangeCallback);
    });
  }

  private setupEventHandlers(): void {
    // Handle soul collection
    this.events.on(GameEvents.SOUL_COLLECTED, (soul: Soul) => {
      const gameState = assertNotNull(
        this.gameState,
        "Game state must be initialized"
      );
      gameState.souls += soul.getValue();
    });

    // Handle player damage
    this.events.on(GameEvents.PLAYER_DAMAGED, (damage: number) => {
      const player = assertNotNull(this.player, "Player must be initialized");
      player.takeDamage(damage);
    });

    // Handle mode changes
    this.events.on(GameEvents.MODE_CHANGED, (mode: string) => {
      const gameState = assertNotNull(
        this.gameState,
        "Game state must be initialized"
      );
      gameState.mode = mode;
    });

    // Handle gold changes
    this.events.on(GameEvents.GOLD_CHANGED, (amount: number) => {
      const gameState = assertNotNull(
        this.gameState,
        "Game state must be initialized"
      );
      gameState.gold += amount;
    });

    // Handle camp destruction
    this.events.on(GameEvents.CAMP_DESTROYED, (camp: CampBuilding) => {
      const waveManager = assertNotNull(
        this.waveManager,
        "Wave manager must be initialized"
      );
      const campStatus = {
        id: camp.getId(),
        position: { x: camp.getSprite().x, y: camp.getSprite().y },
        isSpawning: false,
        isQuestTarget: camp.isQuestTargetState(),
        isDestroyed: true,
        isCooperating: false,
      };
      waveManager.addCamp(campStatus);
    });

    // Handle player interaction with camps
    this.events.on("playerInteractWithCamp", (camp: any) => {
      const campSystem = assertNotNull(
        this.campSystem,
        "Camp system must be initialized"
      );
      campSystem.showDiplomatMenu(camp);
    });

    // Handle wave system events
    this.events.on(GameEvents.CAMP_COOPERATING, (camp: CampBuilding) => {
      const waveManager = assertNotNull(
        this.waveManager,
        "Wave manager must be initialized"
      );
      waveManager.startWave(camp.getId());
    });

    this.events.on(GameEvents.WAVE_START, () => {
      // Switch to combat state when wave starts
      this.events.emit(GameEvents.GAME_STATE_CHANGED, "combat");
    });

    this.events.on(GameEvents.WAVE_END, () => {
      // Return to exploration state when wave ends
      this.events.emit(GameEvents.GAME_STATE_CHANGED, "exploration");
    });

    // TODO: Connect audio system with game events
    // Audio triggers should be added for all major game events
  }

  private setupAudioEventHandlers(): void {
    // Combat sounds
    this.events.on(GameEvents.PLAYER_SHOOT, () => {
      this.audioManager.playSound("shoot");
    });

    this.events.on(GameEvents.ENEMY_DAMAGED, () => {
      this.audioManager.playSound("hit");
    });

    this.events.on(GameEvents.ENEMY_DEATH, () => {
      this.audioManager.playSound("death");
    });

    // Building sounds
    this.events.on(GameEvents.UI_TOWER_PLACED, () => {
      this.audioManager.playSound("build");
    });

    this.events.on(GameEvents.SOUL_COLLECTED, () => {
      this.audioManager.playSound("collect");
    });

    // Wave sounds
    this.events.on(GameEvents.WAVE_START, () => {
      this.audioManager.playSound("wave_start");
      // Switch to combat state when wave starts
      this.events.emit(GameEvents.GAME_STATE_CHANGED, "combat");
    });

    this.events.on(GameEvents.WAVE_END, () => {
      // Return to exploration state when wave ends
      this.events.emit(GameEvents.GAME_STATE_CHANGED, "exploration");
    });

    // Diplomacy sounds
    this.events.on(GameEvents.CAMP_COOPERATING, () => {
      this.events.emit(GameEvents.GAME_STATE_CHANGED, "diplomacy");
    });

    this.events.on(GameEvents.QUEST_COMPLETED, () => {
      this.audioManager.playSound("success");
      // Return to exploration state after diplomacy
      this.events.emit(GameEvents.GAME_STATE_CHANGED, "exploration");
    });

    // UI sounds
    this.events.on("buttonHover", () => {
      this.audioManager.playSound("ui_hover");
    });

    this.events.on("buttonClick", () => {
      this.audioManager.playSound("ui_click");
    });

    // Victory/Defeat sounds
    this.events.on(GameEvents.GAME_VICTORY, () => {
      this.events.emit(GameEvents.GAME_STATE_CHANGED, "victory");
    });

    this.events.on(GameEvents.GAME_DEFEAT, () => {
      this.events.emit(GameEvents.GAME_STATE_CHANGED, "defeat");
    });
  }

  private setupOnboarding(): void {
    // Create container for onboarding elements
    const onboardingContainer = this.add.container(0, 0);
    onboardingContainer.setDepth(1000); // Above game elements

    // Create semi-transparent background for tips
    const tipBg = this.add.rectangle(10, 10, 300, 80, 0x000000, 0.7);
    tipBg.setOrigin(0);
    onboardingContainer.add(tipBg);

    // Create tip text
    const tipText = this.add.text(20, 20, "", {
      fontSize: "16px",
      color: "#ffffff",
      wordWrap: { width: 280 },
    });
    onboardingContainer.add(tipText);

    // Track player actions for contextual tips
    let hasMovedWASD = false;
    let hasShot = false;
    let hasApproachedCamp = false;
    let hasEnteredBuildMode = false;

    // Listen for player movement
    this.input.keyboard?.on("keydown-W", () => {
      hasMovedWASD = true;
    });
    this.input.keyboard?.on("keydown-A", () => {
      hasMovedWASD = true;
    });
    this.input.keyboard?.on("keydown-S", () => {
      hasMovedWASD = true;
    });
    this.input.keyboard?.on("keydown-D", () => {
      hasMovedWASD = true;
    });

    // Listen for shooting
    this.input.on("pointerdown", () => {
      hasShot = true;
    });

    // Listen for build mode
    this.input.keyboard?.on("keydown-F", () => {
      hasEnteredBuildMode = true;
    });

    // Update tips based on player actions
    this.time.addEvent({
      delay: 100,
      callback: () => {
        if (!hasMovedWASD) {
          tipText.setText("Use WASD keys to move around");
        } else if (!hasShot) {
          tipText.setText("Left-click to shoot at enemies");
        } else if (!hasApproachedCamp) {
          tipText.setText("Approach a camp to interact with it");
          // Check if player is near a camp
          if (this.campSystem?.isPlayerNearCamp()) {
            hasApproachedCamp = true;
          }
        } else if (!hasEnteredBuildMode) {
          tipText.setText("Press F to enter build mode and place towers");
        } else {
          // Hide tips when all basic actions are completed
          onboardingContainer.setVisible(false);
        }
      },
      loop: true,
    });

    // Add help button
    const helpButton = this.add
      .text(this.scale.width - 20, 20, "?", {
        fontSize: "32px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 15, y: 10 },
      })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true })
      .setDepth(1000);

    // Show help overlay when clicked
    helpButton.on("pointerdown", () => {
      const helpOverlay = this.add.container(0, 0);
      helpOverlay.setDepth(2000);

      // Add semi-transparent background
      const bg = this.add.rectangle(
        0,
        0,
        this.scale.width,
        this.scale.height,
        0x000000,
        0.8
      );
      bg.setOrigin(0);
      helpOverlay.add(bg);

      // Add help content
      const content = [
        "Controls:",
        "- WASD: Move",
        "- Left Click: Shoot",
        "- F: Build Mode",
        "- ESC: Menu",
        "",
        "Tips:",
        "- Use diplomacy to turn camps into allies",
        "- Build towers to defend against waves",
        "- Collect souls from defeated enemies",
        "- Complete quests to progress",
      ];

      const helpText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2,
        content,
        {
          fontSize: "24px",
          color: "#ffffff",
          align: "left",
          lineSpacing: 10,
        }
      );
      helpText.setOrigin(0.5);
      helpOverlay.add(helpText);

      // Add close button
      const closeButton = this.add
        .text(this.scale.width - 20, 20, "X", {
          fontSize: "32px",
          color: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 15, y: 10 },
        })
        .setOrigin(1, 0)
        .setInteractive({ useHandCursor: true });

      closeButton.on("pointerdown", () => {
        helpOverlay.destroy();
      });

      helpOverlay.add(closeButton);
    });
  }

  public update(time: number, delta: number): void {
    // Update player
    if (this.player) {
      this.player.update(time, delta);
    }

    // Update collision system
    if (this.collisionSystem) {
      this.collisionSystem.update(time, delta);
    }

    // Update camp system
    if (this.campSystem) {
      this.campSystem.update(time, delta);
    }

    // Update wave manager
    if (this.waveManager) {
      this.waveManager.update(time, delta);
    }

    // Update performance optimizer
    if (this.performanceOptimizer) {
      this.performanceOptimizer.update();
    }

    // TODO: Add game state transitions based on game conditions
    // E.g., switch to combat mode when enemies nearby, diplomacy mode near camps

    // TODO: Implement transition to king chamber when all camps are handled
    // Currently no auto-transition to king chamber when conditions are met
  }

  public shutdown(): void {
    // Clean up systems
    if (this.inputSystem) {
      this.inputSystem.destroy();
      this.inputSystem = null;
    }

    if (this.worldSystem) {
      this.worldSystem.destroy();
      this.worldSystem = null;
    }

    if (this.collisionSystem) {
      this.collisionSystem.destroy();
      this.collisionSystem = null;
    }

    if (this.campSystem) {
      this.campSystem.destroy();
      this.campSystem = null;
    }

    if (this.performanceOptimizer) {
      this.performanceOptimizer.destroy();
      this.performanceOptimizer = null;
    }

    // Clean up player
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }

    // Clean up event handlers
    this.events.off(GameEvents.SOUL_COLLECTED);
    this.events.off(GameEvents.PLAYER_DAMAGED);
    this.events.off(GameEvents.MODE_CHANGED);
    this.events.off(GameEvents.GOLD_CHANGED);
    this.events.off(GameEvents.CAMP_DESTROYED);
    this.events.off("playerInteractWithCamp");

    // TODO: Save game state to enable game continuation
    // Currently game state is lost when scene shuts down
  }

  public destroy(): void {
    // Clean up wave manager
    if (this.waveManager) {
      this.waveManager.destroy();
      this.waveManager = null;
    }

    // Clean up event handlers
    this.events.off(GameEvents.PLAYER_SHOOT);
    this.events.off(GameEvents.ENEMY_DAMAGED);
    this.events.off(GameEvents.ENEMY_DEATH);
    this.events.off(GameEvents.UI_TOWER_PLACED);
    this.events.off(GameEvents.SOUL_COLLECTED);
    this.events.off(GameEvents.WAVE_START);
    this.events.off(GameEvents.WAVE_END);
    this.events.off(GameEvents.CAMP_COOPERATING);
    this.events.off(GameEvents.QUEST_COMPLETED);
    this.events.off("buttonHover");
    this.events.off("buttonClick");
    this.events.off(GameEvents.GAME_VICTORY);
    this.events.off(GameEvents.GAME_DEFEAT);

    // Clean up systems
    if (this.campSystem) {
      this.campSystem.destroy();
    }
    this.audioManager.destroy();

    // Clean up camp listeners
    const camps = this.registry.get("camps") as CampBuilding[];
    if (camps) {
      camps.forEach((camp) => {
        const callback = this.campStateChangeCallbacks.get(camp);
        if (callback) {
          camp.off("stateChanged", callback);
          this.campStateChangeCallbacks.delete(camp);
        }
      });
    }
    this.registry.remove("camps");
  }
}
