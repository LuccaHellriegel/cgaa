import { Gameplay } from "../../../scenes/Gameplay";
import { EnemyPool } from "../../base/pool/EnemyPool";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";
import { Wave } from "./Wave";
import { waveSize } from "./waveConfig";
import { Buildings } from "../camp/building/Buildings";
import { Paths } from "../path/Paths";

export class WavePopulator {
	constructor(
		private scene: Gameplay,
		private color: string,
		private enemyPool: EnemyPool,
		private enemySpawnObj: EnemySpawnObj,
		private campBuildings: Buildings,
		private paths: Paths
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

				enemy.pathContainer = this.paths.getReroutedPathForRealPos(
					{ x: spawnPosition[0], y: spawnPosition[1] },
					enemy.color
				);
				enemy.state = "ambush";
				enemyCircles.push(enemy);
			} else {
				break;
			}
		}

		return { enemyCircles, spawnPositions };
	}

	private startWave() {
		if (this.campBuildings.areDestroyed()) {
			this.enemyPool.destroy();
			return;
		}

		let { enemyCircles, spawnPositions } = this.prepareWave();
		new Wave(enemyCircles, spawnPositions, this.campBuildings, this.scene.time);
		this.scene.events.once("start-wave-" + this.color, () => {
			this.startWave();
		});
	}
}
