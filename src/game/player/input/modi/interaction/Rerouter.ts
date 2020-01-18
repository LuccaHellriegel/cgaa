import { campColors } from "../../../../base/globals/globalColors";
import { Rivalries } from "./Rivalries";

export class Rerouter {
	private campReroutings = {};
	private rerouteObj = {};
	private nullRerouting = "";

	constructor(private events, private rivalries: Rivalries) {
		this.initReroutings();
	}

	private initReroutings() {
		campColors.forEach(color => {
			this.campReroutings[color] = this.nullRerouting;
		});
	}

	private updateRerouting(targetColor, eleColor) {
		this.campReroutings[eleColor] = " " + targetColor;
	}

	appendRerouting(color, id) {
		return id + this.campReroutings[color];
	}

	rerouteTroops(color) {
		if (!this.rerouteObj[color]) {
			let arr = [];
			campColors.forEach(otherColor => {
				if (otherColor !== color && otherColor !== this.rivalries.getRival(color)) {
					arr.push(otherColor);
				}
			});
			this.rerouteObj[color] = arr;
		}
		this.events.emit("reroute-" + color, this.rerouteObj[color][0]);
		this.updateRerouting(this.rerouteObj[color][0], color);
		this.rerouteObj[color].reverse();
	}
}
