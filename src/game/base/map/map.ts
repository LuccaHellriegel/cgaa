import { constructColumnRowID } from "../id";
import { AreaConfig } from "../../area/create";
import { walkableSymbol, exitSymbol } from "../../../globals/globalSymbols";
import { realCoordinateToRelative } from "./position";
import { Exit } from "../types";

export type ZeroOneMap = number[][];

export interface MapConfig {
	sizeOfXAxis: number;
	sizeOfYAxis: number;
}

export function createEmptyMap(config: MapConfig) {
	let map: ZeroOneMap = [];
	for (let row = 0; row < config.sizeOfYAxis; row++) {
		map[row] = [];
		for (let column = 0; column < config.sizeOfXAxis; column++) {
			map[row].push(0);
		}
	}
	return map;
}

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
			if (isInArea && isWalkable) dict[constructColumnRowID(column, row)] = walkableSymbol;
		}
	}
	return dict;
}

function hasSpaceForBuilding(map: ZeroOneMap, column, row) {
	let positionArr = getAllBuildingRelevantPositions(column, row);
	for (let index = 0, positionLength = positionArr.length; index < positionLength; index++) {
		if (!(map[positionArr[index][0]][positionArr[index][1]] === walkableSymbol)) return false;
	}
	return true;
}

export function mapToAreaBuildingSpawnableDict(map: ZeroOneMap, areaConfig: AreaConfig) {
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
			let suitableForBuilding = isWalkable && isInArea && hasSpaceForBuilding(map, column, row);
			if (suitableForBuilding) dict[constructColumnRowID(column, row)] = walkableSymbol;
		}
	}
	return dict;
}

function isInArea(column, row, areaConfig: AreaConfig) {
	let relativeAreaTopLeftX = realCoordinateToRelative(areaConfig.topLeftX);
	let relativeAreaWidth = areaConfig.wallBase.sizeOfXAxis;
	let relativeAreaTopLeftY = realCoordinateToRelative(areaConfig.topLeftY);
	let relativeAreaHeight = areaConfig.wallBase.sizeOfYAxis;
	return (
		column < relativeAreaTopLeftX + relativeAreaWidth &&
		column >= relativeAreaTopLeftX &&
		row < relativeAreaTopLeftY + relativeAreaHeight &&
		row >= relativeAreaTopLeftY
	);
}

export function mapToNotAreaSpawnableDict(map: ZeroOneMap, areaConfigs: AreaConfig[]) {
	let dict = {};

	for (let row = 0; row < map.length; row++) {
		for (let column = 0; column < map[0].length; column++) {
			let isWalkable = map[row][column] === walkableSymbol;
			let inArea = false;
			for (let index = 0; index < areaConfigs.length; index++) {
				const areaConfig = areaConfigs[index];
				if (isInArea(column, row, areaConfig)) {
					inArea = true;
					break;
				}
			}
			if (!inArea && isWalkable) dict[constructColumnRowID(column, row)] = walkableSymbol;
		}
	}
	return dict;
}

export function getAllBuildingRelevantPositions(column, row) {
	let positions: number[][] = [];
	let rows = [row - 1, row, row + 1];
	for (let index = 0, length = rows.length; index < length; index++) {
		positions.push([column, rows[index]]);
		positions.push([column + 1, rows[index]]);
		positions.push([column + 2, rows[index]]);
		positions.push([column - 1, rows[index]]);
		positions.push([column - 2, rows[index]]);
	}

	return positions;
}

export function getAllPositionsAroundBuilding(column, row) {
	let positions: number[][] = [];
	let rows = [row - 1, row + 1];
	for (let index = 0, length = rows.length; index < length; index++) {
		positions.push([column, rows[index]]);
		positions.push([column + 1, rows[index]]);
		positions.push([column + 2, rows[index]]);
		positions.push([column - 1, rows[index]]);
		positions.push([column - 2, rows[index]]);
	}
	positions.push([column + 2, row]);
	positions.push([column - 2, row]);

	return positions;
}

export function updateMapWithExit(map: ZeroOneMap, exit: Exit) {
	switch (exit.exitWallSide) {
		case "left":
			for (let index = 0; index < exit.exitWidth; index++) {
				map[exit.exitPosition + index][0] = exitSymbol;
			}
			break;
		case "right":
			for (let index = 0; index < exit.exitWidth; index++) {
				map[exit.exitPosition + index][map[0].length - 1] = exitSymbol;
			}
			break;
	}
}
