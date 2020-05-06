import { Gameplay } from "../../scenes/Gameplay";
import { SelectorRect } from "../ui/SelectorRect";
import { EventSetup } from "../setup/EventSetup";
import { TowerSetup } from "../setup/TowerSetup";
import { TowerSpawnObj } from "../spawn/TowerSpawnObj";
import { Grid } from "../base/Grid";
import { Towers } from "./Tower";
import { ClickModes } from "../../engine/ui/modes/ClickModes";

export class Spawner {
	canSpawn = false;
	clickModes: ClickModes;

	private constructor(
		public scene: Gameplay,
		public pool: Towers,
		private spawnObj,
		enableEvent: string,
		disableEvent: string,
		private cost: number
	) {
		scene.events.on(enableEvent, this.enable.bind(this));
		scene.events.on(disableEvent, this.disable.bind(this));
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
			EventSetup.canBuildShooter,
			EventSetup.cannotBuildShooter,
			TowerSetup.shooterCost
		);
	}

	static createHealerSpawner(scene: Gameplay, healerPool, towerSpawnObj: TowerSpawnObj) {
		return new Spawner(
			scene,
			healerPool,
			towerSpawnObj,
			EventSetup.canBuildHealer,
			EventSetup.cannotBuildHealer,
			TowerSetup.healerCost
		);
	}
}
