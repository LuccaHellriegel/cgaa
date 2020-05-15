import { Gameplay } from "../../../scenes/Gameplay";
import { EnemySpawnObj } from "../spawn/EnemySpawnObj";
import { CampID, CampSetup } from "../../0_GameBase/setup/CampSetup";
import { DangerousCirclePool } from "../pool/CirclePool";
import { CampsState } from "./CampsState";
import { UnitSetup } from "../../0_GameBase/setup/UnitSetup";
import { DangerousCircle } from "../../4_GameUnit/unit/DangerousCircle";
import { GuardComponent } from "../../4_GameUnit/ai/GuardComponent";

export class CampPopulator {
	constructor(
		private campID: CampID,
		private scene: Gameplay,
		private enemyPool: DangerousCirclePool,
		private enemySpawnObj: EnemySpawnObj,
		private maxCampPopulation: number,
		private campsState: CampsState
	) {
		this.startPopulating();
	}

	//Populates the camp with a single new enemy
	private startPopulating() {
		if (this.campID !== CampSetup.bossCampID && !this.campsState.isActive(this.campID)) {
			this.enemyPool.destroy();
			return;
		}

		let areaIsPopulated = this.enemyPool.activeIDArr.length === this.maxCampPopulation;
		if (!areaIsPopulated) {
			let leftToSpawn = UnitSetup.maxCampPopulation - this.enemyPool.activeIDArr.length;
			this.spawnEnemy(leftToSpawn);
		}

		this.scene.time.addEvent({
			delay: CampSetup.delayForCampPopulation,
			callback: () => {
				this.startPopulating();
			},
			repeat: 0,
		});
	}

	private spawnEnemy(leftToSpawn: number) {
		let spawnPosition = this.enemySpawnObj.getRandomSpawnPosition();
		if (spawnPosition) {
			let enemy = this.enemyPool.pop() as DangerousCircle;

			enemy.stateHandler.setComponents([new GuardComponent(enemy, enemy.stateHandler)]);

			enemy.poolActivate(spawnPosition[0], spawnPosition[1]);
			leftToSpawn--;
		}
		if (leftToSpawn > 0) {
			this.scene.time.addEvent({
				delay: 4000,
				callback: () => {
					this.spawnEnemy(leftToSpawn);
				},
				repeat: 0,
			});
		}
	}
}
