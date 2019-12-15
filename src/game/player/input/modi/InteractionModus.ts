import { gridPartHalfSize } from "../../../base/globals/globalSizes";
import { Gameplay } from "../../../../scenes/Gameplay";
import { Tower } from "../../towers/Tower";
import { getRandomCampColorOrder } from "../../../base/globals/global";
import { GhostTower } from "./GhostTower";
import { Square } from "../../unit/Square";
import { establishCooperation, gainLife } from "../../../base/events/player";
import { InterationCircle } from "../../../enemies/camp/unit/InteractionCircle";

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
		let ele = this.findClosestInteractionElement(this.ghostTower.x, this.ghostTower.y);
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
		let ele = this.findClosestInteractionElement(this.ghostTower.x, this.ghostTower.y);
		if (ele !== null) {
			switch (ele.constructor) {
				case InterationCircle:
					let targetColor = this.rivalries[ele.color];
					if (!this.colorKilllist.includes(targetColor) && !this.colorKilllist.includes(ele.color)) {
						this.colorKilllist.push(targetColor);
						this.scene.events.emit("added-to-killlist", targetColor);

						for (const key in this.interactionElements) {
							const element = this.interactionElements[key];
							if (element.color === targetColor) this.unitKilllist.push(element);
						}
					}

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

	private findClosestInteractionElement(x, y) {
		let dist = Infinity;
		let ele = null;
		for (const key in this.interactionElements) {
			const element = this.interactionElements[key];
			let curDist = Phaser.Math.Distance.Between(x, y, element.x, element.y);
			if (dist > curDist) {
				dist = curDist;
				ele = element;
			}
		}
		if (dist > gridPartHalfSize) return null;
		return ele;
	}
}
