import { SelectorRect } from "../SelectorRect";
import { ModiState } from "../ModiState";
import { Cooperation } from "../../state/Cooperation";
import { UnitCollection } from "../../base/UnitCollection";

export class InteractionModus {
	constructor(private cooperation: Cooperation, private interactionElements: UnitCollection) {}

	lockOn(selectorRect: SelectorRect) {
		//TODO: if closest point too far -> dont lock on
		let result = this.interactionElements.findClosestUnit(selectorRect.x, selectorRect.y);
		if (result) {
			selectorRect.setPosition(result[0].x, result[0].y);
		}
	}

	execute(selectorRect: SelectorRect, modiState: ModiState) {
		//TODO: execute anyways if close enough
		if (modiState.lock) {
			let ele = this.interactionElements.findClosestUnit(selectorRect.x, selectorRect.y);
			this.cooperation.interactWithCircle(ele);
		}
	}
}
