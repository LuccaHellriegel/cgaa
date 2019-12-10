import { Gameplay } from "../../../scenes/Gameplay";
import { SpawnManager } from "../../spawn/SpawnManager";

export abstract class Populator {
	enemyCount: number = 0;
	scene: Gameplay;
	spawnManager: SpawnManager;
	dontAttackList: any[] = [];

	constructor(scene: Gameplay, spawnManager) {
		this.scene = scene;
		this.spawnManager = spawnManager;
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
