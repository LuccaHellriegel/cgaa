import { Scene } from "phaser";
import { GameState } from "../controllers/GameController";
import { TowerType } from "../types/TowerTypes";

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
  private menuBackground: Phaser.GameObjects.Rectangle;

  constructor(scene: Scene) {
    this.scene = scene;

    // Create container at the bottom center of the screen
    this.container = this.scene.add.container(
      this.scene.scale.width / 2,
      this.scene.scale.height - 80
    );

    // Add semi-transparent background
    const menuWidth = 400;
    const menuHeight = 60;
    this.menuBackground = this.scene.add.rectangle(
      0,
      0,
      menuWidth,
      menuHeight,
      0x000000,
      0.7
    );
    this.container.add(this.menuBackground);

    // Add title text
    const titleText = this.scene.add.text(-180, -25, "Build Towers:", {
      fontSize: "16px",
      color: "#ffffff",
      fontFamily: "Arial",
    });
    this.container.add(titleText);

    // Create tower buttons
    this.towerOptions.forEach((tower, index) => {
      const button = this.createTowerButton(tower, index);
      this.towerButtons.push(button);
      this.container.add(button);
    });
  }

  private createTowerButton(
    tower: { type: TowerType; cost: number },
    index: number
  ): Phaser.GameObjects.Container {
    const buttonWidth = 100;
    const buttonHeight = 40;
    const padding = 10;
    const x = -120 + (buttonWidth + padding) * index;
    const y = 0;

    // Create button container
    const button = this.scene.add.container(x, y);

    // Add button background with border
    const buttonBg = this.scene.add.rectangle(
      0,
      0,
      buttonWidth,
      buttonHeight,
      0x444444
    );
    buttonBg.setStrokeStyle(2, 0x666666);
    button.add(buttonBg);

    // Add tower name text
    const nameText = this.scene.add.text(0, -8, tower.type, {
      fontSize: "14px",
      color: "#ffffff",
      fontFamily: "Arial",
    });
    nameText.setOrigin(0.5);
    button.add(nameText);

    // Add cost text
    const costText = this.scene.add.text(0, 8, `${tower.cost} souls`, {
      fontSize: "12px",
      color: "#ffff00",
      fontFamily: "Arial",
    });
    costText.setOrigin(0.5);
    button.add(costText);

    // Make button interactive
    buttonBg.setInteractive({ useHandCursor: true });

    // Add hover effects
    buttonBg.on("pointerover", () => {
      buttonBg.setFillStyle(0x666666);
      buttonBg.setStrokeStyle(2, 0x888888);
      this.scene.registry.get("audioManager")?.playSound("ui_hover");
    });

    buttonBg.on("pointerout", () => {
      buttonBg.setFillStyle(0x444444);
      buttonBg.setStrokeStyle(2, 0x666666);
    });

    buttonBg.on("pointerdown", () => {
      this.handleButtonClick(tower.type);
      this.scene.registry.get("audioManager")?.playSound("ui_click");
    });

    return button;
  }

  public updateState(state: GameState): void {
    this.container.setVisible(state.showBuildMenu);

    // Update button states based on affordability and selection
    this.towerOptions.forEach((tower, index) => {
      const button = this.towerButtons[index];
      if (!button || !button.list || button.list.length < 4) return;

      const buttonBg = button.list[0] as Phaser.GameObjects.Rectangle;
      const nameText = button.list[1] as Phaser.GameObjects.Text;
      const costText = button.list[2] as Phaser.GameObjects.Text;

      const canAfford = state.souls >= tower.cost;
      const isSelected = this.selectedTower === tower.type;

      // Update button appearance based on state
      if (isSelected) {
        buttonBg.setFillStyle(0x00ff00, 0.5);
        buttonBg.setStrokeStyle(2, 0x00ff00);
      } else if (!canAfford) {
        buttonBg.setFillStyle(0x444444, 0.5);
        buttonBg.setStrokeStyle(2, 0x666666);
        nameText.setTint(0x666666);
        costText.setTint(0x666666);
      } else {
        buttonBg.setFillStyle(0x444444);
        buttonBg.setStrokeStyle(2, 0x666666);
        nameText.setTint(0xffffff);
        costText.setTint(0xffff00);
      }
    });
  }

  private handleButtonClick(tower: TowerType): void {
    // Toggle selection
    this.selectedTower = this.selectedTower === tower ? null : tower;
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
