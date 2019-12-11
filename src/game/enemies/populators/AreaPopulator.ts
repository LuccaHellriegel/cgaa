import { Populator } from "./Populator";
import { Area } from "../../areas/Area";
import { EnemyConfig, EnemyFactory } from "../units/EnemyFactory";
import { relativePosToRealPos } from "../../base/position";
import { EnemySpawnMap } from "../../spawn/EnemySpawnMap";

export class AreaPopulator extends Populator {
	area: Area;
	enemyConfig: EnemyConfig;

	constructor(enemyConfig: EnemyConfig, area: Area, enemySpawnMap: EnemySpawnMap) {
		super(enemyConfig.scene, enemySpawnMap);
		this.enemyConfig = enemyConfig;
		this.area = area;
	}

	calculateRandUnitSpawnPosition(area) {
		let spawnablePos = this.enemySpawnMap.getValidSpawnPosInArea(area);

		let pos = spawnablePos[Phaser.Math.Between(0, spawnablePos.length - 1)];
		return pos;
	}

	createEnemy() {
		let spawnPosition = this.calculateRandUnitSpawnPosition(this.area);
		let { x, y } = relativePosToRealPos(spawnPosition.column, spawnPosition.row);

		this.enemyConfig.x = x;
		this.enemyConfig.y = y;

		let choseRandWeapon = Phaser.Math.Between(0, 1) === 0 ? true : false;
		if (choseRandWeapon) {
			this.enemyConfig.weaponType = "rand";
		} else {
			this.enemyConfig.weaponType = "chain";
		}

		let enemy = EnemyFactory.createEnemy(this.enemyConfig);

		enemy.state = "guard";
		enemy.dontAttackList = this.dontAttackList;
		return enemy;
	}

	doMoreSpawn() {
		return this.enemyCount != 20;
	}
}
