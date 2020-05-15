import { CampID } from "../../0_GameBase/setup/CampSetup";
import { DangerousCircle } from "../../4_GameUnit/unit/DangerousCircle";
import { CampsState } from "../camp/CampsState";

export class Wave {
	constructor(
		private campID: CampID,
		private buildingID: string,
		private enemyCircles: DangerousCircle[],
		private spawnPositions,
		private time,
		private state: CampsState
	) {
		this.spawnEnemy();
	}

	private destroy() {
		this.enemyCircles.forEach((circle) => circle.destroy());
	}

	private spawnEnemy() {
		if (this.enemyCircles.length === 0) return;

		//Stop spawning if camp was destroyed meanwhile
		if (!this.state.isBuildingActive(this.campID, this.buildingID)) {
			this.destroy();
			return;
		}

		let spawnPosition = this.spawnPositions.pop();
		let enemy = this.enemyCircles.pop();
		enemy.poolActivate(spawnPosition[0], spawnPosition[1]);

		this.time.addEvent({
			delay: 4000,
			callback: () => {
				this.spawnEnemy();
			},
			repeat: 0,
		});
	}
}
