import { buildingSymbol, walkableSymbol } from "../../../base/globals/globalSymbols";
import { ZeroOneMap } from "../../../base/types";
import { Area } from "../../../env/area/Area";

export class RandBuildingPos {
	positions: number[][] = [];
	constructor(private map: ZeroOneMap, area: Area, numberOfPositions) {
		let baseObj = this.mapToAreaBuildingSpawnableDict(area);
		let keys = Object.keys(baseObj);
		let copyObj = { ...baseObj };
		let foundPos = 0;
		let curPosition;

		while (foundPos !== numberOfPositions) {
			curPosition = this.getRandomSpawnPosition(copyObj, keys);
			if (curPosition) {
				let arr = this.IDToIntArr(curPosition);
				this.positions.push(arr);
				this.updateObj(arr[0], arr[1], copyObj);
				foundPos++;
			} else {
				copyObj = { ...baseObj };
				foundPos = 0;
				this.positions = [];
			}
		}
	}

	private getAllBuildingRelevantPositions(column, row) {
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

	private updateObj(column, row, obj) {
		let positionArr = this.getAllBuildingRelevantPositions(column, row);
		for (let index = 0, positionLength = positionArr.length; index < positionLength; index++) {
			let id = positionArr[index][0] + " " + positionArr[index][1];
			if (obj[id] !== undefined) obj[id] = buildingSymbol;
		}
	}

	private IDToIntArr(id: string): number[] {
		let arr = id.split(" ");
		return [parseInt(arr[0]), parseInt(arr[1])];
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

	private getAllPositionsAroundBuildingInclusive(column, row) {
		let positions: number[][] = [];
		let rows = [row - 1, row, row + 1];
		for (let index = 0, length = rows.length; index < length; index++) {
			positions.push([column - 2, rows[index]]);
			positions.push([column - 1, rows[index]]);
			positions.push([column, rows[index]]);
			positions.push([column + 1, rows[index]]);
			positions.push([column + 2, rows[index]]);
		}

		return positions;
	}

	private hasSpaceForBuilding(column, row) {
		let positionArr = this.getAllPositionsAroundBuildingInclusive(column, row);
		for (let index = 0, positionLength = positionArr.length; index < positionLength; index++) {
			let column = positionArr[index][0];
			let row = positionArr[index][1];

			if (!(this.map[row][column] === walkableSymbol)) return false;
		}
		return true;
	}

	private mapToAreaBuildingSpawnableDict(area: Area) {
		let dict = {};

		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[0].length; column++) {
				let isWalkable = this.map[row][column] === walkableSymbol;
				let isInArea = area.isInside({ row, column });
				let suitableForBuilding = isWalkable && isInArea && this.hasSpaceForBuilding(column, row);
				if (suitableForBuilding) dict[column + " " + row] = walkableSymbol;
			}
		}
		return dict;
	}
}
