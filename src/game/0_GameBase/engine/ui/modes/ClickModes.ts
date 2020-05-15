import { IClickableElement } from "./IClickableElement";
import { IModes, IMode } from "./IMode";

export class ClickModes implements IModes {
	activeMode: IMode;
	modes: IMode[];
	modesLength: number;
	index: number;

	constructor(activateSwitching: Function, defaultIndex: number, modes: IMode[]) {
		this.activeMode = modes[defaultIndex];
		this.modes = modes;
		this.modesLength = modes.length;
		this.index = defaultIndex;
		activateSwitching(this);
	}

	click(element: IClickableElement) {
		this.activeMode.execute(element);
	}

	addTo(element: IClickableElement) {
		element.makeClickable(
			function () {
				this.click(element);
			}.bind(this)
		);
	}
}
