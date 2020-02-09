import { Gameplay } from "../../scenes/Gameplay";
import { ElementCollection } from "../base/ElementCollection";
import { Util } from "../base/Util";

export class Quests {
	private campIDKilllist: any[] = [];
	private unitKilllist: any[] = [];

	constructor(private scene: Gameplay) {}

	private addToKilllist(targetCampID, essentialElements: ElementCollection) {
		this.campIDKilllist.push(targetCampID);
		this.scene.events.emit("added-to-killlist-" + targetCampID);
		console.log(essentialElements);
		this.unitKilllist.push(...essentialElements.getElementsWithCampID(targetCampID));
	}

	private refreshKillQuest(targetCampID, eleCampID, essentialElements) {
		if (!this.campIDKilllist.includes(targetCampID) && !this.campIDKilllist.includes(eleCampID)) {
			this.addToKilllist(targetCampID, essentialElements);
		}
		console.log(essentialElements, this.campIDKilllist, this.unitKilllist);
	}

	private killListContains(campID) {
		for (let index = 0; index < this.unitKilllist.length; index++) {
			if (this.unitKilllist[index].campID === campID) return true;
		}
		return false;
	}

	private checkIfKillQuestSolved(targetCampID) {
		return !this.killListContains(targetCampID) && this.campIDKilllist.includes(targetCampID);
	}

	questIsSolved(targetCampID, eleCampID, essentialElements) {
		this.refreshKillQuest(targetCampID, eleCampID, essentialElements);
		return this.checkIfKillQuestSolved(targetCampID);
	}

	killSolvedQuest(ele) {
		if (this.unitKilllist.includes(ele)) Util.removeEle(ele, this.unitKilllist);
		return this.checkIfKillQuestSolved(ele.campID);
	}
}
