import { RelativePosition } from "../../base/types";
import { constructXYIDfromColumnRow } from "../../base/id";
import { PathContainer } from "./classes/PathContainer";
import { PathCalcConfig, getAllPositionsAroundBuilding } from "./pathBase";
import { findClosestRelativePosition } from "../../base/find";

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
				const exit = findClosestRelativePosition(exits, pos[0], pos[1]);
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
