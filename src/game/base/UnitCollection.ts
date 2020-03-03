import { InteractionCircle } from "../unit/InteractionCircle";
import { Gameplay } from "../../scenes/Gameplay";
import { CampID } from "../setup/CampSetup";
import { ActiveElementCollection } from "../ui/select/Selector";

interface basicUnit {
	scene: Gameplay;
	campID: CampID;
}

//Collection of units that are not destroyed
export class UnitCollection implements ActiveElementCollection {
	private units: basicUnit[] = [];

	constructor(units: basicUnit[]) {
		this.addUnits(units);
	}

	private refreshUnits() {
		let units = [];
		this.units.forEach(ele => {
			if (ele.scene) units.push(ele);
		});
		this.units = units;
	}

	getUnitsWithCampID(campID: CampID) {
		this.refreshUnits();

		return this.units.reduce((prev, cur) => {
			if (cur.campID === campID) prev.push(cur);
			return prev;
		}, []);
	}

	getActiveElements() {
		this.refreshUnits();
		return this.units;
	}

	hasUnitsWithCampID(campID: CampID) {
		return this.getUnitsWithCampID(campID).length > 0;
	}

	addUnit(element: basicUnit) {
		this.units.push(element);
	}

	addUnits(units: basicUnit[]) {
		units.forEach(unit => this.addUnit(unit));
	}

	findClosestUnit(x, y): [InteractionCircle, number] {
		this.refreshUnits();
		let unit = UnitCollection.findClosestUnit(this.units, x, y) as [InteractionCircle, number];
		if (unit[1] === Infinity) {
			return null;
		}
		return unit;
	}

	static findClosestUnit(arr, x, y) {
		let obj;
		let dist = Infinity;
		for (const key in arr) {
			let curObj = arr[key];
			let curDist = Phaser.Math.Distance.Between(x, y, curObj.x, curObj.y);
			if (curDist < dist) {
				obj = curObj;
				dist = curDist;
			}
		}
		return [obj, dist];
	}
}
