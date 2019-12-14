import { Gameplay } from "../../../scenes/Gameplay";
import { towerCost } from "../../base/globals/globalConfig";
import { GhostTower } from "../modi/GhostTower";
import { spendSouls } from "../../base/events/player";
import { snapXYToGrid } from "../../base/position";
import { TowerSpawnObj } from "../../base/spawn/TowerSpawnObj";
import { TowerPool } from "./TowerPool";

export class TowerManager {
	scene: Gameplay;
	towerSpawnObj: TowerSpawnObj;
	canBuild = false;
	ghostTower: GhostTower;
	towerPool: TowerPool;

	constructor(scene: Gameplay, towerGroup, bulletGroup, towerSpawnObj: TowerSpawnObj, ghostTower: GhostTower) {
		this.scene = scene;

		scene.events.on("can-build", () => {
			this.canBuild = true;
		});

		scene.events.on("can-not-build", () => {
			this.canBuild = false;
		});
		this.towerSpawnObj = towerSpawnObj;

		this.ghostTower = ghostTower;

		this.towerPool = new TowerPool({ scene, towerGroup, bulletGroup, numberOfTowers: 15 });
	}

	private playInvalidTowerPosAnim() {
		this.ghostTower.anims.play("invalid-tower-pos");
	}

	spawnNewTower() {
		if (!this.canBuild) {
			this.playInvalidTowerPosAnim();
			return;
		}

		let x = this.ghostTower.x;
		let y = this.ghostTower.y;
		if (!(x < 0 || y < 0)) {
			let snappedXY = snapXYToGrid(x, y);
			x = snappedXY.newX;
			y = snappedXY.newY;

			if (this.towerSpawnObj.evaluateRealPos(x, y)) {
				spendSouls(this.scene, towerCost);
				let tower = this.towerPool.pop();
				tower.activate(x, y);
			} else {
				this.playInvalidTowerPosAnim();
			}
		} else {
			this.playInvalidTowerPosAnim();
		}
	}
}
