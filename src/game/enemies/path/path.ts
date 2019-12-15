import EasyStar from "easystarjs";
import { PathContainer } from "./PathContainer";
import { Gameplay } from "../../../scenes/Gameplay";
import { constructXYIDfromColumnRow, constructXYID } from "../../base/id";
import { ZeroOneMap, RelativePosition, Point } from "../../base/types";
import { exitToGlobalPoint, realCoordinateToRelative, exitToGlobalRelativePosition } from "../../base/position";
import { AreaConfig, BuildingInfo } from "../../base/interfaces";

export interface PathCalcConfig {
	scene: Gameplay;
	pathDict: {};
	unifiedMap: ZeroOneMap;
	areaConfigs: AreaConfig[];
	middlePos: RelativePosition;
	buildingInfos: BuildingInfo[];
}

function calculatePathsFromExit(config: PathCalcConfig, easyStar) {
	const emptyPathContainer = { path: [] };
	let middleColumn = config.middlePos.column;
	let middleRow = config.middlePos.row;
	config.areaConfigs.forEach(area => {
		let pos: Point = exitToGlobalPoint(area);
		config.pathDict[constructXYID(pos.x, pos.y)] = new PathContainer(
			config.scene,
			realCoordinateToRelative(pos.x),
			realCoordinateToRelative(pos.y),
			middleColumn,
			middleRow,
			easyStar,
			config.unifiedMap,
			emptyPathContainer
		);
	});
}

function findClosestExit(exits: RelativePosition[], column, row): RelativePosition {
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

function getAllPositionsAroundBuilding(column, row) {
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

function calculateAllBuildingSpecificPaths(config: PathCalcConfig, easyStar, exits: RelativePosition[]) {
	for (let index = 0, length = config.buildingInfos.length; index < length; index++) {
		for (
			let posIndex = 0, posLength = config.buildingInfos[index].spawnPositions.length;
			posIndex < posLength;
			posIndex++
		) {
			const buildingPosition = config.buildingInfos[index].spawnPositions[posIndex];
			const positionsAround = getAllPositionsAroundBuilding(buildingPosition[0], buildingPosition[1]);
			for (let posIndex = 0, length = positionsAround.length; posIndex < length; posIndex++) {
				const pos = positionsAround[posIndex];
				const exit = findClosestExit(exits, pos[0], pos[1]);
				let mainPath = config.pathDict[constructXYIDfromColumnRow(exit.column, exit.row)];
				let saveReference = new PathContainer(
					config.scene,
					pos[0],
					pos[1],
					exit.column,
					exit.row,
					easyStar,
					config.unifiedMap,
					mainPath
				);
				config.pathDict[constructXYIDfromColumnRow(pos[0], pos[1])] = saveReference;
			}
		}
	}
}

export function calculatePaths(config: PathCalcConfig) {
	const easyStar = new EasyStar.js();
	let exitPositions: RelativePosition[] = [];
	for (let index = 0, length = config.areaConfigs.length; index < length; index++) {
		exitPositions.push(exitToGlobalRelativePosition(config.areaConfigs[index]));
	}
	calculatePathsFromExit(config, easyStar);
	calculateAllBuildingSpecificPaths(config, easyStar, exitPositions);
}
