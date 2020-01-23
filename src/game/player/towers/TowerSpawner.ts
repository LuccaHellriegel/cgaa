import { Gameplay } from "../../../scenes/Gameplay";
import { towerCost } from "../../base/globals/globalConfig";
import { SelectorRect } from "../modi/SelectorRect";
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

	spawnNewTower(selectorRect: SelectorRect) {
		if (!this.canBuild) {
			selectorRect.anims.play("invalid-tower-pos");
			return;
		}
		let x = selectorRect.x;
		let y = selectorRect.y;
		if (!(x < 0 || y < 0)) {
			let snappedXY = snapXYToGrid(x, y);
			x = snappedXY.newX;
			y = snappedXY.newY;

			if (this.towerSpawnObj.evaluateRealPos(x, y)) {
				spendSouls(this.scene, towerCost);
				this.towerPool.pop().activate(x, y);
			} else {
				selectorRect.anims.play("invalid-tower-pos");
			}
		} else {
			selectorRect.anims.play("invalid-tower-pos");
		}
	}
}
