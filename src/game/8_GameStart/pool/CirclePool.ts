import { Gameplay } from "../../../scenes/Gameplay";
import { CircleFactory } from "../../4_GameUnit/unit/CircleFactory";
import { Enemies } from "../../4_GameUnit/unit/Enemies";
import { Pool } from "./Pool";
import { poolable } from "../../0_GameBase/engine/interfaces";

export class DangerousCirclePool extends Pool {
	constructor(
		scene: Gameplay,
		numberOfUnits: number,
		protected factory: CircleFactory,
		protected enemies: Enemies,
		protected circleSize
	) {
		super(scene, numberOfUnits);
		this.init();
	}
	destroy() {
		this.enemies.destroyEnemies(this.inactiveIDArr);
	}

	createNewUnit(): poolable {
		return this.factory.createEnemy(this.circleSize);
	}
}

export class BossPool extends Pool {
	constructor(scene: Gameplay, numberOfUnits: number, protected factory: CircleFactory, protected enemies: Enemies) {
		super(scene, numberOfUnits);
		this.init();
	}
	destroy() {
		this.enemies.destroyEnemies(this.inactiveIDArr);
	}

	createNewUnit(): poolable {
		return this.factory.createBoss();
	}
}
