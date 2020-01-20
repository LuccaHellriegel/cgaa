import { Gameplay } from "../../../scenes/Gameplay";
import { EnemyPool } from "../../base/pool/EnemyPool";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";
import { campMaxPopulation } from "./campConfig";
import { Buildings } from "./building/Buildings";

export class CampPopulator {
	constructor(
		private scene: Gameplay,
		private enemyPool: EnemyPool,
		private enemySpawnObj: EnemySpawnObj,
		private campBuildings: Buildings
	) {
		this.startWave();
	}

	private startWave() {
		if (this.campBuildings.areDestroyed()) {
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

			if (this.campBuildings.areDestroyed()) {
				enemy.destroy();
				return;
			}

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
