import { Quests } from "./Quests";
import { CampRouting } from "../camp/CampRouting";
import { CampSetup } from "../setup/CampSetup";
import { InteractionCircle } from "../unit/InteractionCircle";
import { Rivalries } from "./rivalries";
import { Cooperation } from "./Cooperation";

export class Interaction {
	constructor(
		private router: CampRouting,
		private rivalriers: Rivalries,
		public quests: Quests,
		private cooperation: Cooperation
	) {}

	interactWithCircle(interactCircle: InteractionCircle) {
		let id = interactCircle.campID;

		//Can not accept quests from rivals
		if (!this.quests.hasAccepted(this.rivalriers.getRival(id))) {
			this.quests.accept(id);
			if (this.quests.isDone(id)) {
				// check if id has cooperation with player, because id would need to be rerouted
				if (this.cooperation.hasCooperation(id, CampSetup.playerCampID)) {
					this.router.reroute(id);
				} else {
					this.cooperation.activateCooperation(id);
				}
			}
		}
	}
}
