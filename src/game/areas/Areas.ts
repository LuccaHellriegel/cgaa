import { Area } from "./Area";
import { AreaConfig, AreaFactory } from "./AreaFactory";
import { Gameplay } from "../../scenes/Gameplay";
import { wallPartHalfSize } from "../../globals/globalSizes";
import { campColors } from "../../globals/globalColors";
import { areaSize } from "../../globals/globalConfig";
import { Building } from "../enemies/buildings/Building";

export class Areas {
	borderWall: Area;
	private walkableMap;
	private areas: Area[][] = [];
	physicsGroup;

	//TODO: listen to building destroyed

	private areaConfig: AreaConfig;
	colorIndices: number[];
	scene: Gameplay;

	constructor(scene, physicsGroup) {
		this.scene = scene;
		this.physicsGroup = physicsGroup;
		this.colorIndices = [0, 1, 2, 3];
		for (let i = this.colorIndices.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * i);
			const temp = this.colorIndices[i];
			this.colorIndices[i] = this.colorIndices[j];
			this.colorIndices[j] = temp;
		}

		this.createAreas();
		this.walkableMap = this.calculateWalkAbleArr();
	}

	getWalkableMap() {
		return this.walkableMap;
	}

	private toggleAreaType() {
		if (this.areaConfig.type === "camp") {
			this.areaConfig.type = "empty";
		} else {
			this.areaConfig.type = "camp";
		}
	}

	private createRowOfAreas(startingTopLeftX, startingTopLeftY, rightStepValue, variableConfig) {
		let row: Area[] = [];
		this.areaConfig.topLeftX = startingTopLeftX;
		this.areaConfig.topLeftY = startingTopLeftY;
		let stepCount = 0;
		variableConfig.forEach(config => {
			this.areaConfig.exits = config.exits;

			if (config.isEmpty) this.toggleAreaType();
			if (!config.isEmpty) {
				this.areaConfig.color = campColors[this.colorIndices.pop()];
			}
			this.areaConfig.topLeftX = startingTopLeftX + stepCount * rightStepValue;
			row.push(AreaFactory.createArea(this.areaConfig));
			if (config.isEmpty) this.toggleAreaType();
			stepCount++;
		});
		this.areas.push(row);
	}

	private createAreas() {
		this.areaConfig = {
			color: "blue",
			sizeOfXAxis: areaSize,
			sizeOfYAxis: areaSize,
			topLeftX: 0,
			topLeftY: 0,
			unitForPart: 2 * wallPartHalfSize,
			type: "camp",
			exits: [{ position: 6, wallSide: "right", width: 3 }],
			scene: this.scene,
			physicsGroup: this.physicsGroup
		};

		let rightStepValue = areaSize * 2 * wallPartHalfSize;

		this.createRowOfAreas(0, 0, rightStepValue, [
			{ isEmpty: false, exits: [{ position: 6, wallSide: "right", width: 3 }] },
			{ isEmpty: true, exits: [] },
			{ isEmpty: false, exits: [{ position: 6, wallSide: "left", width: 3 }] }
		]);
		this.createRowOfAreas(0, rightStepValue, rightStepValue, [
			{ isEmpty: true, exits: [] },
			{ isEmpty: true, exits: [] },
			{ isEmpty: true, exits: [] }
		]);
		this.createRowOfAreas(0, 2 * rightStepValue, rightStepValue, [
			{ isEmpty: false, exits: [{ position: 6, wallSide: "right", width: 3 }] },
			{ isEmpty: true, exits: [] },
			{ isEmpty: false, exits: [{ position: 6, wallSide: "left", width: 3 }] }
		]);

		this.areaConfig.topLeftX = -2 * wallPartHalfSize;
		this.areaConfig.topLeftY = -2 * wallPartHalfSize;
		this.areaConfig.sizeOfXAxis = 2 + 3 * areaSize;
		this.areaConfig.sizeOfYAxis = 2 + 3 * areaSize;
		this.areaConfig.exits = [];
		this.borderWall = AreaFactory.createArea(this.areaConfig);
	}
	private rowOfAreaToWalkableRow(rowOfArea) {
		let row: number[] = [];
		for (let k = 0; k < rowOfArea.length; k++) {
			let notWalkableSymbol = rowOfArea[k].contentType === "building" ? 2 : 1;

			row.push(rowOfArea[k].isWalkable() ? 0 : notWalkableSymbol);
		}
		return row;
	}

	private calculateWalkAbleArr() {
		//assummption that all areas have the same number of rows, and that the input arr is symmetric

		let areas = this.areas;
		let map: any[] = [];

		for (let rowIndexArea = 0; rowIndexArea < areas.length; rowIndexArea++) {
			for (let rowIndex = 0; rowIndex < areas[0][0].parts.length; rowIndex++) {
				let cumulativeRow = [];

				for (let columnIndexArea = 0; columnIndexArea < areas[0].length; columnIndexArea++) {
					cumulativeRow = cumulativeRow.concat(
						this.rowOfAreaToWalkableRow(areas[rowIndexArea][columnIndexArea].parts[rowIndex])
					);
				}
				map.push(cumulativeRow);
			}
		}
		return map;
	}

	getAreaForBuildings() {
		return [this.areas[0][0], this.areas[0][2], this.areas[2][0], this.areas[2][2]];
	}

	getBuildings() {
		let buildings: Building[] = [];
		this.areas.forEach(areaRow => {
			areaRow.forEach(area => {
				if (area.buildings[0]) {
					buildings = buildings.concat(area.buildings);
				}
			});
		});
		return buildings;
	}
}
