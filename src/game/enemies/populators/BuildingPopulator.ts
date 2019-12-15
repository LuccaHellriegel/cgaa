import { Populator } from "./Populator";
import { EnemyConfig } from "../unit/EnemyFactory";
import { relativePosToRealPos } from "../../base/position";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";
import { constructColumnRowID } from "../../base/id";
import { EnemyPool } from "./EnemyPool";

export class BuildingPopulator extends Populator {
	enemyPool: EnemyPool;
	pathDict;

	constructor(enemyConfig: EnemyConfig, enemySpawnObj: EnemySpawnObj, pathDict) {
		super(enemyConfig.scene, enemySpawnObj, enemyConfig.color);
		this.pathDict = pathDict;

		let bigCircleWithRand = { weaponType: "rand", size: "Big" };
		let bigCircleWithChain = { weaponType: "chain", size: "Big" };
		let normalCircleWithRand = { weaponType: "rand", size: "Normal" };
		let normalCircleWithChain = { weaponType: "chain", size: "Normal" };

		this.enemyPool = new EnemyPool({
			enemyConfig,
			numberOfGroups: 1,
			groupComposition: [bigCircleWithRand, bigCircleWithChain, normalCircleWithRand, normalCircleWithChain]
		});
	}

	createEnemy() {
		let spawnPosition = this.enemySpawnObj.getRandomSpawnPosition();
		if (spawnPosition) {
			let { x, y } = relativePosToRealPos(spawnPosition[0], spawnPosition[1]);

			let enemy = this.enemyPool.pop();
			enemy.pathContainer = this.pathDict[constructColumnRowID(spawnPosition[0], spawnPosition[1])];
			enemy.state = "ambush";
			enemy.dontAttackList = this.dontAttackList;
			enemy.activate(x, y);
			return enemy;
		}
		return null;
	}

	doMoreSpawn() {
		return this.enemyCount != 3;
	}
}
