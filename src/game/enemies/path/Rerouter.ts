import { campColors } from "../../base/globals/globalColors";
import { Rivalries } from "../camp/Rivalries";

export class Rerouter {
	private campReroutings = {};
	private rerouteQueues = {};
	private nullRerouting = "";

	constructor(private events, private rivalries: Rivalries) {
		this.initReroutings();
		this.initRerouteQueues();
	}

	private initReroutings() {
		campColors.forEach(color => {
			this.campReroutings[color] = this.nullRerouting;
		});
	}

	private initRerouteQueues() {
		campColors.forEach(color => {
			this.rerouteQueues[color] = campColors.filter(otherColor => {
				return otherColor !== color && otherColor !== this.rivalries.getRival(color);
			});
		});
	}

	private updateRerouting(targetColor, eleColor) {
		this.campReroutings[eleColor] = " " + targetColor;
	}

	appendRerouting(color, id) {
		return id + this.campReroutings[color];
	}

	rerouteTroops(color) {
		this.events.emit("reroute-" + color, this.rerouteQueues[color][0]);
		this.updateRerouting(this.rerouteQueues[color][0], color);
		this.rerouteQueues[color].reverse();
	}
}
