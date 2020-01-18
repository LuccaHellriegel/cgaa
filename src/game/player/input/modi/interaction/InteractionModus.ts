import { Gameplay } from "../../../../../scenes/Gameplay";
import { Tower } from "../../../towers/Tower";
import { GhostTower } from "./GhostTower";
import { Square } from "../../../unit/Square";
import { InteractionCircle } from "../../../../enemies/unit/InteractionCircle";
import { Cooperation } from "./Cooperation";
import { Point } from "../../../../base/types";
import { Quests } from "./Quest";
import { Rerouter } from "./Rerouter";
import { Rivalries } from "./Rivalries";

export class InteractionModus {
	private isOn: Boolean = false;
	private cooperation: Cooperation;

	constructor(
		private scene: Gameplay,
		private ghostTower: GhostTower,
		keyObjE,
		rerouter: Rerouter,
		rivalries: Rivalries
	) {
		this.ghostTower = ghostTower;

		this.scene = scene;

		this.cooperation = new Cooperation(scene, new Quests(scene), rerouter, rivalries);

		keyObjE.on("down", () => {
			this.toggle();
			this.lockGhostTower();
		});
	}

	private findClosestPoint(arr: Point[], x, y): Point {
		let obj;
		let dist = Infinity;
		for (const key in arr) {
			let curObj = arr[key];
			let curDist = Phaser.Math.Distance.Between(x, y, curObj.x, curObj.y);
			if (curDist < dist) {
				obj = curObj;
				dist = curDist;
			}
		}
		return obj;
	}

	private lockGhostTower() {
		let ele = this.findClosestPoint(this.scene.cgaa.interactionElements, this.ghostTower.x, this.ghostTower.y);
		if (ele !== null) {
			this.ghostTower.setPosition(ele.x, ele.y);
			this.ghostTower.toggleLock();
		}
	}

	private toggle() {
		this.isOn = !this.isOn;
	}

	notifyRemovalOfEle(ele) {
		this.cooperation.updateCooperationState(ele);
	}

	private interactWithInteractionCircle(ele) {
		let iEles = this.scene.cgaa.interactionElements;
		this.cooperation.interactWithCircle(ele, iEles);
	}

	private interactWithTower(ele) {
		this.scene.events.emit("sold-tower", ele);
		this.ghostTower.toggleLock();
	}

	private interactWithSquare() {
		this.scene.events.emit("life-gained", 20);
	}

	interactWithClosestEle() {
		//TODO: if closest point too far -> dont lock on
		let ele = this.findClosestPoint(this.scene.cgaa.interactionElements, this.ghostTower.x, this.ghostTower.y);
		if (ele !== null) {
			switch (ele.constructor) {
				case InteractionCircle:
					this.interactWithInteractionCircle(ele);
					break;
				case Tower:
					this.interactWithTower(ele);
					break;
				case Square:
					this.interactWithSquare();
					break;
				default:
					break;
			}
		}
	}
}
