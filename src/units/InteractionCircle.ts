import { EventSetup } from "../config/EventSetup";
import { IClickableElement } from "../ui/modes/IClickableElement";
import { setupMouseOver } from "../ui/MouseOver";
import { CircleUnit } from "./CircleUnit";

export class InteractionCircle extends CircleUnit implements IClickableElement {
  stateHandler = { spotted: null, obstacle: null };
  mouseOver;

  destroy() {
    this.scene.events.emit(EventSetup.essentialUnitKilledEvent, this.campID);
    this.scene.events.emit(
      EventSetup.interactionCircleDestroyEvent,
      this.campID
    );
    super.destroy();
  }

  makeClickable(onClickCallback: Function) {
    this.setInteractive();
    this.on("pointerdown", onClickCallback);
    setupMouseOver(this, this);
  }
}
