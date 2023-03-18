import { Scene } from "phaser";
import { CampSetup } from "../config/CampSetup";
import { EventSetup } from "../config/EventSetup";
import { Rivalries } from "../state/Rivalries";

const QUEST_INACTIVE = 0;
const QUEST_ACTIVE = 1;
const QUEST_SUCCESS = 2;

export class QuestManager {
  ids: string[] = [];
  states: number[] = [];
  amountToKill: number[] = [];
  rivals: string[] = [];

  constructor(private scene: Scene, rivalries: Rivalries) {
    for (const id of CampSetup.ordinaryCampIDs) {
      this.ids.push(id);
      this.states.push(QUEST_INACTIVE);
      this.amountToKill.push(
        CampSetup.numbOfDiplomats + CampSetup.numbOfBuildings
      );
      this.rivals.push(rivalries.get(id));
    }

    scene.events.on(EventSetup.essentialUnitKilledEvent, (id: string) => {
      this.decrement(id);
    });
  }

  success(id: string): boolean {
    const index = this.ids.indexOf(id);
    return this.states[index] === QUEST_SUCCESS;
  }

  activeOrSuccess(id: string): boolean {
    const index = this.ids.indexOf(id);
    const state = this.states[index];
    return state === QUEST_SUCCESS || state === QUEST_ACTIVE;
  }

  setActive(id: string) {
    const index = this.ids.indexOf(id);
    const rivalID = this.rivals[index];
    const oldState = this.states[index];
    let newState = oldState;
    const rivalIsActive = this.activeOrSuccess(rivalID);
    //not allowed to start a quest if you already started its rival
    if (
      oldState !== QUEST_ACTIVE &&
      oldState !== QUEST_SUCCESS &&
      !rivalIsActive
    ) {
      this.states[index] = QUEST_ACTIVE;
      newState = QUEST_ACTIVE;
      //this notifies the UI that we need to kill that sucker
      this.scene.events.emit(EventSetup.questAcceptedEvent, rivalID);
    }
    return newState === QUEST_ACTIVE || newState === QUEST_SUCCESS;
  }

  decrement(rivalID: string) {
    const index = this.rivals.indexOf(rivalID);
    this.amountToKill[index]--;
    const count = this.amountToKill[index];
    if (count == 0) {
      this.states[index] = QUEST_SUCCESS;
      this.scene.events.emit(EventSetup.essentialUnitsKilled, rivalID);
    }
  }
}
