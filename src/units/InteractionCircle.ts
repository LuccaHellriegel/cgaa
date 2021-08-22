import { Quest } from "../game/0_GameBase/engine/quest/Quest";
import { IClickableElement } from "../game/0_GameBase/engine/ui/modes/IClickableElement";
import { MouseOver } from "../game/0_GameBase/engine/ui/MouseOver";
import { EventSetup } from "../game/0_GameBase/setup/EventSetup";
import { CircleUnit } from "./CircleUnit";

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
