import { TowerModus } from "./TowerModus";
import { towerHalfSize } from "../../../globals/globalSizes";
import { EnemyCircle } from "../../enemies/units/EnemyCircle";
import { Gameplay } from "../../../scenes/Gameplay";
import { Tower } from "../towers/Tower";
import { establishCooperation } from "../../base/events";
import { getRandomCampColorOrder } from "../../../globals/global";

export class InteractionModus {
	isOn: Boolean = false;
	interactionElements: any[] = [];
	towerModus: TowerModus;
	colorKilllist: any[] = [];
	unitKilllist: any[] = [];
	rivalries = {};
	scene: Gameplay;

	constructor(scene: Gameplay, towerModus: TowerModus) {
		let colors = getRandomCampColorOrder();

		let color = colors.pop();
		let secondColor = colors.pop();
		this.rivalries[color] = secondColor;
		this.rivalries[secondColor] = color;
		color = colors.pop();
		secondColor = colors.pop();
		this.rivalries[color] = secondColor;
		this.rivalries[secondColor] = color;

		this.towerModus = towerModus;

		this.scene = scene;

		scene.events.on("interaction-ele-added", ele => {
			this.interactionElements.push(ele);
		});
		scene.events.on("interaction-ele-removed", ele => {
			let index = this.interactionElements.indexOf(ele);
			this.interactionElements.splice(index, 1);
			index = this.unitKilllist.indexOf(ele);
			if (index > -1) this.unitKilllist.splice(index, 1);

			if (index > -1) {
				let destroyed = this.checkIfCampDestroy(ele.color);
				if (destroyed) {
					//TODO: multiple camp cooperation
					establishCooperation(scene, this.rivalries[ele.color], "blue");
				}
			}
		});
		let keyObj = scene.input.keyboard.addKey("E");
		keyObj.on("down", () => {
			this.isOn = !this.isOn;
			if (!this.isOn) {
				this.towerModus.unlockGhostTower();
			} else {
				let ele = this.findClosestInteractionElement(this.towerModus.ghostTower.x, this.towerModus.ghostTower.y);
				if (ele !== null) this.towerModus.lockGhostTower(ele.x, ele.y);
			}
		});
	}

	checkIfCampDestroy(color) {
		for (const key in this.unitKilllist) {
			const element = this.unitKilllist[key];
			if (element.color === color) return false;
		}
		return true;
	}

	interactWithClosestEle() {
		let ele = this.findClosestInteractionElement(this.towerModus.ghostTower.x, this.towerModus.ghostTower.y);
		if (ele !== null) {
			if (ele instanceof EnemyCircle) {
				let targetColor = this.rivalries[ele.color];
				//TODO: error if getting two rivals in kill list
				if (!this.colorKilllist.includes(targetColor) && !this.colorKilllist.includes(ele.color)) {
					this.colorKilllist.push(targetColor);
					this.scene.events.emit("added-to-killlist", targetColor);
				}

				for (const key in this.interactionElements) {
					const element = this.interactionElements[key];
					if (element.color === targetColor) this.unitKilllist.push(element);
				}
			} else if (ele instanceof Tower) {
				this.scene.events.emit("remove-tower", ele);
				this.towerModus.unlockGhostTower();
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
		if (dist > towerHalfSize) return null;
		return ele;
	}
}
