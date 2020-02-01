import { EnemyFactory, EnemySize, WeaponTypes, CircleConfig } from "../../enemies/unit/EnemyFactory";
import { EnemyCircle } from "../../enemies/unit/EnemyCircle";
import { removeEle } from "../utils";
import { Gameplay } from "../../../scenes/Gameplay";
import { Enemies } from "../../enemies/unit/Enemies";

type GroupComposition = { weaponType: string; size: string }[];

export interface CirclePhysics {
	physicsGroup: Phaser.Physics.Arcade.Group;
	weaponGroup: Phaser.Physics.Arcade.Group;
}

//TODO: refactor to Pool -> Pool is not Group based, maybe leave two classes?
export abstract class GroupPool {
	activeIDArr: string[] = [];
	private inactiveIDArr: string[] = [];
	private isNeeded = true;

	constructor(
		private scene: Gameplay,
		private numberOfGroups: number,
		private groupComposition: GroupComposition,
		private enemies: Enemies,
		protected factory: EnemyFactory
	) {
		this.initPool();
		this.setupEvents();
	}

	private setupEvents() {
		for (const id of this.inactiveIDArr) {
			this.scene.events.once("inactive-" + id, this.makeInactive.bind(this));
		}
	}

	private makeInactive(key) {
		if (this.isNeeded) {
			removeEle(key, this.activeIDArr);
			this.inactiveIDArr.unshift(key);
			this.scene.events.once("inactive-" + key, this.makeInactive.bind(this));
		}
	}

	protected abstract createUnit(config);

	private initPool() {
		let circleConfig: CircleConfig = {
			size: "Big",
			x: 0,
			y: 0,
			weaponType: "chain"
		};

		for (let index = 0; index < this.numberOfGroups; index++) {
			for (let index = 0, length = this.groupComposition.length; index < length; index++) {
				const curComposition = this.groupComposition[index];
				circleConfig.size = curComposition.size as EnemySize;
				circleConfig.weaponType = curComposition.weaponType as WeaponTypes;
				let enemy = this.createUnit(circleConfig);

				enemy.poolDestroy();
				//TODO: listening for inactive-event is initialized after this function
				this.inactiveIDArr.push(enemy.id);
			}
		}
	}

	pop(): EnemyCircle {
		if (this.inactiveIDArr.length === 0) {
			this.numberOfGroups = 1;
			this.initPool();
		}
		let id = this.inactiveIDArr.pop();
		this.activeIDArr.push(id);
		return this.enemies.getEnemy(id);
	}

	destroy() {
		this.isNeeded = false;
		this.enemies.destroyEnemies(this.inactiveIDArr);
	}
}

export class EnemyPool extends GroupPool {
	protected createUnit(config) {
		return this.factory.createEnemy(config);
	}
}
