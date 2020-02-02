import { Enemies } from "../unit/Enemies";
import { numberOfBuildings, campGroupComposition } from "./campConfig";
import { Buildings } from "./building/Buildings";
import { CircleFactory } from "../unit/CircleFactory";
import { EnemyPool } from "../../base/pool/EnemyPool";
import { CampPopulator } from "./CampPopulator";
import { CampConfig } from "./Camps";
import { BuildingFactory } from "./building/BuildingFactory";
import { Paths } from "../path/Paths";
import { Exits } from "../path/Exits";
import { InteractionCircle } from "../unit/InteractionCircle";
import { Membership } from "../../base/classes/Membership";
import { EnemySpawnObj } from "../../base/spawnObj/EnemySpawnObj";
import { RandBuildingPos } from "./building/RandBuildingPos";
import { GameMap } from "../../base/GameMap";

//TODO: abstract general camp
export class Camp {
	buildings: Buildings;
	interactionUnit: InteractionCircle;
	hostile = true;
	id: string;

	constructor(
		private config: CampConfig,
		private enemies: Enemies,
		private paths: Paths,
		private membership: Membership,
		private factory: CircleFactory,
		private gameMap: GameMap,
		private enemySpawnObj: EnemySpawnObj
	) {
		this.id = this.config.color;

		this.spawnBuildings();
		this.populateCamp();
		this.addMemberships();
	}

	private spawnBuildings() {
		let buildingPositions = new RandBuildingPos(this.gameMap, this.config.areaConfig, numberOfBuildings).positions;

		this.buildings = new Buildings(this.config.staticConfig.scene, buildingPositions, this.config.color);
		this.buildings.spawnBuildings(
			new BuildingFactory(
				this.config.staticConfig.scene,
				this.config.staticConfig.physicsGroup,
				this.config.color,
				this.enemies,
				this.buildings,
				this.paths,
				this.factory
			)
		);

		this.gameMap.updateWithBuildings(buildingPositions);
	}

	private populateCamp() {
		let enemyPool = new EnemyPool(this.config.staticConfig.scene, 4, campGroupComposition, this.enemies, this.factory);
		new CampPopulator(this.config.staticConfig.scene, enemyPool, this.enemySpawnObj, this.buildings);
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
