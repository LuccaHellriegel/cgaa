import EasyStar from "easystarjs";
import { PathContainer } from "./PathContainer";
import { calculateRelativeSpawnPositionsAround } from "../../base/map/calculate";
import { realPosToRelativePos } from "../../base/map/position";
import { Gameplay } from "../../../scenes/Gameplay";
import { Building } from "../units/Building";
import { Area } from "../../areas/Area";

export class PathManager {
	easyStar: EasyStar.js;
	relativeGoalPositionRow: number = 14;
	realtiveGoalPositionColumn: number = 14;
	paths = {};
	unifiedMap: any;
	scene: Gameplay;
	mainPaths = {};
	exits: any[] = [];

	constructor(scene: Gameplay, unifiedMap, areas: Area[]) {
		this.unifiedMap = unifiedMap;
		this.easyStar = new EasyStar.js();
		this.scene = scene;

		const emptyPathContainer = { id: "", path: [] };
		areas.forEach(area => {
			let pos = area.findFirstExit();
			this.exits.push(pos);
			this.mainPaths[[pos.column, pos.row].join("")] = new PathContainer(
				scene,
				pos.column,
				pos.row,
				this.realtiveGoalPositionColumn,
				this.relativeGoalPositionRow,
				this.easyStar,
				unifiedMap,
				emptyPathContainer
			);
		});
	}

	private findClosestExit(column, row) {
		let exit;
		let dist = Infinity;
		for (const curExit in this.exits) {
			let curDist = Phaser.Math.Distance.Between(column, row, this.exits[curExit].column, this.exits[curExit].row);
			if (curDist < dist) {
				exit = curExit;
				dist = curDist;
			}
		}

		return this.exits[exit];
	}

	private calculateAllBuildingSpecificPaths(building: Building) {
		let { column, row } = realPosToRelativePos(building.x, building.y);
		let validSpawnPositions = calculateRelativeSpawnPositionsAround(column, row, 3, 1);

		validSpawnPositions.forEach(pos => {
			let exit = this.findClosestExit(pos.column, pos.row);
			let mainPath = this.mainPaths[[exit.column, exit.row].join("")];
			let saveReference = new PathContainer(
				this.scene,
				pos.column,
				pos.row,
				exit.column,
				exit.row,
				this.easyStar,
				this.unifiedMap,
				mainPath
			);
			this.paths[[pos.column, pos.row].join("")] = saveReference;
		});
	}

	calculateBuildingSpecificPaths(buildings) {
		buildings.forEach(building => {
			this.calculateAllBuildingSpecificPaths(building);
		});
	}

	getSpecificPathForSpawnPos(column, row) {
		let id = [column, row].join("");
		if (this.paths[id]) return this.paths[id];
	}
}
