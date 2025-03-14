import { Scene } from "phaser";
import { TowerType, TOWER_CONFIGS } from "../../Tower";
import { TowerButton } from "../buttons/TowerButton";
import { assert } from "../../../utils/assert";

export class BuildMenu {
  private scene: Scene;
  private container: Phaser.GameObjects.Container;
  private menuBackground: Phaser.GameObjects.Rectangle;
  private towerButtons: Map<TowerType, TowerButton>;
  private selectedTowerType: TowerType | null = null;

  constructor(scene: Scene) {
    assert(scene instanceof Scene, "Must provide a valid Phaser Scene");

    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.towerButtons = new Map();

    this.createMenuBackground();
    this.createTowerButtons();
    this.setupEventListeners();
  }

  private createMenuBackground(): void {
    const { width } = this.scene.scale;
    this.menuBackground = this.scene.add.rectangle(
      width / 2,
      50,
      width,
      100,
      0x333333,
      0.8
    );
    this.container.add(this.menuBackground);
  }

  private createTowerButtons(): void {
    const startX = 100;
    const spacing = 80;
    const y = 50;

    Object.values(TowerType).forEach((type, index) => {
      const button = new TowerButton(
        this.scene,
        startX + index * spacing,
        y,
        type
      );
      this.towerButtons.set(type, button);
    });
  }

  private setupEventListeners(): void {
    // Listen for screen resize
    this.scene.scale.on("resize", this.updatePosition, this);

    // Listen for mode changes
    this.scene.events.on("mode-changed", (mode: string) => {
      if (mode !== "build") {
        this.selectedTowerType = null;
        this.updateTowerButtons();
      }
    });

    // Listen for tower selection
    this.scene.events.on("tower-selected", (type: TowerType) => {
      this.selectedTowerType = type;
      this.updateTowerButtons();
    });

    this.scene.events.on("tower-deselected", () => {
      this.selectedTowerType = null;
      this.updateTowerButtons();
    });
  }

  private updatePosition(): void {
    const { width } = this.scene.scale;
    this.menuBackground.setPosition(width / 2, 50);
  }

  private updateTowerButtons(): void {
    const state = this.scene.registry.get("gameState");
    if (!state) return;

    this.towerButtons.forEach((button, type) => {
      const config = TOWER_CONFIGS[type];
      const isSelected =
        state.mode === "build" && this.selectedTowerType === type;
      const canAfford = state.gold >= config.cost;

      button.setVisible(canAfford);
      button.setAlpha(isSelected ? 1 : 0.7);
    });
  }

  public destroy(): void {
    // Clean up event listeners
    this.scene.scale.off("resize", this.updatePosition, this);
    this.scene.events.off("mode-changed");
    this.scene.events.off("tower-selected");
    this.scene.events.off("tower-deselected");

    // Destroy buttons
    this.towerButtons.forEach((button) => button.destroy());
    this.towerButtons.clear();

    // Destroy container
    this.container.destroy();
  }
}
