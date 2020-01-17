import { Gameplay } from "../../../scenes/Gameplay";
import { EnemyPool } from "../population/EnemyPool";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";
import { constructXYID } from "../../base/id";
import { Wave } from "./Wave";
import { waveSize } from "./waveConfig";

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

	private prepareWave() {
		let spawnPositions = [];
		let enemyCircles = [];
		for (let index = 0; index < waveSize; index++) {
			let spawnPosition = this.enemySpawnObj.getRandomSpawnPosition();
			if (spawnPosition) {
				spawnPositions.push(spawnPosition);

				let enemy = this.enemyPool.pop();

				let id = constructXYID(spawnPosition[0], spawnPosition[1]);
				if (this.scene.cgaa.camps[enemy.color].rerouteColor !== "") {
					id += " " + this.scene.cgaa.camps[enemy.color].rerouteColor;
				}

				enemy.pathContainer = this.scene.cgaa.pathDict[id];
				enemy.state = "ambush";
				enemyCircles.push(enemy);
			} else {
				break;
			}
		}

		return { enemyCircles, spawnPositions };
	}

	private startWave() {
		if (this.scene.cgaa.camps[this.color].buildings.areDestroyed()) {
			this.enemyPool.destroy();
			return;
		}

		let { enemyCircles, spawnPositions } = this.prepareWave();
		new Wave(enemyCircles, spawnPositions, this.scene.cgaa.camps[this.color].buildings, this.scene.time);
		this.scene.events.once("start-wave-" + this.color, () => {
			this.startWave();
		});
	}
}
