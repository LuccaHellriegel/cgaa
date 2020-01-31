import { constructXYIDfromColumnRow } from "../id";
import { walkableSymbol } from "../globals/globalSymbols";
import { realCoordinateToRelative } from "../position";
import { ZeroOneMap } from "../types";
import { AreaConfig } from "../interfaces";

export function mapToAreaSpawnableDict(map: ZeroOneMap, areaConfig: AreaConfig) {
	let dict = {};
	let relativeAreaTopLeftX = realCoordinateToRelative(areaConfig.topLeftX);
	let relativeAreaWidth = areaConfig.wallBase.sizeOfXAxis;
	let relativeAreaTopLeftY = realCoordinateToRelative(areaConfig.topLeftY);
	let relativeAreaHeight = areaConfig.wallBase.sizeOfYAxis;

	for (let row = 0; row < map.length; row++) {
		for (let column = 0; column < map[0].length; column++) {
			let isWalkable = map[row][column] === walkableSymbol;
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

export function mapToSpawnableDict(map: ZeroOneMap) {
	let dict = {};

	for (let row = 0; row < map.length; row++) {
		for (let column = 0; column < map[0].length; column++) {
			let isWalkable = map[row][column] === walkableSymbol;
			if (isWalkable) dict[constructXYIDfromColumnRow(column, row)] = walkableSymbol;
		}
	}
	return dict;
}

export function createBuildingSpawnableDict(column, row) {
	let dict = {};
	let rows = [row - 1, row + 1];
	for (let index = 0, length = rows.length; index < length; index++) {
		dict[constructXYIDfromColumnRow(column, rows[index])] = walkableSymbol;
		dict[constructXYIDfromColumnRow(column + 1, rows[index])] = walkableSymbol;
		dict[constructXYIDfromColumnRow(column + 2, rows[index])] = walkableSymbol;
		dict[constructXYIDfromColumnRow(column - 1, rows[index])] = walkableSymbol;
		dict[constructXYIDfromColumnRow(column - 2, rows[index])] = walkableSymbol;
	}
	dict[constructXYIDfromColumnRow(column + 2, row)] = walkableSymbol;
	dict[constructXYIDfromColumnRow(column - 2, row)] = walkableSymbol;

	return dict;
}
