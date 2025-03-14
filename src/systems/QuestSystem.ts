import { Scene } from "phaser";
import { CampBuilding } from "../components/CampBuilding";
import { GameEvents } from "../events/GameEvents";

export interface Quest {
  id: string;
  sourceCamp: CampBuilding;
  targetCamp: CampBuilding;
  isActive: boolean;
  isCompleted: boolean;
  timestamp: number;
}

export class QuestSystem {
  private scene: Scene;
  private quests: Map<string, Quest> = new Map();
  private activeQuests: Set<string> = new Set();
  private nextQuestId: number = 1;

  constructor(scene: Scene) {
    this.scene = scene;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.scene.events.on(GameEvents.CAMP_DESTROYED, (camp: CampBuilding) => {
      this.handleCampDestruction(camp);
    });
  }

  public startQuest(sourceCamp: CampBuilding, targetCamp: CampBuilding): void {
    const quest = this.createQuest(sourceCamp, targetCamp);
    this.activateQuest(quest.id);
  }

  public createQuest(
    sourceCamp: CampBuilding,
    targetCamp: CampBuilding
  ): Quest {
    const quest: Quest = {
      id: `quest_${this.nextQuestId++}`,
      sourceCamp,
      targetCamp,
      isActive: false,
      isCompleted: false,
      timestamp: Date.now(),
    };

    this.quests.set(quest.id, quest);
    return quest;
  }

  public activateQuest(questId: string): boolean {
    const quest = this.quests.get(questId);
    if (!quest || quest.isCompleted) return false;

    // Deactivate any other active quests for the source camp
    this.deactivateQuestsForCamp(quest.sourceCamp);

    quest.isActive = true;
    this.activeQuests.add(questId);
    quest.targetCamp.markAsQuestTarget();

    // Set up event listeners for quest completion
    this.scene.events.on(GameEvents.CAMP_DESTROYED, (camp: CampBuilding) => {
      if (camp === quest.targetCamp && !quest.isCompleted) {
        this.completeQuest(questId);
      }
    });

    return true;
  }

  private deactivateQuestsForCamp(camp: CampBuilding): void {
    for (const [questId, quest] of this.quests) {
      if (quest.sourceCamp === camp && quest.isActive) {
        quest.isActive = false;
        this.activeQuests.delete(questId);
        quest.targetCamp.unmarkAsQuestTarget();
      }
    }
  }

  private completeQuest(questId: string): void {
    const quest = this.quests.get(questId);
    if (!quest || quest.isCompleted) return;

    quest.isCompleted = true;
    this.activeQuests.delete(questId);
    quest.isActive = false;
    quest.targetCamp.unmarkAsQuestTarget();

    // Emit quest completion event
    this.scene.events.emit(GameEvents.QUEST_COMPLETED, quest);
  }

  public getActiveQuestsForCamp(camp: CampBuilding): Quest[] {
    return Array.from(this.activeQuests)
      .map((id) => this.quests.get(id)!)
      .filter(
        (quest) => quest.sourceCamp === camp || quest.targetCamp === camp
      );
  }

  public getAllQuestsForCamp(camp: CampBuilding): Quest[] {
    return Array.from(this.quests.values()).filter(
      (quest) => quest.sourceCamp === camp
    );
  }

  private handleCampDestruction(camp: CampBuilding): void {
    // Complete any quests targeting this camp
    for (const [questId, quest] of this.quests) {
      if (quest.targetCamp === camp && quest.isActive) {
        this.completeQuest(questId);
      }
    }
  }

  public destroy(): void {
    this.scene.events.off(GameEvents.CAMP_DESTROYED);
    this.quests.clear();
    this.activeQuests.clear();
  }
}
