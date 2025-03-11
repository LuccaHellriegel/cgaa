import { Scene } from "phaser";
import { UIState } from "../controllers/UIController";
import { GameState } from "../controllers/GameController";
import { TowerType, TowerTypes } from "../types/TowerTypes";

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
  private currentTower: TowerData | null = null;
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
    this.createSellButton();

    // Hide by default
    this.container.setVisible(false);
  }

  private createBackground(): void {
    const width = 200;
    const height = 250;
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

  private createSellButton(): void {
    const buttonContainer = this.scene.add.container(10, 200);

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
    this.currentTower = tower;

    // Position menu near the tower but ensure it stays on screen
    const screenWidth = this.scene.scale.width;
    const screenHeight = this.scene.scale.height;
    const menuWidth = 200;
    const menuHeight = 250;

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

    this.container.setVisible(true);
  }

  public hide(): void {
    this.container.setVisible(false);
    this.currentTower = null;
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
    } else {
      this.statsText.setText("");
      this.sellButton.setVisible(false);
      this.selectedTower = null;
    }
  }

  private handleSellButtonClick(): void {
    if (this.selectedTower) {
      this.scene.events.emit("sellTower", this.selectedTower);
      this.selectedTower = null;
    }
  }

  public destroy(): void {
    this.container.destroy();
  }
}
