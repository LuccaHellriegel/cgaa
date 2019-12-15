import { getRandomCampColorOrder } from "../../../../base/globals/global";
import { establishCooperation } from "../../../../base/events/player";

export class Cooperation {
	private colorKilllist: any[] = [];
	private unitKilllist: any[] = [];
	private rivalries = {};

	constructor() {
		this.setupRivalries();
	}

	private setupRivalries() {
		let colors = getRandomCampColorOrder();

		let color = colors.pop();
		let secondColor = colors.pop();
		this.rivalries[color] = secondColor;
		this.rivalries[secondColor] = color;
		color = colors.pop();
		secondColor = colors.pop();
		this.rivalries[color] = secondColor;
		this.rivalries[secondColor] = color;
	}

	interactWithCircle(ele, scene, interactionElements) {
		let targetColor = this.rivalries[ele.color];
		if (!this.colorKilllist.includes(targetColor) && !this.colorKilllist.includes(ele.color)) {
			this.colorKilllist.push(targetColor);
			scene.events.emit("added-to-killlist", targetColor);

			for (const key in interactionElements) {
				const element = interactionElements[key];
				if (element.color === targetColor) this.unitKilllist.push(element);
			}
		}
	}

	private checkIfCampDestroy(color) {
		for (const key in this.unitKilllist) {
			const element = this.unitKilllist[key];
			if (element.color === color) return false;
		}
		return true;
	}

	verifyCooperation(ele, scene) {
		let index = this.unitKilllist.indexOf(ele);
		if (index > -1) {
			this.unitKilllist.splice(index, 1);
			let destroyed = this.checkIfCampDestroy(ele.color);
			if (destroyed) {
				//TODO: multiple camp cooperation
				establishCooperation(scene, this.rivalries[ele.color], "blue");
			}
		}
	}
}
