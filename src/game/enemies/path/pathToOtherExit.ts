import {
	PathCalcConfig,
	getAllPositionsAroundBuilding,
	findClosestBuilding,
	findClosestRelativePosition
} from "./pathBase";
import { RelativePosition } from "../../base/types";
import { constructXYIDfromColumnRow } from "../../base/id";
import { Paths } from "./Paths";
import { Path } from "./classes/Path";

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
				const exit = findClosestRelativePosition(exits, pos[0], pos[1]);
				let posToMiddle: Path = (config.scene.cgaa.paths as Paths).getPathForRelPos({
					column: pos[0],
					row: pos[1]
				});

				for (let exitIndex = 0; exitIndex < exits.length; exitIndex++) {
					if (exits[exitIndex] !== exit) {
						let otherExit = exits[exitIndex];
						let otherExitToMiddle: Path = (config.scene.cgaa.paths as Paths).getPathForRelPos(otherExit);
						let color = findClosestBuilding(config.buildingInfos, otherExit.column, otherExit.row).color;
						(config.scene.cgaa.paths as Paths).setPathForID(
							constructXYIDfromColumnRow(pos[0], pos[1]) + " " + color,
							{}
						);

						let middleToOtherExitPath = otherExitToMiddle.pathArr.slice().reverse();
						let posToOtherExitPath = posToMiddle.pathArr.concat(middleToOtherExitPath);
						(config.scene.cgaa.paths as Paths).setPathForID(constructXYIDfromColumnRow(pos[0], pos[1]) + " " + color, {
							path: posToOtherExitPath
						});
					}
				}
			}
		}
	}
}
