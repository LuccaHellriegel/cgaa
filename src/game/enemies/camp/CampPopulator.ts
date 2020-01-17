import { Gameplay } from "../../../scenes/Gameplay";
import { EnemyPool } from "../population/EnemyPool";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";
import { campMaxPopulation } from "./campConfig";

export class CampPopulator {
	constructor(
		private scene: Gameplay,
		private color: string,
		private enemyPool: EnemyPool,
		private enemySpawnObj: EnemySpawnObj
	) {
		this.startWave();
	}

	private startWave() {
		if (this.scene.cgaa.camps[this.color].buildings.areDestroyed()) {
			this.enemyPool.destroy();
			return;
		}
		let areaIsPopulated = this.enemyPool.activeIDArr.length === campMaxPopulation;
		if (!areaIsPopulated) {
			let leftToSpawn = campMaxPopulation - this.enemyPool.activeIDArr.length;
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

	private spawnEnemy(leftToSpawn: number) {
		let spawnPosition = this.enemySpawnObj.getRandomSpawnPosition();
		if (spawnPosition) {
			let enemy = this.enemyPool.pop();

			if (this.scene.cgaa.camps[this.color].buildings.areDestroyed()) {
				enemy.destroy();
				return;
			}

			enemy.state = "guard";
			enemy.poolActivate(spawnPosition[0], spawnPosition[1]);
			this.enemySpawnObj.add(enemy);
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
