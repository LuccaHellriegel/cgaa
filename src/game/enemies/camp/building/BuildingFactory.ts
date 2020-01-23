import { Gameplay } from "../../../../scenes/Gameplay";
import { Building, BuildingSpawnConfig } from "./Building";
import { Buildings } from "./Buildings";
import { Enemies } from "../../unit/Enemies";
import { WavePopulator } from "../../wave/WavePopulator";
import { EnemyPool } from "../../../base/pool/EnemyPool";
import { buildingGroupComposition } from "../../wave/waveConfig";
import { realCoordinateToRelative } from "../../../base/position";
import { Paths } from "../../path/Paths";
import { EnemySpawnObj } from "../../../base/spawn/EnemySpawnObj";

export class BuildingFactory {
	constructor(
		private scene: Gameplay,
		private physicsGroup: Phaser.Physics.Arcade.StaticGroup,
		private color: string,
		private enemies: Enemies,
		private campBuildings: Buildings,
		private spawnConfig: BuildingSpawnConfig,
		private paths: Paths
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
			EnemySpawnObj.createBuildingEnemySpawnObj(realCoordinateToRelative(x), realCoordinateToRelative(y), this.enemies),
			this.campBuildings,
			this.paths
		);
	}

	setupBuilding(x, y, circleSizeName) {
		this.setupWave(x, y);
		return this.createBuilding(x, y, circleSizeName);
	}
}
