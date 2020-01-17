import { Gameplay } from "../../../scenes/Gameplay";
import { EnemyPool } from "../population/EnemyPool";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";
import { constructXYID } from "../../base/id";

export class WavePopulator {
	constructor(
		private scene: Gameplay,
		private color: string,
		private enemyPool: EnemyPool,
		private enemySpawnObj: EnemySpawnObj
	) {
		this.setupInitEvents();
	}

	private setupInitEvents() {
		this.scene.events.once("start-wave-" + this.color, () => {
			this.startWave();
		});
	}

	startWave() {
		if (this.scene.cgaa.camps[this.color].buildings.areDestroyed()) {
			this.enemyPool.destroy();
			return;
		}

		let leftToSpawn = 3;
		this.spawnEnemy(leftToSpawn);
		this.scene.events.once("start-wave-" + this.color, () => {
			this.startWave();
		});
	}

	spawnEnemy(leftToSpawn: number) {
		let spawnPosition = this.enemySpawnObj.getRandomSpawnPosition();
		if (spawnPosition) {
			let enemy = this.enemyPool.pop();

			//TODO: not if all but if THIS building is destroyed
			if (this.scene.cgaa.camps[enemy.color].buildings.areDestroyed()) {
				enemy.destroy();
				return;
			}

			let id = constructXYID(spawnPosition[0], spawnPosition[1]);
			if (this.scene.cgaa.camps[enemy.color].rerouteColor !== "") {
				id += " " + this.scene.cgaa.camps[enemy.color].rerouteColor;
			}

			enemy.pathContainer = this.scene.cgaa.pathDict[id];
			enemy.state = "ambush";
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
