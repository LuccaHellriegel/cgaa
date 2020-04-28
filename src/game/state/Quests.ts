import { Gameplay } from "../../scenes/Gameplay";
import { UnitCollection } from "../base/UnitCollection";
import { Rivalries } from "./rivalries";
import { CampSetup } from "../setup/CampSetup";
import { Quest } from "./Quest";

export class Quests {
	private questDict = {};

	constructor(scene: Gameplay, rivalries: Rivalries, essentialDict) {
		CampSetup.ordinaryCampIDs.forEach((id) => {
			let rivalID = rivalries.getRival(id);
			let killCollection = new UnitCollection(essentialDict[rivalID]);
			let quest = new Quest(scene, killCollection, id, rivalID);
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
