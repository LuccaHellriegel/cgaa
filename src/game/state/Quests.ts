import { Gameplay } from "../../scenes/Gameplay";
import { UnitCollection } from "../base/UnitCollection";
import { Rivalries } from "./rivalries";
import { CampSetup } from "../setup/CampSetup";
import { Quest } from "./Quest";

export class Quests {
	private questDict = {};

	constructor(private scene: Gameplay, private rivalries: Rivalries) {}

	createStartQuests(essentialDict) {
		CampSetup.ordinaryCampIDs.forEach((id) => {
			let rivalID = this.rivalries.getRival(id);
			let killCollection = new UnitCollection(essentialDict[rivalID]);
			let quest = new Quest(this.scene, killCollection, id, rivalID);
			this.questDict[id] = quest;
		});
	}

	isDone(campID) {
		return this.questDict[campID].isDone();
	}

	hasAccepted(campID) {
		return this.questDict[campID].hasAccepted();
	}

	accept(campID) {
		this.questDict[campID].accept();
	}
}
