import { Tower } from "./Tower";
import { Gameplay } from "../../../scenes/Gameplay";
import { towerHalfSize } from "../../../globals/globalSizes";
import { BasePhysicalManagerConfig } from "../../base/config";
import { applyBasePhysicalManagerConfig } from "../../base/apply";
import { getRelativePosOfElementsAndAroundElements } from "../../base/position";
import { findClosestTower, snapTowerPosToClosestTower } from "./towers";

export class TowerManager {
	physicsGroup: Phaser.Physics.Arcade.StaticGroup;
	scene: Gameplay;
	sightGroup: Phaser.Physics.Arcade.StaticGroup;
	bulletGroup: Phaser.Physics.Arcade.Group;
	towers: Tower[] = [];

	constructor(config: BasePhysicalManagerConfig) {
		applyBasePhysicalManagerConfig(this, config);
		this.sightGroup = this.scene.physics.add.staticGroup();
		this.bulletGroup = this.scene.physics.add.group();
	}

	getRelativeTowerPositionsAndAroundTowerPositions() {
		return getRelativePosOfElementsAndAroundElements(this.towers, 1, 1);
	}

	private playInvalidTowerPosAnim() {
		this.scene.towerModus.ghostTower.anims.play("invalid-tower-pos");
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

			if (this.scene.spawnManager.evaluateRealSpawnPosOfTower(x, y)) {
				let tower = new Tower(this.scene, x, y, this.physicsGroup, this.sightGroup, this.bulletGroup);
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
