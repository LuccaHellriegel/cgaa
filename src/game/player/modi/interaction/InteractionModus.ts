import { GhostTower } from "../GhostTower";
import { Cooperation } from "../../state/Cooperation";
import { ElementCollection } from "./ElementCollection";

export class InteractionModus {
	constructor(private cooperation: Cooperation, private interactionElements: ElementCollection) {}

	lockOn(ghostTower: GhostTower) {
		//TODO: if closest point too far -> dont lock on
		let ele = this.interactionElements.findClosestElement(ghostTower.x, ghostTower.y);
		if (ele !== null) {
			ghostTower.setPosition(ele.x, ele.y);
		}
	}

	notifyRemovalOfEle(ele) {
		this.cooperation.updateCooperationState(ele);
	}

	execute(ghostTower: GhostTower, lock: boolean) {
		//TODO: execute anyways if close enough
		if (lock) {
			let ele = this.interactionElements.findClosestElement(ghostTower.x, ghostTower.y);
			this.cooperation.interactWithCircle(ele, this.interactionElements);
			ghostTower.toggleLock();
		}
	}
}
