import { CampID } from "../setup/CampSetup";
import { CampsState } from "../state/CampsState";
import { Util } from "../base/Util";
import { OrdinaryOrder } from "../state/OrdinaryOrder";

export class WaveOrder extends OrdinaryOrder {
	order: CampID[];
	index = 0;

	constructor(private state: CampsState) {
		super();
	}

	increment() {
		console.log(this.index, "increment1");
		this.index++;

		if (this.index > this.order.length - 1) {
			this.index = 0;
		}
		console.log(this.index, "increment2");
	}

	private shouldHaveWave(campID: CampID) {
		return this.state.isActive(campID);
	}

	getNextCampID(): CampID | boolean {
		let id = this.order[this.index];

		while (!this.shouldHaveWave(id)) {
			Util.removeEle(id, this.order);
			if (this.order.length === 0) return false;
			if (this.index > this.order.length - 1) this.index = 0;
			id = this.order[this.index];
		}
		return id;
	}
}
