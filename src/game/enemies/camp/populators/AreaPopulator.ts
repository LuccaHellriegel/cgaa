import { Populator } from "./Populator";
import { EnemyConfig } from "../unit/EnemyFactory";
import { EnemySpawnObj } from "../../../base/spawn/EnemySpawnObj";
import { EnemyPool } from "./EnemyPool";
import { numberOfBuildings } from "../camp";
import { removeEle } from "../../../base/utils";

export class AreaPopulator extends Populator {
	enemyPool: EnemyPool;
	destroyedBuildingCounter = 0;

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

		enemyConfig.scene.events.on("building-destroyed-" + enemyConfig.color, () => {
			this.destroyedBuildingCounter++;
			if (this.destroyedBuildingCounter == numberOfBuildings) {
				enemyConfig.scene.events.emit("destroyed-" + enemyConfig.color);
				removeEle(enemyConfig.color, enemyConfig.scene.cgaa.activeCamps);
				this.destroy();
			}
		});
	}

	createEnemy() {
		let spawnPosition = this.enemySpawnObj.getRandomSpawnPosition();
		if (spawnPosition) {
			let enemy = this.enemyPool.pop();

			enemy.state = "guard";
			enemy.dontAttackList = this.dontAttackList;
			enemy.poolActivate(spawnPosition[0], spawnPosition[1]);
			return enemy;
		}
		return null;
	}

	doMoreSpawn() {
		return this.enemyCount != 5;
	}
}
