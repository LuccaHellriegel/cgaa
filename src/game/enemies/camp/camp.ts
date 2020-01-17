import { StaticConfig, ZeroOneMap } from "../../base/types";
import { createAreaEnemySpawnObj } from "../../base/spawn/spawn";
import { EnemyConfig, EnemyFactory } from "../unit/EnemyFactory";
import { exitToGlobalPoint } from "../../base/position";
import { AreaConfig, BuildingInfo } from "../../base/interfaces";
import { Gameplay } from "../../../scenes/Gameplay";
import { PhysicGroups } from "../../collision/collisionBase";
import { getRandomCampColorOrder } from "../../base/globals/global";
import { buildingSymbol } from "../../base/globals/globalSymbols";
import { CampPopulator } from "./CampPopulator";
import { EnemyPool } from "../population/EnemyPool";
import { campGroupComposition, numberOfBuildings } from "./campConfig";
import { CampBuildings } from "./building/CampBuildings";
import { Enemies } from "../unit/Enemies";
import { BuildingSpawn } from "./building/BuildingSpawn";

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

function createInteractionUnit(config: CampConfig, enemyConfig: EnemyConfig, enemies: Enemies) {
	let { x, y } = exitToGlobalPoint(config.areaConfig);
	enemyConfig.x = x;
	enemyConfig.y = y;
	let circle = EnemyFactory.createInteractionCircle(enemyConfig, enemies);
	config.staticConfig.scene.cgaa.interactionElements.push(circle);
}

function createCamp(config: CampConfig, enemies: Enemies): BuildingInfo {
	let spawnPositions = new BuildingSpawn(
		config.map,
		config.areaConfig,
		numberOfBuildings
	).getRandomBuildingSpawnPositions();
	let spawnConfig = {
		enemyPhysicGroup: config.enemyPhysicGroup,
		weaponPhysicGroup: config.weaponPhysicGroup
	};

	config.staticConfig.scene.cgaa.camps[config.color].buildingPopulation = {};

	config.staticConfig.scene.cgaa.camps[config.color].buildings = new CampBuildings(
		config.staticConfig.scene,
		spawnPositions,
		spawnConfig,
		config.color,
		config.staticConfig.physicsGroup,
		enemies
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
		config.color,
		enemyPool,
		createAreaEnemySpawnObj(config.map, config.areaConfig, enemies)
	);
	createInteractionUnit(config, enemyConfig, enemies);

	return { spawnPositions, color: config.color };
}

function createCamps(configs: CampConfig[], enemies: Enemies): BuildingInfo[] {
	let positions: BuildingInfo[] = [];
	for (let index = 0, length = configs.length; index < length; index++) {
		positions.push(createCamp(configs[index], enemies));
	}
	return positions;
}

export function mainCamp(
	scene: Gameplay,
	map: ZeroOneMap,
	areaConfigs: AreaConfig[],
	physicGroups: PhysicGroups,
	enemies: Enemies
): BuildingInfo[] {
	let campConfigs: CampConfig[] = constructCampConfigs(scene, map, areaConfigs, physicGroups);
	return createCamps(campConfigs, enemies);
}
