import { Scene } from "phaser";

export enum GameMode {
  ATTACK = "attack",
  INTERACTION = "interaction",
}

export interface UIState {
  currentMode: GameMode;
  souls: number;
  selectedTower: string | null;
  showBuildMenu: boolean;
  showTowerMenu: boolean;
  showDiplomatMenu: boolean;
}

export class UIController {
  private scene: Scene;
  private state: UIState;
  private modeText: Phaser.GameObjects.Text;

  constructor(scene: Scene) {
    this.scene = scene;
    this.state = {
      currentMode: GameMode.ATTACK,
      souls: 0,
      selectedTower: null,
      showBuildMenu: false,
      showTowerMenu: false,
      showDiplomatMenu: false,
    };

    this.setupControls();
    this.createModeIndicator();
  }

  private setupControls(): void {
    // Mode switching with F key
    this.scene.input.keyboard?.on("keydown-F", () => {
      this.toggleMode();
    });

    // Mouse click handling
    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.handleClick(pointer);
    });
  }

  private createModeIndicator(): void {
    const padding = { x: 10, y: 8 };
    const fontSize = "16px";

    // Create container for mode indicator
    const container = this.scene.add.container(
      150,
      this.scene.scale.height - 60
    );
    container.setDepth(100);
    container.setScrollFactor(0);

    // Create background
    const background = this.scene.add.rectangle(0, 0, 240, 40, 0x000000, 0.7);
    background.setStrokeStyle(1, 0xffffff);
    container.add(background);

    // Create mode text
    this.modeText = this.scene.add.text(
      padding.x - background.width / 2,
      -15,
      "",
      {
        fontSize,
        fontStyle: "bold",
        color: "#ffffff",
        padding,
      }
    );
    container.add(this.modeText);

    // Listen for screen resize
    this.scene.scale.on("resize", () => {
      container.setPosition(150, this.scene.scale.height - 60);
    });

    this.updateModeIndicator();
  }

  private toggleMode(): void {
    const audioManager = this.scene.registry.get("audioManager");
    if (audioManager) {
      audioManager.playSound("ui_click");
    }

    this.state.currentMode =
      this.state.currentMode === GameMode.ATTACK
        ? GameMode.INTERACTION
        : GameMode.ATTACK;

    // Update build menu visibility based on current mode
    this.state.showBuildMenu = this.state.currentMode === GameMode.INTERACTION;

    this.updateModeIndicator();
    // Emit an event to notify other components about the mode change
    this.scene.events.emit("modeChanged", this.state.currentMode);
  }

  private updateModeIndicator(): void {
    const currentMode =
      this.state.currentMode === GameMode.ATTACK ? "ATTACK" : "BUILD";
    const altMode =
      this.state.currentMode === GameMode.ATTACK ? "BUILD" : "ATTACK";
    const key = "F";

    this.modeText.setText(
      `Current: ${currentMode} MODE\n` + `Press [${key}] for ${altMode} MODE`
    );

    // Update text color based on mode
    this.modeText.setColor(
      this.state.currentMode === GameMode.ATTACK ? "#ff4444" : "#44ff44"
    );
  }

  private handleClick(pointer: Phaser.Input.Pointer): void {
    const worldPoint = this.scene.cameras.main.getWorldPoint(
      pointer.x,
      pointer.y
    );

    if (this.state.currentMode === GameMode.ATTACK) {
      this.handleAttackModeClick(worldPoint);
    } else {
      this.handleInteractionModeClick(worldPoint);
    }
  }

  private handleAttackModeClick(worldPoint: Phaser.Math.Vector2): void {
    // Emit attack event for the Game scene to handle
    this.scene.events.emit("playerAttack", worldPoint);
  }

  private handleInteractionModeClick(worldPoint: Phaser.Math.Vector2): void {
    if (this.state.showBuildMenu) {
      // Handle tower selection from build menu
      // This will be implemented when we create the BuildMenu
      return;
    }

    // Emit interaction event for the Game scene to handle
    this.scene.events.emit("playerInteract", worldPoint);
  }

  public updateSouls(amount: number): void {
    this.state.souls = amount;
    this.scene.events.emit("soulsUpdated", amount);
  }

  public getState(): UIState {
    return { ...this.state };
  }

  public getCurrentMode(): GameMode {
    return this.state.currentMode;
  }

  public destroy(): void {
    // Clean up UI elements
    this.modeText.destroy();

    // Clean up keyboard event listeners
    this.scene.input.keyboard?.off("keydown-F");

    // Clean up mouse event listeners
    this.scene.input.off("pointerdown");

    // Clean up any scene event listeners
    this.scene.events.off("soulsUpdated");
    this.scene.events.off("modeChanged");
    this.scene.scale.off("resize");

    // Reset state
    this.state = {
      currentMode: GameMode.ATTACK,
      souls: 0,
      selectedTower: null,
      showBuildMenu: false,
      showTowerMenu: false,
      showDiplomatMenu: false,
    };
  }
}
