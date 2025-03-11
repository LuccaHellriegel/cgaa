import { Scene } from "phaser";
import { GameState } from "../controllers/GameController";
import { TowerType, TowerTypes } from "../types/TowerTypes";

export class BuildMenu {
  private scene: Scene;
  private container: Phaser.GameObjects.Container;
  private towerButtons: Phaser.GameObjects.Container[] = [];
  private towerOptions: { type: TowerType; cost: number }[] = [
    { type: "basic", cost: 50 },
    { type: "splash", cost: 100 },
    { type: "sniper", cost: 150 },
  ];
  private selectedTower: TowerType | null = null;

  constructor(scene: Scene) {
    this.scene = scene;
    this.container = this.scene.add.container(10, this.scene.scale.height - 60);

    this.towerOptions.forEach((tower, index) => {
      const button = this.createTowerButton(tower.type, index);
      this.towerButtons.push(button);
      this.container.add(button);
    });
  }

  private createTowerButton(
    tower: TowerType,
    index: number
  ): Phaser.GameObjects.Container {
    const buttonWidth = 100;
    const buttonHeight = 40;
    const padding = 10;
    const x = (buttonWidth + padding) * index;
    const y = 0;

    const buttonBg = this.scene.add.rectangle(
      0,
      0,
      buttonWidth,
      buttonHeight,
      0x333333
    );
    const buttonText = this.scene.add.text(0, 0, tower, {
      fontSize: "16px",
      color: "#ffffff",
    });
    buttonText.setOrigin(0.5);

    const button = this.scene.add.container(x, y, [buttonBg, buttonText]);
    buttonBg.setInteractive({ useHandCursor: true });

    buttonBg.on("pointerover", () => {
      buttonBg.setFillStyle(0x444444);
    });

    buttonBg.on("pointerout", () => {
      buttonBg.setFillStyle(0x333333);
    });

    buttonBg.on("pointerdown", () => {
      this.handleButtonClick(tower);
    });

    return button;
  }

  public updateState(state: GameState): void {
    this.container.setVisible(state.showBuildMenu);

    // Update button states based on affordability
    this.towerOptions.forEach((tower, index) => {
      const button = this.towerButtons[index];
      if (!button || !button.list || button.list.length < 2) return;

      const buttonBg = button.list[0] as Phaser.GameObjects.Rectangle;
      const buttonText = button.list[1] as Phaser.GameObjects.Text;

      const canAfford = state.souls >= tower.cost;
      buttonBg.setFillStyle(canAfford ? 0x333333 : 0x222222);
      buttonText.setTint(canAfford ? 0xffffff : 0x666666);
    });
  }

  private handleButtonClick(tower: TowerType): void {
    this.selectedTower = tower;
    this.scene.events.emit("towerSelected", tower);
  }

  public getSelectedTower(): TowerType | null {
    return this.selectedTower;
  }

  public clearSelection(): void {
    this.selectedTower = null;
  }

  public destroy(): void {
    this.container.destroy();
  }
}
