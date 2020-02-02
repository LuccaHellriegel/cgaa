import { StaticConfig } from "../base/types";
import { areaSize } from "../base/globals/globalConfig";
import { relativeCoordinateToReal } from "../base/position";
import { Area, EmptyArea, AreaDimensions } from "./Area";
import { GameMap } from "./GameMap";
import { Gameplay } from "../../scenes/Gameplay";
import { Exit } from "./Exit";

const exitWidth = 3;

//Right = Player, Left = Boss
const exitLayout = [
	["empty", "down", "down", "empty"],
	["right", "empty", "empty", "left"],
	["empty", "up", "up", "empty"]
];

class Areas {
	private areas: Area[];
	private playerArea: Area;
	private bossArea: Area;

	constructor(scene: Gameplay) {
		const exitWidth = 3;

		const playerPos = [1, 0];
		const bossPos = [1, 3];
		//Right = Player, Left = Boss
		const exitLayout = [
			["empty", "down", "down", "empty"],
			["right", "empty", "empty", "left"],
			["empty", "up", "up", "empty"]
		];
	}
}

export function constructAreas(staticConfig: StaticConfig): [Area[], Area, Area] {
	let areas: Area[] = [];

	let playerArea: Area;
	let bossArea: Area;

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

				if (exitLayout[layoutRow][layoutColumn] === "down" || exitLayout[layoutRow][layoutColumn] === "up") {
					//TODO: is hardcoded
					let column = 6;
					let row = layoutRow === 0 ? areaSize - 1 : 0;
					area = new Area(
						staticConfig,
						{ x: topLeftX, y: topLeftY },
						areaDims,
						new Exit(wallSide, exitWidth, { column, row })
					);
				} else if (exitLayout[layoutRow][layoutColumn] === "right") {
					//TODO: player exit is always to the right with current layout, might need to expand

					let column = layoutColumn === 0 ? areaDims.sizeOfXAxis - 1 : 0;
					let row = 6 - 1;
					area = new Area(
						staticConfig,
						{ x: topLeftX, y: topLeftY },
						areaDims,
						new Exit(wallSide, exitWidth, { column, row })
					);

					playerArea = area;
				} else if (exitLayout[layoutRow][layoutColumn] === "left") {
					//TODO: boss exit is always to the left with current layout, might need to expand

					let column = layoutColumn === 0 ? areaDims.sizeOfXAxis - 1 : 0;
					let row = 6 - 1;
					area = new Area(
						staticConfig,
						{ x: topLeftX, y: topLeftY },
						areaDims,
						new Exit(wallSide, exitWidth, { column, row })
					);
					bossArea = area;
				}
				areas.push(area);
			}
		}
	}

	return [areas, playerArea, bossArea];
}

export function createAreas(areas: Area[]) {
	//TODO: extract numbers to global config

	let dims: AreaDimensions = { sizeOfXAxis: areaSize, sizeOfYAxis: areaSize };
	//TODO: order in maps is hardcoded
	let layout = [
		[new EmptyArea(dims), areas[0], areas[1], new EmptyArea(dims)],
		[areas[2], new EmptyArea(dims), new EmptyArea(dims), areas[3]],
		[new EmptyArea(dims), areas[4], areas[5], new EmptyArea(dims)]
	];

	return new GameMap(layout);
}

export function removeNonEnemyAreas(areas: Area[], playerArea: Area, bossArea: Area) {
	return areas.filter(
		area =>
			(area.topLeft.x !== playerArea.topLeft.x || area.topLeft.y !== playerArea.topLeft.y) &&
			(area.topLeft.x !== bossArea.topLeft.x || area.topLeft.y !== bossArea.topLeft.y)
	);
}
