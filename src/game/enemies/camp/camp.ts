import { StaticConfig, ZeroOneMap } from "../../base/types";
import { createBuildingSpawnObj, createAreaEnemySpawnObj } from "../../base/spawn/spawn";
import { spawnBuildings, updateMapWithBuildings } from "./building";
import { AreaPopulator } from "./populators/AreaPopulator";
import { EnemyConfig, EnemyFactory } from "./unit/EnemyFactory";
import { addToInteractionElements } from "../../base/events/interaction";
import { relativePosToRealPos, exitToGlobalPositon } from "../../base/position";
import { AreaConfig } from "../../base/interfaces";
import { Gameplay } from "../../../scenes/Gameplay";
import { PhysicGroups } from "../../collision/Collision";
import { getRandomCampColorOrder } from "../../base/globals/global";

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
	let pos = exitToGlobalPositon(config.areaConfig);
	let { x, y } = relativePosToRealPos(pos.column, pos.row);
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

function createCamp(config: CampConfig): number[][] {
	let buildingSpawnObj = createBuildingSpawnObj(config.map, config.areaConfig);
	let spawnConfig = {
		enemyDict: config.enemyDict,
		pathDict: config.pathDict,
		enemyPhysicGroup: config.enemyPhysicGroup,
		weaponPhysicGroup: config.weaponPhysicGroup
	};
	let positions = spawnBuildings({
		buildingSpawnObj,
		color: config.color,
		staticConfig: config.staticConfig,
		spawnConfig
	});
	updateMapWithBuildings(config.map, positions);

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

	return positions;
}

function createCamps(configs: CampConfig[]): number[][] {
	let positions: number[][] = [];
	for (let index = 0, length = configs.length; index < length; index++) {
		positions = positions.concat(createCamp(configs[index]));
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
): number[][] {
	let campConfigs: CampConfig[] = constructCampConfigs(scene, map, areaConfigs, enemyDict, physicGroups, pathDict);
	return createCamps(campConfigs);
}
