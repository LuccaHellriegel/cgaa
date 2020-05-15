import { CircleUnit } from "./CircleUnit";
import { IClickableElement } from "../../0_GameBase/engine/ui/modes/IClickableElement";
import { Quest } from "../../0_GameBase/engine/quest/Quest";
import { EventSetup } from "../../0_GameBase/setup/EventSetup";
import { MouseOver } from "../../0_GameBase/engine/ui/MouseOver";

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
