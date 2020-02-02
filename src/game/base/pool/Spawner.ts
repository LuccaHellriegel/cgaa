import { enableable, Enabler } from "./Enabler";
import { Gameplay } from "../../../scenes/Gameplay";
import { SelectorRect } from "../../player/modi/SelectorRect";
import { snapXYToGrid } from "../position";
import { spendSouls } from "../events/player";
import { ShooterPool } from "../../player/unit/shooter/ShooterPool";
import { Pool } from "./Pool";
import { shooterCost, healerCost } from "../globals/globalConfig";
import { TowerSpawnObj } from "../spawnObj/TowerSpawnObj";
import { HealerPool } from "../../player/unit/healer/HealerPool";

export class Spawner implements enableable {
	private canSpawn = false;

	private constructor(
		public scene: Gameplay,
		public pool: Pool,
		private spawnObj,
		enabler: Enabler,
		private cost: number
	) {
		enabler.listenWith(this);
	}

	enable() {
		this.canSpawn = true;
	}

	disable() {
		this.canSpawn = false;
	}

	spawn(selectorRect: SelectorRect) {
		if (!this.canSpawn) {
			selectorRect.anims.play("invalid-shooter-pos");
			return;
		}
		let x = selectorRect.x;
		let y = selectorRect.y;
		if (!(x < 0 || y < 0)) {
			let snappedXY = snapXYToGrid(x, y);
			x = snappedXY.newX;
			y = snappedXY.newY;

			if (this.spawnObj.evaluateRealPos(x, y)) {
				spendSouls(this.scene, this.cost);
				this.pool.poolActivate(this.pool.pop(), x, y);
			} else {
				selectorRect.anims.play("invalid-shooter-pos");
			}
		} else {
			selectorRect.anims.play("invalid-shooter-pos");
		}
	}

	static createShooterSpawner(scene: Gameplay, shooterPool: ShooterPool, towerSpawnObj: TowerSpawnObj) {
		return new Spawner(
			scene,
			shooterPool,
			towerSpawnObj,
			new Enabler(scene, "can-build", "can-not-build"),
			shooterCost
		);
	}

	static createHealerSpawner(scene: Gameplay, healerPool: HealerPool, towerSpawnObj: TowerSpawnObj) {
		return new Spawner(scene, healerPool, towerSpawnObj, new Enabler(scene, "can-build", "can-not-build"), healerCost);
	}
}
