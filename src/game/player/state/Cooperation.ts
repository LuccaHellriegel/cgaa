import { Gameplay } from "../../../scenes/Gameplay";
import { Quests } from "./Quest";
import { Rerouter } from "../../enemies/path/Rerouter";
import { Rivalries } from "../../enemies/camp/Rivalries";

export class Cooperation {
	constructor(
		private scene: Gameplay,
		private quests: Quests,
		private rerouter: Rerouter,
		private rivalries: Rivalries
	) {}

	interactWithCircle(ele, essentialElements) {
		if (this.quests.questIsSolved(this.rivalries.getRival(ele.color), ele.color, essentialElements)) {
			this.rerouter.rerouteTroops(ele.color);
		}
	}

	updateCooperationState(ele) {
		if (this.quests.killSolvedQuest(ele)) {
			//TODO: multiple camp cooperation
			this.scene.cgaa.camps[this.rivalries.getRival(ele.color)].dontAttackList.push("blue");
		}
	}
}
