import { Quests } from "./Quests";
import { CampRouting } from "../camp/CampRouting";
import { CampSetup, CampID } from "../setup/CampSetup";
import { InteractionCircle } from "../unit/InteractionCircle";
import { Rivalries } from "./rivalries";
import { Gameplay } from "../../scenes/Gameplay";
import { EventSetup } from "../setup/EventSetup";

export class Cooperation {
	dict: { [key in CampID]: Set<CampID> };
	quests: Quests;
	constructor(private scene: Gameplay, private router: CampRouting, private rivalriers: Rivalries) {
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
				if ((this.dict[id] as Set<CampID>).has(CampSetup.playerCampID)) {
					this.router.reroute(id);
				} else {
					this.activateCooperation(id);
					this.scene.events.emit(EventSetup.cooperationEvent, id);
				}
			}
		}
	}

	activateCooperation(campID: CampID) {
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
