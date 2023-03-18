import { EventSetup } from "../../config/EventSetup";
import { QuestManager } from "../../quests/QuestManager";
import { IClickableElement } from "../../ui/modes/IClickableElement";
import { setupMouseOver } from "../../ui/MouseOver";
import { CircleUnit } from "../Circle/CircleUnit";

export class InteractionCircle extends CircleUnit implements IClickableElement {
  stateHandler = { spotted: null, obstacle: null };
  questManager: QuestManager;
  mouseOver;

  destroy() {
    this.scene.events.emit(EventSetup.essentialUnitKilledEvent, this.campID);
    EventSetup.destroyInteractionCircle(this.scene, this.campID);
    super.destroy();
  }

  makeClickable(onClickCallback: Function) {
    this.setInteractive();
    this.on("pointerdown", onClickCallback);
    setupMouseOver(this, this);
  }
}
