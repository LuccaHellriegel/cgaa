import { Building, BuildingSpawnConfig } from "./Building";
import { relativeCoordinateToReal, realCoordinateToRelative } from "../../../base/position";
import { HealthBar } from "../../../base/classes/HealthBar";
import { rectBuildinghalfHeight, circleSizeNames } from "../../../base/globals/globalSizes";
import { Gameplay } from "../../../../scenes/Gameplay";
import { removeEle } from "../../../base/utils";
import { WavePopulator } from "../../wave/WavePopulator";
import { EnemyPool } from "../../population/EnemyPool";
import { buildingGroupComposition } from "../../wave/waveConfig";
import { createBuildingEnemySpawnObj } from "../../../base/spawn/spawn";
import { Enemies } from "../../unit/Enemies";
import { BuildingInfo } from "../../../base/interfaces";
import { Rerouter } from "../../path/Rerouter";

export class CampBuildings {
	buildings: Building[] = [];

	constructor(
		private scene: Gameplay,
		private spawnPositions: number[][],
		private spawnConfig: BuildingSpawnConfig,
		public color: string,
		private physicsGroup: Phaser.Physics.Arcade.StaticGroup,
		private enemies: Enemies,
		private rerouter: Rerouter
	) {
		this.spawnBuildings();
	}

	private spawnBuildings() {
		for (let index = 0, length = this.spawnPositions.length; index < length; index++) {
			let pos = this.spawnPositions[index];

			let x = relativeCoordinateToReal(pos[0]);
			let y = relativeCoordinateToReal(pos[1]);

			let healthbar = new HealthBar(x - 25, y - rectBuildinghalfHeight, {
				posCorrectionX: 0,
				posCorrectionY: -rectBuildinghalfHeight,
				healthWidth: 46,
				healthLength: 12,
				value: 100,
				scene: this.scene
			});

			this.buildings.push(
				new Building(this.scene, x, y, this.physicsGroup, circleSizeNames[index], this.color, healthbar, this)
			);

			new WavePopulator(
				this.scene,
				this.color,
				new EnemyPool(
					this.scene,
					1,
					buildingGroupComposition,
					{
						scene: this.scene,
						color: this.color,
						size: "Big",
						x: 100,
						y: 100,
						weaponType: "rand",
						physicsGroup: this.spawnConfig.enemyPhysicGroup,
						weaponGroup: this.spawnConfig.weaponPhysicGroup
					},
					this.enemies
				),
				createBuildingEnemySpawnObj(realCoordinateToRelative(x), realCoordinateToRelative(y), this.enemies),
				this,
				this.rerouter
			);
		}
	}

	remove(building: Building) {
		removeEle(building, this.buildings);
	}

	areDestroyed() {
		return this.buildings.length === 0;
	}

	getBuildingInfo(): BuildingInfo {
		return { color: this.color, spawnPositions: this.spawnPositions };
	}
}
