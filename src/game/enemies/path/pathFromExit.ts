import { RelativePosition } from "../../base/types";
import { PathContainer } from "./classes/PathContainer";
import { PathCalcConfig, getAllPositionsAroundBuilding, findClosestRelativePosition } from "./pathBase";
import { Paths } from "./Paths";

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
				let mainPath = (config.scene.cgaa.paths as Paths).getPathForRelPos(exit);
				let saveReference = new PathContainer(
					pos[0],
					pos[1],
					exit.column,
					exit.row,
					easyStar,
					config.unifiedMap,
					mainPath
				);
				(config.scene.cgaa.paths as Paths).setPathForRelPos({ column: pos[0], row: pos[1] }, saveReference);
			}
		}
	}
}
