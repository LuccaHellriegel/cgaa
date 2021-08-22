import { GuardComponent } from "../ai/GuardComponent";
import { AmbushComponent } from "../ai/AmbushComponent";
import { RelPos } from "../engine/RelPos";
import { Wave } from "./Wave";
import { CampsState } from "../camps/CampsState";
import { CampID } from "../config/CampSetup";
import { EventSetup } from "../config/EventSetup";
import { WaveSetup } from "../config/WaveSetup";
import { PathAssigner } from "../path/PathAssigner";
import { DangerousCirclePool } from "../pool/CirclePool";
import { Gameplay } from "../scenes/Gameplay";
import { EnemySpawnObj } from "../spawn/EnemySpawnObj";
import { DangerousCircle } from "../units/DangerousCircle/DangerousCircle";

export class WavePopulator {
	waveSize = WaveSetup.waveSize;
	waveCount = 0;

	constructor(
		private scene: Gameplay,
		public id: CampID,
		private enemyPool: DangerousCirclePool,
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

	private prepareWave() {
		let spawnPositions = [];
		let enemyCircles = [];
		for (let index = 0; index < this.waveSize; index++) {
			let spawnPosition = this.enemySpawnObj.getRandomSpawnPosition();
			if (spawnPosition) {
				spawnPositions.push(spawnPosition);

				let enemy = this.enemyPool.pop() as DangerousCircle;
				//Path is saved in logical order (A to B), needs to be reversed for pop()

				//	enemy.stateHandler.setComponents([new GuardComponent(enemy, enemy.stateHandler)]);

				enemy.stateHandler.setComponents([
					new GuardComponent(enemy, enemy.stateHandler),
					new AmbushComponent(
						this.assigner
							.assign(enemy, RelPos.fromPoint({ x: spawnPosition[0], y: spawnPosition[1] }))
							.getRealPath()
							.reverse(),
						enemy,
						enemy.stateHandler,
						enemy.stateHandler
					),
				]);

				enemyCircles.push(enemy);

				this.waveCount++;

				if (this.waveCount % 10 === 0) this.waveSize++;
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
