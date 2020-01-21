import { ZeroOneMap, RelativePosition } from "../../base/types";
import { Path } from "./Path";
import { Paths } from "./Paths";
import { Exits } from "./Exits";
import { getAllPositionsAroundBuilding, findClosestBuilding } from "./pathBase";
import { BuildingInfo } from "../../base/interfaces";

export class PathFactory {
	constructor(
		private map: ZeroOneMap,
		private easystar,
		private paths: Paths,
		private exits: Exits,
		middlePos: RelativePosition
	) {
		this.calculatePathsFromExitsToMiddle(middlePos);
	}

	private calculatePath(start, goal, pathArrToAdd): Path {
		let path = new Path(start.column, start.row, goal.column, goal.row, this.easystar, this.map, pathArrToAdd);
		path.calculate();
		return path;
	}

	private calculatePathsFromExitsToMiddle(middlePos) {
		this.exits.exitsAsRelativePositions.forEach(exit => {
			this.paths.setPathForRelPos(exit, this.calculatePath(exit, middlePos, []));
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

	private constructPathsFromBuildingToOtherExit(buildingPosition: RelativePosition, buildingInfos: BuildingInfo[]) {
		const positionsAround = getAllPositionsAroundBuilding(buildingPosition.column, buildingPosition.row);
		for (let posIndex = 0, length = positionsAround.length; posIndex < length; posIndex++) {
			const pos = positionsAround[posIndex];
			const exit = this.exits.getClosestRelativeExit({ column: pos[0], row: pos[1] });
			let posToMiddle: Path = this.paths.getPathForRelPos({
				column: pos[0],
				row: pos[1]
			});

			for (let exitIndex = 0; exitIndex < this.exits.exitsAsRelativePositions.length; exitIndex++) {
				if (this.exits.exitsAsRelativePositions[exitIndex] !== exit) {
					let otherExit = this.exits.exitsAsRelativePositions[exitIndex];
					let otherExitToMiddle: Path = this.paths.getPathForRelPos(otherExit);
					let color = findClosestBuilding(buildingInfos, otherExit.column, otherExit.row).color;
					let middleToOtherExitPath = otherExitToMiddle.pathArr.slice().reverse();
					let posToOtherExitPath = middleToOtherExitPath.concat(posToMiddle.pathArr);
					this.paths.setReroutedPathForRelPos(
						{ column: pos[0], row: pos[1] },
						color,
						Path.createPathFromArr(posToOtherExitPath)
					);
				}
			}
		}
	}

	private constructPathsFromBuildingsToOtherExit(buildingInfos: BuildingInfo[]) {
		buildingInfos.forEach(info => {
			info.spawnPositions.forEach(pos => {
				this.constructPathsFromBuildingToOtherExit({ column: pos[0], row: pos[1] }, buildingInfos);
			});
		});
	}

	generatePaths(buildingInfos: BuildingInfo[]) {
		this.calculatePathsFromBuildingsToMiddle(buildingInfos);
		this.constructPathsFromBuildingsToOtherExit(buildingInfos);
	}
}
