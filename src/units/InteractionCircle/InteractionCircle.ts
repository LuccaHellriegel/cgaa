import { EventSetup } from "../../config/EventSetup";
import { Quest } from "../../engine/quest/Quest";
import { IClickableElement } from "../../engine/ui/modes/IClickableElement";
import { MouseOver } from "../../engine/ui/MouseOver";
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
		new MouseOver(this, this);
	}
}
