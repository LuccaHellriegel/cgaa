import { BuildingSpawn } from "./building/BuildingSpawn";
import { Enemies } from "../unit/Enemies";
import { numberOfBuildings, campGroupComposition } from "./campConfig";
import { Buildings } from "./building/Buildings";
import { EnemyFactory } from "../unit/EnemyFactory";
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
	private factory: EnemyFactory;
	hostile = true;
	id: string;

	constructor(
		private config: CampConfig,
		private enemies: Enemies,
		private paths: Paths,
		private membership: Membership
	) {
		this.id = this.config.color;

		this.factory = new EnemyFactory(
			this.config.staticConfig.scene,
			this.config.color,
			{
				physicsGroup: this.config.enemyPhysicGroup,
				weaponGroup: this.config.weaponPhysicGroup
			},
			this.enemies
		);

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
		let enemyPool = new EnemyPool(this.config.staticConfig.scene, 4, campGroupComposition, this.enemies, this.factory);
		new CampPopulator(
			this.config.staticConfig.scene,
			enemyPool,
			EnemySpawnObj.createAreaEnemySpawnObj(this.config.map, this.config.areaConfig, this.enemies),
			this.buildings
		);
		this.createInteractionUnit(this.config);
	}

	private createInteractionUnit(config: CampConfig) {
		let circleConfig = { ...Exits.exitToGlobalPoint(config.areaConfig), size: "Big", weaponType: "rand" };
		this.interactionUnit = this.factory.createInteractionCircle(circleConfig);
	}

	private addMemberships() {
		//TODO: essential sounds weird, essential = if this is destroyed, the camp is destroyed
		//TODO: bug, even if interactionUnit lives, if buildings are destroyed, camp is destroyed
		this.membership.add(this.interactionUnit, "interaction", "essential");
		this.membership.addAll([...this.buildings.buildings], "essential");
	}

	isDestroyed() {
		return this.buildings.areDestroyed();
	}

	isHostile() {
		return this.hostile;
	}
}
