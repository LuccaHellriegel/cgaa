import { Util } from "./Util";
import { InteractionCircle } from "../unit/InteractionCircle";

export class ElementCollection {
	private elements = [];

	constructor() {}

	getElementsWithColor(color) {
		return this.elements.reduce((prev, cur) => {
			let hasScene = cur.scene;
			if (hasScene) {
				if (cur.color === color) prev.push(cur);
			} else {
				Util.removeEle(cur, this.elements);
			}
			return prev;
		}, []);
	}

	addElement(element) {
		this.elements.push(element);
	}

	removeElement(element) {
		Util.removeEle(element, this.elements);
	}

	findClosestElement(x, y): [InteractionCircle, number] {
		let [ele, dist] = ElementCollection.findClosestElement(this.elements, x, y);

		//If scene undefined, then ele has been destroyed
		if (ele.scene) {
			return [ele, dist];
		} else {
			this.removeElement(ele);
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
		return [obj, dist];
	}
}
