import { Scene } from "phaser";
import { Player } from "../components/Player";
import { InputSystem } from "./game/systems/InputSystem";
import { WorldSystem } from "./game/systems/WorldSystem";
import { CollisionSystem } from "./game/systems/CollisionSystem";
import { GameState } from "../controllers/GameController";
import { GameEvents } from "../events/GameEvents";
import { Soul } from "../components/Soul";

// Add assertion utility function
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

export class Game extends Scene {
  private player: Player | null = null;
  private inputSystem: InputSystem | null = null;
  private worldSystem: WorldSystem | null = null;
  private collisionSystem: CollisionSystem | null = null;
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

    // Emit player ready event for systems to register
    this.events.emit(GameEvents.PLAYER_READY, this.player);

    // Setup event handlers
    this.setupEventHandlers();
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
  }

  public update(): void {
    // Update player
    if (this.player) {
      this.player.update();
    }

    // Update collision system
    if (this.collisionSystem) {
      this.collisionSystem.update();
    }
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

    // Clean up registry
    this.registry.remove("gameState");
    this.registry.remove("wasdKeys");
  }
}
