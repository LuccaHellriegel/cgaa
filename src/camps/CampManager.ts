import { Scene } from "phaser";
import { CampSetup } from "../config/CampSetup";
import { EventSetup } from "../config/EventSetup";
import { randomizeArr } from "../engine/randomizeArr";

const QUEST_INACTIVE = 0;
const QUEST_ACTIVE = 1;
const QUEST_SUCCESS = 2;

function createRivalsMap(ids: string[]) {
  const rivalsMap = new Map<string, string>();
  const randIDs = randomizeArr(ids);

  // only works for four camps
  let id = randIDs.pop();
  let secondID = randIDs.pop();
  rivalsMap.set(id, secondID);
  rivalsMap.set(secondID, id);

  id = randIDs.pop();
  secondID = randIDs.pop();
  rivalsMap.set(id, secondID);
  rivalsMap.set(secondID, id);

  return rivalsMap;
}

export class CampManager {
  ids: string[] = [];
  states: number[] = [];
  amountToKill: number[] = [];
  rivals: string[] = [];
  routings: string[] = [];
  reroutingQueues: string[][] = [];

  constructor(private scene: Scene) {
    const rivalries = createRivalsMap(CampSetup.ordinaryCampIDs);
    for (const id of CampSetup.ordinaryCampIDs) {
      this.ids.push(id);
      this.states.push(QUEST_INACTIVE);
      this.amountToKill.push(
        CampSetup.numbOfDiplomats + CampSetup.numbOfBuildings
      );
      const rivalID = rivalries.get(id);
      this.rivals.push(rivalID);
      //All camps start by attacking the player
      this.routings.push(CampSetup.playerCampID);
      this.reroutingQueues.push(
        CampSetup.ordinaryCampIDs.filter((otherID) => {
          return otherID !== id && otherID !== rivalID;
        })
      );
    }

    scene.events.on(EventSetup.essentialUnitKilledEvent, (id: string) => {
      this.decrement(id);
    });
    scene.events.on(EventSetup.conqueredEvent, () => {
      //allow boss camp to be routed to
      this.reroutingQueues.forEach((queue) => queue.push(CampSetup.bossCampID));
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

  getRival(id: string) {
    const index = this.ids.indexOf(id);
    return this.rivals[index];
  }

  getRouting(campID: string): string {
    const index = this.ids.indexOf(campID);
    return this.routings[index];
  }

  reroute(campID: string) {
    const index = this.ids.indexOf(campID);
    let otherCamp = this.reroutingQueues[index].pop();
    this.reroutingQueues[index].unshift(otherCamp);
    this.routings[index] = otherCamp;
    this.scene.events.emit(
      EventSetup.partialReroutingEvent + campID,
      otherCamp
    );
  }
}
