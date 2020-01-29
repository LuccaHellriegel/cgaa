import { RelativePosition } from "../../base/types";

import { BuildingInfo } from "../../base/interfaces";

import { getAllPositionsAroundBuilding, findClosestBuilding } from "./pathBase";

import { Path } from "./Path";
import { Exits } from "./Exits";
import { Paths } from "./Paths";

export class PathConstructor {
	constructor(private exits: Exits, private paths: Paths) {}

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

	constructPathsFromBuildingsToOtherExit(buildingInfos: BuildingInfo[]) {
		buildingInfos.forEach(info => {
			info.spawnPositions.forEach(pos => {
				this.constructPathsFromBuildingToOtherExit({ column: pos[0], row: pos[1] }, buildingInfos);
			});
		});
	}

	//TODO: they are dependant on the buidlingToExit having been executed
	private constructPathsFromBuildingToMiddleToPlayerCamp(buildingPosition: RelativePosition) {
		//TODO: might not be optimal to just replace the previous path to middle, as this is confusing
		const positionsAround = getAllPositionsAroundBuilding(buildingPosition.column, buildingPosition.row);
		for (let posIndex = 0, length = positionsAround.length; posIndex < length; posIndex++) {
			const pos = positionsAround[posIndex];
			let posToMiddle: Path = this.paths.getPathForRelPos({
				column: pos[0],
				row: pos[1]
			});
			let middleToPlayerArr = this.paths
				.getPathForID("MiddleToPlayer")
				.pathArr.slice()
				.reverse();
			let posToPlayer = middleToPlayerArr.concat(posToMiddle.pathArr);
			this.paths.setPathForRelPos(
				{
					column: pos[0],
					row: pos[1]
				},
				Path.createPathFromArr(posToPlayer)
			);
		}
	}

	constructPathsFromBuildingsToMiddleToPlayerCamp(buildingInfos: BuildingInfo[]) {
		buildingInfos.forEach(info => {
			info.spawnPositions.forEach(pos => {
				this.constructPathsFromBuildingToMiddleToPlayerCamp({ column: pos[0], row: pos[1] });
			});
		});
	}

	//TODO: test this path
	private constructPathsFromBuildingToMiddleToBossCamp(buildingPosition: RelativePosition) {
		const positionsAround = getAllPositionsAroundBuilding(buildingPosition.column, buildingPosition.row);
		for (let posIndex = 0, length = positionsAround.length; posIndex < length; posIndex++) {
			const pos = positionsAround[posIndex];
			let posToMiddle: Path = this.paths.getPathForRelPos({
				column: pos[0],
				row: pos[1]
			});
			let middleToBossArr = this.paths
				.getPathForID("MiddleToBoss")
				.pathArr.slice()
				.reverse();
			let posToBoss = middleToBossArr.concat(posToMiddle.pathArr);
			this.paths.setPathToBoss(
				{
					column: pos[0],
					row: pos[1]
				},
				Path.createPathFromArr(posToBoss)
			);
		}
	}

	constructPathsFromBuildingsToMiddleToBossCamp(buildingInfos: BuildingInfo[]) {
		buildingInfos.forEach(info => {
			info.spawnPositions.forEach(pos => {
				this.constructPathsFromBuildingToMiddleToBossCamp({ column: pos[0], row: pos[1] });
			});
		});
	}
}
