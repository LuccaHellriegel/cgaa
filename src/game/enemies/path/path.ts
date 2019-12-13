import EasyStar from "easystarjs";
import { exitToPosition } from "../../area/calculate";
import { PathContainer } from "./PathContainer";
import { Gameplay } from "../../../scenes/Gameplay";
import { ZeroOneMap, getAllPositionsAroundBuilding } from "../../base/map/map";
import { AreaConfig } from "../../area/create";
import { constructColumnRowID } from "../../base/id";
import { RelativePosition } from "../../base/types";

export interface PathCalcConfig {
	scene: Gameplay;
	pathDict: {};
	unifiedMap: ZeroOneMap;
	areaConfigs: AreaConfig[];
	middlePos: { column: number; row: number };
	buildingPositions: number[][];
}

function calculatePathsFromExit(config: PathCalcConfig, easyStar) {
	const emptyPathContainer = { id: "", path: [] };
	let middleColumn = config.middlePos.column;
	let middleRow = config.middlePos.row;
	config.areaConfigs.forEach(area => {
		let pos: RelativePosition = exitToPosition(area);
		config.pathDict[constructColumnRowID(pos.column, pos.row)] = new PathContainer(
			config.scene,
			pos.column,
			pos.row,
			middleColumn,
			middleRow,
			easyStar,
			config.unifiedMap,
			emptyPathContainer
		);
	});
}

function findClosestExit(exits, column, row): { column: number; row: number } {
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

function calculateAllBuildingSpecificPaths(config: PathCalcConfig, easyStar, exits) {
	for (let index = 0, length = config.buildingPositions.length; index < length; index++) {
		const buildingPosition = config.buildingPositions[index];
		const positionsAround = getAllPositionsAroundBuilding(buildingPosition[0], buildingPosition[1]);
		for (let posIndex = 0, length = positionsAround.length; posIndex < length; posIndex++) {
			const pos = positionsAround[posIndex];
			const exit = findClosestExit(exits, pos[0], pos[1]);
			let mainPath = config.pathDict[constructColumnRowID(exit.column, exit.row)];
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
			config.pathDict[constructColumnRowID(pos[0], pos[1])] = saveReference;
			// exits.forEach(otherExit => {
			// 	if (otherExit !== exit) {
			// 		const timer = setInterval(
			// 			function() {
			// 				let otherExitToMainPath = config.pathDict[constructColumnRowID(otherExit.column, otherExit.row)].path;
			// 				let curPosToMainPath = config.pathDict[constructColumnRowID(pos[0], pos[1])].path;
			// 				if (otherExitToMainPath && curPosToMainPath) {
			// 					const id = constructColumnRowID(pos[0], pos[1]);
			// 					const reversedOtherExitToMainPath = otherExitToMainPath.slice().reverse();
			// 					const curPosToOtherExitPath = curPosToMainPath.concat(reversedOtherExitToMainPath);
			// 					config.pathDict[id] = { id, path: curPosToOtherExitPath };
			// 					clearInterval(timer);
			// 				}
			// 			}.bind(this),
			// 			4000
			// 		);
			// 	}
			// });
		}
	}
}

export function calculatePaths(config: PathCalcConfig) {
	const easyStar = new EasyStar.js();
	let exitPositions: { column: number; row: number }[] = [];
	for (let index = 0, length = config.areaConfigs.length; index < length; index++) {
		exitPositions.push(exitToPosition(config.areaConfigs[index]));
	}
	calculatePathsFromExit(config, easyStar);
	calculateAllBuildingSpecificPaths(config, easyStar, exitPositions);
}
