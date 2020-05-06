import { Enabler } from "./Enabler";
import { Gameplay } from "../../scenes/Gameplay";
import { SelectorRect } from "../modi/SelectorRect";
import { EventSetup } from "../setup/EventSetup";
import { TowerSetup } from "../setup/TowerSetup";
import { TowerSpawnObj } from "../spawn/TowerSpawnObj";
import { Grid } from "../base/Grid";
import { enableable } from "../base/interfaces";
import { Towers } from "../tower/Tower";
import { ClickModes } from "../../engine/ui/modes/ClickModes";

export class Spawner implements enableable {
	canSpawn = false;
	clickModes: ClickModes;

	private constructor(
		public scene: Gameplay,
		public pool: Towers,
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

	setModes(clickModes: ClickModes) {
		this.clickModes = clickModes;
	}

	spawn(selectorRect: SelectorRect) {
		if (!this.canSpawn) {
			selectorRect.anims.play("invalid-shooter-pos");
			return false;
		}
		let x = selectorRect.x;
		let y = selectorRect.y;

		if (!(x < 0 || y < 0)) {
			let snappedXY = Grid.snapXYToGrid(x, y);
			x = snappedXY.newX;
			y = snappedXY.newY;
			if (this.spawnObj.evaluatePoint({ x, y })) {
				EventSetup.spendSouls(this.scene, this.cost);
				this.clickModes.addTo(this.pool.placeTower(x, y));
			} else {
				selectorRect.anims.play("invalid-shooter-pos");
				return false;
			}
		} else {
			selectorRect.anims.play("invalid-shooter-pos");
			return false;
		}

		return true;
	}

	static createShooterSpawner(scene: Gameplay, shooterPool, towerSpawnObj: TowerSpawnObj) {
		return new Spawner(
			scene,
			shooterPool,
			towerSpawnObj,
			new Enabler(scene, EventSetup.canBuildShooter, EventSetup.cannotBuildShooter),
			TowerSetup.shooterCost
		);
	}

	static createHealerSpawner(scene: Gameplay, healerPool, towerSpawnObj: TowerSpawnObj) {
		return new Spawner(
			scene,
			healerPool,
			towerSpawnObj,
			new Enabler(scene, EventSetup.canBuildHealer, EventSetup.cannotBuildHealer),
			TowerSetup.healerCost
		);
	}
}
