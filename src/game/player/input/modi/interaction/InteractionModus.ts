import { Gameplay } from "../../../../../scenes/Gameplay";
import { Tower } from "../../../towers/Tower";
import { getRandomCampColorOrder } from "../../../../base/globals/global";
import { GhostTower } from "../GhostTower";
import { Square } from "../../../unit/Square";
import { establishCooperation, gainLife } from "../../../../base/events/player";
import { InterationCircle } from "../../../../enemies/camp/unit/InteractionCircle";
import { interactWithCircle } from "./circle";
import { findClosestPoint } from "../../../../base/find";

export class InteractionModus {
	isOn: Boolean = false;
	interactionElements: any[] = [];
	ghostTower: GhostTower;
	colorKilllist: any[] = [];
	unitKilllist: any[] = [];
	rivalries = {};
	scene: Gameplay;

	constructor(scene: Gameplay, ghostTower: GhostTower) {
		let colors = getRandomCampColorOrder();

		let color = colors.pop();
		let secondColor = colors.pop();
		this.rivalries[color] = secondColor;
		this.rivalries[secondColor] = color;
		color = colors.pop();
		secondColor = colors.pop();
		this.rivalries[color] = secondColor;
		this.rivalries[secondColor] = color;

		this.ghostTower = ghostTower;

		this.scene = scene;

		scene.events.on("interaction-ele-added", ele => {
			this.interactionElements.push(ele);
		});
		scene.events.on("interaction-ele-removed", ele => {
			let index = this.interactionElements.indexOf(ele);
			this.interactionElements.splice(index, 1);
			index = this.unitKilllist.indexOf(ele);
			if (index > -1) {
				this.unitKilllist.splice(index, 1);
				let destroyed = this.checkIfCampDestroy(ele.color);
				if (destroyed) {
					//TODO: multiple camp cooperation
					establishCooperation(scene, this.rivalries[ele.color], "blue");
				}
			}
		});
	}

	lockGhostTower() {
		let ele = findClosestPoint(this.interactionElements, this.ghostTower.x, this.ghostTower.y);
		if (ele !== null) {
			this.ghostTower.setPosition(ele.x, ele.y);
			this.ghostTower.toggleLock();
		}
	}

	toggle() {
		this.isOn = !this.isOn;
	}

	checkIfCampDestroy(color) {
		for (const key in this.unitKilllist) {
			const element = this.unitKilllist[key];
			if (element.color === color) return false;
		}
		return true;
	}

	interactWithClosestEle() {
		let ele = findClosestPoint(this.interactionElements, this.ghostTower.x, this.ghostTower.y);
		if (ele !== null) {
			switch (ele.constructor) {
				case InterationCircle:
					interactWithCircle(
						ele,
						this.rivalries,
						this.colorKilllist,
						this.unitKilllist,
						this.scene,
						this.interactionElements
					);
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
