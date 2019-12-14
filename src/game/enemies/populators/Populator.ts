import { Gameplay } from "../../../scenes/Gameplay";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";

export abstract class Populator {
	enemyCount: number = 0;
	scene: Gameplay;
	enemySpawnObj: EnemySpawnObj;
	dontAttackList: string[] = [];
	shouldPopulate = true;
	color: string;

	constructor(scene: Gameplay, enemySpawnObj: EnemySpawnObj, color: string) {
		this.scene = scene;
		this.color = color;
		this.enemySpawnObj = enemySpawnObj;
		scene.events.once("start-wave-" + color, this.startWave.bind(this));

		scene.events.once("cooperation-established-" + color, function(cooperationColor) {
			this.dontAttackList.push(cooperationColor);
		});
	}

	private startWave() {
		if (this.shouldPopulate) {
			this.enemyCount = 0;
			this.startPopulating();
			this.scene.events.once("start-wave-" + this.color, this.startWave.bind(this));
		}
	}

	abstract createEnemy();

	abstract doMoreSpawn();

	private startPopulating() {
		let enemy = this.createEnemy();
		if (enemy != null) {
			this.enemyCount++;
			this.enemySpawnObj.add(enemy);
		}
		if (this.doMoreSpawn()) {
			this.scene.time.addEvent({
				delay: 4000,
				callback: this.startPopulating,
				callbackScope: this,
				repeat: 0
			});
		}
	}

	destroy() {
		this.shouldPopulate = false;
		this.enemySpawnObj.destroy();
	}
}
