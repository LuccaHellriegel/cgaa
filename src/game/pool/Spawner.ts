import { enableable, Enabler } from "./Enabler";
import { Gameplay } from "../../scenes/Gameplay";
import { Pool } from "./Pool";
import { SelectorRect } from "../modi/SelectorRect";
import { EventSetup } from "../setup/EventSetup";
import { ShooterPool } from "./ShooterPool";
import { TowerSetup } from "../setup/TowerSetup";
import { TowerSpawnObj } from "../spawn/TowerSpawnObj";
import { HealerPool } from "./HealerPool";
import { Grid } from "../base/Grid";

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
			let snappedXY = Grid.snapXYToGrid(x, y);
			x = snappedXY.newX;
			y = snappedXY.newY;
			if (this.spawnObj.evaluatePoint({ x, y })) {
				EventSetup.spendSouls(this.scene, this.cost);
				this.pool.pop().poolActivate(x, y);
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
			TowerSetup.shooterCost
		);
	}

	static createHealerSpawner(scene: Gameplay, healerPool: HealerPool, towerSpawnObj: TowerSpawnObj) {
		return new Spawner(
			scene,
			healerPool,
			towerSpawnObj,
			new Enabler(scene, "can-build", "can-not-build"),
			TowerSetup.healerCost
		);
	}
}
