import { Buildings } from "./building/Buildings";
import { removeEle } from "../../base/utils";

export class CampsState {
	private activeCamps = [];

	constructor(private camps: Buildings[]) {
		camps.forEach(camp => this.activeCamps.push(camp.color));
	}

	private updateActiveCamps() {
		for (let index = 0; index < this.activeCamps.length; index++) {
			if (this.camps[index].areDestroyed()) {
				removeEle(this.camps[index], this.camps);
				removeEle(this.activeCamps[index], this.activeCamps);
			}
		}
	}

	getNextActiveCampColor() {
		this.updateActiveCamps();

		if (this.activeCamps.length === 0) return false;

		let nextColor = this.activeCamps.pop();
		this.activeCamps.unshift(nextColor);

		let nextBuildings = this.camps.pop();
		this.camps.unshift(nextBuildings);

		return nextColor;
	}
}
