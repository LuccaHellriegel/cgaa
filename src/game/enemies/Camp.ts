import { CampConfig } from "./camp/Camps";
import { Enemies } from "./unit/Enemies";
import { Paths } from "./path/Paths";
import { gridPartHalfSize, circleSizeNames } from "../base/globals/globalSizes";
import { EnemyFactory } from "./unit/EnemyFactory";
import { BossBarrier } from "./boss/BossBarrier";
import { bigCircleWithChain, numberOfBuildings, campGroupComposition } from "./camp/campConfig";
import { BossCampPopulator } from "./boss/BossCampPopulator";
import { BoosPool } from "./boss/BossPool";
import { EnemySpawnObj } from "../base/spawn/EnemySpawnObj";
import { Point } from "../base/types";
import { Exits } from "./path/Exits";
import { Membership } from "../base/classes/Membership";
import { Buildings } from "./camp/building/Buildings";
import { BuildingSpawn } from "./camp/building/BuildingSpawn";
import { BuildingFactory } from "./camp/building/BuildingFactory";
import { relativeCoordinateToReal } from "../base/position";
import { EnemyPool } from "../base/pool/EnemyPool";
import { CampPopulator } from "./camp/CampPopulator";

class Populator {
	//TODO boss populator starts two waves or three
	start() {}
}

export interface FactoryConfigPairs {
	factoryFunc;
	configs: any[];
}

export class Instantiator {
	constructor(private pair: FactoryConfigPairs) {}
	instantiate() {
		return Instantiator.instantiate(this.pair);
	}

	static instantiate(pair: FactoryConfigPairs) {
		return pair.configs.map(config => {
			return pair.factoryFunc(config);
		});
	}
}

class KingInstantiator extends Instantiator {
	constructor(config: CampConfig, enemies: Enemies) {
		let kingConfig = {
			scene: config.staticConfig.scene,
			color: config.color,
			//TODO: fix color then I can fix this
			size: "",
			x: (2 * gridPartHalfSize * config.areaConfig.wallBase.sizeOfXAxis) / 2 + config.areaConfig.topLeftX,
			y: (2 * gridPartHalfSize * config.areaConfig.wallBase.sizeOfXAxis) / 2 + config.areaConfig.topLeftY,
			weaponType: "chain",
			physicsGroup: config.enemyPhysicGroup,
			weaponGroup: config.weaponPhysicGroup
		};

		let kingPair: FactoryConfigPairs = {
			configs: [kingConfig],
			factoryFunc: config => {
				return EnemyFactory.createKing(config, enemies);
			}
		};

		super(kingPair);
	}
}

class InteractInstantiator extends Instantiator {
	constructor(config: CampConfig, enemies: Enemies) {
		let { x, y } = Exits.exitToGlobalPoint(config.areaConfig);

		let interactConfig = {
			scene: config.staticConfig.scene,
			color: config.color,
			//TODO: fix color then I can fix this
			size: "",
			x,
			y,
			weaponType: "chain",
			physicsGroup: config.enemyPhysicGroup,
			weaponGroup: config.weaponPhysicGroup
		};

		let interactPair: FactoryConfigPairs = {
			configs: [interactConfig],
			factoryFunc: config => {
				return EnemyFactory.createInteractionCircle(config, enemies);
			}
		};

		super(interactPair);
	}
}

class BarrierInstantiator extends Instantiator {
	constructor(config: CampConfig, points: Point[]) {
		let barrierConfigs = points.map(point => {
			return {
				scene: config.staticConfig.scene,
				physicsGroup: config.areaConfig.wallBase.staticConfig.physicsGroup,
				x: point.x,
				y: point.y
			};
		});

		let barrierPair = {
			configs: barrierConfigs,
			factoryFunc: config => new BossBarrier(config.scene, config.x, config.y, config.physicsGroup)
		};
		super(barrierPair);
	}
}

abstract class Camp {
	protected infra: any[];
	protected specialUnits: any[];

