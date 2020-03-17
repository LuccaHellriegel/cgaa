import { CampSetup } from "../setup/CampSetup";
import { EventSetup } from "../setup/EventSetup";
import { Rivalries } from "../state/Rivalries";

export class CampRouting {
	private routings = {};
	private rerouteQueues = {};
	constructor(private events, rivalries: Rivalries) {
		this.initRoutings();
		this.initRerouteQueues(rivalries);
	}

	private initRoutings() {
		//All camps start by attacking the player
		CampSetup.ordinaryCampIDs.forEach(id => {
			this.routings[id] = CampSetup.playerCampID;
		});
	}

	private initRerouteQueues(rivalries) {
		CampSetup.ordinaryCampIDs.forEach(id => {
			this.rerouteQueues[id] = CampSetup.ordinaryCampIDs.filter(otherID => {
				return otherID !== id && otherID !== rivalries.getRival(id);
			});
		});
	}

	getRouting(campID: string): string {
		return this.routings[campID];
	}

	reroute(campID: string) {
		let otherCamp = this.rerouteQueues[campID].pop();
		this.rerouteQueues[campID].unshift(otherCamp);
		this.routings[campID] = otherCamp;
		this.events.emit(EventSetup.partialReroutingEvent + campID, otherCamp);
	}
}
