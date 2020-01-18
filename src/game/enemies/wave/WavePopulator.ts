import { Gameplay } from "../../../scenes/Gameplay";
import { EnemyPool } from "../population/EnemyPool";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";
import { constructXYID } from "../../base/id";
import { Wave } from "./Wave";
import { waveSize } from "./waveConfig";
import { CampBuildings } from "../camp/building/CampBuildings";
import { Rerouter } from "../../player/input/modi/interaction/Rerouter";

export class WavePopulator {
	constructor(
		private scene: Gameplay,
		private color: string,
		private enemyPool: EnemyPool,
		private enemySpawnObj: EnemySpawnObj,
		private campBuildings: CampBuildings,
		private rerouter: Rerouter
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

				let id = this.rerouter.appendRerouting(enemy.color, constructXYID(spawnPosition[0], spawnPosition[1]));

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
