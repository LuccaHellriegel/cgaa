import { cloneDeep } from "lodash";
import { constructColumnRowID, columnRowIDToIntArr } from "../id";
import { buildingSymbol, walkableSymbol } from "../../../globals/globalSymbols";

export function getAllBuildingRelevantPositions(column, row) {
	let positions: number[][] = [];
	let rows = [row - 1, row, row + 1];
	for (let index = 0, length = rows.length; index < length; index++) {
		positions.push([column - 3, rows[index]]);
		positions.push([column - 2, rows[index]]);
		positions.push([column - 1, rows[index]]);
		positions.push([column, rows[index]]);
		positions.push([column + 1, rows[index]]);
		positions.push([column + 2, rows[index]]);
		positions.push([column + 3, rows[index]]);
	}

	return positions;
}

export function updateObj(column, row, obj) {
	let positionArr = getAllBuildingRelevantPositions(column, row);
	for (let index = 0, positionLength = positionArr.length; index < positionLength; index++) {
		let id = constructColumnRowID(positionArr[index][0], positionArr[index][1]);
		if (obj[id] !== undefined) obj[id] = buildingSymbol;
	}
}

export class BuildingSpawnObj {
	private baseObj;

	constructor(baseObj) {
		this.baseObj = baseObj;
	}

	private getRandomSpawnPosition(obj, keys) {
		let key = keys[Phaser.Math.Between(0, keys.length - 1)];
		let isWalkable = obj[key] === walkableSymbol;
		let tries = 0;
		while (!isWalkable && tries < 100) {
			key = keys[Phaser.Math.Between(0, keys.length - 1)];
			isWalkable = obj[key] === walkableSymbol;
			tries++;
		}
		if (tries === 100) return false;
		return key;
	}

	getRandomSpawnPositions(numberOfPositions): number[][] {
		let keys = Object.keys(this.baseObj);
		let copyObj = cloneDeep(this.baseObj);
		let foundPos = 0;
		let curPositions: number[][] = [];
		let curPosition;

		while (foundPos !== numberOfPositions) {
			curPosition = this.getRandomSpawnPosition(copyObj, keys);
			if (curPosition) {
				let arr = columnRowIDToIntArr(curPosition);
				curPositions.push(arr);
				updateObj(arr[0], arr[1], copyObj);
				foundPos++;
			} else {
				copyObj = cloneDeep(this.baseObj);
				foundPos = 0;
				curPositions = [];
			}
		}

		return curPositions;
	}
}
