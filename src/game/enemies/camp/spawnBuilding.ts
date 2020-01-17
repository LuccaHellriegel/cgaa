import { ZeroOneMap, StaticConfig } from "../../base/types";
import { walkableSymbol, buildingSymbol } from "../../base/globals/globalSymbols";
import { AreaConfig } from "../../base/interfaces";
import { realCoordinateToRelative, relativeCoordinateToReal } from "../../base/position";
import { BuildingSpawnConfig, Building } from "./unit/Building";
import { HealthBar } from "../../base/classes/HealthBar";
import { rectBuildinghalfHeight, circleSizeNames } from "../../base/globals/globalSizes";
import { cloneDeep } from "lodash";

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
			if (suitableForBuilding) dict[column + " " + row] = walkableSymbol;
		}
	}
	return dict;
}

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

function updateObj(column, row, obj) {
	let positionArr = getAllBuildingRelevantPositions(column, row);
	for (let index = 0, positionLength = positionArr.length; index < positionLength; index++) {
		let id = positionArr[index][0] + " " + positionArr[index][1];
		if (obj[id] !== undefined) obj[id] = buildingSymbol;
	}
}

function IDToIntArr(id: string): number[] {
	let arr = id.split(" ");
	return [parseInt(arr[0]), parseInt(arr[1])];
}
function getRandomSpawnPosition(obj, keys) {
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

function getRandomSpawnPositions(numberOfPositions, baseObj): number[][] {
	let keys = Object.keys(baseObj);
	let copyObj = cloneDeep(baseObj);
	let foundPos = 0;
	let curPositions: number[][] = [];
	let curPosition;

	while (foundPos !== numberOfPositions) {
		curPosition = getRandomSpawnPosition(copyObj, keys);
		if (curPosition) {
			let arr = IDToIntArr(curPosition);
			curPositions.push(arr);
			updateObj(arr[0], arr[1], copyObj);
			foundPos++;
		} else {
			copyObj = cloneDeep(baseObj);
			foundPos = 0;
			curPositions = [];
		}
	}
	return curPositions;
}

export function getRandomBuildingSpawnPositions(map: ZeroOneMap, areaConfig: AreaConfig, numberOfPositions) {
	return getRandomSpawnPositions(numberOfPositions, mapToAreaBuildingSpawnableDict(map, areaConfig));
}

interface BuildingsConfig {
	staticConfig: StaticConfig;
	color: string;
	spawnConfig: BuildingSpawnConfig;
}

export function spawnBuildings(spawnPositions, config: BuildingsConfig) {
	let buildings: Building[] = [];

	for (let index = 0, length = spawnPositions.length; index < length; index++) {
		let pos = spawnPositions[index];

		let x = relativeCoordinateToReal(pos[0]);
		let y = relativeCoordinateToReal(pos[1]);

		let healthbar = new HealthBar(x - 25, y - rectBuildinghalfHeight, {
			posCorrectionX: 0,
			posCorrectionY: -rectBuildinghalfHeight,
			healthWidth: 46,
			healthLength: 12,
			value: 100,
			scene: config.staticConfig.scene
		});

		buildings.push(
			new Building(
				config.staticConfig.scene,
				x,
				y,
				config.staticConfig.physicsGroup,
				circleSizeNames[index],
				config.color,
				healthbar,
				config.spawnConfig
			)
		);
	}
	config.staticConfig.scene.cgaa.camps[config.color]["buildings"] = buildings;
}