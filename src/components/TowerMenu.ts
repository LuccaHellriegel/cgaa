import { Scene } from "phaser";
import { GameState } from "../controllers/GameController";
import { TowerType, TowerTypes, TOWER_UPGRADES } from "../types/TowerTypes";
import { GameEvents } from "../events/GameEvents";

export interface TowerData {
  name: string;
  damage: number;
  range: number;
  cost: number;
  key?: string;
  level?: number;
  attackSpeed?: number;
  sellValue?: number;
  position?: { x: number; y: number };
}

export class TowerMenu {
  private scene: Scene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Rectangle;
  private titleText: Phaser.GameObjects.Text;
  private statsText: Phaser.GameObjects.Text;
  private sellButton: Phaser.GameObjects.Container;
  private upgradeButton: Phaser.GameObjects.Container;
  private upgradePreviewText: Phaser.GameObjects.Text;
  private selectedTower: TowerType | null = null;
  private towerTypes: Record<TowerType, TowerData> = TowerTypes;

  constructor(scene: Scene) {
    this.scene = scene;

    this.container = this.scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(100);

    this.createBackground();
    this.createTitle();
    this.createStats();
    this.createUpgradePreview();
    this.createUpgradeButton();
    this.createSellButton();

    // Hide by default
    this.container.setVisible(false);
  }

  private createBackground(): void {
    const width = 200;
    const height = 300;
    this.background = this.scene.add.rectangle(
      0,
      0,
      width,
      height,
      0x000000,
      0.8
    );
    this.background.setOrigin(0, 0);
    this.container.add(this.background);
  }

  private createTitle(): void {
    this.titleText = this.scene.add.text(10, 10, "Tower Info", {
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold",
    });
    this.container.add(this.titleText);
  }

  private createStats(): void {
    this.statsText = this.scene.add.text(10, 40, "", {
      fontSize: "14px",
      color: "#ffffff",
      wordWrap: { width: 180 },
    });
    this.container.add(this.statsText);
  }

  private createUpgradePreview(): void {
    this.upgradePreviewText = this.scene.add.text(10, 120, "", {
      fontSize: "12px",
      color: "#00ff00",
      wordWrap: { width: 180 },
    });
    this.container.add(this.upgradePreviewText);
  }

  private createUpgradeButton(): void {
    const buttonContainer = this.scene.add.container(10, 160);

    // Button background
    const buttonBg = this.scene.add.rectangle(0, 0, 180, 40, 0x006600);
    buttonBg.setOrigin(0, 0);
    buttonBg.setInteractive({ useHandCursor: true });

    // Button text
    const buttonText = this.scene.add.text(90, 20, "Upgrade Tower", {
      fontSize: "16px",
      color: "#ffffff",
    });
    buttonText.setOrigin(0.5, 0.5);

    buttonContainer.add([buttonBg, buttonText]);
    this.container.add(buttonContainer);
    this.upgradeButton = buttonContainer;

    // Button events
    buttonBg.on("pointerover", () => {
      buttonBg.setFillStyle(0x008800);
    });

    buttonBg.on("pointerout", () => {
      buttonBg.setFillStyle(0x006600);
    });

    buttonBg.on("pointerdown", () => {
      this.handleUpgradeButtonClick();
    });
  }

  private createSellButton(): void {
    const buttonContainer = this.scene.add.container(10, 220);

    // Button background
    const buttonBg = this.scene.add.rectangle(0, 0, 180, 40, 0x990000);
    buttonBg.setOrigin(0, 0);
    buttonBg.setInteractive({ useHandCursor: true });

    // Button text
    const buttonText = this.scene.add.text(90, 20, "Sell Tower", {
      fontSize: "16px",
      color: "#ffffff",
    });
    buttonText.setOrigin(0.5, 0.5);

    buttonContainer.add([buttonBg, buttonText]);
    this.container.add(buttonContainer);
    this.sellButton = buttonContainer;

    // Button events
    buttonBg.on("pointerover", () => {
      buttonBg.setFillStyle(0xbb0000);
    });

    buttonBg.on("pointerout", () => {
      buttonBg.setFillStyle(0x990000);
    });

    buttonBg.on("pointerdown", () => {
      this.handleSellButtonClick();
    });
  }

