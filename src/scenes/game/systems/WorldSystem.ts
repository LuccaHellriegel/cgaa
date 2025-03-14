import { Scene } from "phaser";
import { GameEvents } from "../../../events/GameEvents";
import { Player } from "../../../components/Player";

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

export class WorldSystem {
  private scene: Scene;
  private worldWidth: number;
  private worldHeight: number;

  constructor(scene: Scene) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene", {
      providedType: typeof scene,
      isScene: scene instanceof Scene,
    });

    this.scene = scene;
    this.worldWidth = scene.scale.width * 2;
    this.worldHeight = scene.scale.height * 2;

    this.setupWorld();
    this.setupCamera();
    this.setupResizeHandler();
  }

  private setupWorld(): void {
    assert(this.scene.physics !== undefined, "Scene must have physics system", {
      sceneKey: this.scene.sys.settings.key,
    });

    // Set world bounds
    this.scene.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
  }

  private setupCamera(): void {
    assert(this.scene.cameras !== undefined, "Scene must have camera system", {
      sceneKey: this.scene.sys.settings.key,
    });

    const mainCamera = this.scene.cameras.main;
    assert(mainCamera !== undefined, "Main camera must be defined");

    // Set camera bounds
    mainCamera.setBounds(0, 0, this.worldWidth, this.worldHeight);

    // Set up camera follow when player is ready
    this.scene.events.once(GameEvents.PLAYER_READY, (player: Player) => {
      assert(player !== undefined, "Player must be defined");
      mainCamera.startFollow(player.getSprite(), true);
    });
  }

  private setupResizeHandler(): void {
    assert(this.scene.scale !== undefined, "Scene must have scale manager", {
      sceneKey: this.scene.sys.settings.key,
    });

    this.scene.scale.on("resize", this.handleResize, this);
  }

  private handleResize(): void {
    // Update world dimensions
    this.worldWidth = this.scene.scale.width * 2;
    this.worldHeight = this.scene.scale.height * 2;

    assert(this.worldWidth > 0, "World width must be positive after resize", {
      width: this.worldWidth,
    });
    assert(this.worldHeight > 0, "World height must be positive after resize", {
      height: this.worldHeight,
    });

    // Update world bounds
    this.scene.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

    // Update camera bounds
    const mainCamera = this.scene.cameras.main;
    assert(mainCamera !== undefined, "Main camera must be defined");
    mainCamera.setBounds(0, 0, this.worldWidth, this.worldHeight);
  }

  public getWorldDimensions(): { width: number; height: number } {
    return {
      width: this.worldWidth,
      height: this.worldHeight,
    };
  }

  public destroy(): void {
    // Clean up event listeners
    this.scene.scale.off("resize", this.handleResize, this);
    this.scene.events.off(GameEvents.PLAYER_READY);
  }
}
