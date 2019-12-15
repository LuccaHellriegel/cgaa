import { StaticConfig, ZeroOneMap } from "../../base/types";
import { createAreaEnemySpawnObj } from "../../base/spawn/spawn";
import { spawnBuildings, updateMapWithBuildings } from "./building";
import { AreaPopulator } from "./populators/AreaPopulator";
import { EnemyConfig, EnemyFactory } from "./unit/EnemyFactory";
import { addToInteractionElements } from "../../base/events/interaction";
import { exitToGlobalPoint } from "../../base/position";
import { AreaConfig, BuildingInfo } from "../../base/interfaces";
import { Gameplay } from "../../../scenes/Gameplay";
import { PhysicGroups } from "../../collision/Collision";
import { getRandomCampColorOrder } from "../../base/globals/global";
import { getRandomBuildingSpawnPositions } from "./buildingSpawn";

interface CampConfig {
	staticConfig: StaticConfig;
	map: ZeroOneMap;
	areaConfig: AreaConfig;
	color: string;
	enemyDict;
	pathDict;
	enemyPhysicGroup: Phaser.Physics.Arcade.Group;
	weaponPhysicGroup: Phaser.Physics.Arcade.Group;
}

function constructCampConfigs(
	scene: Gameplay,
	map: ZeroOneMap,
	areaConfigs: AreaConfig[],
	enemyDict,
	physicGroups: PhysicGroups,
	pathDict
): CampConfig[] {
	let campConfigs: CampConfig[] = [];
	let colors = getRandomCampColorOrder();
	for (let index = 0, length = colors.length; index < length; index++) {
		let color = colors[index];
		let areaConfig = areaConfigs[index];
		let campConfig: CampConfig = {
			color,
			pathDict,
			enemyDict,
			map,
			areaConfig,
			staticConfig: { scene, physicsGroup: physicGroups.buildings[color] },
			enemyPhysicGroup: physicGroups.enemies[color],
			weaponPhysicGroup: physicGroups.enemyWeapons[color]
		};
		campConfigs.push(campConfig);
	}
	return campConfigs;
}

function createInteractionUnit(config: CampConfig, enemyConfig: EnemyConfig) {
	let { x, y } = exitToGlobalPoint(config.areaConfig);
	enemyConfig.size = "Normal";
	enemyConfig.weaponType = "chain";
	enemyConfig.x = x;
	enemyConfig.y = y;
	let circle = EnemyFactory.createEnemy(enemyConfig);
	circle.state = "interaction";
	circle.purpose = "interaction";
	addToInteractionElements(config.staticConfig.scene, circle);
	config.enemyDict[circle.id] = circle;
}

const numberOfBuildings = 3;

function createCamp(config: CampConfig): BuildingInfo {
	let spawnPositions = getRandomBuildingSpawnPositions(config.map, config.areaConfig, numberOfBuildings);
	let spawnConfig = {
		enemyDict: config.enemyDict,
		pathDict: config.pathDict,
		enemyPhysicGroup: config.enemyPhysicGroup,
		weaponPhysicGroup: config.weaponPhysicGroup
	};
	spawnBuildings(spawnPositions, {
		color: config.color,
		staticConfig: config.staticConfig,
		spawnConfig
	});
	updateMapWithBuildings(config.map, spawnPositions);

	let enemyConfig: EnemyConfig = {
		scene: config.staticConfig.scene,
		color: config.color,
		size: "Big",
		x: 0,
		y: 0,
		weaponType: "rand",
		physicsGroup: config.enemyPhysicGroup,
		weaponGroup: config.weaponPhysicGroup
	};

	let areaEnemySpawnObj = createAreaEnemySpawnObj(config.map, config.areaConfig, config.enemyDict);
	new AreaPopulator(enemyConfig, areaEnemySpawnObj);

	createInteractionUnit(config, enemyConfig);

	return { spawnPositions, color: config.color };
}

function createCamps(configs: CampConfig[]): BuildingInfo[] {
	let positions: BuildingInfo[] = [];
	for (let index = 0, length = configs.length; index < length; index++) {
		positions.push(createCamp(configs[index]));
	}
	return positions;
}

export function mainCamp(
	scene: Gameplay,
	map: ZeroOneMap,
	areaConfigs: AreaConfig[],
	enemyDict,
	physicGroups: PhysicGroups,
	pathDict
): BuildingInfo[] {
	let campConfigs: CampConfig[] = constructCampConfigs(scene, map, areaConfigs, enemyDict, physicGroups, pathDict);
	return createCamps(campConfigs);
}
