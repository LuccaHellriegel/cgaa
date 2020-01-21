import { RelativePosition } from "../../base/types";
import { PathCalcConfig, getAllPositionsAroundBuilding, findClosestRelativePosition } from "./pathBase";
import { Paths } from "./Paths";
import { PathFactory } from "./classes/PathFactory";

export function calculateAllBuildingSpecificPaths(
	config: PathCalcConfig,
	factory: PathFactory,
	exits: RelativePosition[]
) {
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
				let path = factory.createContainer(pos[0], pos[1], exit.column, exit.row, mainPath.pathArr);
				(config.scene.cgaa.paths as Paths).setPathForRelPos({ column: pos[0], row: pos[1] }, path);
			}
		}
	}
}
