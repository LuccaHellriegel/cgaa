import { Scene } from "phaser";
import { Player } from "../components/Player";
import { InputSystem } from "./game/systems/InputSystem";
import { WorldSystem } from "./game/systems/WorldSystem";
import { CollisionSystem } from "./game/systems/CollisionSystem";
import { CampSystem } from "./game/systems/CampSystem";
import { GameState } from "../controllers/GameController";
import { GameEvents } from "../events/GameEvents";
import { Soul } from "../components/Soul";
import { assert } from "../utils/assert";
import { BuildingSize } from "../components/CampBuilding";
import { PerformanceOptimizer } from "../systems/PerformanceOptimizer";

export class Game extends Scene {
  private player: Player | null = null;
  private inputSystem: InputSystem | null = null;
  private worldSystem: WorldSystem | null = null;
  private collisionSystem: CollisionSystem | null = null;
  private campSystem: CampSystem | null = null;
  private performanceOptimizer: PerformanceOptimizer | null = null;
  private gameState: GameState | null = null;

  constructor() {
    super({ key: "Game" });
  }

  public init(data: { gameState: GameState }): void {
    assert(data.gameState !== undefined, "Game state must be provided");
    this.gameState = data.gameState;
  }

  public create(): void {
    assert(this.gameState !== null, "Game state must be initialized");

    // Initialize systems
    this.worldSystem = new WorldSystem(this);
    assert(this.worldSystem !== null, "World system must be initialized");

    this.inputSystem = new InputSystem(this);
    assert(this.inputSystem !== null, "Input system must be initialized");

    this.collisionSystem = new CollisionSystem(this);
    assert(
      this.collisionSystem !== null,
      "Collision system must be initialized"
    );

    this.campSystem = new CampSystem(this);
    assert(this.campSystem !== null, "Camp system must be initialized");

    this.performanceOptimizer = new PerformanceOptimizer(this);
    assert(
      this.performanceOptimizer !== null,
      "Performance optimizer must be initialized"
    );

    // Create player
    this.player = new Player(this);
    assert(this.player !== null, "Player must be initialized");

    const worldCenter = this.worldSystem.getWorldDimensions();
    this.player.setPosition(worldCenter.width / 2, worldCenter.height / 2);

    // Set game state in registry for other systems
    this.registry.set("gameState", this.gameState);

    // Set WASD keys in registry for player movement
    const wasdKeys = this.inputSystem.getWASDKeys();
    this.registry.set("wasdKeys", wasdKeys);

    // Create initial camps
    this.createInitialCamps();

    // Emit player ready event for systems to register
    this.events.emit(GameEvents.PLAYER_READY, this.player);

    // Setup event handlers
    this.setupEventHandlers();

    // Optimize static content after everything is created
    if (this.performanceOptimizer) {
      this.performanceOptimizer.optimizeStaticContent();
    }

    // TODO: Implement wave system initialization and integration
    // Need to connect wave system with camps and spawn enemies properly

    // TODO: Add tutorial and onboarding elements
    // New players need guidance on controls and game mechanics
  }

  private createInitialCamps(): void {
    assert(this.worldSystem !== null, "World system must be initialized");
    assert(this.campSystem !== null, "Camp system must be initialized");

    const worldDimensions = this.worldSystem.getWorldDimensions();
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

    campPositions.forEach(({ x, y, size }) => {
      const camp = this.campSystem!.createCamp(x, y, size);
      // Add camp to collision system and static layer
      if (this.collisionSystem) {
        this.collisionSystem.registerCamp(camp);
      }
      if (this.performanceOptimizer) {
        this.performanceOptimizer.addToStaticLayer("terrain", camp.getSprite());
      }
    });

    // TODO: Store camps list in registry for access in KingChamber scene
    // Currently camp data doesn't persist between scenes
  }

  private setupEventHandlers(): void {
    // Handle soul collection
    this.events.on(GameEvents.SOUL_COLLECTED, (soul: Soul) => {
      if (this.gameState) {
        this.gameState.souls += soul.getValue();
      }
    });

    // Handle player damage
    this.events.on(GameEvents.PLAYER_DAMAGED, (damage: number) => {
      if (this.player) {
        this.player.takeDamage(damage);
      }
    });

    // Handle mode changes
    this.events.on(GameEvents.MODE_CHANGED, (mode: string) => {
      if (this.gameState) {
        this.gameState.mode = mode;
      }
    });

    // Handle gold changes
    this.events.on(GameEvents.GOLD_CHANGED, (amount: number) => {
      if (this.gameState) {
        this.gameState.gold += amount;
      }
    });

    // Handle camp destruction
    this.events.on(GameEvents.CAMP_DESTROYED, (camp: any) => {
      if (this.campSystem) {
        this.campSystem.handleCampDestruction(camp);
      }
    });

    // Handle player interaction with camps
    this.events.on("playerInteractWithCamp", (camp: any) => {
      if (this.campSystem) {
        this.campSystem.showDiplomatMenu(camp);
      }
    });

    // TODO: Add event handlers for wave system integration
    // Need to handle wave start, enemy spawning, and wave completion

    // TODO: Connect audio system with game events
    // Audio triggers should be added for all major game events
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
}
