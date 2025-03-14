import { Scene } from "phaser";
import { CampBuilding, BuildingSize } from "../../../components/CampBuilding";
import { Diplomat } from "../../../components/Diplomat";
import {
  DiplomatMenu,
  DiplomatMenuConfig,
} from "../../../components/ui/menus/DiplomatMenu";
import { GameEvents } from "../../../events/GameEvents";
import { Quest, QuestSystem } from "../../../systems/QuestSystem";

interface CampData {
  camp: CampBuilding;
  diplomat: Diplomat;
  targetCamp: CampBuilding | null;
}

export class CampSystem {
  private scene: Scene;
  private camps: Map<CampBuilding, CampData> = new Map();
  private diplomatMenu: DiplomatMenu | null = null;
  private questSystem: QuestSystem;

  constructor(scene: Scene) {
    this.scene = scene;
    this.questSystem = new QuestSystem(scene);
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.scene.events.on("showDiplomatMenu", (camp: CampBuilding) => {
      this.showDiplomatMenu(camp);
    });

    this.scene.events.on(GameEvents.CAMP_DESTROYED, (camp: CampBuilding) => {
      this.handleCampDestruction(camp);
    });

    this.scene.events.on(GameEvents.QUEST_COMPLETED, (quest: Quest) => {
      const targetCamp = quest.targetCamp;

      // Set cooperation state
      targetCamp.setCooperating(true);

      // Play success sound
      this.scene.registry.get("audioManager").playSound("success");
    });
  }

  public createCamp(x: number, y: number, size: BuildingSize): CampBuilding {
    const camp = new CampBuilding(this.scene, x, y, size);
    const diplomat = new Diplomat(this.scene, x + 30, y);

    this.camps.set(camp, {
      camp,
      diplomat,
      targetCamp: null,
    });

    return camp;
  }

  public showDiplomatMenu(camp: CampBuilding): void {
    const campData = this.camps.get(camp);
    if (!campData) return;

    // Create menu if it doesn't exist
    if (!this.diplomatMenu) {
      const config: DiplomatMenuConfig = {
        scene: this.scene,
        diplomat: campData.diplomat,
        camp: camp,
        questSystem: this.questSystem,
        onClose: () => {
          this.diplomatMenu = null;
        },
      };
      this.diplomatMenu = new DiplomatMenu(config);
    }

    // Find nearby camps
    const nearbyCamps = this.findNearbyCamps(camp, 200);
    this.diplomatMenu.show(camp, nearbyCamps);
  }

  private findNearbyCamps(camp: CampBuilding, radius: number): CampBuilding[] {
    const nearbyCamps: CampBuilding[] = [];
    const campSprite = camp.getSprite();

    for (const [otherCamp, _] of this.camps) {
      if (otherCamp === camp) continue;

      const otherSprite = otherCamp.getSprite();
      const distance = Phaser.Math.Distance.Between(
        campSprite.x,
        campSprite.y,
        otherSprite.x,
        otherSprite.y
      );

      if (distance <= radius) {
        nearbyCamps.push(otherCamp);
      }
    }

    return nearbyCamps;
  }

  public handleCampDestruction(camp: CampBuilding): void {
    // Remove camp from system
    this.camps.delete(camp);
  }

  public update(time: number, delta: number): void {
    // Update all camps and their diplomats
    for (const [camp, data] of this.camps) {
      if (!camp.isDestroyedState()) {
        camp.update(time, delta);
        data.diplomat.update(time, delta);
      }
    }

    // Update diplomat menu if visible
    if (this.diplomatMenu && this.diplomatMenu.isMenuVisible()) {
      this.diplomatMenu.update();
    }
  }

  public destroy(): void {
    // Clean up all camps and diplomats
    for (const [camp, data] of this.camps) {
      camp.destroy();
      data.diplomat.destroy();
    }
    this.camps.clear();

    // Clean up menu
    if (this.diplomatMenu) {
      this.diplomatMenu.destroy();
      this.diplomatMenu = null;
    }

    // Clean up quest system
    this.questSystem.destroy();

    // Clean up event handlers
    this.scene.events.off("showDiplomatMenu");
    this.scene.events.off(GameEvents.CAMP_DESTROYED);
    this.scene.events.off(GameEvents.QUEST_COMPLETED);
  }
}
