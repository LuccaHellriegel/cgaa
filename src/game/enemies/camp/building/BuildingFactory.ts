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
import { EnemyFactory } from "../../unit/EnemyFactory";

export class BuildingFactory {
	constructor(
		private scene: Gameplay,
		private physicsGroup: Phaser.Physics.Arcade.StaticGroup,
		private color: string,
		private enemies: Enemies,
		private buildings: Buildings,
		private spawnConfig: BuildingSpawnConfig,
		private paths: Paths
	) {}

	private createBuilding(x, y, circleSizeName) {
		return new Building(this.scene, x, y, this.physicsGroup, circleSizeName, this.color, this.buildings);
	}

	private setupWave(x, y) {
		let factory = new EnemyFactory(
			this.scene,
			this.color,
			{
				physicsGroup: this.spawnConfig.enemyPhysicGroup,
				weaponGroup: this.spawnConfig.weaponPhysicGroup
			},
			this.enemies
		);

		new WavePopulator(
			this.scene,
			this.color,
			new EnemyPool(this.scene, 1, buildingGroupComposition, this.enemies, factory),
			EnemySpawnObj.createBuildingEnemySpawnObj(realCoordinateToRelative(x), realCoordinateToRelative(y), this.enemies),
			this.buildings,
			this.paths
		);
	}

	setupBuilding(x, y, circleSizeName) {
		this.setupWave(x, y);
		return this.createBuilding(x, y, circleSizeName);
	}
}
