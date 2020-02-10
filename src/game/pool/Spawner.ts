import { enableable, Enabler } from "./Enabler";
import { Gameplay } from "../../scenes/Gameplay";
import { Pool } from "./Pool";
import { SelectorRect } from "../modi/SelectorRect";
import { EventSetup } from "../setup/EventSetup";
import { ShooterPool } from "./ShooterPool";
import { TowerSetup } from "../setup/TowerSetup";
import { TowerSpawnObj } from "../spawn/TowerSpawnObj";
import { HealerPool } from "./HealerPool";
import { EnvSetup } from "../setup/EnvSetup";

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

	//TODO: duplication in Grid
	private snapCoordinateToGrid(coordinate) {
		let ceil = Math.ceil(coordinate / EnvSetup.halfGridPartSize) * EnvSetup.halfGridPartSize;
		let floor = Math.floor(coordinate / EnvSetup.halfGridPartSize) * EnvSetup.halfGridPartSize;

		if ((ceil / EnvSetup.halfGridPartSize) % 2 === 0) ceil = Infinity;
		if ((floor / EnvSetup.halfGridPartSize) % 2 === 0) floor = Infinity;

		let diffCeil = Math.abs(ceil - coordinate);
		let diffFloor = Math.abs(floor - coordinate);

		if (ceil === Infinity && floor === Infinity) {
			return coordinate - EnvSetup.halfGridPartSize;
		} else if (diffCeil < diffFloor) {
			return ceil;
		} else {
			return floor;
		}
	}

	private snapXYToGrid(x, y) {
		let needToSnapX = (x - EnvSetup.halfGridPartSize) % (2 * EnvSetup.halfGridPartSize) !== 0;
		let needToSnapY = (y - EnvSetup.halfGridPartSize) % (2 * EnvSetup.halfGridPartSize) !== 0;

		if (!needToSnapX && !needToSnapY) return { newX: x, newY: y };

		let newX;
		let newY;

		if (needToSnapX) {
			newX = this.snapCoordinateToGrid(x);
		} else {
			newX = x;
		}

		if (needToSnapY) {
			newY = this.snapCoordinateToGrid(y);
		} else {
			newY = y;
		}
		return { newX, newY };
	}

	spawn(selectorRect: SelectorRect) {
		if (!this.canSpawn) {
			selectorRect.anims.play("invalid-shooter-pos");
			return;
		}
		let x = selectorRect.x;
		let y = selectorRect.y;

		if (!(x < 0 || y < 0)) {
			let snappedXY = this.snapXYToGrid(x, y);
			x = snappedXY.newX;
			y = snappedXY.newY;
			if (this.spawnObj.evaluatePoint({ x, y })) {
				EventSetup.spendSouls(this.scene, this.cost);
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
