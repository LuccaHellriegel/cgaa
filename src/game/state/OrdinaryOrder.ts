import { RandomOrder } from "../base/RandomOrder";
import { CampSetup } from "../setup/CampSetup";
export class OrdinaryOrder extends RandomOrder {
	constructor() {
		super(CampSetup.ordinaryCampIDs);
	}
}
