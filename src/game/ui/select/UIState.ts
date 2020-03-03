import { Player } from "../../unit/Player";
import { SelectionManager } from "./SelectionManager";
import { BuildBar } from "./BuildBar";
import { ClickableImageRect } from "../DoubleRect";
import { SelectorRect } from "../../modi/SelectorRect";
import { BuildManager } from "./BuildManager";
import { State } from "./State";
export class UIState {
	private state: State = "attack";
	constructor(
		private build: BuildManager,
		private player: Player,
		private select: SelectionManager,
		private uiElements: ClickableImageRect[],
		private selectorRect: SelectorRect,
		private buildBar: BuildBar
	) {}
	down() {
		if (!this.uiElements.reduce((prev, ele) => prev || ele.mouseOver, false)) {
			if (this.state === "build") {
				this.build.build();
				this.selectorRect.turnOff();
				//Reset show
				this.buildBar.show();
				this.default();
			} else if (this.state === "select") {
				this.select.down();
			} else {
				this.player.attack();
			}
		}
	}
	default() {
		this.setState("select");
	}
	setState(state: State) {
		this.state = state;
	}
	toggle() {
		//Attack is off state, select is default on state
		if (this.state === "attack") {
			this.setState("select");
		} else {
			this.state = "attack";
		}
	}
}
