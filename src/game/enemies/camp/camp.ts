import { StaticConfig, ZeroOneMap } from "../../base/types";
import { createAreaEnemySpawnObj } from "../../base/spawn/spawn";
import { spawnBuildings, updateMapWithBuildings } from "./building";
import { EnemyConfig, EnemyFactory } from "./unit/EnemyFactory";
import { exitToGlobalPoint } from "../../base/position";
import { AreaConfig, BuildingInfo } from "../../base/interfaces";
import { Gameplay } from "../../../scenes/Gameplay";
import { PhysicGroups } from "../../collision/collisionBase";
import { getRandomCampColorOrder } from "../../base/globals/global";
import { getRandomBuildingSpawnPositions } from "./buildingSpawn";
import { setupAreaPopulation } from "./populators/aPopulation";

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
	enemyConfig.x = x;
	enemyConfig.y = y;
	let circle = EnemyFactory.createInteractionCircle(enemyConfig);
	config.staticConfig.scene.cgaa.interactionElements.push(circle);
}

export const numberOfBuildings = 3;

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
		x: 100,
		y: 100,
		weaponType: "rand",
		physicsGroup: config.enemyPhysicGroup,
		weaponGroup: config.weaponPhysicGroup
	};

	config.staticConfig.scene.cgaa.camps[config.color]["area"] = {};
	config.staticConfig.scene.cgaa.camps[config.color]["area"]["enemySpawnObj"] = createAreaEnemySpawnObj(
		config.map,
		config.areaConfig,
		config.enemyDict
	);
	config.staticConfig.scene.cgaa.camps[config.color]["area"]["enemyConfig"] = enemyConfig;

	setupAreaPopulation(config.staticConfig.scene, config.color);
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
