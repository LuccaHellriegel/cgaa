import { SelectorRect } from "../SelectorRect";
import { TowerSpawner } from "../../towers/TowerSpawner";
import { ElementCollection } from "../../../base/classes/ElementCollection";
import { gainSouls } from "../../../base/events/player";
import { towerCost } from "../../../base/globals/globalConfig";

export class BuildModus {
	constructor(private towerSpawner: TowerSpawner) {}

	//TODO: place Squares
	//TODO: Square Aura
	//TODO: switch to Squares with Shift

	lockOn(selectorRect: SelectorRect) {
		//TODO: if closest point too far -> dont lock on
		let ele = ElementCollection.findClosestElement(
			this.towerSpawner.towerPool.getActiveTowers(),
			selectorRect.x,
			selectorRect.y
		);
		if (ele) {
			selectorRect.setPosition(ele.x, ele.y);
		}
	}

	execute(selectorRect: SelectorRect, lock: boolean) {
		if (lock) {
			let ele = ElementCollection.findClosestElement(
				this.towerSpawner.towerPool.getActiveTowers(),
				selectorRect.x,
				selectorRect.y
			);
			this.interactWithTower(ele);
		} else {
			this.towerSpawner.spawnNewTower(selectorRect);
		}
	}

	private interactWithTower(ele) {
		ele.poolDestroy();
		gainSouls(this.towerSpawner.scene, towerCost);
	}

	//TODO:
	private interactWithSquare() {
		this.scene.events.emit("life-gained", 20);
	}
}
