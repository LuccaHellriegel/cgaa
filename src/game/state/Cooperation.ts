import { Quests } from "./Quests";
import { CampRouting } from "../camp/CampRouting";
import { CampSetup, CampID } from "../setup/CampSetup";
import { InteractionCircle } from "../unit/InteractionCircle";

export class Cooperation {
	dict: { [key in CampID]: Set<CampID> };
	private quests: Quests;
	constructor(private router: CampRouting) {
		this.dict = CampSetup.campIDs.reduce((prev, id) => {
			prev[id] = new Set<CampID>();
			return prev;
		}, {} as { [key in CampID]: Set<CampID> });
	}

	setQuests(quests: Quests) {
		this.quests = quests;
	}

	interactWithCircle(pair: [InteractionCircle, number]) {
		let id = pair[0].campID;
		this.quests.accept(id);
		if (this.quests.isDone(id)) {
			this.router.reroute(id);
			this.updateCooperation(id);
		}
	}

	updateCooperation(campID: CampID) {
		(this.dict[campID] as Set<CampID>).add(CampSetup.playerCampID);

		//TODO: multiple camp cooperation
		Object.keys(this.dict).forEach(key => {
			let set: Set<CampID> = this.dict[key];
			if (set.has(CampSetup.playerCampID)) set.add(campID);
		});
		//TODO: get rid of scene call
		//TODO: update already spawned units
		// (this.scene.cgaa.campObj as Camps).setNonHostile(ele.campID);
	}

	hasCooperation(campID, otherCampID) {
		return campID === otherCampID || this.dict[campID].has(otherCampID);
	}
}
