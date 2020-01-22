import { BuildingSpawn } from "./building/BuildingSpawn";
import { Enemies } from "../unit/Enemies";
import { numberOfBuildings, campGroupComposition } from "./campConfig";
import { Buildings } from "./building/Buildings";
import { EnemyConfig, EnemyFactory } from "../unit/EnemyFactory";
import { EnemyPool } from "../../base/pool/EnemyPool";
import { CampPopulator } from "./CampPopulator";
import { createAreaEnemySpawnObj } from "../../base/spawn/spawn";
import { CampConfig } from "./Camps";
import { BuildingFactory } from "./building/BuildingFactory";
import { Paths } from "../path/Paths";
import { Exits } from "../path/Exits";
import { InteractionCircle } from "../unit/InteractionCircle";
import { Membership } from "../../base/classes/Membership";

export class Camp {
	campBuildings: Buildings;
	interactionUnit: InteractionCircle;

	constructor(
		private config: CampConfig,
		private enemies: Enemies,
		private paths: Paths,
		private membership: Membership
	) {
		this.spawnBuildings();
		this.populateCamp();
		this.addMemberships();
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
				this.paths
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
		let { x, y } = Exits.exitToGlobalPoint(config.areaConfig);
		enemyConfig.x = x;
		enemyConfig.y = y;
		this.interactionUnit = EnemyFactory.createInteractionCircle(enemyConfig, enemies);
	}

	private addMemberships() {
		this.membership.add(this.interactionUnit, "interaction", "essential");
		this.membership.addAll([...this.campBuildings.buildings], "essential");
	}
}
