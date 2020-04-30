import { CampID, CampSetup } from "../setup/CampSetup";
import { CampsState } from "../camp/CampsState";
import { Util } from "../base/Util";
import { RandomOrder } from "../base/RandomOrder";

export class WaveOrder extends RandomOrder {
	order: CampID[];
	index = 0;

	constructor(private state: CampsState) {
		super(CampSetup.ordinaryCampIDs);
	}

	increment() {
		this.index++;

		if (this.index > this.order.length - 1) {
			this.index = 0;
		}
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
