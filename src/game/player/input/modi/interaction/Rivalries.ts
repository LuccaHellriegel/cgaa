import { getRandomCampColorOrder } from "../../../../base/globals/global";

export class Rivalries {
	private rivalries = {};

	constructor() {
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

	getRival(color) {
		return this.rivalries[color];
	}
}
