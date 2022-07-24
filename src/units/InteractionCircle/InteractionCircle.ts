import { EventSetup } from "../../config/EventSetup";
import { Quest } from "../../quests/Quest";
import { IClickableElement } from "../../ui/modes/IClickableElement";
import { setupMouseOver } from "../../ui/MouseOver";
import { CircleUnit } from "../Circle/CircleUnit";

export class InteractionCircle extends CircleUnit implements IClickableElement {
  stateHandler = { spotted: null, obstacle: null };
  quest: Quest;
  mouseOver;

  destroy() {
    this.scene.events.emit(EventSetup.unitKilledEvent, this.campID);
    EventSetup.destroyInteractionCircle(this.scene, this.campID);
    super.destroy();
  }

  setQuest(quest: Quest) {
    this.quest = quest;
  }

  makeClickable(onClickCallback: Function) {
    this.setInteractive();
    this.on("pointerdown", onClickCallback);
    setupMouseOver(this, this);
  }
}
