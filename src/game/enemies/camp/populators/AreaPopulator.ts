import { Populator } from "./Populator";
import { EnemyConfig } from "../unit/EnemyFactory";
import { relativePositionToPoint } from "../../../base/position";
import { EnemySpawnObj } from "../../../base/spawn/EnemySpawnObj";
import { EnemyPool } from "./EnemyPool";

export class AreaPopulator extends Populator {
	enemyPool: EnemyPool;
	constructor(enemyConfig: EnemyConfig, enemySpawnObj: EnemySpawnObj) {
		super(enemyConfig.scene, enemySpawnObj, enemyConfig.color);

		let bigCircleWithRand = { weaponType: "rand", size: "Big" };
		let bigCircleWithChain = { weaponType: "chain", size: "Big" };
		let normalCircleWithRand = { weaponType: "rand", size: "Normal" };
		let normalCircleWithChain = { weaponType: "chain", size: "Normal" };

		this.enemyPool = new EnemyPool({
			enemyConfig,
			numberOfGroups: 4,
			groupComposition: [
				bigCircleWithRand,
				bigCircleWithChain,
				bigCircleWithChain,
				normalCircleWithRand,
				normalCircleWithChain
			]
		});
	}

	createEnemy() {
		let spawnPosition = this.enemySpawnObj.getRandomSpawnPosition();
		if (spawnPosition) {
			let { x, y } = relativePositionToPoint(spawnPosition[0], spawnPosition[1]);

			let enemy = this.enemyPool.pop();

			enemy.state = "guard";
			enemy.dontAttackList = this.dontAttackList;
			enemy.activate(x, y);
			return enemy;
		}
		return null;
	}

	doMoreSpawn() {
		return this.enemyCount != 5;
	}
}
