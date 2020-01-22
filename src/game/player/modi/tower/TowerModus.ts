import { GhostTower } from "../GhostTower";
import { TowerSpawner } from "../../towers/TowerSpawner";
import { ElementCollection } from "../interaction/ElementCollection";
import { gainSouls } from "../../../base/events/player";
import { towerCost } from "../../../base/globals/globalConfig";

export class TowerModus {
	constructor(private towerSpawner: TowerSpawner) {}

	lockOn(ghostTower: GhostTower) {
		//TODO: if closest point too far -> dont lock on
		let ele = ElementCollection.findClosestElement(
			this.towerSpawner.towerPool.getActiveTowers(),
			ghostTower.x,
			ghostTower.y
		);
		if (ele) {
			ghostTower.setPosition(ele.x, ele.y);
		}
	}

	execute(ghostTower: GhostTower, lock: boolean) {
		//TODO: if lockOn fails we still set lock true
		if (lock) {
			let ele = ElementCollection.findClosestElement(
				this.towerSpawner.towerPool.getActiveTowers(),
				ghostTower.x,
				ghostTower.y
			);
			this.interactWithTower(ele);
			ghostTower.toggleLock();
		} else {
			this.towerSpawner.spawnNewTower(ghostTower);
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
