import { enableable, Enabler } from "./Enabler";
import { Gameplay } from "../../../scenes/Gameplay";
import { SelectorRect } from "../../player/modi/SelectorRect";
import { snapXYToGrid } from "../position";
import { spendSouls } from "../events/player";
import { ShooterPool } from "../../player/unit/shooter/ShooterPool";
import { Pool } from "./Pool";
import { shooterCost } from "../globals/globalConfig";
import { ShooterSpawnObj } from "../spawn/ShooterSpawnObj";
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
		enabler.listen(this);
	}

	enable() {
		this.canSpawn = true;
	}

	disable() {
		this.canSpawn = false;
	}

	spawn(selectorRect: SelectorRect) {
		if (!this.canSpawn) {
			//TODO: make anim general
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

	static createShooterSpawner(scene: Gameplay, shooterPool: ShooterPool, shooterSpawnObj: ShooterSpawnObj) {
		return new Spawner(
			scene,
			shooterPool,
			shooterSpawnObj,
			new Enabler(scene, "can-build", "can-not-build"),
			shooterCost
		);
	}

	//TODO: cost
	static createHealerSpawner(scene: Gameplay, healerPool: HealerPool, shooterSpawnObj: ShooterSpawnObj) {
		return new Spawner(
			scene,
			healerPool,
			shooterSpawnObj,
			new Enabler(scene, "can-build", "can-not-build"),
			shooterCost
		);
	}
}
