import { removeEle } from "../utils";

export class ElementCollection {
	private elements = [];

	constructor(private type: string) {}

	getElementsWithColor(color) {
		return this.elements.reduce((prev, cur) => {
			let hasScene = cur.scene;
			if (hasScene) {
				if (cur.color === color) prev.push(cur);
			} else {
				removeEle(cur, this.elements);
			}
			return prev;
		}, []);
	}

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
