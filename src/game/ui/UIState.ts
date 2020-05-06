import { Player } from "../unit/Player";
import { SelectionManager } from "./select/SelectionManager";
import { BuildBar } from "./build/BuildBar";
import { SelectorRect } from "./SelectorRect";
import { BuildManager } from "./build/BuildManager";
import { ClickableImageRect } from "./rect/DoubleRect";

type State = "build" | "attack" | "select";

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
		const mouseOverUI = this.uiElements.reduce((prev, ele) => prev || ele.mouseOver, false);
		const mouseOverUnit = this.select.selectedUnit && this.select.selectedUnit.mouseOver;
		if (!mouseOverUI) {
			if (!mouseOverUnit) this.selectorRect.turnOff();

			if (this.state === "build") {
				if (this.build.build()) {
					this.selectorRect.turnOff();
					//Reset show
					this.buildBar.show();
					this.default();
				}
			} else if (this.state === "attack") {
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
