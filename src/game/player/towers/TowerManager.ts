import { Gameplay } from "../../../scenes/Gameplay";
import { towerCost } from "../../base/globals/globalConfig";
import { GhostTower } from "../input/modi/interaction/GhostTower";
import { spendSouls } from "../../base/events/player";
import { snapXYToGrid } from "../../base/position";
import { TowerSpawnObj } from "../../base/spawn/TowerSpawnObj";
import { TowerPool } from "./TowerPool";

export class TowerManager {
	private canBuild = false;
	private towerPool: TowerPool;

	constructor(
		private scene: Gameplay,
		towerGroup,
		bulletGroup,
		private towerSpawnObj: TowerSpawnObj,
		private ghostTower: GhostTower
	) {
		scene.events.on("can-build", () => {
			this.canBuild = true;
		});

		scene.events.on("can-not-build", () => {
			this.canBuild = false;
		});

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
				this.towerPool.pop().activate(x, y);
			} else {
				this.playInvalidTowerPosAnim();
			}
		} else {
			this.playInvalidTowerPosAnim();
		}
	}
}
