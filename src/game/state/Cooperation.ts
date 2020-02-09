import { Quests } from "./Quest";
import { ElementCollection } from "../base/ElementCollection";
import { CampRouting } from "../camp/CampRouting";
import { Rivalries } from "./Rivalries";
import { CampSetup, CampID } from "../setup/CampSetup";
import { InteractionCircle } from "../unit/InteractionCircle";

export class Cooperation {
	dict: { [key in CampID]: Set<CampID> };
	constructor(private quests: Quests, private router: CampRouting, private rivalries: Rivalries) {
		let dict = {};
		CampSetup.campIDs.forEach(id => {
			dict[id] = new Set<CampID>();
		});
		this.dict = dict;
	}

	interactWithCircle(ele: [InteractionCircle, number], essentialElements: ElementCollection) {
		if (this.quests.questIsSolved(this.rivalries.getRival(ele[0].campID), ele[0].campID, essentialElements)) {
			console.log(ele, "here");
			this.router.reroute(ele[0].campID);
		}
	}

	updateCooperationState(ele) {
		if (this.quests.killSolvedQuest(ele)) {
			(this.dict[ele.campID] as Set<CampID>).add(CampSetup.playerCampID);

			//TODO: multiple camp cooperation
			Object.keys(this.dict).forEach(key => {
				let set: Set<CampID> = this.dict[key];
				if (set.has(CampSetup.playerCampID)) set.add(ele.campID);
			});
			//TODO: get rid of scene call
			//TODO: update already spawned units
			// (this.scene.cgaa.campObj as Camps).setNonHostile(ele.campID);
		}
	}
}
