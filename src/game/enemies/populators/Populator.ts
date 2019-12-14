import { Gameplay } from "../../../scenes/Gameplay";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";

export abstract class Populator {
	enemyCount: number = 0;
	scene: Gameplay;
	enemySpawnObj: EnemySpawnObj;
	dontAttackList: string[] = [];

	constructor(scene: Gameplay, enemySpawnObj: EnemySpawnObj, color: string) {
		this.scene = scene;
		this.enemySpawnObj = enemySpawnObj;
		scene.events.on(
			"start-wave-" + color,
			function() {
				this.enemyCount = 0;
				this.startPopulating();
			}.bind(this)
		);

		scene.events.on("cooperation-established-" + color, function(cooperationColor) {
			this.dontAttackList.push(cooperationColor);
		});
	}

	abstract createEnemy();

	abstract doMoreSpawn();

	private startPopulating() {
		let enemy = this.createEnemy();
		if (enemy != null) {
			this.enemyCount++;
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
}
