import { Scene, Input } from "phaser";
import { GameEvents } from "../../../events/GameEvents";

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

interface WASDKeys {
  W: Input.Keyboard.Key;
  A: Input.Keyboard.Key;
  S: Input.Keyboard.Key;
  D: Input.Keyboard.Key;
}

export class InputSystem {
  private scene: Scene;
  private wasdKeys: WASDKeys | null = null;
  private escKey: Input.Keyboard.Key | null = null;

  constructor(scene: Scene) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene", {
      providedType: typeof scene,
      isScene: scene instanceof Scene,
    });

    this.scene = scene;
    this.setupKeyboardInput();
    this.setupPointerInput();
  }

  private setupKeyboardInput(): void {
    assert(
      this.scene.input.keyboard !== null,
      "Scene must have keyboard input system",
      { sceneKey: this.scene.sys.settings.key }
    );

    const keyboard = this.scene.input.keyboard;

    // Setup WASD keys
    this.wasdKeys = {
      W: keyboard.addKey("W"),
      A: keyboard.addKey("A"),
      S: keyboard.addKey("S"),
      D: keyboard.addKey("D"),
    };

    // Setup ESC key
    this.escKey = keyboard.addKey("ESC");
    this.escKey.on("down", () => {
      this.scene.scene.start("MainMenu");
    });
  }

  private setupPointerInput(): void {
    assert(this.scene.input !== null, "Scene must have input system", {
      sceneKey: this.scene.sys.settings.key,
    });

    // Handle pointer down events
    this.scene.input.on("pointerdown", (pointer: Input.Pointer) => {
      this.handlePlayerInteraction(pointer);
    });

    // Handle pointer move events
    this.scene.input.on("pointermove", (pointer: Input.Pointer) => {
      if (pointer.isDown) {
        this.handlePlayerInteraction(pointer);
      }
    });
  }

  private handlePlayerInteraction(pointer: Input.Pointer): void {
    const gameState = this.scene.registry.get("gameState");
    if (!gameState) return;

    const worldPoint = pointer.positionToCamera(
      this.scene.cameras.main
    ) as Phaser.Math.Vector2;

    if (gameState.mode === "build") {
      this.scene.events.emit(GameEvents.TOWER_PLACED, worldPoint);
    } else {
      this.scene.events.emit(GameEvents.PLAYER_SHOOT, worldPoint);
    }
  }

  public getWASDKeys(): WASDKeys | null {
    return this.wasdKeys;
  }

  public destroy(): void {
    // Clean up keyboard inputs
    if (this.escKey) {
      this.escKey.destroy();
      this.escKey = null;
    }

    if (this.wasdKeys) {
      Object.values(this.wasdKeys).forEach((key) => key.destroy());
      this.wasdKeys = null;
    }

    // Clean up pointer inputs
    this.scene.input.off("pointerdown");
    this.scene.input.off("pointermove");
  }
}
