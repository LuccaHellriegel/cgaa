import { SelectorRect } from "./SelectorRect";
import { Cooperation } from "../state/Cooperation";
import { UnitCollection } from "../base/UnitCollection";

export class InteractionModus {
	constructor(
		private cooperation: Cooperation,
		private interactionElements: UnitCollection,
		private selectorRect: SelectorRect
	) {}

	lockOn() {
		let result = this.interactionElements.findClosestUnit(this.selectorRect.x, this.selectorRect.y);
		if (result && result[1] < 100) {
			this.selectorRect.setPosition(result[0].x, result[0].y);
			this.selectorRect.lockOn();
		}
	}

	private interact() {
		let ele = this.interactionElements.findClosestUnit(this.selectorRect.x, this.selectorRect.y);
		if (ele && ele[1] < 100) this.cooperation.interactWithCircle(ele);
	}

	executeLocked() {
		this.interact();
	}

	execute() {
		this.interact();
	}

	getFuncArr() {
		return [this.execute.bind(this), this.executeLocked.bind(this), this.lockOn.bind(this)];
	}
}
