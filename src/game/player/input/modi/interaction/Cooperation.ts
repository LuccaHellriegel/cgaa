import { getRandomCampColorOrder } from "../../../../base/globals/global";
import { campColors } from "../../../../base/globals/globalColors";
import { removeEle } from "../../../../base/utils";
import { Gameplay } from "../../../../../scenes/Gameplay";

export class Cooperation {
	private colorKilllist: any[] = [];
	private unitKilllist: any[] = [];
	private rivalries = {};
	private rerouteObj = {};

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

	private addToKilllist(targetColor, scene, interactionElements) {
		this.colorKilllist.push(targetColor);
		scene.events.emit("added-to-killlist-" + targetColor);

		for (const key in interactionElements) {
			const element = interactionElements[key];
			if (element.color === targetColor) this.unitKilllist.push(element);
		}
	}

	private rerouteTroops(color, scene) {
		if (!this.rerouteObj[color]) {
			let arr = [];
			campColors.forEach(otherColor => {
				if (otherColor !== color && otherColor !== this.rivalries[color]) {
					arr.push(otherColor);
				}
			});
			this.rerouteObj[color] = arr;
		}
		scene.events.emit("reroute-" + color, this.rerouteObj[color][0]);
		this.rerouteObj[color].reverse();
	}

	interactWithCircle(ele, scene, interactionElements) {
		let targetColor = this.rivalries[ele.color];
		let establishKillQuest = !this.colorKilllist.includes(targetColor) && !this.colorKilllist.includes(ele.color);

		let hasKilledAllRivals = !this.unitKilllist.includes(targetColor);
		let hasAccessToTroops = hasKilledAllRivals && this.colorKilllist.includes(targetColor);

		if (establishKillQuest) {
			this.addToKilllist(targetColor, scene, interactionElements);
		} else if (hasAccessToTroops) {
			this.rerouteTroops(ele.color, scene);
		}
	}

	private checkIfCampDestroy(color) {
		for (const key in this.unitKilllist) {
			const element = this.unitKilllist[key];
			if (element.color === color) return false;
		}
		return true;
	}

	verifyCooperation(ele, scene: Gameplay) {
		if (this.unitKilllist.includes(ele)) removeEle(ele, this.unitKilllist);
		let destroyed = this.checkIfCampDestroy(ele.color);
		if (destroyed) {
			//TODO: multiple camp cooperation
			scene.cgaa.camps[this.rivalries[ele.color]].dontAttackList.push("blue");
		}
	}
}
