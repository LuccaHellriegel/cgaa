import EasyStar from "easystarjs";
import { PathContainer } from "./PathContainer";
import { calculateRelativeSpawnPositionsAround } from "../../base/map/calculate";
import { realPosToRelativePos } from "../../base/map/position";
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
