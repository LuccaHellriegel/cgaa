import { Area } from "../env/area/Area";
import { EnvSetup } from "../setup/EnvSetup";
import { RelPos } from "../base/RelPos";
import { RelativeMap } from "../env/types";

export class RandomBuildingPositions {
	positions: RelPos[] = [];
	spawnPos: RelPos[] = [];
	pairs = [];
	middle: RelPos;

	constructor(private map: RelativeMap, area: Area, numberOfPositions) {
		this.middle = area.getMiddle();

		let baseObj = this.mapToAreaBuildingSpawnableDict(area);
		let keys = Object.keys(baseObj);
		let copyObj = { ...baseObj };
		let foundPos = 0;
		let curPosition;
		while (foundPos !== numberOfPositions) {
			curPosition = this.getRandomSpawnPosition(copyObj, keys);
			if (curPosition) {
				this.positions.push(curPosition);
				this.updateObj(curPosition.column, curPosition.row, copyObj);
				foundPos++;
			} else {
				copyObj = { ...baseObj };
				foundPos = 0;
				this.positions = [];
			}
		}
		this.positions.forEach(pos => {
			let spawnPos = this.getAllPositionsAroundBuildingExclusive(pos.column, pos.row);
			this.spawnPos.push(...spawnPos);
			this.pairs.push({ building: pos, spawnPos });
		});
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
			if (obj[id] !== undefined) obj[id] = EnvSetup.buildingSymbol;
		}
	}
	private IDToIntArr(id: string): RelPos {
		let arr = id.split(" ");
		return new RelPos(parseInt(arr[1]), parseInt(arr[0]));
	}
	private getRandomSpawnPosition(obj, keys) {
		let key = keys[Phaser.Math.Between(0, keys.length - 1)];
		let isWalkable = obj[key] === EnvSetup.walkableSymbol;
		let tries = 0;
		while (!isWalkable && tries < 100) {
			key = keys[Phaser.Math.Between(0, keys.length - 1)];
			isWalkable = obj[key] === EnvSetup.walkableSymbol;
			tries++;
		}
		if (tries === 100) return false;

		//Building not allowed in middle for pathfinding
		let pos = this.IDToIntArr(key);
		if (pos.row === this.middle.row && pos.column === this.middle.column) return false;
		//Building not allowed to overlap middle for pathfinding
		if (pos.row === this.middle.row && pos.column === this.middle.column - 1) return false;
		if (pos.row === this.middle.row && pos.column === this.middle.column + 1) return false;

		return pos;
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

	private getAllPositionsAroundBuildingExclusive(column, row) {
		let positions: RelPos[] = [];
		let rows = [row - 1, row + 1];
		for (let index = 0, length = rows.length; index < length; index++) {
			positions.push(new RelPos(rows[index], column - 2));
			positions.push(new RelPos(rows[index], column - 1));
			positions.push(new RelPos(rows[index], column));
			positions.push(new RelPos(rows[index], column + 1));
			positions.push(new RelPos(rows[index], column + 2));
		}
		positions.push(new RelPos(row, column - 2));
		positions.push(new RelPos(row, column + 2));

		return positions;
	}

	private hasSpaceForBuilding(column, row) {
		let positionArr = this.getAllPositionsAroundBuildingInclusive(column, row);
		for (let index = 0, positionLength = positionArr.length; index < positionLength; index++) {
			let column = positionArr[index][0];
			let row = positionArr[index][1];
			if (!(this.map[row][column] === EnvSetup.walkableSymbol)) return false;
		}
		return true;
	}
	private mapToAreaBuildingSpawnableDict(area: Area) {
		let dict = {};
		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[0].length; column++) {
				let isWalkable = this.map[row][column] === EnvSetup.walkableSymbol;
				let isInArea = area.isInside(new RelPos(row, column));
				let suitableForBuilding = isWalkable && isInArea && this.hasSpaceForBuilding(column, row);
				if (suitableForBuilding) dict[column + " " + row] = EnvSetup.walkableSymbol;
			}
		}
		return dict;
	}
}
