import { EventSetup } from "../setup/EventSetup";
import { CircleUnit } from "./CircleUnit";
import { Quest } from "../../engine/quest/Quest";

export class InteractionCircle extends CircleUnit {
	stateHandler = { spotted: null, obstacle: null };
	quest: Quest;

	destroy() {
		this.scene.events.emit(EventSetup.unitKilledEvent, this.campID);
		EventSetup.destroyInteractionCircle(this.scene, this.campID);
		super.destroy();
	}

	setQuest(quest: Quest) {
		this.quest = quest;
	}
}
