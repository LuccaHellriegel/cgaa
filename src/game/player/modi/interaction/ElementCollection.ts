import { removeEle } from "../../../base/utils";

export class ElementCollection {
	private elements = [];

	constructor(private type: string) {}

	addElementIfType(element, type: string) {
		if (type === this.type) this.elements.push(element);
	}

	removeElementIfType(element, type: string) {
		if (type === this.type) removeEle(element, this.elements);
	}

	findClosestElement(x, y) {
		let ele = ElementCollection.findClosestElement(this.elements, x, y);
		if (ele.scene) {
			return ele;
		} else {
			this.removeElementIfType(ele, this.type);
			return this.findClosestElement(x, y);
		}
	}

	static findClosestElement(arr, x, y) {
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
		return obj;
	}
}
