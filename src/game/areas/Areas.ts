import { Area, AreaConfig } from "./Area";
import { Gameplay } from "../../scenes/Gameplay";
import { wallPartHalfSize } from "../../globals/globalSizes";
import { areaSize } from "../../globals/globalConfig";

export class Areas {
	private borderWall: Area;
	private areas: Area[][] = [];
	private physicsGroup;
	private areaConfig: AreaConfig;
	private scene: Gameplay;

	constructor(scene, physicsGroup) {
		this.scene = scene;
		this.physicsGroup = physicsGroup;
		this.createAreas();
	}

	getBorderWall() {
		return this.borderWall;
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
			this.areaConfig.topLeftX = startingTopLeftX + stepCount * rightStepValue;
			row.push(new Area(this.areaConfig));
			if (config.isEmpty) this.toggleAreaType();
			stepCount++;
		});
		this.areas.push(row);
	}

	private createAreas() {
		this.areaConfig = {
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
		this.borderWall = new Area(this.areaConfig);
	}

	getAllMaps() {
		let maps: any[] = [];
		this.areas.forEach(areaRow => {
			let row: any[] = [];
			areaRow.forEach(area => {
				row.push(area.map);
			});
			maps.push(row);
		});

		return maps;
	}

	getAreaForBuildings() {
		return [this.areas[0][0], this.areas[0][2], this.areas[2][0], this.areas[2][2]];
	}
}
