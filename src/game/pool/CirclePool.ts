import { Gameplay } from "../../scenes/Gameplay";
import { poolable } from "../base/interfaces";
import { CircleFactory } from "../unit/CircleFactory";
import { Enemies } from "../unit/Enemies";
import { Pool } from "./Pool";
export abstract class CirclePool extends Pool {
	constructor(
		scene: Gameplay,
		numberOfUnits: number,
		protected factory: CircleFactory,
		protected enemies: Enemies,
		protected circleSize?
	) {
		super(scene, numberOfUnits);
		this.init();
	}
	destroy() {
		//TODO: unlisten to inactive
		this.enemies.destroyEnemies(this.inactiveIDArr);
	}
}
export class DangerousCirclePool extends CirclePool {
	constructor(scene: Gameplay, numberOfUnits: number, factory: CircleFactory, enemies: Enemies, circleSize) {
		super(scene, numberOfUnits, factory, enemies, circleSize);
	}

	createNewUnit(): poolable {
		return this.factory.createEnemy(this.circleSize);
	}
}
export class BossPool extends CirclePool {
	createNewUnit(): poolable {
		return this.factory.createBoss();
	}
}
