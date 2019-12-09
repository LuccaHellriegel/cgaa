import EasyStar from "easystarjs";
import { PathContainer } from "./PathContainer";
import { Area } from "../../areas/Area";
import { realPosToRelativePos } from "../../base/position";
import { calculateRelativeSpawnPositionsAround } from "../spawn/spawn";
import { Areas } from "../../areas/Areas";

export class PathManager {
	easyStar: EasyStar.js;
	relativeGoalPositionRow: number = 14;
	realtiveGoalPositionColumn: number = 14;
	buildingSpecificPaths: PathContainer[] = [];
	areas: Areas;

	constructor(areas: Areas) {
		this.areas = areas;
		this.easyStar = new EasyStar.js();
		this.calculateBuildingSpecificPaths();
	}

	calculateAllBuildingSpecificPaths(building) {
		let { column, row } = realPosToRelativePos(building.x, building.y);

		let validSpawnPositions = calculateRelativeSpawnPositionsAround(column, row, 3, 1);
		let containers: PathContainer[] = [];

		validSpawnPositions.forEach(pos => {
			let saveReference = new PathContainer(pos.column, pos.row);
			this.easyStar.setGrid(this.areas.getWalkableMap());
			this.easyStar.setAcceptableTiles([0]);
			this.easyStar.findPath(
				pos.column,
				pos.row,
				this.realtiveGoalPositionColumn,
				this.relativeGoalPositionRow,
				function(path) {
					if (path === null) {
						console.log("Path was not found.");
					} else {
						saveReference.updatePath(path);
					}
				}.bind(this)
			);
			this.easyStar.calculate();
			containers.push(saveReference);
		});
		return containers;
	}

	private calculateBuildingSpecificPaths() {
		this.areas.executeWithAreasThatHaveBuilding((area: Area) => {
			area.buildings.forEach(building => {
				this.buildingSpecificPaths = this.buildingSpecificPaths.concat(
					this.calculateAllBuildingSpecificPaths(building)
				);
			});
		});
	}

	getSpecificPathForSpawnPos(column, row) {
		for (const container in this.buildingSpecificPaths) {
			if (this.buildingSpecificPaths[container].id === [column, row].join(""))
				return this.buildingSpecificPaths[container];
		}
	}
}
