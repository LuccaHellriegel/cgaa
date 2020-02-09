import { Gameplay } from "../../scenes/Gameplay";
import { ElementCollection } from "../base/ElementCollection";
import { Util } from "../base/Util";

export class Quests {
	private colorKilllist: any[] = [];
	private unitKilllist: any[] = [];

	constructor(private scene: Gameplay) {}

	private addToKilllist(targetColor, essentialElements: ElementCollection) {
		this.colorKilllist.push(targetColor);
		this.scene.events.emit("added-to-killlist-" + targetColor);
		this.unitKilllist.push(...essentialElements.getElementsWithColor(targetColor));
	}

	private refreshKillQuest(targetColor, eleColor, essentialElements) {
		if (!this.colorKilllist.includes(targetColor) && !this.colorKilllist.includes(eleColor)) {
			this.addToKilllist(targetColor, essentialElements);
		}
	}

	private killListContains(color) {
		for (let index = 0; index < this.unitKilllist.length; index++) {
			if (this.unitKilllist[index].color === color) return true;
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
		if (this.unitKilllist.includes(ele)) Util.removeEle(ele, this.unitKilllist);
		return this.checkIfKillQuestSolved(ele.color);
	}
}
