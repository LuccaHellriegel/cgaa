import { Gameplay } from "../../scenes/Gameplay";
import { EnemyPool } from "../pool/EnemyPool";
import { EnemySpawnObj } from "../spawn/EnemySpawnObj";
import { PathAssigner } from "../path/PathAssigner";
import { WaveSetup } from "../setup/WaveSetup";
import { RelPos } from "../base/RelPos";
import { Wave } from "./Wave";
import { CampID } from "../setup/CampSetup";
import { CampsState } from "../state/CampsState";
import { EventSetup } from "../setup/EventSetup";

export class WavePopulator {
	constructor(
		private scene: Gameplay,
		public id: CampID,
		private enemyPool: EnemyPool,
		private enemySpawnObj: EnemySpawnObj,
		private assigner: PathAssigner,
		private state: CampsState,
		private buildingID: string
	) {
		this.setupInitEvents();
	}

	private setupInitEvents() {
		this.scene.events.once(EventSetup.startWaveEvent, this.tryStartWave.bind(this));
	}

	private tryStartWave(id) {
		if (this.id === id) {
			this.startWave();
		} else {
			this.setupInitEvents();
		}
	}

	//TODO: remove building pos from non ordinary camps in GameMap
	private prepareWave() {
		let spawnPositions = [];
		let enemyCircles = [];
		for (let index = 0; index < WaveSetup.waveSize; index++) {
			let spawnPosition = this.enemySpawnObj.getRandomSpawnPosition();
			if (spawnPosition) {
				spawnPositions.push(spawnPosition);

				let enemy = this.enemyPool.pop();

				//Path is saved in logical order (A to B), needs to be reversed for pop()
				enemy.pathArr = this.assigner
					.assign(enemy, RelPos.fromPoint({ x: spawnPosition[0], y: spawnPosition[1] }))
					.getRealPath()
					.reverse();
				enemy.state = "ambush";
				enemyCircles.push(enemy);
			} else {
				break;
			}
		}

		return { enemyCircles, spawnPositions };
	}

	private startWave() {
		if (!this.state.isBuildingActive(this.id, this.buildingID)) {
			this.enemyPool.destroy();
			return;
		}

		let { enemyCircles, spawnPositions } = this.prepareWave();
		new Wave(this.id, this.buildingID, enemyCircles, spawnPositions, this.scene.time, this.state);
		this.setupInitEvents();
	}
}
