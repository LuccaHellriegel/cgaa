import { Quests } from "./Quests";
import { CampRouting } from "../camp/CampRouting";
import { CampSetup, CampID } from "../setup/CampSetup";
import { InteractionCircle } from "../unit/InteractionCircle";
import { Rivalries } from "./Rivalries";

export class Cooperation {
	dict: { [key in CampID]: Set<CampID> };
	private quests: Quests;
	constructor(private router: CampRouting, private rivalriers: Rivalries) {
		this.dict = CampSetup.campIDs.reduce((prev, id) => {
			prev[id] = new Set<CampID>();
			return prev;
		}, {} as { [key in CampID]: Set<CampID> });
	}

	setQuests(quests: Quests) {
		this.quests = quests;
	}

	interactWithCircle(interactCircle: InteractionCircle) {
		let id = interactCircle.campID;

		//Can not accept quests from rivals
		if (!this.quests.hasAccepted(this.rivalriers.getRival(id))) {
			this.quests.accept(id);
			if (this.quests.isDone(id)) {
				this.router.reroute(id);
				this.updateCooperation(id);
			}
		}
	}

	updateCooperation(campID: CampID) {
		(this.dict[campID] as Set<CampID>).add(CampSetup.playerCampID);

		Object.keys(this.dict).forEach(key => {
			let set: Set<CampID> = this.dict[key];
			if (set.has(CampSetup.playerCampID)) set.add(campID);
		});
	}

	hasCooperation(campID, otherCampID) {
		return campID === otherCampID || this.dict[campID].has(otherCampID);
	}
}
