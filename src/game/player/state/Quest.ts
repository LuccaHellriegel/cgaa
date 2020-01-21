import { Gameplay } from "../../../scenes/Gameplay";
import { removeEle } from "../../base/utils";

export class Quests {
	private colorKilllist: any[] = [];
	private unitKilllist: any[] = [];

	constructor(private scene: Gameplay) {}

	private addToKilllist(targetColor, essentialElements) {
		this.colorKilllist.push(targetColor);
		this.scene.events.emit("added-to-killlist-" + targetColor);

		for (const key in essentialElements) {
			const element = essentialElements[key];
			if (element.color === targetColor) this.unitKilllist.push(element);
		}
	}

	private refreshKillQuest(targetColor, eleColor, essentialElements) {
		if (!this.colorKilllist.includes(targetColor) && !this.colorKilllist.includes(eleColor)) {
			this.addToKilllist(targetColor, essentialElements);
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

	questIsSolved(targetColor, eleColor, essentialElements) {
		this.refreshKillQuest(targetColor, eleColor, essentialElements);
		return this.checkIfKillQuestSolved(targetColor);
	}

	killSolvedQuest(ele) {
		if (this.unitKilllist.includes(ele)) removeEle(ele, this.unitKilllist);
		return this.checkIfKillQuestSolved(ele.color);
	}
}
