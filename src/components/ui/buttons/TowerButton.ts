import { Scene } from "phaser";
import { TowerType, TOWER_CONFIGS } from "../../Tower";
import { assert } from "../../../utils/assert";

interface TowerButtonConfig {
  type: TowerType;
  cost: number;
}

export class TowerButton extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private isSelected: boolean = false;
  private config: TowerButtonConfig;

  constructor(scene: Scene, x: number, y: number, type: TowerType) {
    super(scene, x, y);
    scene.add.existing(this);

    assert(scene instanceof Scene, "Scene must be a valid Phaser.Scene");
    assert(typeof x === "number", "X must be a number");
    assert(typeof y === "number", "Y must be a number");
    assert(Object.values(TowerType).includes(type), "Invalid tower type");

    this.config = {
      type,
      cost: TOWER_CONFIGS[type].cost,
    };

    // Create background
    this.background = scene.add.rectangle(0, 0, 60, 60, 0x333333);
    this.add(this.background);

    // Make interactive
    this.background.setInteractive();
    this.background.on("pointerdown", this.handleClick, this);
  }

  private handleClick(): void {
    this.isSelected = !this.isSelected;
    this.background.setFillStyle(this.isSelected ? 0x666666 : 0x333333);
    this.scene.events.emit(
      this.isSelected ? "tower-selected" : "tower-deselected",
      this.config.type
    );
  }

  public destroy(): void {
    this.background.off("pointerdown", this.handleClick, this);
    super.destroy();
  }
}
