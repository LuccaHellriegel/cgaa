import { Populator } from "./Populator";
import { Building } from "../units/Building";
import { EnemyConfig, EnemyFactory } from "../units/EnemyFactory";
import EasyStar from "easystarjs";
import { PathManager } from "../path/PathManager";
import { EnemySpawnMap } from "../../spawn/EnemySpawnMap";
import { calculateRelativeSpawnPositionsAround } from "../../base/map/calculate";
import { realPosToRelativePos, relativePosToRealPos } from "../../base/map/position";

export class BuildingPopulator extends Populator {
	easyStar: EasyStar.js;
	building: Building;
	validSpawnPositions: { column: any; row: any }[];
	enemyConfig: EnemyConfig;
	pathManager: PathManager;

	constructor(enemyConfig: EnemyConfig, building: Building, enemySpawnMap: EnemySpawnMap, pathManager: PathManager) {
		super(enemyConfig.scene, enemySpawnMap);
		this.pathManager = pathManager;
		this.enemyConfig = enemyConfig;
		this.building = building;

		let { column, row } = realPosToRelativePos(building.x, building.y);
		this.validSpawnPositions = calculateRelativeSpawnPositionsAround(column, row, 3, 1);
	}

	calculateRandUnitSpawnPosition() {
		let curValidPos = this.enemySpawnMap.filterPositions(this.validSpawnPositions);
		return curValidPos[Phaser.Math.Between(0, curValidPos.length - 1)];
	}

	createEnemy() {
		let spawnPosition = this.calculateRandUnitSpawnPosition();
		if (spawnPosition) {
			let { x, y } = relativePosToRealPos(spawnPosition.column, spawnPosition.row);

			this.enemyConfig.x = x;
			this.enemyConfig.y = y;

			let choseRandWeapon = Phaser.Math.Between(0, 1) === 0 ? true : false;
			if (choseRandWeapon) {
				this.enemyConfig.weaponType = "rand";
			} else {
				this.enemyConfig.weaponType = "chain";
			}
			let enemy = EnemyFactory.createEnemy(this.enemyConfig);

			enemy.pathContainer = this.pathManager.getSpecificPathForSpawnPos(spawnPosition.column, spawnPosition.row);
			enemy.state = "ambush";
			enemy.dontAttackList = this.dontAttackList;
			return enemy;
		}
		return null;
	}

	doMoreSpawn() {
		return this.enemyCount != 3;
	}
}
