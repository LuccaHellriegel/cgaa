import { Gameplay } from "../../scenes/Gameplay";
import { EnemySpawnObj } from "../spawn/EnemySpawnObj";
import { UnitSetup } from "../setup/UnitSetup";
import { GroupPool } from "../pool/GroupPool";
import { GuardComponent } from "../ai/GuardComponent";

export class CampPopulator {
	constructor(private scene: Gameplay, private enemyPool: GroupPool, private enemySpawnObj: EnemySpawnObj) {
		//TODO: why also in start() ?
		this.startWave();
	}

	start() {
		this.startWave();
	}

	private startWave() {
		//TODO (also boss case?)
		// if (this.buildings.areDestroyed()) {
		// 	this.enemyPool.destroy();
		// 	return;
		// }
		//TODO: if king destroyed stop (or maybe not necessary because its Game End)

		//TODO: make maxPop configurable -> for bossCamp
		let areaIsPopulated = this.enemyPool.activeIDArr.length === UnitSetup.maxCampPopulation;
		if (!areaIsPopulated) {
			let leftToSpawn = UnitSetup.maxCampPopulation - this.enemyPool.activeIDArr.length;
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

			enemy.stateHandler.setComponents([new GuardComponent(enemy, enemy.stateHandler)]);

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
