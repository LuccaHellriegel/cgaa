import EasyStar from "easystarjs";
import { PathContainer } from "./PathContainer";
import { walkableSymbol, exitSymbol } from "../../../globals/globalSymbols";
import { calculateRelativeSpawnPositionsAround } from "../../base/map/calculate";
import { realPosToRelativePos, relativePosToRealPos, calculateRelativeCrossPostioning } from "../../base/map/position";
import { PathMarking } from "./PathMarking";
import { Gameplay } from "../../../scenes/Gameplay";

export class PathManager {
	easyStar: EasyStar.js;
	relativeGoalPositionRow: number = 14;
	realtiveGoalPositionColumn: number = 14;
	buildingSpecificPaths: PathContainer[] = [];
	unifiedMap: any;
	scene: Gameplay;
	pathMarkings: PathMarking[] = [];

	constructor(scene: Gameplay, unifiedMap) {
		this.unifiedMap = unifiedMap;
		this.easyStar = new EasyStar.js();
		this.scene = scene;
	}

	private calculateAllBuildingSpecificPaths(building) {
		let { column, row } = realPosToRelativePos(building.x, building.y);

		let validSpawnPositions = calculateRelativeSpawnPositionsAround(column, row, 3, 1);
		let containers: PathContainer[] = [];

		validSpawnPositions.forEach(pos => {
			let saveReference = new PathContainer(
				pos.column,
				pos.row,
				this.realtiveGoalPositionColumn,
				this.relativeGoalPositionRow,
				this.easyStar,
				this.unifiedMap
			);
			containers.push(saveReference);
		});
		return containers;
	}

	private drawPath(realPath) {
		let curPos = realPath[0];
		let prevDirection = calculateRelativeCrossPostioning(curPos.x, curPos.y, curPos.x - 1, curPos.y);
		let nextPos = realPath[1];
		let nextDirection = calculateRelativeCrossPostioning(curPos.x, curPos.y, nextPos.x, nextPos.y);
		this.pathMarkings.push(new PathMarking(this.scene, curPos.x, curPos.y, prevDirection, nextDirection));
		for (let index = 1; index < realPath.length - 1; index++) {
			let prevPos = realPath[index - 1];
			curPos = realPath[index];
			prevDirection = calculateRelativeCrossPostioning(curPos.x, curPos.y, prevPos.x, prevPos.y);
			nextPos = realPath[index + 1];
			nextDirection = calculateRelativeCrossPostioning(curPos.x, curPos.y, nextPos.x, nextPos.y);
			this.pathMarkings.push(new PathMarking(this.scene, curPos.x, curPos.y, prevDirection, nextDirection));
		}
		let prevPos = realPath[realPath.length - 1 - 1];
		curPos = realPath[realPath.length - 1];
		prevDirection = calculateRelativeCrossPostioning(curPos.x, curPos.y, prevPos.x, prevPos.y);
		nextDirection = calculateRelativeCrossPostioning(curPos.x, curPos.y, curPos.x + 1, curPos.y);
		this.pathMarkings.push(new PathMarking(this.scene, curPos.x, curPos.y, prevDirection, nextDirection));
	}

	calculateBuildingSpecificPaths(buildings) {
		buildings.forEach(building => {
			this.buildingSpecificPaths = this.buildingSpecificPaths.concat(this.calculateAllBuildingSpecificPaths(building));
		});
	}

	getSpecificPathForSpawnPos(column, row) {
		for (const container in this.buildingSpecificPaths) {
			if (this.buildingSpecificPaths[container].id === [column, row].join(""))
				return this.buildingSpecificPaths[container];
		}
	}
}
