import { ZeroOneMap } from "./types";
import { AreaConfig } from "./interfaces";
import { realCoordinateToRelative } from "./position";
import { walkableSymbol, buildingSymbol } from "./globals/globalSymbols";
import { constructXYIDfromColumnRow } from "./id";

export class GameMap {
	private spawnableDict = {};
	constructor(private map: ZeroOneMap) {
		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[0].length; column++) {
				let isWalkable = this.map[row][column] === walkableSymbol;
				if (isWalkable) this.spawnableDict[constructXYIDfromColumnRow(column, row)] = walkableSymbol;
			}
		}
	}

	toAreaSpawnableDict(areaConfig: AreaConfig) {
		let dict = {};
		let relativeAreaTopLeftX = realCoordinateToRelative(areaConfig.topLeftX);
		let relativeAreaWidth = areaConfig.wallBase.sizeOfXAxis;
		let relativeAreaTopLeftY = realCoordinateToRelative(areaConfig.topLeftY);
		let relativeAreaHeight = areaConfig.wallBase.sizeOfYAxis;

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

	toAreaBuildingSpawnableDict(areaConfig: AreaConfig) {
		let dict = {};
		let relativeAreaTopLeftX = realCoordinateToRelative(areaConfig.topLeftX);
		let relativeAreaWidth = areaConfig.wallBase.sizeOfXAxis;
		let relativeAreaTopLeftY = realCoordinateToRelative(areaConfig.topLeftY);
		let relativeAreaHeight = areaConfig.wallBase.sizeOfYAxis;

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
