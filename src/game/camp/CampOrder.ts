import { CampSetup, CampID } from "../setup/CampSetup";
import { RandomOrder } from "../base/RandomOrder";

export class CampOrder extends RandomOrder {
	order: CampID[];
	constructor() {
		super(CampSetup.campIDs);
	}
}
