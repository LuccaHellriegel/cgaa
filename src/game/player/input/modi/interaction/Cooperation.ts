import { getRandomCampColorOrder } from "../../../../base/globals/global";
import { campColors } from "../../../../base/globals/globalColors";
import { Gameplay } from "../../../../../scenes/Gameplay";
import { Quests } from "./Quest";

export class Cooperation {
	private rivalries = {};
	private rerouteObj = {};

	constructor(private scene: Gameplay, private quests: Quests) {
		this.setupRivalriesForFourCamps();
	}

	private setupRivalriesForFourCamps() {
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

	private rerouteTroops(color) {
		if (!this.rerouteObj[color]) {
			let arr = [];
			campColors.forEach(otherColor => {
				if (otherColor !== color && otherColor !== this.rivalries[color]) {
					arr.push(otherColor);
				}
			});
			this.rerouteObj[color] = arr;
		}
		this.scene.events.emit("reroute-" + color, this.rerouteObj[color][0]);
		this.scene.cgaa.camps[color].rerouteColor = this.rerouteObj[color][0];
		this.rerouteObj[color].reverse();
	}

	interactWithCircle(ele, interactionElements) {
		if (this.quests.questIsSolved(this.rivalries[ele.color], ele.color, interactionElements)) {
			this.rerouteTroops(ele.color);
		}
	}

	updateCooperationState(ele) {
		if (this.quests.killSolvedQuest(ele)) {
			//TODO: multiple camp cooperation
			this.scene.cgaa.camps[this.rivalries[ele.color]].dontAttackList.push("blue");
		}
	}
}
