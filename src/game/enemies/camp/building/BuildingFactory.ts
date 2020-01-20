import { Gameplay } from "../../../../scenes/Gameplay";
import { HealthBar } from "../../../base/classes/HealthBar";
import { rectBuildinghalfHeight } from "../../../base/globals/globalSizes";
import { Building, BuildingSpawnConfig } from "./Building";
import { CampBuildings } from "./CampBuildings";
import { Enemies } from "../../unit/Enemies";
import { WavePopulator } from "../../wave/WavePopulator";
import { EnemyPool } from "../../population/EnemyPool";
import { buildingGroupComposition } from "../../wave/waveConfig";
import { createBuildingEnemySpawnObj } from "../../../base/spawn/spawn";
import { realCoordinateToRelative } from "../../../base/position";
import { Rerouter } from "../../path/Rerouter";

export class BuildingFactory {
	constructor(
		private scene: Gameplay,
		private physicsGroup: Phaser.Physics.Arcade.StaticGroup,
		private color: string,
		private enemies: Enemies,
		private campBuildings: CampBuildings,
		private spawnConfig: BuildingSpawnConfig,
		private rerouter: Rerouter
	) {}

	private createBuilding(x, y, circleSizeName) {
		let healthbar = new HealthBar(x - 25, y - rectBuildinghalfHeight, {
			posCorrectionX: 0,
			posCorrectionY: -rectBuildinghalfHeight,
			healthWidth: 46,
			healthLength: 12,
			value: 100,
			scene: this.scene
		});
		return new Building(this.scene, x, y, this.physicsGroup, circleSizeName, this.color, healthbar, this.campBuildings);
	}

	private setupWave(x, y) {
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
			this.campBuildings,
			this.rerouter
		);
	}

	setupBuilding(x, y, circleSizeName) {
		this.setupWave(x, y);
		return this.createBuilding(x, y, circleSizeName);
	}
}
