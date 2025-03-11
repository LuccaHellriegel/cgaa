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
    this.modeText = this.scene.add.text(10, 10, "Mode: Attack", {
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { x: 5, y: 5 },
    });
    this.modeText.setScrollFactor(0);
    this.modeText.setDepth(100);
  }

  private toggleMode(): void {
    this.state.currentMode =
      this.state.currentMode === GameMode.ATTACK
        ? GameMode.INTERACTION
        : GameMode.ATTACK;

    this.updateModeIndicator();
  }

  private updateModeIndicator(): void {
    const modeText =
      this.state.currentMode === GameMode.ATTACK ? "Attack" : "Interaction";
    this.modeText.setText(`Mode: ${modeText}`);
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
    this.modeText.destroy();
    // Clean up any event listeners
    this.scene.input.keyboard?.off("keydown-F");
    this.scene.input.off("pointerdown");
  }
}
