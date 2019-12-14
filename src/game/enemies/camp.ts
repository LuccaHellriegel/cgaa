import { StaticConfig, ZeroOneMap } from "../base/types";
import { createBuildingSpawnObj, createAreaEnemySpawnObj, createBuildingEnemySpawnObj } from "../base/spawn/spawn";
import { spawnBuildings, updateMapWithBuildings } from "./building";
import { EnemyCircle } from "./units/EnemyCircle";
import { AreaPopulator } from "./populators/AreaPopulator";
import { BuildingPopulator } from "./populators/BuildingPopulator";
import { EnemyConfig, EnemyFactory } from "./units/EnemyFactory";
import { addInteractionEle } from "../base/events/elements";
import { relativePosToRealPos, exitToGlobalPositon } from "../base/position";
import { AreaConfig } from "../base/interfaces";

export interface CampConfig {
	staticConfig: StaticConfig;
	map: ZeroOneMap;
	areaConfig: AreaConfig;
	color: string;
	enemies: EnemyCircle[];
	pathDict;
	enemyPhysicGroup: Phaser.Physics.Arcade.Group;
	weaponPhysicGroup: Phaser.Physics.Arcade.Group;
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
	addInteractionEle(config.staticConfig.scene, circle);
	config.enemies.push(circle);
}

function createBuildingPopulators(config: CampConfig, positions) {
	for (let index = 0, length = positions.length; index < length; index++) {
		let enemySpawnObj = createBuildingEnemySpawnObj(positions[index][0], positions[index][1], config.enemies);
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
		new BuildingPopulator(enemyConfig, enemySpawnObj, config.pathDict);
	}
}

export function createCamp(config: CampConfig): number[][] {
	let buildingSpawnObj = createBuildingSpawnObj(config.map, config.areaConfig);
	let positions = spawnBuildings({ buildingSpawnObj, color: config.color, staticConfig: config.staticConfig });
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

	let areaEnemySpawnObj = createAreaEnemySpawnObj(config.map, config.areaConfig, config.enemies);
	new AreaPopulator(enemyConfig, areaEnemySpawnObj);

	createInteractionUnit(config, enemyConfig);

	createBuildingPopulators(config, positions);

	return positions;
}

export function createCamps(configs: CampConfig[]): number[][] {
	let positions: number[][] = [];
	for (let index = 0, length = configs.length; index < length; index++) {
		positions = positions.concat(createCamp(configs[index]));
	}
	return positions;
}
