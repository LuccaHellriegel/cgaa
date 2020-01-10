import { EnemyConfig, EnemyFactory, EnemySize, WeaponTypes } from "../unit/EnemyFactory";
import { EnemyCircle } from "../unit/EnemyCircle";

type GroupComposition = { weaponType: string; size: string }[];

interface PoolParams {
	numberOfGroups: number;
	groupComposition: GroupComposition;
	enemyConfig: EnemyConfig;
}

export class EnemyPool {
	enemyDict = {};
	activeIDArr: string[] = [];
	inactiveIDArr: string[] = [];
	isNeeded = true;

	constructor(private params: PoolParams) {
		this.initPool(params);

		let keys = Object.keys(this.enemyDict);
		for (const key in keys) {
			params.enemyConfig.scene.events.once("inactive-" + key, this.makeInactive.bind(this));
		}
	}

	private makeInactive(key) {
		if (this.isNeeded) {
			let index = this.activeIDArr.indexOf(key);
			this.activeIDArr.splice(index, 1);
			this.inactiveIDArr.unshift(key);
			this.params.enemyConfig.scene.events.once("inactive-" + key, this.makeInactive.bind(this));
		}
	}

	private initPool(params: PoolParams) {
		for (let index = 0; index < params.numberOfGroups; index++) {
			for (let index = 0, length = params.groupComposition.length; index < length; index++) {
				const curComposition = params.groupComposition[index];
				params.enemyConfig.size = curComposition.size as EnemySize;
				params.enemyConfig.weaponType = curComposition.weaponType as WeaponTypes;
				let enemy: EnemyCircle = EnemyFactory.createEnemy(params.enemyConfig);
				this.enemyDict[enemy.id] = enemy;
				enemy.poolDestroy();
				//listening for inactive-event is initialized after this function
				this.inactiveIDArr.push(enemy.id);
			}
		}
	}

	pop(): EnemyCircle {
		if (this.inactiveIDArr.length === 0) {
			this.params.numberOfGroups = 1;
			this.initPool(this.params);
		}
		let id = this.inactiveIDArr.pop();
		this.activeIDArr.push(id);
		return this.enemyDict[id];
	}

	destroy() {
		this.isNeeded = false;
		for (const key in this.inactiveIDArr) {
			this.enemyDict[this.inactiveIDArr[key]].destroy();
		}
	}
}
