import { EnemyCircle } from "../unit/EnemyCircle";
import { Buildings } from "../camp/building/Buildings";

export class Wave {
	constructor(
		private enemyCircles: EnemyCircle[],
		private spawnPositions,
		private campBuildings: Buildings,
		private time
	) {
		this.spawnEnemy();
	}

	private destroy() {
		this.enemyCircles.forEach(circle => circle.destroy());
	}

	private spawnEnemy() {
		if (this.enemyCircles.length === 0) return;

		//TODO: not if all but if THIS building is destroyed
		if (this.campBuildings.areDestroyed()) {
			this.destroy();
			return;
		}

		let spawnPosition = this.spawnPositions.pop();
		this.enemyCircles.pop().poolActivate(spawnPosition[0], spawnPosition[1]);

		this.time.addEvent({
			delay: 4000,
			callback: () => {
				this.spawnEnemy();
			},
			repeat: 0
		});
	}
}
