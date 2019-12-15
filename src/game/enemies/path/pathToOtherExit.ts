import { PathCalcConfig, getAllPositionsAroundBuilding, findClosestExit, findClosestBuilding } from "./pathBase";
import { RelativePosition } from "../../base/types";
import { constructXYIDfromColumnRow } from "../../base/id";
import { PathContainer } from "./classes/PathContainer";

export function calculatePathToOtherExits(config: PathCalcConfig, exits: RelativePosition[]) {
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
				let posToMiddle: PathContainer = config.pathDict[constructXYIDfromColumnRow(pos[0], pos[1])];

				for (let exitIndex = 0; exitIndex < exits.length; exitIndex++) {
					if (exits[exitIndex] !== exit) {
						let otherExit = exits[exitIndex];
						let otherExitToMiddle: PathContainer =
							config.pathDict[constructXYIDfromColumnRow(otherExit.column, otherExit.row)];
						let color = findClosestBuilding(config.buildingInfos, otherExit.column, otherExit.row).color;
						config.pathDict[constructXYIDfromColumnRow(pos[0], pos[1]) + " " + color] = {};
						let timer = setInterval(() => {
							if (posToMiddle.path && otherExitToMiddle.path) {
								clearInterval(timer);

								let middleToOtherExitPath = otherExitToMiddle.path.slice().reverse();
								let posToOtherExitPath = posToMiddle.path.concat(middleToOtherExitPath);
								config.pathDict[constructXYIDfromColumnRow(pos[0], pos[1]) + " " + color] = {
									path: posToOtherExitPath
								};
							}
						}, 4000);
					}
				}
			}
		}
	}
}
