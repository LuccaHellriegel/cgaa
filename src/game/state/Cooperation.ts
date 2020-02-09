import { Quests } from "./Quest";
import { ElementCollection } from "../base/ElementCollection";
import { CampRouting } from "../camp/CampRouting";
import { Rivalries } from "./Rivalries";
import { CampSetup, CampID } from "../setup/CampSetup";

export class Cooperation {
	dict: { [key in CampID]: Set<CampID> };
	constructor(private quests: Quests, private router: CampRouting, private rivalries: Rivalries) {
		let dict = {};
		CampSetup.campIDs.forEach(id => {
			dict[id] = new Set<CampID>();
		});
		this.dict = dict;
	}

	interactWithCircle(ele, essentialElements: ElementCollection) {
		if (this.quests.questIsSolved(this.rivalries.getRival(ele.color), ele.color, essentialElements)) {
			this.router.reroute(ele.color);
		}
	}

	updateCooperationState(ele) {
		if (this.quests.killSolvedQuest(ele)) {
			(this.dict[ele.color] as Set<CampID>).add(CampSetup.playerCampID);

			//TODO: multiple camp cooperation
			Object.keys(this.dict).forEach(key => {
				let set: Set<CampID> = this.dict[key];
				if (set.has(CampSetup.playerCampID)) set.add(ele.color);
			});
			//TODO: get rid of scene call
			//TODO: update already spawned units
			// (this.scene.cgaa.campObj as Camps).setNonHostile(ele.color);
		}
	}
}
