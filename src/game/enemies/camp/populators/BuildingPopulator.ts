import { Populator } from "./Populator";
import { EnemyConfig } from "../unit/EnemyFactory";
import { EnemySpawnObj } from "../../../base/spawn/EnemySpawnObj";
import { constructXYID } from "../../../base/id";
import { EnemyPool } from "./EnemyPool";

export class BuildingPopulator extends Populator {
	enemyPool: EnemyPool;
	pathDict;
	otherColor = "";

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

		enemyConfig.scene.events.on("reroute-" + enemyConfig.color, otherColor => (this.otherColor = otherColor));
	}

	createEnemy() {
		let spawnPosition = this.enemySpawnObj.getRandomSpawnPosition();
		if (spawnPosition) {
			let enemy = this.enemyPool.pop();

			let id = constructXYID(spawnPosition[0], spawnPosition[1]);
			if (this.otherColor !== "") {
				id += " " + this.otherColor;
			}
			enemy.pathContainer = this.pathDict[id];
			enemy.state = "ambush";
			enemy.dontAttackList = this.dontAttackList;
			enemy.activate(spawnPosition[0], spawnPosition[1]);
			return enemy;
		}
		return null;
	}

	doMoreSpawn() {
		return this.enemyCount != 3;
	}
}
