import { constructXYID } from "../id";
import { enemySmybol, walkableSymbol } from "../globals/globalSymbols";
import { Enemies } from "../../enemies/unit/Enemies";
import { ZeroOneMap } from "../types";
import { AreaConfig } from "../interfaces";
import { mapToAreaSpawnableDict, createBuildingSpawnableDict } from "./spawn";

export class EnemySpawnObj {
	public relativeObj;

	constructor(private baseObj, private enemies: Enemies) {}

	private updateRelativeObjWithMovingUnits() {
		this.enemies.getAllEnemyPositions().forEach(pos => {
			let id = pos.x + " " + pos.y;
			if (this.relativeObj[id] !== undefined) this.relativeObj[id] = enemySmybol;
		});
	}

	private updateRelativeObj() {
		this.relativeObj = { ...this.baseObj };
		this.updateRelativeObjWithMovingUnits();
	}

	evaluateRealPos(x, y) {
		this.updateRelativeObj();
		return this.relativeObj[constructXYID(x, y)] === walkableSymbol;
	}

	getRandomSpawnPosition(): number[] | boolean {
		this.updateRelativeObj();

		let keys = Object.keys(this.baseObj);
		let key = keys[Phaser.Math.Between(0, keys.length - 1)];
		let isWalkable = this.baseObj[key] === walkableSymbol;

		let tries = 0;
		while (!isWalkable && tries < 100) {
			key = keys[Phaser.Math.Between(0, keys.length - 1)];
			isWalkable = this.baseObj[key] === walkableSymbol;
			tries++;
		}
		if (tries === 100) return false;
		let arr = key.split(" ");
		return [parseInt(arr[0]), parseInt(arr[1])];
	}

	static createAreaEnemySpawnObj(map: ZeroOneMap, areaConfig: AreaConfig, enemies: Enemies): EnemySpawnObj {
		return new EnemySpawnObj(mapToAreaSpawnableDict(map, areaConfig), enemies);
	}

	static createBuildingEnemySpawnObj(column, row, enemies: Enemies): EnemySpawnObj {
		return new EnemySpawnObj(createBuildingSpawnableDict(column, row), enemies);
	}
}
