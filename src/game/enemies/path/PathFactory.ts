import { ZeroOneMap, RelativePosition } from "../../base/types";
import { Path } from "./Path";
import { Paths } from "./Paths";
import { Exits } from "./Exits";
import { getAllPositionsAroundBuilding } from "./pathBase";
import { BuildingInfo, AreaConfig } from "../../base/interfaces";
import { PathConstructor } from "./PathConstructor";
import { gridPartHalfSize } from "../../base/globals/globalSizes";
import { realCoordinateToRelative } from "../../base/position";

export class PathFactory {
	private pathConstructor: PathConstructor;

	constructor(
		private map: ZeroOneMap,
		private easystar,
		private paths: Paths,
		private exits: Exits,
		private middlePos: RelativePosition
	) {
		this.calculatePathsFromExitsToMiddle();
		this.pathConstructor = new PathConstructor(exits, paths);
	}

	private calculatePath(start: RelativePosition, goal: RelativePosition, pathArrToAdd): Path {
		let path = new Path(start.column, start.row, goal.column, goal.row, this.easystar, this.map, pathArrToAdd);
		path.calculate();
		return path;
	}

	private calculatePathsFromExitsToMiddle() {
		this.exits.exitsAsRelativePositions.forEach(exit => {
			this.paths.setPathForRelPos(exit, this.calculatePath(exit, this.middlePos, []));
		});
	}

	private calculatePathsFromBuildingToMiddle(buildingPosition: RelativePosition) {
		const positionsAround = getAllPositionsAroundBuilding(buildingPosition.column, buildingPosition.row);
		for (let posIndex = 0, length = positionsAround.length; posIndex < length; posIndex++) {
			const pos = positionsAround[posIndex];
			const exit = this.exits.getClosestRelativeExit({ column: pos[0], row: pos[1] });
			let mainPath = this.paths.getPathForRelPos(exit);
			this.paths.setPathForRelPos(
				{ column: pos[0], row: pos[1] },
				this.calculatePath({ column: pos[0], row: pos[1] }, exit, mainPath.pathArr)
			);
		}
	}

	private calculatePathsFromBuildingsToMiddle(buildingInfos: BuildingInfo[]) {
		buildingInfos.forEach(info => {
			info.spawnPositions.forEach(pos => {
				this.calculatePathsFromBuildingToMiddle({ column: pos[0], row: pos[1] });
			});
		});
	}

	private calculatePathsFromMiddleToMiddleOfArea(areaConfig: AreaConfig, id) {
		//TODO: extract area to middle function
		let middleOfPlayerAreaX = (2 * gridPartHalfSize * areaConfig.wallBase.sizeOfXAxis) / 2 + areaConfig.topLeftX;
		let middleOfPlayerAreaY = (2 * gridPartHalfSize * areaConfig.wallBase.sizeOfXAxis) / 2 + areaConfig.topLeftY;
		this.paths.setPathForID(
			id,
			this.calculatePath(
				{ column: realCoordinateToRelative(middleOfPlayerAreaX), row: realCoordinateToRelative(middleOfPlayerAreaY) },
				this.middlePos,
				[]
			)
		);
	}

	generatePaths(buildingInfos: BuildingInfo[], playerConfig: AreaConfig, bossConfig: AreaConfig) {
		this.calculatePathsFromMiddleToMiddleOfArea(playerConfig, "MiddleToPlayer");
		this.calculatePathsFromMiddleToMiddleOfArea(bossConfig, "MiddleToBoss");

		this.calculatePathsFromBuildingsToMiddle(buildingInfos);
		this.pathConstructor.constructPathsFromBuildingsToOtherExit(buildingInfos);

		this.pathConstructor.constructPathsFromBuildingsToMiddleToBossCamp(buildingInfos);
		this.pathConstructor.constructPathsFromBuildingsToMiddleToPlayerCamp(buildingInfos);
	}
}
