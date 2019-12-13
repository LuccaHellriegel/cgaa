import {
	ZeroOneMap,
	mapToNotAreaSpawnableDict,
	mapToAreaSpawnableDict,
	mapToAreaBuildingSpawnableDict
} from "./map/map";
import { AreaConfig } from "../area/create";
import { TowerSpawnObj } from "../spawn/TowerSpawnObj";
import { EnemyCircle } from "../enemies/units/EnemyCircle";
import { EnemySpawnObj } from "../spawn/EnemySpawnObj";
import { BuildingSpawnObj } from "../spawn/BuildingSpawnObj";
import { constructColumnRowID } from "./id";
import { walkableSymbol } from "../../globals/globalSymbols";

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
