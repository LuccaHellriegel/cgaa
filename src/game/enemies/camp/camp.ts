import { StaticConfig, ZeroOneMap } from "../../base/types";
import { createAreaEnemySpawnObj } from "../../base/spawn/spawn";
import { getRandomBuildingSpawnPositions } from "./spawnBuilding";
import { EnemyConfig, EnemyFactory } from "./unit/EnemyFactory";
import { exitToGlobalPoint } from "../../base/position";
import { AreaConfig, BuildingInfo } from "../../base/interfaces";
import { Gameplay } from "../../../scenes/Gameplay";
import { PhysicGroups } from "../../collision/collisionBase";
import { getRandomCampColorOrder } from "../../base/globals/global";
import { buildingSymbol } from "../../base/globals/globalSymbols";
import { CampPopulator } from "./population/CampPopulator";
import { EnemyPool } from "./population/EnemyPool";
import { campGroupComposition } from "./population/campConfig";
import { CampBuildings } from "./CampBuildings";

interface CampConfig {
	staticConfig: StaticConfig;
	map: ZeroOneMap;
	areaConfig: AreaConfig;
	color: string;
	enemyPhysicGroup: Phaser.Physics.Arcade.Group;
	weaponPhysicGroup: Phaser.Physics.Arcade.Group;
}

function constructCampConfigs(
	scene: Gameplay,
	map: ZeroOneMap,
	areaConfigs: AreaConfig[],
	physicGroups: PhysicGroups
): CampConfig[] {
	let campConfigs: CampConfig[] = [];
	let colors = getRandomCampColorOrder();
	for (let index = 0, length = colors.length; index < length; index++) {
		let color = colors[index];
		let areaConfig = areaConfigs[index];
		let campConfig: CampConfig = {
			color,
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

function updateMapWithBuildings(map: ZeroOneMap, positions) {
	for (let index = 0, length = positions.length; index < length; index++) {
		let pos = positions[index];
		let column = pos[0];
		let row = pos[1];
		map[row][column] = buildingSymbol;
		map[row][column - 1] = buildingSymbol;
		map[row][column + 1] = buildingSymbol;
	}
}

function createCamp(config: CampConfig): BuildingInfo {
	let spawnPositions = getRandomBuildingSpawnPositions(config.map, config.areaConfig, numberOfBuildings);
	let spawnConfig = {
		enemyPhysicGroup: config.enemyPhysicGroup,
		weaponPhysicGroup: config.weaponPhysicGroup
	};

	config.staticConfig.scene.cgaa.camps[config.color].buildingPopulation = {};

	new CampBuildings(
		config.staticConfig.scene,
		spawnPositions,
		spawnConfig,
		config.color,
		config.staticConfig.physicsGroup
	);
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

	let enemyPool = new EnemyPool(config.staticConfig.scene, 4, campGroupComposition, enemyConfig);
	new CampPopulator(
		config.staticConfig.scene,
		config.color,
		enemyPool,
		createAreaEnemySpawnObj(config.map, config.areaConfig)
	);
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
	physicGroups: PhysicGroups
): BuildingInfo[] {
	let campConfigs: CampConfig[] = constructCampConfigs(scene, map, areaConfigs, physicGroups);
	return createCamps(campConfigs);
}
