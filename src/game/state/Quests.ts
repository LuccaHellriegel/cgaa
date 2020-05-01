import { UnitCollection } from "../base/UnitCollection";
import { CampSetup } from "../setup/CampSetup";
import { Quest } from "./Quest";

export const newQuestEvent = "new-quest-created";

type AddArr = [string, any];

export class Quests {
	collection = {};

	constructor() {}

	add([id, element]: AddArr) {
		this.collection[id] = element;
	}

	static createStartQuests(essentialDict, scene, rivalries) {
		let questArr = [];
		CampSetup.ordinaryCampIDs.forEach((id) => {
			let rivalID = rivalries.getRival(id);
			let killCollection = new UnitCollection(essentialDict[rivalID]);
			let quest = new Quest(scene, killCollection, id, rivalID);
			questArr.push([id, quest]);
		});
		return questArr;
	}

	isDone(campID) {
		return this.collection[campID].isDone();
	}

	hasAccepted(campID) {
		return this.collection[campID].hasAccepted();
	}

	accept(campID) {
		this.collection[campID].accept();
	}
}
