import { TowerSpawnObj } from "./TowerSpawnObj";
import { EnemyCircle } from "../../enemies/unit/EnemyCircle";
import { EnemySpawnObj } from "./EnemySpawnObj";
import { BuildingSpawnObj } from "./BuildingSpawnObj";
import { constructColumnRowID } from "../id";
import { walkableSymbol } from "../../../globals/globalSymbols";
import { realCoordinateToRelative } from "../position";
import { ZeroOneMap } from "../types";
import { AreaConfig } from "../interfaces";

function mapToAreaSpawnableDict(map: ZeroOneMap, areaConfig: AreaConfig) {
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

function getAllPositionsAroundBuildingInclusive(column, row) {
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

function hasSpaceForBuilding(map: ZeroOneMap, column, row) {
	let positionArr = getAllPositionsAroundBuildingInclusive(column, row);
	for (let index = 0, positionLength = positionArr.length; index < positionLength; index++) {
		let column = positionArr[index][0];
		let row = positionArr[index][1];

		if (!(map[row][column] === walkableSymbol)) return false;
	}
	return true;
}

function mapToAreaBuildingSpawnableDict(map: ZeroOneMap, areaConfig: AreaConfig) {
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

function mapToNotAreaSpawnableDict(map: ZeroOneMap, areaConfigs: AreaConfig[]) {
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

export function createTowerSpawnObj(map: ZeroOneMap, areaConfigs: AreaConfig[], enemies: EnemyCircle[]): TowerSpawnObj {
	return new TowerSpawnObj(mapToNotAreaSpawnableDict(map, areaConfigs), enemies);
}

export function createAreaEnemySpawnObj(
	map: ZeroOneMap,
	areaConfig: AreaConfig,
	enemies: EnemyCircle[]
): EnemySpawnObj {
	return new EnemySpawnObj(mapToAreaSpawnableDict(map, areaConfig), enemies);
}

function createBuildingSpawnableDict(column, row) {
	let dict = {};
	let rows = [row - 1, row + 1];
	for (let index = 0, length = rows.length; index < length; index++) {
		dict[constructColumnRowID(column, rows[index])] = walkableSymbol;
		dict[constructColumnRowID(column + 1, rows[index])] = walkableSymbol;
		dict[constructColumnRowID(column + 2, rows[index])] = walkableSymbol;
		dict[constructColumnRowID(column - 1, rows[index])] = walkableSymbol;
		dict[constructColumnRowID(column - 2, rows[index])] = walkableSymbol;
	}
	dict[constructColumnRowID(column + 2, row)] = walkableSymbol;
	dict[constructColumnRowID(column - 2, row)] = walkableSymbol;

	return dict;
}

export function createBuildingEnemySpawnObj(column, row, enemies: EnemyCircle[]): EnemySpawnObj {
	return new EnemySpawnObj(createBuildingSpawnableDict(column, row), enemies);
}

export function createBuildingSpawnObj(map: ZeroOneMap, areaConfig: AreaConfig) {
	return new BuildingSpawnObj(mapToAreaBuildingSpawnableDict(map, areaConfig));
}
