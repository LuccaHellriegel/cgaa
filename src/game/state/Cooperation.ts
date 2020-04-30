import { CampSetup, CampID } from "../setup/CampSetup";
import { Gameplay } from "../../scenes/Gameplay";
import { EventSetup } from "../setup/EventSetup";

export class Cooperation {
	dict: { [key in CampID]: Set<CampID> };
	constructor(private scene: Gameplay) {
		this.dict = CampSetup.campIDs.reduce((prev, id) => {
			prev[id] = new Set<CampID>();
			return prev;
		}, {} as { [key in CampID]: Set<CampID> });
	}

	activateCooperation(campID: CampID) {
		this.scene.events.emit(EventSetup.cooperationEvent, campID);

		(this.dict[campID] as Set<CampID>).add(CampSetup.playerCampID);

		Object.keys(this.dict).forEach((key) => {
			let set: Set<CampID> = this.dict[key];
			if (set.has(CampSetup.playerCampID)) set.add(campID);
		});
	}

	hasCooperation(campID, otherCampID) {
		return campID === otherCampID || this.dict[campID].has(otherCampID);
	}
}
