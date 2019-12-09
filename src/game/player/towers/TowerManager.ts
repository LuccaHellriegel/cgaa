import { Tower } from "./Tower";
import { Gameplay } from "../../../scenes/Gameplay";
import { towerHalfSize } from "../../../globals/globalSizes";
import { getRelativePosOfElementsAndAroundElements } from "../../base/position";
import { findClosestTower, snapTowerPosToClosestTower } from "./towers";
import { TowerModus } from "../input/TowerModus";
import { SpawnManager } from "../../enemies/spawn/SpawnManager";

export class TowerManager {
	towerGroup: Phaser.Physics.Arcade.StaticGroup;
	scene: Gameplay;
	sightGroup: Phaser.Physics.Arcade.StaticGroup;
	bulletGroup: Phaser.Physics.Arcade.Group;
	towers: Tower[] = [];
	towerModus: TowerModus;
	spawnManager: SpawnManager;

	constructor(scene, towerGroup, sightGroup, bulletGroup, towerModus, spawnManager) {
		this.scene = scene;

		this.spawnManager = spawnManager;

		this.towerModus = towerModus;

		this.towerGroup = towerGroup;

		this.sightGroup = sightGroup;
		this.bulletGroup = bulletGroup;
	}

	getRelativeTowerPositionsAndAroundTowerPositions() {
		return getRelativePosOfElementsAndAroundElements(this.towers, 1, 1);
	}

	private playInvalidTowerPosAnim() {
		this.towerModus.ghostTower.anims.play("invalid-tower-pos");
	}

	spawnNewTower(x, y) {
		if (!(x < 0 || y < 0)) {
			let { closestTower, dist } = findClosestTower(this.towers, x, y);
			if (dist < 3.5 * towerHalfSize) {
				let resultXY = snapTowerPosToClosestTower(closestTower, x, y);
				if (resultXY === null) {
					this.playInvalidTowerPosAnim();
					return;
				}

				let { newX, newY } = resultXY;
				x = newX;
				y = newY;
			}

			if (this.spawnManager.evaluateRealSpawnPosOfTower(x, y)) {
				let tower = new Tower(this.scene, x, y, this.towerGroup, this.sightGroup, this.bulletGroup);
				this.scene.events.emit("added-tower", tower);
				this.towers.push(tower);
			} else {
				this.playInvalidTowerPosAnim();
			}
		} else {
			this.playInvalidTowerPosAnim();
		}
	}
}
