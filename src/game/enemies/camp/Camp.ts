import { BuildingSpawn } from "./building/BuildingSpawn";
import { Enemies } from "../unit/Enemies";
import { numberOfBuildings, campGroupComposition } from "./campConfig";
import { Buildings } from "./building/Buildings";
import { EnemyConfig, EnemyFactory } from "../unit/EnemyFactory";
import { EnemyPool } from "../../base/pool/EnemyPool";
import { CampPopulator } from "./CampPopulator";
import { CampConfig } from "./Camps";
import { BuildingFactory } from "./building/BuildingFactory";
import { Paths } from "../path/Paths";
import { Exits } from "../path/Exits";
import { InteractionCircle } from "../unit/InteractionCircle";
import { Membership } from "../../base/classes/Membership";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";

//TODO: abstract general camp
export class Camp {
	buildings: Buildings;
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
		this.buildings = new Buildings(
			this.config.staticConfig.scene,
			new BuildingSpawn(this.config.map, this.config.areaConfig, numberOfBuildings).getRandomBuildingSpawnPositions(),
			this.config.color
		);
		this.buildings.spawnBuildings(
			new BuildingFactory(
				this.config.staticConfig.scene,
				this.config.staticConfig.physicsGroup,
				this.config.color,
				this.enemies,
				this.buildings,
				{
					enemyPhysicGroup: this.config.enemyPhysicGroup,
					weaponPhysicGroup: this.config.weaponPhysicGroup
				},
				this.paths
			)
		);
	}

	private populateCamp() {
		let enemyPool = new EnemyPool(
			this.config.staticConfig.scene,
			4,
			campGroupComposition,
			this.enemies,
			this.config.color,
			this.config.enemyPhysicGroup,
			this.config.weaponPhysicGroup
		);
		new CampPopulator(
			this.config.staticConfig.scene,
			enemyPool,
			EnemySpawnObj.createAreaEnemySpawnObj(this.config.map, this.config.areaConfig, this.enemies),
			this.buildings
		);
		this.createInteractionUnit(this.config, this.enemies);
	}

	private createInteractionUnit(config: CampConfig, enemies: Enemies) {
		let enemyConfig = {
			scene: this.config.staticConfig.scene,
			color: this.config.color,
			size: "Big",
			x: 100,
			y: 100,
			weaponType: "rand",
			physicsGroup: this.config.enemyPhysicGroup,
			weaponGroup: this.config.weaponPhysicGroup
		};
		let { x, y } = Exits.exitToGlobalPoint(config.areaConfig);
		enemyConfig.x = x;
		enemyConfig.y = y;
		this.interactionUnit = EnemyFactory.createInteractionCircle(enemyConfig, enemies);
	}

	private addMemberships() {
		//TODO: essential sounds weird, essential = if this is destroyed, the camp is destroyed
		//TODO: bug, even if interactionUnit lives, if buildings are destroyed, camp is destroyed
		this.membership.add(this.interactionUnit, "interaction", "essential");
		this.membership.addAll([...this.buildings.buildings], "essential");
	}
}
