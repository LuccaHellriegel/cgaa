import { layoutAreaToMapTopLeft, mapAreaTopLeftToMapMiddle, filterRelPosInsideArea } from "./layout";
import { RelPos } from "../0_GameBase/engine/RelPos";
import { GameMap, BuildingPosition } from "../0_GameBase/types";

function getAllBuildingRelevantPositions(column, row) {
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

function updateObj(column, row, obj, mapBuildingSymbol: number) {
	let positionArr = getAllBuildingRelevantPositions(column, row);
	for (let index = 0, positionLength = positionArr.length; index < positionLength; index++) {
		let id = positionArr[index][0] + " " + positionArr[index][1];
		if (obj[id] !== undefined) obj[id] = mapBuildingSymbol;
	}
}

function IDToIntArr(id: string): RelPos {
	let arr = id.split(" ");
	return new RelPos(parseInt(arr[1]), parseInt(arr[0]));
}

function getRandomSpawnPosition(middle: RelPos, obj, keys, mapDefaultSymbol: number) {
	let key = keys[Phaser.Math.Between(0, keys.length - 1)];
	let isWalkable = obj[key] === mapDefaultSymbol;
	let tries = 0;
	while (!isWalkable && tries < 100) {
		key = keys[Phaser.Math.Between(0, keys.length - 1)];
		isWalkable = obj[key] === mapDefaultSymbol;
		tries++;
	}
	if (tries === 100) return false;

	//Building not allowed in middle for pathfinding
	let pos = IDToIntArr(key);
	if (pos.row === middle.row && pos.column === middle.column) return false;
	//Building not allowed to overlap middle for pathfinding
	if (pos.row === middle.row && pos.column === middle.column - 1) return false;
	if (pos.row === middle.row && pos.column === middle.column + 1) return false;

	return pos;
}

function spawnPosForBuilding(column, row) {
	// all pos around the building, constraints are ensured by random pos algo
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

function positionsAroundBuldingInclusive(row, column) {
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

function mapHasSpaceForBuilding(map: GameMap, row, column, mapDefaultSymbol: number) {
	let positionArr = positionsAroundBuldingInclusive(row, column);
	for (let index = 0, positionLength = positionArr.length; index < positionLength; index++) {
		let column = positionArr[index][0];
		let row = positionArr[index][1];
		if (!(map[row][column] === mapDefaultSymbol)) return false;
	}
	return true;
}

function buildingSpawnDict(
	areaMapTopLeft: RelPos,
	areaSize,
	mapSpawnPos: RelPos[],
	map: GameMap,
	mapDefaultSymbol: number
) {
	const buildingSpawnPos = filterRelPosInsideArea(areaMapTopLeft, areaSize, mapSpawnPos).filter((pos) =>
		mapHasSpaceForBuilding(map, pos.row, pos.column, mapDefaultSymbol)
	);
	const dict = {};
	buildingSpawnPos.forEach((pos) => (dict[pos.column + " " + pos.row] = mapDefaultSymbol));
	return dict;
}

function randomAreaBuildingPositions(
	area: RelPos,
	areaSize: number,
	buildingsPerCamp,
	mapSpawnPos: RelPos[],
	gameMap: GameMap,
	mapDefaultSymbol: number,
	mapBuildingSymbol: number
): BuildingPosition[] {
	const topLeft = layoutAreaToMapTopLeft(area, areaSize);

	let positions: RelPos[] = [];
	let middle = mapAreaTopLeftToMapMiddle(topLeft, areaSize);

	let baseObj = buildingSpawnDict(topLeft, areaSize, mapSpawnPos, gameMap, mapDefaultSymbol);

	let keys = Object.keys(baseObj);
	let copyObj = { ...baseObj };
	let foundPos = 0;
	let curPosition;
	while (foundPos !== buildingsPerCamp) {
		curPosition = getRandomSpawnPosition(middle, copyObj, keys, mapDefaultSymbol);
		if (curPosition) {
			positions.push(curPosition);
			updateObj(curPosition.column, curPosition.row, copyObj, mapBuildingSymbol);
			foundPos++;
		} else {
			copyObj = { ...baseObj };
			foundPos = 0;
			positions = [];
		}
	}

	return positions.map((pos) => {
		return { areaInLayout: area, positionInMap: pos, spawnPos: spawnPosForBuilding(pos.column, pos.row) };
	});
}

export function randomBuildingPositions(
	areaLayout,
	areaSymbol,
	areaSize,
	buildingsPerCamp,
	mapSpawnPos: RelPos[],
	gameMap: GameMap,
	mapDefaultSymbol: number,
	mapBuildingSymbol: number
) {
	let result: BuildingPosition[] = [];

	for (let row = 0; row < areaLayout.length; row++) {
		for (let column = 0; column < areaLayout[0].length; column++) {
			if (areaLayout[row][column] == areaSymbol)
				result = result.concat(
					randomAreaBuildingPositions(
						new RelPos(row, column),
						areaSize,
						buildingsPerCamp,
						mapSpawnPos,
						gameMap,
						mapDefaultSymbol,
						mapBuildingSymbol
					)
				);
		}
	}

	return result;
}

export function addBuildingPositionsToGameMap(
	map: GameMap,
	buildingPositions: BuildingPosition[],
	mapBuildingSymbol: number
) {
	for (const pos of buildingPositions) {
		map[pos.positionInMap.row][pos.positionInMap.column - 1] = mapBuildingSymbol;
		map[pos.positionInMap.row][pos.positionInMap.column] = mapBuildingSymbol;
		map[pos.positionInMap.row][pos.positionInMap.column + 1] = mapBuildingSymbol;
	}
}
