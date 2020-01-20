import { Gameplay } from "../../../scenes/Gameplay";
import { removeEle } from "../../base/utils";

export class Quests {
	private colorKilllist: any[] = [];
	private unitKilllist: any[] = [];

	constructor(private scene: Gameplay) {}

	private addToKilllist(targetColor, interactionElements) {
		this.colorKilllist.push(targetColor);
		this.scene.events.emit("added-to-killlist-" + targetColor);

		for (const key in interactionElements) {
			const element = interactionElements[key];
			if (element.color === targetColor) this.unitKilllist.push(element);
		}
	}

	private refreshKillQuest(targetColor, eleColor, interactionElements) {
		if (!this.colorKilllist.includes(targetColor) && !this.colorKilllist.includes(eleColor)) {
			this.addToKilllist(targetColor, interactionElements);
		}
	}

	private killListContains(color) {
		for (let index = 0; index < this.unitKilllist.length; index++) {
			const unit = this.unitKilllist[index];
			if (unit.color === color) return true;
		}
		return false;
	}

	private checkIfKillQuestSolved(targetColor) {
		return !this.killListContains(targetColor) && this.colorKilllist.includes(targetColor);
	}

	questIsSolved(targetColor, eleColor, interactionElements) {
		this.refreshKillQuest(targetColor, eleColor, interactionElements);
		return this.checkIfKillQuestSolved(targetColor);
	}

	killSolvedQuest(ele) {
		if (this.unitKilllist.includes(ele)) removeEle(ele, this.unitKilllist);
		return this.checkIfKillQuestSolved(ele.color);
	}
}
