import { BuildingSpawn } from "./building/BuildingSpawn";
import { Enemies } from "../unit/Enemies";
import { numberOfBuildings, campGroupComposition } from "./campConfig";
import { CampBuildings } from "./building/CampBuildings";
import { EnemyConfig, EnemyFactory } from "../unit/EnemyFactory";
import { EnemyPool } from "../population/EnemyPool";
import { CampPopulator } from "./CampPopulator";
import { createAreaEnemySpawnObj } from "../../base/spawn/spawn";
import { exitToGlobalPoint } from "../../base/position";
import { CampConfig } from "./Camps";
import { Rerouter } from "../path/Rerouter";
import { BuildingFactory } from "./building/BuildingFactory";

export class Camp {
	buildingSpawn: BuildingSpawn;
	campBuildings: CampBuildings;
	constructor(config: CampConfig, enemies: Enemies, rerouter: Rerouter) {
		this.buildingSpawn = new BuildingSpawn(config.map, config.areaConfig, numberOfBuildings);
		let spawnPositions = this.buildingSpawn.getRandomBuildingSpawnPositions();
		let spawnConfig = {
			enemyPhysicGroup: config.enemyPhysicGroup,
			weaponPhysicGroup: config.weaponPhysicGroup
		};

		this.campBuildings = new CampBuildings(spawnPositions, config.color);
		this.campBuildings.spawnBuildings(
			new BuildingFactory(
				config.staticConfig.scene,
				config.staticConfig.physicsGroup,
				config.color,
				enemies,
				this.campBuildings,
				spawnConfig,
				rerouter
			)
		);

		let enemyConfig: EnemyConfig = {
			scene: config.staticConfig.scene,
			color: config.color,
			size: "Big",
			x: 100,
			y: 100,
			weaponType: "rand",
			physicsGroup: config.enemyPhysicGroup,
			weaponGroup: config.weaponPhysicGroup
		};

		let enemyPool = new EnemyPool(config.staticConfig.scene, 4, campGroupComposition, enemyConfig, enemies);
		new CampPopulator(
			config.staticConfig.scene,
			enemyPool,
			createAreaEnemySpawnObj(config.map, config.areaConfig, enemies),
			this.campBuildings
		);
		this.createInteractionUnit(config, enemyConfig, enemies);
	}

	private createInteractionUnit(config: CampConfig, enemyConfig: EnemyConfig, enemies: Enemies) {
		let { x, y } = exitToGlobalPoint(config.areaConfig);
		enemyConfig.x = x;
		enemyConfig.y = y;
		let circle = EnemyFactory.createInteractionCircle(enemyConfig, enemies);
		config.staticConfig.scene.cgaa.interactionElements.push(circle);
	}
}
