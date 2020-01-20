import { Gameplay } from "../../../../scenes/Gameplay";
import { Building, BuildingSpawnConfig } from "./Building";
import { Buildings } from "./Buildings";
import { Enemies } from "../../unit/Enemies";
import { WavePopulator } from "../../wave/WavePopulator";
import { EnemyPool } from "../../../base/pool/EnemyPool";
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
		private campBuildings: Buildings,
		private spawnConfig: BuildingSpawnConfig,
		private rerouter: Rerouter
	) {}

	private createBuilding(x, y, circleSizeName) {
		return new Building(this.scene, x, y, this.physicsGroup, circleSizeName, this.color, this.campBuildings);
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
