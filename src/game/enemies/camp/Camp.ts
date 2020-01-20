import { BuildingSpawn } from "./building/BuildingSpawn";
import { Enemies } from "../unit/Enemies";
import { numberOfBuildings, campGroupComposition } from "./campConfig";
import { Buildings } from "./building/Buildings";
import { EnemyConfig, EnemyFactory } from "../unit/EnemyFactory";
import { EnemyPool } from "../../base/pool/EnemyPool";
import { CampPopulator } from "./CampPopulator";
import { createAreaEnemySpawnObj } from "../../base/spawn/spawn";
import { exitToGlobalPoint } from "../../base/position";
import { CampConfig } from "./Camps";
import { Rerouter } from "../path/Rerouter";
import { BuildingFactory } from "./building/BuildingFactory";

export class Camp {
	campBuildings: Buildings;

	constructor(private config: CampConfig, private enemies: Enemies, private rerouter: Rerouter) {
		this.spawnBuildings();
		this.populateCamp();
	}

	private spawnBuildings() {
		this.campBuildings = new Buildings(
			this.config.staticConfig.scene,
			new BuildingSpawn(this.config.map, this.config.areaConfig, numberOfBuildings).getRandomBuildingSpawnPositions(),
			this.config.color
		);
		this.campBuildings.spawnBuildings(
			new BuildingFactory(
				this.config.staticConfig.scene,
				this.config.staticConfig.physicsGroup,
				this.config.color,
				this.enemies,
				this.campBuildings,
				{
					enemyPhysicGroup: this.config.enemyPhysicGroup,
					weaponPhysicGroup: this.config.weaponPhysicGroup
				},
				this.rerouter
			)
		);
	}

	private populateCamp() {
		let enemyConfig: EnemyConfig = {
			scene: this.config.staticConfig.scene,
			color: this.config.color,
			size: "Big",
			x: 100,
			y: 100,
			weaponType: "rand",
			physicsGroup: this.config.enemyPhysicGroup,
			weaponGroup: this.config.weaponPhysicGroup
		};

		let enemyPool = new EnemyPool(this.config.staticConfig.scene, 4, campGroupComposition, enemyConfig, this.enemies);
		new CampPopulator(
			this.config.staticConfig.scene,
			enemyPool,
			createAreaEnemySpawnObj(this.config.map, this.config.areaConfig, this.enemies),
			this.campBuildings
		);
		this.createInteractionUnit(this.config, enemyConfig, this.enemies);
	}

	private createInteractionUnit(config: CampConfig, enemyConfig: EnemyConfig, enemies: Enemies) {
		let { x, y } = exitToGlobalPoint(config.areaConfig);
		enemyConfig.x = x;
		enemyConfig.y = y;
		let circle = EnemyFactory.createInteractionCircle(enemyConfig, enemies);
		config.staticConfig.scene.cgaa.interactionElements.push(circle);
	}
}
