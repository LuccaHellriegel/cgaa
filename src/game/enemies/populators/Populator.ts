import { Gameplay } from "../../../scenes/Gameplay";
import { EnemySpawnMap } from "../../spawn/EnemySpawnMap";

export abstract class Populator {
	enemyCount: number = 0;
	scene: Gameplay;
	enemySpawnMap: EnemySpawnMap;
	dontAttackList: any[] = [];

	constructor(scene: Gameplay, enemySpawnMap) {
		this.scene = scene;
		this.enemySpawnMap = enemySpawnMap;
	}

	establishCooperation(cooperationColor) {
		this.dontAttackList.push(cooperationColor);
	}

	abstract createEnemy();

	abstract doMoreSpawn();

	startPopulating() {
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
