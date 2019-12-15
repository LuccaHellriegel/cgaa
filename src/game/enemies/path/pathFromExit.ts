import { RelativePosition } from "../../base/types";
import { PathCalcConfig } from "./path";
import { constructXYIDfromColumnRow } from "../../base/id";
import { PathContainer } from "./classes/PathContainer";

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

export function calculateAllBuildingSpecificPaths(config: PathCalcConfig, easyStar, exits: RelativePosition[]) {
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
