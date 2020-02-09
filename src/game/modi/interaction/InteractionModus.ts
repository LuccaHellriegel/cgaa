import { SelectorRect } from "../SelectorRect";
import { ModiState } from "../ModiState";
import { Cooperation } from "../../state/Cooperation";
import { ElementCollection } from "../../base/ElementCollection";

export class InteractionModus {
	constructor(private cooperation: Cooperation, private interactionElements: ElementCollection) {}

	lockOn(selectorRect: SelectorRect) {
		//TODO: if closest point too far -> dont lock on
		let result = this.interactionElements.findClosestElement(selectorRect.x, selectorRect.y);
		if (result !== null) {
			selectorRect.setPosition(result[0].x, result[0].y);
		}
	}

	notifyRemovalOfEle(ele) {
		this.cooperation.updateCooperationState(ele);
	}

	execute(selectorRect: SelectorRect, modiState: ModiState) {
		//TODO: execute anyways if close enough
		if (modiState.lock) {
			let ele = this.interactionElements.findClosestElement(selectorRect.x, selectorRect.y);
			this.cooperation.interactWithCircle(ele, this.interactionElements);
		}
	}
}
