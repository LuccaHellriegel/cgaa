import { Populator } from "./Populator";
import { EnemyConfig, EnemyFactory } from "../units/EnemyFactory";
import { EnemySpawnObj } from "../../spawn/EnemySpawnObj";
import { relativePosToRealPos } from "../../base/map/position";

export class AreaPopulator extends Populator {
	enemyConfig: EnemyConfig;

	constructor(enemyConfig: EnemyConfig, enemySpawnObj: EnemySpawnObj) {
		super(enemyConfig.scene, enemySpawnObj, enemyConfig.color);
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

			enemy.state = "guard";
			enemy.dontAttackList = this.dontAttackList;
			return enemy;
		}
		return null;
	}

	doMoreSpawn() {
		return this.enemyCount != 20;
	}
}
