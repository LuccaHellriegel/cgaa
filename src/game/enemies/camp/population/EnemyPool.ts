import { EnemyConfig, EnemyFactory, EnemySize, WeaponTypes } from "../unit/EnemyFactory";
import { EnemyCircle } from "../unit/EnemyCircle";
import { removeEle } from "../../../base/utils";
import { Gameplay } from "../../../../scenes/Gameplay";

type GroupComposition = { weaponType: string; size: string }[];

interface PoolParams {
	numberOfGroups: number;
	groupComposition: GroupComposition;
	enemyConfig: EnemyConfig;
}

export class EnemyPool {
	activeIDArr: string[] = [];
	inactiveIDArr: string[] = [];
	isNeeded = true;
	scene: Gameplay;

	constructor(private params: PoolParams) {
		this.initPool(params);

		for (const id of this.inactiveIDArr) {
			params.enemyConfig.scene.events.once("inactive-" + id, this.makeInactive.bind(this));
		}

		this.scene = params.enemyConfig.scene;
	}

	private makeInactive(key) {
		if (this.isNeeded) {
			removeEle(key, this.activeIDArr);
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
		return this.scene.cgaa.enemyDict[id];
	}

	destroy() {
		this.isNeeded = false;
		for (const key in this.inactiveIDArr) {
			this.scene.cgaa.enemyDict[this.inactiveIDArr[key]].destroy();
		}
	}
}
