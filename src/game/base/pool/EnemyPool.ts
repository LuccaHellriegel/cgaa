import { EnemyConfig, EnemyFactory, EnemySize, WeaponTypes } from "../../enemies/unit/EnemyFactory";
import { EnemyCircle } from "../../enemies/unit/EnemyCircle";
import { removeEle } from "../utils";
import { Gameplay } from "../../../scenes/Gameplay";
import { Enemies } from "../../enemies/unit/Enemies";

type GroupComposition = { weaponType: string; size: string }[];

interface CirclePhysics {
	physicsGroup: Phaser.Physics.Arcade.Group;
	weaponGroup: Phaser.Physics.Arcade.Group;
}

//TODO: refactor to Pool
export class EnemyPool {
	activeIDArr: string[] = [];
	private inactiveIDArr: string[] = [];
	private isNeeded = true;
	private enemyConfig: EnemyConfig;

	constructor(
		private scene: Gameplay,
		private numberOfGroups: number,
		private groupComposition: GroupComposition,
		private enemies: Enemies,
		color,
		enemyPhysicGroup,
		weaponPhysicGroup
	) {
		this.enemyConfig = {
			scene: scene,
			color: color,
			size: "Big",
			x: 100,
			y: 100,
			weaponType: "rand",
			physicsGroup: enemyPhysicGroup,
			weaponGroup: weaponPhysicGroup
		};
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

	private initPool() {
		for (let index = 0; index < this.numberOfGroups; index++) {
			for (let index = 0, length = this.groupComposition.length; index < length; index++) {
				const curComposition = this.groupComposition[index];
				this.enemyConfig.size = curComposition.size as EnemySize;
				this.enemyConfig.weaponType = curComposition.weaponType as WeaponTypes;
				let enemy: EnemyCircle = EnemyFactory.createEnemy(this.enemyConfig, this.enemies);
				enemy.poolDestroy();
				//listening for inactive-event is initialized after this function
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
