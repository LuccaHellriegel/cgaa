import { ZeroOneMap, RelativePosition } from "../../base/types";
import { Path } from "./Path";
import { Paths } from "./Paths";
import { Exits } from "./Exits";
import { getAllPositionsAroundBuilding } from "./pathBase";
import { BuildingInfo } from "../../base/interfaces";
import { PathConstructor } from "./PathConstructor";
import { realCoordinateToRelative, areaToRealMiddlePoint } from "../../base/position";
import { Area } from "../../area/Area";

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

	private calculatePathsFromMiddleToMiddleOfArea(area: Area, id) {
		let realMiddle = areaToRealMiddlePoint(area);
		this.paths.setPathForID(
			id,
			this.calculatePath(
				{ column: realCoordinateToRelative(realMiddle.x), row: realCoordinateToRelative(realMiddle.y) },
				this.middlePos,
				[]
			)
		);
	}

	generatePaths(buildingInfos: BuildingInfo[], playerArea: Area, bossArea: Area) {
		this.calculatePathsFromMiddleToMiddleOfArea(playerArea, "MiddleToPlayer");
		this.calculatePathsFromMiddleToMiddleOfArea(bossArea, "MiddleToBoss");

		this.calculatePathsFromBuildingsToMiddle(buildingInfos);
		this.pathConstructor.constructPathsFromBuildingsToOtherExit(buildingInfos);

		this.pathConstructor.constructPathsFromBuildingsToMiddleToBossCamp(buildingInfos);
		this.pathConstructor.constructPathsFromBuildingsToMiddleToPlayerCamp(buildingInfos);
	}
}
