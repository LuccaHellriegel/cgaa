import { CampBuildings } from "./building/CampBuildings";
import { removeEle } from "../../base/utils";

export class CampsState {
	private activeCamps = [];

	constructor(private camps: CampBuildings[]) {
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

		let nextCampBuildings = this.camps.pop();
		this.camps.unshift(nextCampBuildings);

		return nextColor;
	}
}
