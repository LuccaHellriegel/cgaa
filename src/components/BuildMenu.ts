import { Scene } from "phaser";
import { GameState } from "../controllers/GameController";
import { TowerType, TowerConfig, TOWER_CONFIGS } from "../components/Tower";

export class BuildMenu {
  private scene: Scene;
  private container: Phaser.GameObjects.Container;
  private towerButtons: Phaser.GameObjects.Container[] = [];
  private towerOptions: TowerConfig[] = [
    TOWER_CONFIGS[TowerType.SHOOTER],
    TOWER_CONFIGS[TowerType.HEALER],
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
    tower: TowerConfig,
    index: number
  ): Phaser.GameObjects.Container {
    const buttonWidth = 180;
    const buttonHeight = 60;
    const padding = 10;
    const x = 10;
    const y = 10 + index * (buttonHeight + padding);

    const button = this.scene.add.container(x, y);

    // Button background
    const background = this.scene.add.rectangle(
      0,
      0,
      buttonWidth,
      buttonHeight,
      0x444444,
      0.8
    );
    background.setStrokeStyle(2, 0x666666);
    button.add(background);

    // Tower icon (circle with distinctive features based on type)
    const icon = this.scene.add.container(-buttonWidth / 2 + 30, 0);
    const iconCircle = this.scene.add.circle(0, 0, 15);

    switch (tower.type) {
      case TowerType.SHOOTER:
        iconCircle.setFillStyle(0xff0000);
        const barrel = this.scene.add.rectangle(15, 0, 10, 4, 0x000000);
        icon.add([iconCircle, barrel]);
        break;
      case TowerType.HEALER:
        iconCircle.setFillStyle(0x00ff00);
        const cross = this.scene.add.graphics();
        cross.lineStyle(2, 0xffffff);
        cross.moveTo(-5, 0);
        cross.lineTo(5, 0);
        cross.moveTo(0, -5);
        cross.lineTo(0, 5);
        icon.add([iconCircle, cross]);
        break;
    }
    button.add(icon);

    // Tower name
    const nameText = this.scene.add.text(-buttonWidth / 4, -15, tower.type, {
      fontSize: "16px",
      color: "#ffffff",
    });
    button.add(nameText);

    // Tower cost
    const costText = this.scene.add.text(
      -buttonWidth / 4,
      5,
      `${tower.cost} souls`,
      {
        fontSize: "14px",
        color: "#ffff00",
      }
    );
    button.add(costText);

    // Stats preview (on hover)
    const statsContainer = this.scene.add.container(buttonWidth + 10, 0);
    statsContainer.setVisible(false);

    const statsBox = this.scene.add.rectangle(0, 0, 150, 100, 0x000000, 0.9);
    statsBox.setStrokeStyle(1, 0xffffff);

    const statsText = this.scene.add.text(
      -70,
      -45,
      `Damage: ${tower.damage}\n` +
        `Range: ${tower.range}\n` +
        `Rate: ${tower.fireRate / 1000}/s\n` +
        `Type: ${tower.type}`,
      {
        fontSize: "12px",
        color: "#ffffff",
      }
    );

    statsContainer.add([statsBox, statsText]);
    button.add(statsContainer);

    // Hover effects
    background
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        background.setFillStyle(0x666666);
        statsContainer.setVisible(true);
      })
      .on("pointerout", () => {
        if (this.selectedTower !== tower.type) {
          background.setFillStyle(0x444444);
        }
        statsContainer.setVisible(false);
      })
      .on("pointerdown", () => {
        this.selectTower(tower.type);
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
      const icon = button.list[1] as Phaser.GameObjects.Container;
      const nameText = button.list[2] as Phaser.GameObjects.Text;
      const costText = button.list[3] as Phaser.GameObjects.Text;

      const canAfford = state.souls >= tower.cost;
      const isSelected = this.selectedTower === tower.type;

      // Update button appearance based on state
      if (isSelected) {
        buttonBg.setFillStyle(0x00ff00, 0.5);
        buttonBg.setStrokeStyle(2, 0x00ff00);
        icon.setAlpha(1);
      } else if (!canAfford) {
        buttonBg.setFillStyle(0x444444, 0.5);
        buttonBg.setStrokeStyle(2, 0x666666);
        nameText.setTint(0x666666);
        costText.setTint(0x666666);
        icon.setAlpha(0.5);
      } else {
        buttonBg.setFillStyle(0x444444);
        buttonBg.setStrokeStyle(2, 0x666666);
        nameText.setTint(0xffffff);
        costText.setTint(0xffff00);
        icon.setAlpha(1);
      }
    });
  }

  private selectTower(tower: TowerType): void {
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
