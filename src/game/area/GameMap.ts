import { ZeroOneMap } from "../base/types";
import { realCoordinateToRelative } from "../base/position";
import { walkableSymbol, buildingSymbol } from "../base/globals/globalSymbols";
import { constructXYIDfromColumnRow } from "../base/id";
import { EmptyArea, Area } from "./Area";

export class GameMap {
	private spawnableDict = {};
	map: ZeroOneMap = [];
	constructor(areas: EmptyArea[][]) {
		this.calculateUnifiedAreasMap(areas);
	}

	private calculateUnifiedAreasMap(areas: EmptyArea[][]) {
		//assummption that all areas have the same number of rows, and that the input arr is symmetric
		let numberOfRows = areas[0][0].areaMap.length;

		for (let layoutRow = 0; layoutRow < areas.length; layoutRow++) {
			for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
				let cumulativeRow = [];

				for (let layoutColumn = 0; layoutColumn < areas[0].length; layoutColumn++) {
					cumulativeRow = cumulativeRow.concat(areas[layoutRow][layoutColumn].areaMap[rowIndex]);
				}
				this.map.push(cumulativeRow);
			}
		}
	}

	toAreaSpawnableDict(area: Area) {
		let dict = {};
		let relativeAreaTopLeftX = realCoordinateToRelative(area.topLeft.x);
		let relativeAreaWidth = area.dims.sizeOfXAxis;
		let relativeAreaTopLeftY = realCoordinateToRelative(area.topLeft.y);
		let relativeAreaHeight = area.dims.sizeOfYAxis;

		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[0].length; column++) {
				let isWalkable = this.map[row][column] === walkableSymbol;
				let isInArea =
					column < relativeAreaTopLeftX + relativeAreaWidth &&
					column >= relativeAreaTopLeftX &&
					row < relativeAreaTopLeftY + relativeAreaHeight &&
					row >= relativeAreaTopLeftY;
				if (isInArea && isWalkable) dict[constructXYIDfromColumnRow(column, row)] = walkableSymbol;
			}
		}
		return dict;
	}

	toSpawnableDict() {
		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[0].length; column++) {
				let isWalkable = this.map[row][column] === walkableSymbol;
				if (isWalkable) this.spawnableDict[constructXYIDfromColumnRow(column, row)] = walkableSymbol;
			}
		}
		return this.spawnableDict;
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

	toAreaBuildingSpawnableDict(area: Area) {
		let dict = {};
		let relativeAreaTopLeftX = realCoordinateToRelative(area.topLeft.x);
		let relativeAreaWidth = area.dims.sizeOfXAxis;
		let relativeAreaTopLeftY = realCoordinateToRelative(area.topLeft.y);
		let relativeAreaHeight = area.dims.sizeOfYAxis;

		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[0].length; column++) {
				let isWalkable = this.map[row][column] === walkableSymbol;
				let isInArea =
					column < relativeAreaTopLeftX + relativeAreaWidth &&
					column >= relativeAreaTopLeftX &&
					row < relativeAreaTopLeftY + relativeAreaHeight &&
					row >= relativeAreaTopLeftY;
				let suitableForBuilding = isWalkable && isInArea && this.hasSpaceForBuilding(column, row);
				if (suitableForBuilding) dict[column + " " + row] = walkableSymbol;
			}
		}
		return dict;
	}

	updateWithBuildings(buildingPositions) {
		for (let index = 0, length = buildingPositions.length; index < length; index++) {
			let pos = buildingPositions[index];
			let column = pos[0];
			let row = pos[1];
			this.map[row][column] = buildingSymbol;
			this.map[row][column - 1] = buildingSymbol;
			this.map[row][column + 1] = buildingSymbol;
		}
	}
}
