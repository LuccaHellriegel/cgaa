import { Gameplay } from "../../../../../scenes/Gameplay";
import { Tower } from "../../../towers/Tower";
import { GhostTower } from "../GhostTower";
import { Square } from "../../../unit/Square";
import { InterationCircle } from "../../../../enemies/camp/unit/InteractionCircle";
import { findClosestPoint } from "../../../../base/find";
import { Cooperation } from "./Cooperation";
import { gainLife } from "../../../../base/events/player";

export class InteractionModus {
	isOn: Boolean = false;
	interactionElements: any[] = [];
	ghostTower: GhostTower;
	scene: Gameplay;
	cooperation: Cooperation;

	constructor(scene: Gameplay, ghostTower: GhostTower, keyObjE) {
		this.ghostTower = ghostTower;

		this.scene = scene;

		this.cooperation = new Cooperation();

		keyObjE.on("down", () => {
			this.toggle();
			this.lockGhostTower();
		});

		scene.events.on("interaction-ele-added", ele => {
			this.interactionElements.push(ele);
		});
		scene.events.on("interaction-ele-removed", ele => {
			let index = this.interactionElements.indexOf(ele);
			this.interactionElements.splice(index, 1);
			this.cooperation.verifyCooperation(ele, this.scene);
		});
	}

	private lockGhostTower() {
		let ele = findClosestPoint(this.interactionElements, this.ghostTower.x, this.ghostTower.y);
		if (ele !== null) {
			this.ghostTower.setPosition(ele.x, ele.y);
			this.ghostTower.toggleLock();
		}
	}

	private toggle() {
		this.isOn = !this.isOn;
	}

	interactWithClosestEle() {
		let ele = findClosestPoint(this.interactionElements, this.ghostTower.x, this.ghostTower.y);
		if (ele !== null) {
			switch (ele.constructor) {
				case InterationCircle:
					this.cooperation.interactWithCircle(ele, this.scene, this.interactionElements);
					break;
				case Tower:
					this.scene.events.emit("sold-tower", ele);
					this.ghostTower.toggleLock();
					break;
				case Square:
					gainLife(this.scene, 20);
					break;
				default:
					break;
			}
		}
	}
}
