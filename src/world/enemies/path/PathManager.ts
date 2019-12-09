import { Gameplay } from "../../../scenes/Gameplay";
import EasyStar from "easystarjs";
import { PathContainer } from "./PathContainer";
import { Area } from "../../areas/Area";
import { BaseManagerConfig } from "../../base/config";
import { applyBaseManagerConfig } from "../../base/apply";
import { realPosToRelativePos } from "../../base/position";
import { calculateRelativeSpawnPositionsAround } from "../spawn/spawn";

export class PathManager {
	scene: Gameplay;
	easyStar: EasyStar.js;
	relativeGoalPositionRow: number = 14;
	realtiveGoalPositionColumn: number = 14;
	buildingSpecificPaths: PathContainer[] = [];

	constructor(config: BaseManagerConfig) {
		applyBaseManagerConfig(this, config);
		this.easyStar = new EasyStar.js();
		this.calculateBuildingSpecificPaths();
	}

	calculateAllBuildingSpecificPaths(building) {
		let { column, row } = realPosToRelativePos(building.x, building.y);

		let validSpawnPositions = calculateRelativeSpawnPositionsAround(column, row, 3, 1);
		let containers: PathContainer[] = [];

		validSpawnPositions.forEach(pos => {
			let saveReference = new PathContainer(pos.column, pos.row);
			this.scene.world.setMapAsGrid(this.easyStar);
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
		this.scene.world.executeWithAreasThatHaveBuilding((area: Area) => {
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
