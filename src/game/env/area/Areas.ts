import { StaticConfig } from "../../base/types";
import { areaSize } from "../../base/globals/globalConfig";
import { relativeCoordinateToReal } from "../../base/position";
import { Area, AreaDimensions } from "./Area";
import { EmptyArea } from "./EmptyArea";
import { GameMap } from "../GameMap";
import { Exit } from "./Exit";

export class Areas {
	public areas: Area[] = [];
	public playerArea: Area;
	public bossArea: Area;

	constructor(staticConfig: StaticConfig) {
		const exitWidth = 3;

		const playerPos = [1, 0];
		const bossPos = [1, 3];
		//Right = Player, Left = Boss
		const exitLayout = [
			["empty", "down", "down", "empty"],
			["right", "empty", "empty", "left"],
			["empty", "up", "up", "empty"]
		];

		let areaDims: AreaDimensions = { sizeOfXAxis: areaSize, sizeOfYAxis: areaSize };

		let startX = 0;
		let startY = 0;

		for (let layoutRow = 0; layoutRow < exitLayout.length; layoutRow++) {
			for (let layoutColumn = 0; layoutColumn < exitLayout[0].length; layoutColumn++) {
				if (exitLayout[layoutRow][layoutColumn] !== "empty") {
					//TODO: duplication
					let topLeftX = relativeCoordinateToReal(startX + layoutColumn * areaDims.sizeOfXAxis);
					let topLeftY = relativeCoordinateToReal(startY + layoutRow * areaDims.sizeOfYAxis);
					let wallSide = exitLayout[layoutRow][layoutColumn];
					let area;
					let column;
					let row;

					switch (wallSide) {
						case "down":
						case "up":
							//TODO: is hardcoded
							column = 6;
							row = layoutRow === 0 ? areaSize - 1 : 0;
							area = new Area(
								staticConfig,
								{ x: topLeftX, y: topLeftY },
								areaDims,
								new Exit(wallSide, exitWidth, { column, row })
							);
							break;
						case "left":
							column = layoutColumn === 0 ? areaDims.sizeOfXAxis - 1 : 0;
							row = 6 - 1;
							area = new Area(
								staticConfig,
								{ x: topLeftX, y: topLeftY },
								areaDims,
								new Exit(wallSide, exitWidth, { column, row })
							);
							break;
						case "right":
							column = layoutColumn === 0 ? areaDims.sizeOfXAxis - 1 : 0;
							row = 6 - 1;
							area = new Area(
								staticConfig,
								{ x: topLeftX, y: topLeftY },
								areaDims,
								new Exit(wallSide, exitWidth, { column, row })
							);
							break;
					}

					if (layoutRow == playerPos[0] && layoutColumn == playerPos[1]) {
						this.playerArea = area;
					} else if (layoutRow == bossPos[0] && layoutColumn == bossPos[1]) {
						this.bossArea = area;
					} else {
						this.areas.push(area);
					}
				}
			}
		}
	}

	createGameMap() {
		let dims: AreaDimensions = { sizeOfXAxis: areaSize, sizeOfYAxis: areaSize };
		//TODO: order in maps is hardcoded
		let layout = [
			[new EmptyArea(dims), this.areas[0], this.areas[1], new EmptyArea(dims)],
			[this.playerArea, new EmptyArea(dims), new EmptyArea(dims), this.bossArea],
			[new EmptyArea(dims), this.areas[2], this.areas[3], new EmptyArea(dims)]
		];

		return new GameMap(layout);
	}
}
