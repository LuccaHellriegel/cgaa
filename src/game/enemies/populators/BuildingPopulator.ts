import { Populator } from "./Populator";
import { Building } from "../buildings/Building";
import { EnemyConfig, EnemyFactory } from "../units/EnemyFactory";
import { realPosToRelativePos, relativePosToRealPos } from "../../base/position";
import EasyStar from "easystarjs";
import { calculateRelativeSpawnPositionsAround } from "../spawn/spawn";
import { SpawnManager } from "../spawn/SpawnManager";
import { PathManager } from "../path/PathManager";

export class BuildingPopulator extends Populator {
	easyStar: EasyStar.js;
	building: Building;
	validSpawnPositions: { column: any; row: any }[];
	enemyConfig: EnemyConfig;
	spawnManager: SpawnManager;
	pathManager: PathManager;

	constructor(enemyConfig: EnemyConfig, building: Building, spawnManager: SpawnManager, pathManager: PathManager) {
		super(enemyConfig.scene, spawnManager);
		this.pathManager = pathManager;
		this.enemyConfig = enemyConfig;

		let { column, row } = realPosToRelativePos(building.x, building.y);
		this.validSpawnPositions = calculateRelativeSpawnPositionsAround(column, row, 3, 1);
	}

	calculateRandUnitSpawnPosition() {
		let curValidPos = this.spawnManager.filterForValidEnemySpawnPos(this.validSpawnPositions);
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
			return enemy;
		}
		return null;
	}

	doMoreSpawn() {
		return this.enemyCount != 3;
	}
}
