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
	params: PoolParams;

	constructor(params: PoolParams) {
		this.initPool(params);

		let keys = Object.keys(this.enemyDict);
		for (const key in keys) {
			params.enemyConfig.scene.events.on("inactive-" + key, id => {
				let index = this.activeIDArr.indexOf(id);
				this.activeIDArr.splice(index, 1);
				this.inactiveIDArr.push(id);
			});
		}

		this.params = params;
	}

	private initPool(params: PoolParams) {
		for (let index = 0; index < params.numberOfGroups; index++) {
			for (let index = 0, length = params.groupComposition.length; index < length; index++) {
				const curComposition = params.groupComposition[index];
				params.enemyConfig.size = curComposition.size as EnemySize;
				params.enemyConfig.weaponType = curComposition.weaponType as WeaponTypes;
				let enemy: EnemyCircle = EnemyFactory.createEnemy(params.enemyConfig);
				this.enemyDict[enemy.id] = enemy;
				enemy.destroy();
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
}
