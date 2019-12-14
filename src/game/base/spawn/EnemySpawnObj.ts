import { cloneDeep } from "lodash";
import { getRelativePosOfElements, realPosToRelativePos } from "../position";
import { constructColumnRowID } from "../id";
import { enemySmybol, walkableSymbol } from "../../../globals/globalSymbols";

export class EnemySpawnObj {
	baseObj;
	relativeObj;
	movingUnitsArr;

	constructor(baseObj, movingUnitsArr) {
		this.baseObj = baseObj;
		this.movingUnitsArr = movingUnitsArr;
	}

	private updateRelativeObjWithMovingUnits() {
		let relativePositions = getRelativePosOfElements(this.movingUnitsArr);

		relativePositions.forEach(pos => {
			let id = constructColumnRowID(pos.column, pos.row);
			if (this.relativeObj[id] !== undefined) this.relativeObj[id] = enemySmybol;
		});
	}

	private updateRelativeObj() {
		this.relativeObj = cloneDeep(this.baseObj);
		this.updateRelativeObjWithMovingUnits();
	}

	evaluateRealPos(x, y) {
		this.updateRelativeObj();

		let { row, column } = realPosToRelativePos(x, y);
		return this.relativeObj[constructColumnRowID(column, row)] === walkableSymbol;
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
