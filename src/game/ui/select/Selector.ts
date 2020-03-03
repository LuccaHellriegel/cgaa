import { Point } from "../../base/types";
import { SelectorRect } from "../../modi/SelectorRect";

export interface ActiveElementCollection {
	getActiveElements();
}

export abstract class Selector {
	constructor(private collections: ActiveElementCollection[]) {}

	protected abstract find(criteria, arr: any[]): any;

	protected abstract decision(arr: any[]): any;

	select(criteria: any) {
		let found = this.collections.map(col => col.getActiveElements()).map(eleArr => this.find(criteria, eleArr));
		let decision = this.decision(found);
		return decision;
	}
}

export class ClosestSelector extends Selector {
	protected find(criteria: Point, arr: Point[]) {
		let obj;
		let dist = Infinity;
		for (const ele of arr) {
			let curDist = Phaser.Math.Distance.Between(criteria.x, criteria.y, ele.x, ele.y);
			if (curDist < dist) {
				obj = ele;
				dist = curDist;
			}
		}

		return [obj, dist];
	}

	protected decision(arr: any[]) {
		let obj = arr[0];
		for (const distObj of arr) {
			if (distObj[1] < obj[1]) {
				obj = distObj;
			}
		}

		if (obj[1] === Infinity) return null;
		return obj;
	}
}