  public show(tower: TowerData): void {
    // Position menu near the tower but ensure it stays on screen
    const screenWidth = this.scene.scale.width;
    const screenHeight = this.scene.scale.height;
    const menuWidth = 200;
    const menuHeight = 300;

    let x = tower.position?.x || 0;
    let y = tower.position?.y || 0;

    // Adjust if menu would go off screen
    if (x + menuWidth > screenWidth) {
      x = tower.position?.x || 0 - menuWidth - 20;
    }
    if (y < 0) {
      y = 0;
    } else if (y + menuHeight > screenHeight) {
      y = screenHeight - menuHeight;
    }

    this.container.setPosition(x, y);

    // Update stats display
    this.titleText.setText(tower.name);
    this.statsText.setText(
      `Level: ${tower.level}\n` +
        `Damage: ${tower.damage}\n` +
        `Range: ${tower.range}\n` +
        `Attack Speed: ${tower.attackSpeed}/s\n\n` +
        `Sell Value: ${tower.sellValue} souls`
    );

    // Show upgrade preview if available
    const nextLevel = (tower.level || 1) + 1;
    const upgrade = TOWER_UPGRADES[nextLevel];
    if (upgrade) {
      this.upgradePreviewText.setText(
        `Next Level:\n` +
          `Cost: ${upgrade.cost} souls\n` +
          `+${upgrade.damageIncrease} Damage\n` +
          `+${upgrade.rangeIncrease} Range\n` +
          `+${upgrade.attackSpeedIncrease} Attack Speed`
      );
      this.upgradeButton.setVisible(true);
    } else {
      this.upgradePreviewText.setText("Max Level Reached!");
      this.upgradeButton.setVisible(false);
    }

    this.container.setVisible(true);
  }

  public hide(): void {
    this.container.setVisible(false);
  }

  public updateState(state: GameState): void {
    this.container.setVisible(state.showTowerMenu);

    if (state.selectedTower) {
      const tower = this.towerTypes[state.selectedTower];
      this.statsText.setText(
        `Tower: ${tower.name}\nDamage: ${tower.damage}\nRange: ${tower.range}\nCost: ${tower.cost}`
      );
      this.sellButton.setVisible(true);
      this.selectedTower = state.selectedTower;

      // Show upgrade preview if available
      const nextLevel = (tower.level || 1) + 1;
      const upgrade = TOWER_UPGRADES[nextLevel];
      if (upgrade) {
        this.upgradePreviewText.setText(
          `Next Level:\n` +
            `Cost: ${upgrade.cost} souls\n` +
            `+${upgrade.damageIncrease} Damage\n` +
            `+${upgrade.rangeIncrease} Range\n` +
            `+${upgrade.attackSpeedIncrease} Attack Speed`
        );
        this.upgradeButton.setVisible(true);
      } else {
        this.upgradePreviewText.setText("Max Level Reached!");
        this.upgradeButton.setVisible(false);
      }
    } else {
      this.statsText.setText("");
      this.sellButton.setVisible(false);
      this.upgradeButton.setVisible(false);
      this.upgradePreviewText.setText("");
      this.selectedTower = null;
    }
  }

  private handleUpgradeButtonClick(): void {
    if (this.selectedTower) {
      this.scene.events.emit(GameEvents.UI_TOWER_UPGRADED, this.selectedTower);
    }
  }

  private handleSellButtonClick(): void {
    if (this.selectedTower) {
      this.scene.events.emit(GameEvents.UI_TOWER_SOLD, this.selectedTower);
      this.selectedTower = null;
    }
  }

  public destroy(): void {
    this.container.destroy();
  }

  public getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }
}
