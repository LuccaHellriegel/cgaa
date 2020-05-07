import { CampOrder } from "./CampOrder";
import { RelPos } from "../base/RelPos";
import { CampID } from "../setup/CampSetup";
import { Exit } from "../env/environment";

export class CampExits {
	private exitDict = {};

	constructor(exits: Exit[], order: CampOrder) {
		exits.forEach((exit, index) => {
			this.exitDict[order.order[index]] = exit.getMiddle();
		});
	}

	getExitFor(campID: CampID): RelPos {
		return this.exitDict[campID];
	}
}
