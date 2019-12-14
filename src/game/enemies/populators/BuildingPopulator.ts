import { Populator } from "./Populator";
import { EnemyConfig, EnemyFactory } from "../unit/EnemyFactory";
import { relativePosToRealPos } from "../../base/position";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";
import { constructColumnRowID } from "../../base/id";

export class BuildingPopulator extends Populator {
	enemyConfig: EnemyConfig;
	pathDict;

	constructor(enemyConfig: EnemyConfig, enemySpawnObj: EnemySpawnObj, pathDict) {
		super(enemyConfig.scene, enemySpawnObj, enemyConfig.color);
		this.pathDict = pathDict;
		this.enemyConfig = enemyConfig;
	}

	createEnemy() {
		let spawnPosition = this.enemySpawnObj.getRandomSpawnPosition();
		if (spawnPosition) {
			let { x, y } = relativePosToRealPos(spawnPosition[0], spawnPosition[1]);

			this.enemyConfig.x = x;
			this.enemyConfig.y = y;

			let choseRandWeapon = Phaser.Math.Between(0, 1) === 0 ? true : false;
			if (choseRandWeapon) {
				this.enemyConfig.weaponType = "rand";
			} else {
				this.enemyConfig.weaponType = "chain";
			}
			let enemy = EnemyFactory.createEnemy(this.enemyConfig);
			enemy.pathContainer = this.pathDict[constructColumnRowID(spawnPosition[0], spawnPosition[1])];
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
