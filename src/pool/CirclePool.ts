import { poolable } from "../engine/interfaces";
import { Gameplay } from "../scenes/Gameplay";
import { CircleFactory } from "../units/CircleFactory";
import { Enemies } from "../units/Enemies";
import { Pool } from "./Pool";

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
