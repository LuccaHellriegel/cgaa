import { CampSetup } from "../config/CampSetup";
import { EventSetup } from "../config/EventSetup";
import { QuestManager } from "../quests/QuestManager";

export class CampRouting {
  private routings = {};
  private rerouteQueues = {};
  constructor(private events, questManager: QuestManager) {
    this.initRoutings();
    this.initRerouteQueues(questManager);

    events.on(EventSetup.conqueredEvent, this.allowKingRouting.bind(this));
  }

  private allowKingRouting() {
    CampSetup.ordinaryCampIDs.forEach((id) => {
      this.rerouteQueues[id].push(CampSetup.bossCampID);
    });
  }

  private initRoutings() {
    //All camps start by attacking the player
    CampSetup.ordinaryCampIDs.forEach((id) => {
      this.routings[id] = CampSetup.playerCampID;
    });
  }

  private initRerouteQueues(questManager: QuestManager) {
    CampSetup.ordinaryCampIDs.forEach((id) => {
      this.rerouteQueues[id] = CampSetup.ordinaryCampIDs.filter((otherID) => {
        return otherID !== id && otherID !== questManager.getRival(id);
      });
    });
  }

  getRouting(campID: string): string {
    return this.routings[campID];
  }

  reroute(campID: string) {
    let otherCamp = this.rerouteQueues[campID].pop();
    this.rerouteQueues[campID].unshift(otherCamp);
    this.routings[campID] = otherCamp;
    this.events.emit(EventSetup.partialReroutingEvent + campID, otherCamp);
  }
}
