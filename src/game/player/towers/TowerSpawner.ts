import { Gameplay } from "../../../scenes/Gameplay";
import { towerCost } from "../../base/globals/globalConfig";
import { GhostTower } from "../modi/GhostTower";
import { spendSouls } from "../../base/events/player";
import { snapXYToGrid } from "../../base/position";
import { TowerSpawnObj } from "../../base/spawn/TowerSpawnObj";
import { TowerPool } from "./TowerPool";

export class TowerSpawner {
	private canBuild = false;

	constructor(public scene: Gameplay, public towerPool: TowerPool, private towerSpawnObj: TowerSpawnObj) {
		scene.events.on("can-build", () => {
			this.canBuild = true;
		});

		scene.events.on("can-not-build", () => {
			this.canBuild = false;
		});
	}

	spawnNewTower(ghostTower: GhostTower) {
		if (!this.canBuild) {
			ghostTower.anims.play("invalid-tower-pos");
			return;
		}
		let x = ghostTower.x;
		let y = ghostTower.y;
		if (!(x < 0 || y < 0)) {
			let snappedXY = snapXYToGrid(x, y);
			x = snappedXY.newX;
			y = snappedXY.newY;

			if (this.towerSpawnObj.evaluateRealPos(x, y)) {
				spendSouls(this.scene, towerCost);
				this.towerPool.pop().activate(x, y);
			} else {
				ghostTower.anims.play("invalid-tower-pos");
			}
		} else {
			ghostTower.anims.play("invalid-tower-pos");
		}
	}
}
