import { WaveOrder } from "../wave/WaveOrder";

export class Rivalries {
	private rivalries = {};

	constructor() {
		this.setupRivalriesForFourCamps();
	}

	private setupRivalriesForFourCamps() {
		//TODO: waveOrder -> ordinaryOrder
		//TODO: color -> id
		let colors = new WaveOrder().order;

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
