import { OrdinaryOrder } from "./OrdinaryOrder";

export class Rivalries {
	private rivalries = {};

	constructor() {
		this.setupRivalriesForFourCamps();
	}

	private setupRivalriesForFourCamps() {
		let campIDs = new OrdinaryOrder().order;

		let campID = campIDs.pop();
		let secondCampID = campIDs.pop();
		this.rivalries[campID] = secondCampID;
		this.rivalries[secondCampID] = campID;

		campID = campIDs.pop();
		secondCampID = campIDs.pop();
		this.rivalries[campID] = secondCampID;
		this.rivalries[secondCampID] = campID;
	}

	getRival(campID) {
		return this.rivalries[campID];
	}
}
