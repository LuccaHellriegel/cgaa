import { Gameplay } from "../../../scenes/Gameplay";
import { ZeroOneMap, RelativePosition } from "../../base/types";
import { AreaConfig, BuildingInfo } from "../../base/interfaces";

export interface PathCalcConfig {
	scene: Gameplay;
	pathDict: {};
	unifiedMap: ZeroOneMap;
	areaConfigs: AreaConfig[];
	middlePos: RelativePosition;
	buildingInfos: BuildingInfo[];
}

export function findClosestExit(exits: RelativePosition[], column, row): RelativePosition {
	let exit;
	let dist = Infinity;
	for (const curExit in exits) {
		let curDist = Phaser.Math.Distance.Between(column, row, exits[curExit].column, exits[curExit].row);
		if (curDist < dist) {
			exit = curExit;
			dist = curDist;
		}
	}
	return exits[exit];
}

export function findClosestBuilding(buildingInfos: BuildingInfo[], column: number, row: number): BuildingInfo {
	let buildingInfo;
	let dist = Infinity;
	for (const curBuilding in buildingInfos) {
		let curDist = Phaser.Math.Distance.Between(
			column,
			row,
			buildingInfos[curBuilding].spawnPositions[0][0],
			buildingInfos[curBuilding].spawnPositions[0][1]
		);
		if (curDist < dist) {
			buildingInfo = curBuilding;
			dist = curDist;
		}
	}
	return buildingInfos[buildingInfo];
}

export function getAllPositionsAroundBuilding(column, row) {
	let positions: number[][] = [];
	let rows = [row - 1, row + 1];

	positions.push([column + 2, row]);
	positions.push([column - 2, row]);
	for (let index = 0, length = rows.length; index < length; index++) {
		positions.push([column - 2, rows[index]]);
		positions.push([column - 1, rows[index]]);
		positions.push([column, rows[index]]);
		positions.push([column + 1, rows[index]]);
		positions.push([column + 2, rows[index]]);
	}

	return positions;
}

//export function executeOver
