import { Scene } from "phaser";
import { CampBuilding } from "../../CampBuilding";
import { Diplomat } from "../../Diplomat";
import { QuestSystem } from "../../../systems/QuestSystem";

export interface DiplomatMenuConfig {
  scene: Scene;
  diplomat: Diplomat;
  camp: CampBuilding;
  questSystem: QuestSystem;
  onClose: () => void;
}

export class DiplomatMenu {
  private scene: Scene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Rectangle;
  private title: Phaser.GameObjects.Text;
  private closeButton: Phaser.GameObjects.Text;
  private campButtons: Phaser.GameObjects.Text[] = [];
  private questList: Phaser.GameObjects.Text[] = [];
  private isVisible: boolean = false;
  private onClose: () => void;
  private questSystem: QuestSystem;
  private currentCamp: CampBuilding | null = null;

  constructor(config: DiplomatMenuConfig) {
    this.scene = config.scene;
    this.onClose = config.onClose;
    this.questSystem = config.questSystem;

    // Create container for menu elements
    this.container = this.scene.add.container(400, 100);
    this.container.setDepth(10);

    // Create background
    this.background = this.scene.add.rectangle(0, 0, 300, 400, 0x000000, 0.8);
    this.background.setOrigin(0);
    this.container.add(this.background);

    // Create title
    this.title = this.scene.add.text(10, 10, "Diplomacy Menu", {
      fontSize: "24px",
      color: "#ffffff",
    });
    this.container.add(this.title);

    // Create close button
    this.closeButton = this.scene.add.text(270, 10, "X", {
      fontSize: "20px",
      color: "#ff0000",
    });
    this.closeButton.setInteractive();
    this.closeButton.on("pointerdown", () => this.close());
    this.container.add(this.closeButton);

    // Hide menu initially
    this.container.setVisible(false);
  }

  public show(camp: CampBuilding, nearbyCamps: CampBuilding[]): void {
    this.currentCamp = camp;
    this.clearMenuItems();

    // Show active quests
    const activeQuests = this.questSystem.getActiveQuestsForCamp(camp);
    if (activeQuests.length > 0) {
      const questTitle = this.scene.add.text(10, 50, "Active Quests:", {
        fontSize: "18px",
        color: "#ffff00",
      });
      this.container.add(questTitle);

      activeQuests.forEach((quest, index) => {
        const questText = this.scene.add.text(
          20,
          80 + index * 30,
          `Destroy ${quest.targetCamp.getId()}`,
          { fontSize: "16px", color: "#ffffff" }
        );
        this.questList.push(questText);
        this.container.add(questText);
      });
    }

    // Show wave direction control if camp is cooperating
    if (camp.isCooperatingState()) {
      const waveTitle = this.scene.add.text(10, 160, "Wave Direction:", {
        fontSize: "18px",
        color: "#44ff44",
      });
      this.container.add(waveTitle);

      const currentTarget = camp.getWaveTarget();
      nearbyCamps.forEach((targetCamp, index) => {
        const isSelected = currentTarget === targetCamp;
        const button = this.scene.add.text(
          20,
          190 + index * 30,
          `${isSelected ? "➤" : "  "} Attack ${targetCamp.getId()}`,
          {
            fontSize: "16px",
            color: isSelected ? "#44ff44" : "#ffffff",
          }
        );
        button.setInteractive();
        button.on("pointerdown", () => {
          camp.setWaveTarget(targetCamp);
          this.show(camp, nearbyCamps); // Refresh to update selection
        });

        this.campButtons.push(button);
        this.container.add(button);
      });

      // Add option to clear wave target
      if (currentTarget) {
        const clearButton = this.scene.add.text(
          20,
          190 + nearbyCamps.length * 30,
          "Clear Wave Target",
          { fontSize: "16px", color: "#ff4444" }
        );
        clearButton.setInteractive();
        clearButton.on("pointerdown", () => {
          camp.setWaveTarget(null);
          this.show(camp, nearbyCamps); // Refresh to update selection
        });
        this.campButtons.push(clearButton);
        this.container.add(clearButton);
      }
    }

    // Show available camps for new quests
    const availableCampsTitle = this.scene.add.text(
      10,
      camp.isCooperatingState() ? 280 : 160,
      "Available Targets:",
      { fontSize: "18px", color: "#ffff00" }
    );
    this.container.add(availableCampsTitle);

    nearbyCamps.forEach((targetCamp, index) => {
      const button = this.scene.add.text(
        20,
        (camp.isCooperatingState() ? 310 : 190) + index * 30,
        `Target ${targetCamp.getId()}`,
        { fontSize: "16px", color: "#ffffff" }
      );
      button.setInteractive();
      button.on("pointerdown", () => this.createQuest(targetCamp));

      this.campButtons.push(button);
      this.container.add(button);
    });

    // Adjust background height based on content
    const contentHeight = camp.isCooperatingState()
      ? Math.max(400, 340 + nearbyCamps.length * 30)
      : Math.max(400, 220 + nearbyCamps.length * 30);
    this.background.setSize(300, contentHeight);

    this.container.setVisible(true);
    this.isVisible = true;
  }

  private createQuest(targetCamp: CampBuilding): void {
    if (!this.currentCamp) return;

    const quest = this.questSystem.createQuest(this.currentCamp, targetCamp);
    this.questSystem.activateQuest(quest.id);

    // Refresh the menu
    if (this.currentCamp) {
      const nearbyCamps = this.findNearbyCamps(this.currentCamp, 200);
      this.show(this.currentCamp, nearbyCamps);
    }
  }

  private findNearbyCamps(
    _camp: CampBuilding,
    _radius: number
  ): CampBuilding[] {
    // This should be implemented in the game scene or camp system
    // For now, return an empty array as noted in the comment
    return [];
  }

  private clearMenuItems(): void {
    // Clear camp buttons
    this.campButtons.forEach((button) => {
      button.removeAllListeners();
      button.destroy();
    });
    this.campButtons = [];

    // Clear quest list
    this.questList.forEach((text) => text.destroy());
    this.questList = [];
  }

  public close(): void {
    this.container.setVisible(false);
    this.isVisible = false;
    this.currentCamp = null;
    this.onClose();
  }

  public isMenuVisible(): boolean {
    return this.isVisible;
  }

  public update(): void {
    // Update menu position if needed
  }

  public destroy(): void {
    // Clean up event listeners
    this.closeButton.removeAllListeners();
    this.campButtons.forEach((button) => button.removeAllListeners());

    // Destroy game objects
    this.container.destroy();
  }
}