	constructor(infra: Instantiator, populators: Populator[], specialUnits: Instantiator) {
		populators.forEach(populator => populator.start());

		this.infra = infra.instantiate();
		this.specialUnits = specialUnits.instantiate();

		console.log(this.infra, this.specialUnits);
	}
}

export class BossCamp extends Camp {
	constructor(
		config: CampConfig,
		enemies: Enemies,
		//TODO: use paths
		paths: Paths
	) {
		let bossCampGroupComposition = [bigCircleWithChain, bigCircleWithChain, bigCircleWithChain, bigCircleWithChain];

		let { x, y } = Exits.exitToGlobalPoint(config.areaConfig);

		let bossConfig = {
			scene: config.staticConfig.scene,
			color: config.color,
			//TODO: fix color then I can fix this
			size: "",
			x: 100,
			y: 100,
			weaponType: "chain",
			physicsGroup: config.enemyPhysicGroup,
			weaponGroup: config.weaponPhysicGroup
		};

		super(
			new BarrierInstantiator(config, [
				{ x, y },
				{ x, y: y + 2 * gridPartHalfSize },
				{ x, y: y + 4 * gridPartHalfSize }
			]),
			[
				new BossCampPopulator(
					config.staticConfig.scene,
					new BoosPool(config.staticConfig.scene, 4, bossCampGroupComposition, bossConfig, enemies),
					EnemySpawnObj.createAreaEnemySpawnObj(config.map, config.areaConfig, enemies)
				)
			],
			new KingInstantiator(config, enemies)
		);
	}
}

class BuildingInstantiator extends Instantiator {
	constructor(config: CampConfig, paths: Paths, enemies: Enemies) {
		let spawnPositions = new BuildingSpawn(
			config.map,
			config.areaConfig,
			numberOfBuildings
		).getRandomBuildingSpawnPositions();
		let buildings = new Buildings(config.staticConfig.scene, spawnPositions, config.color);

		let factory = new BuildingFactory(
			config.staticConfig.scene,
			config.staticConfig.physicsGroup,
			config.color,
			enemies,
			buildings,
			{
				enemyPhysicGroup: config.enemyPhysicGroup,
				weaponPhysicGroup: config.weaponPhysicGroup
			},
			paths
		);

		let buildingConfigs = spawnPositions.map((pos, index) => {
			return {
				x: relativeCoordinateToReal(pos[0]),
				y: relativeCoordinateToReal(pos[1]),
				size: circleSizeNames[index]
			};
		});

		let buildingPair: FactoryConfigPairs = {
			configs: buildingConfigs,
			factoryFunc: buildingConfig => {
				return factory.setupBuilding(buildingConfig.x, buildingConfig.y, buildingConfig.size);
			}
		};
		super(buildingPair);
	}
}

class EnemyCamp extends Camp {
	buildings: Buildings;
	constructor(
		config: CampConfig,
		enemies: Enemies,
		//TODO: use paths
		paths: Paths,
		membership: Membership
	) {
		let spawnPositions = new BuildingSpawn(
			config.map,
			config.areaConfig,
			numberOfBuildings
		).getRandomBuildingSpawnPositions();

		//TODO: use buildings from Instantiator -> make param
		let buildings = new Buildings(config.staticConfig.scene, spawnPositions, config.color);

		let enemyConfig = {
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
		let populator = new CampPopulator(
			config.staticConfig.scene,
			enemyPool,
			EnemySpawnObj.createAreaEnemySpawnObj(config.map, config.areaConfig, enemies),
			buildings
		);

		super(new BuildingInstantiator(config, paths, enemies), [populator], new InteractInstantiator(config, enemies));

		this.buildings = buildings;
		this.buildings.buildings = this.infra;

		//TODO: essential sounds weird, essential = if this is destroyed, the camp is destroyed
		//TODO: bug, even if interactionUnit lives, if buildings are destroyed, camp is destroyed
		membership.addAll(this.specialUnits, "interaction", "essential");
		membership.addAll(this.infra, "essential");
	}
}
