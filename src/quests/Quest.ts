import { EventSetup } from "../config/EventSetup";
import { Scene } from "phaser";
import { Rivalries } from "../state/Rivalries";
import { CampSetup } from "../config/CampSetup";

const QUEST_INACTIVE = 0b00;
const QUEST_ACTIVE = 0b001;
const QUEST_SUCCESS = 0b010;

const maskCheck = (mask: number) => (state: number) => (state & mask) === mask;

const active = maskCheck(QUEST_ACTIVE);
const success = maskCheck(QUEST_SUCCESS);

export class Quest {
  state = QUEST_INACTIVE;

  constructor(private allowed: Function, private activeCallback: Function) {}

  success() {
    return success(this.state);
  }

  activeOrSuccess() {
    return active(this.state) || success(this.state);
  }

  setActive() {
    if (this.allowed()) {
      this.state = QUEST_ACTIVE;
      this.activeCallback();
    }
  }

  setSuccess() {
    this.state = QUEST_SUCCESS;
  }

  static killQuest(scene: Scene, rivalries: Rivalries, quests, id) {
    const rivalID = rivalries.get(id);
    const quest = new Quest(
      () => {
        return !quests.get(rivalries.get(id)).activeOrSuccess();
      },
      () => {
        let rivalID = rivalries.get(id);
        scene.events.emit(EventSetup.questAcceptedEvent, rivalID);
      }
    );

    let amountToKill = CampSetup.numbOfDiplomats + CampSetup.numbOfBuildings;
    const decrement = (payload?) => {
      if (payload === rivalID) {
        amountToKill--;
        if (amountToKill == 0) {
          scene.events.off(EventSetup.essentialUnitKilledEvent, decrement);
          quest.setSuccess();
          scene.events.emit(EventSetup.essentialUnitsKilled, rivalID);
        }
      }
    };
    scene.events.on(EventSetup.essentialUnitKilledEvent, decrement);

    return quest;
  }
}
