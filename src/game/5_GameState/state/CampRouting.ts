import { Rivalries } from "./Rivalries";
import { EventSetup } from "../../0_GameBase/setup/EventSetup";
import { CampSetup } from "../../0_GameBase/setup/CampSetup";

export class CampRouting {
	private routings = {};
	private rerouteQueues = {};
	constructor(private events, rivalries: Rivalries) {
		this.initRoutings();
		this.initRerouteQueues(rivalries);

		events.on(EventSetup.conqueredEvent, this.allowKingRouting.bind(this));
	}

	private allowKingRouting() {
		CampSetup.ordinaryCampIDs.forEach((id) => {
			this.rerouteQueues[id].push(CampSetup.bossCampID);
		});
	}

	private initRoutings() {
		//All camps start by attacking the player
		CampSetup.ordinaryCampIDs.forEach((id) => {
			this.routings[id] = CampSetup.playerCampID;
		});
	}

	private initRerouteQueues(rivalries) {
		CampSetup.ordinaryCampIDs.forEach((id) => {
			this.rerouteQueues[id] = CampSetup.ordinaryCampIDs.filter((otherID) => {
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
