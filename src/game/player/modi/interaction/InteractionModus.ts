import { SelectorRect } from "../SelectorRect";
import { Cooperation } from "../../state/Cooperation";
import { ElementCollection } from "../../../base/classes/ElementCollection";

export class InteractionModus {
	constructor(private cooperation: Cooperation, private interactionElements: ElementCollection) {}

	lockOn(selectorRect: SelectorRect) {
		//TODO: if closest point too far -> dont lock on
		let ele = this.interactionElements.findClosestElement(selectorRect.x, selectorRect.y);
		if (ele !== null) {
			selectorRect.setPosition(ele.x, ele.y);
		}
	}

	notifyRemovalOfEle(ele) {
		this.cooperation.updateCooperationState(ele);
	}

	execute(selectorRect: SelectorRect, lock: boolean) {
		//TODO: execute anyways if close enough
		if (lock) {
			let ele = this.interactionElements.findClosestElement(selectorRect.x, selectorRect.y);
			this.cooperation.interactWithCircle(ele, this.interactionElements);
		}
	}
}
