import { Scene } from "phaser";
import { CampBuilding, BuildingSize } from "../../../components/CampBuilding";
import { Diplomat } from "../../../components/Diplomat";
import { Guardian } from "../../../components/Guardian";
import {
  DiplomatMenu,
  DiplomatMenuConfig,
} from "../../../components/ui/menus/DiplomatMenu";
import { GameEvents } from "../../../events/GameEvents";
import { Quest, QuestSystem } from "../../../systems/QuestSystem";

interface CampData {
  camp: CampBuilding;
  diplomat: Diplomat;
  guardians: Guardian[];
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

    // Create guardians based on camp size
    const guardians: Guardian[] = [];
    const guardianCount =
      size === BuildingSize.SMALL ? 1 : size === BuildingSize.MEDIUM ? 2 : 3;

    for (let i = 0; i < guardianCount; i++) {
      const angle = (i / guardianCount) * Math.PI * 2;
      const radius = 60; // Distance from camp center
      const guardianX = x + Math.cos(angle) * radius;
      const guardianY = y + Math.sin(angle) * radius;

      const guardian = new Guardian(this.scene, guardianX, guardianY, camp, {
        patrolRadius: radius,
      });
      guardians.push(guardian);
    }

    this.camps.set(camp, {
      camp,
      diplomat,
      guardians,
      targetCamp: null,
    });

    return camp;
  }

  public showDiplomatMenu(camp: CampBuilding): void {
    if (this.diplomatMenu) {
      this.diplomatMenu.destroy();
    }

    // Get nearby camps for quest targets
    const nearbyCamps = Array.from(this.camps.keys()).filter(
      (otherCamp) => otherCamp !== camp
    );

    // Create menu config
    const config: DiplomatMenuConfig = {
      x: camp.getSprite().x + 100,
      y: camp.getSprite().y,
      width: 200,
      height: 300,
    };

    this.diplomatMenu = new DiplomatMenu(this.scene, config, this.questSystem);
    this.diplomatMenu.show(camp, nearbyCamps);
  }

  public handleCampDestruction(camp: CampBuilding): void {
    const campData = this.camps.get(camp);
    if (campData) {
      // Destroy all guardians
      campData.guardians.forEach((guardian) => guardian.destroy());

      // Remove camp from system
      this.camps.delete(camp);
    }
  }

  public update(time: number, delta: number): void {
    // Update all camps and their components
    for (const [camp, data] of this.camps) {
      camp.update(time, delta);
      data.diplomat.update(time, delta);
      data.guardians.forEach((guardian) => guardian.update());
    }
  }

  public isPlayerNearCamp(): boolean {
    const player = this.scene.registry.get("player");
    if (!player) return false;

    const interactionDistance = 100; // Distance in pixels to consider "near"

    for (const [camp] of this.camps) {
      const campSprite = camp.getSprite();
      const distance = Phaser.Math.Distance.Between(
        player.x,
        player.y,
        campSprite.x,
        campSprite.y
      );

      if (distance <= interactionDistance) {
        return true;
      }
    }

    return false;
  }

  public destroy(): void {
    // Clean up all camps and their components
    for (const [camp, data] of this.camps) {
      camp.destroy();
      data.diplomat.destroy();
      data.guardians.forEach((guardian) => guardian.destroy());
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
