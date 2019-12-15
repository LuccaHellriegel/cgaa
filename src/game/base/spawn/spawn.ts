import { TowerSpawnObj } from "./TowerSpawnObj";
import { EnemySpawnObj } from "./EnemySpawnObj";
import { constructXYIDfromColumnRow } from "../id";
import { walkableSymbol } from "../globals/globalSymbols";
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
			if (isInArea && isWalkable) dict[constructXYIDfromColumnRow(column, row)] = walkableSymbol;
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
			if (!inArea && isWalkable) dict[constructXYIDfromColumnRow(column, row)] = walkableSymbol;
		}
	}
	return dict;
}

export function createTowerSpawnObj(map: ZeroOneMap, areaConfigs: AreaConfig[], enemyDict): TowerSpawnObj {
	return new TowerSpawnObj(mapToNotAreaSpawnableDict(map, areaConfigs), enemyDict);
}

export function createAreaEnemySpawnObj(map: ZeroOneMap, areaConfig: AreaConfig, enemyDict): EnemySpawnObj {
	return new EnemySpawnObj(mapToAreaSpawnableDict(map, areaConfig), enemyDict);
}

function createBuildingSpawnableDict(column, row) {
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

export function createBuildingEnemySpawnObj(column, row, enemyDict): EnemySpawnObj {
	return new EnemySpawnObj(createBuildingSpawnableDict(column, row), enemyDict);
}
