import { cloneDeep } from "lodash";
import { constructXYID } from "../id";
import { enemySmybol, walkableSymbol } from "../globals/globalSymbols";
import { Enemies } from "../../enemies/unit/Enemies";

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
		this.relativeObj = cloneDeep(this.baseObj);
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
}
