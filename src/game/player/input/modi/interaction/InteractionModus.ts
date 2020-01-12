import { Gameplay } from "../../../../../scenes/Gameplay";
import { Tower } from "../../../towers/Tower";
import { GhostTower } from "./GhostTower";
import { Square } from "../../../unit/Square";
import { InteractionCircle } from "../../../../enemies/camp/unit/InteractionCircle";
import { findClosestPoint } from "../../../../base/find";
import { Cooperation } from "./Cooperation";
import { gainLife } from "../../../../base/events/player";

export class InteractionModus {
	isOn: Boolean = false;
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
	}

	private lockGhostTower() {
		let ele = findClosestPoint(this.scene.cgaa.interactionElements, this.ghostTower.x, this.ghostTower.y);
		if (ele !== null) {
			this.ghostTower.setPosition(ele.x, ele.y);
			this.ghostTower.toggleLock();
		}
	}

	private toggle() {
		this.isOn = !this.isOn;
	}

	notifyRemovalOfEle(ele) {
		this.cooperation.verifyCooperation(ele, this.scene);
	}

	interactWithClosestEle() {
		let ele = findClosestPoint(this.scene.cgaa.interactionElements, this.ghostTower.x, this.ghostTower.y);
		if (ele !== null) {
			switch (ele.constructor) {
				case InteractionCircle:
					let iEles = this.scene.cgaa.interactionElements;
					this.cooperation.interactWithCircle(ele, this.scene, iEles);
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
