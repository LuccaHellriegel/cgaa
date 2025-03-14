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

  constructor(scene: Scene) {
    this.scene = scene;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.scene.events.on(GameEvents.CAMP_DESTROYED, (camp: CampBuilding) => {
      this.handleCampDestruction(camp);
    });
  }

  public createQuest(
    sourceCamp: CampBuilding,
    targetCamp: CampBuilding
  ): Quest {
    const questId = `quest_${Date.now()}_${sourceCamp.getId()}_${targetCamp.getId()}`;
    const quest: Quest = {
      id: questId,
      sourceCamp,
      targetCamp,
      isActive: false,
      isCompleted: false,
      timestamp: Date.now(),
    };

    this.quests.set(questId, quest);
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

  public getActiveQuestsForCamp(camp: CampBuilding): Quest[] {
    return Array.from(this.activeQuests)
      .map((id) => this.quests.get(id)!)
      .filter((quest) => quest.sourceCamp === camp);
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
        quest.isCompleted = true;
        quest.isActive = false;
        this.activeQuests.delete(questId);

        // Emit quest completion event
        this.scene.events.emit(GameEvents.QUEST_COMPLETED, quest);
      }
    }
  }

  public destroy(): void {
    this.scene.events.off(GameEvents.CAMP_DESTROYED);
    this.quests.clear();
    this.activeQuests.clear();
  }
}
