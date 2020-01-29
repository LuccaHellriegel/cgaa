import { Gameplay } from "../../../scenes/Gameplay";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";
import { BoosPool } from "./BossPool";

export class BossCampPopulator {
	constructor(private scene: Gameplay, private enemyPool: BoosPool, private enemySpawnObj: EnemySpawnObj) {
		this.startWave();
	}

	private startWave() {
		//TODO: if king destroyed stop (or maybe not necessary because its Game End)

		let maxBossPopulation = 10;

		let areaIsPopulated = this.enemyPool.activeIDArr.length === maxBossPopulation;
		if (!areaIsPopulated) {
			let leftToSpawn = maxBossPopulation - this.enemyPool.activeIDArr.length;
			this.spawnEnemy(leftToSpawn);
		}

		this.scene.time.addEvent({
			delay: 40000,
			callback: () => {
				this.startWave();
			},
			repeat: 0
		});
	}

	//TODO: activate units only once boss camp is unlocked

	private spawnEnemy(leftToSpawn: number) {
		let spawnPosition = this.enemySpawnObj.getRandomSpawnPosition();
		if (spawnPosition) {
			let enemy = this.enemyPool.pop();
			enemy.state = "guard";
			enemy.poolActivate(spawnPosition[0], spawnPosition[1]);
			leftToSpawn--;
		}
		if (leftToSpawn > 0) {
			this.scene.time.addEvent({
				delay: 4000,
				callback: () => {
					this.spawnEnemy(leftToSpawn);
				},
				repeat: 0
			});
		}
	}
}
