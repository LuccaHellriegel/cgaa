import { ExitSide, AreaDimensions, MapDimensions } from "../types";
import { RelPos } from "../../base/RelPos";
import { EnvSetup } from "../../setup/EnvSetup";
import { Areas } from "./Areas";
import { Exit } from "./Exit";
import { Area } from "./Area";
import { WallFactory } from "../wall/WallFactory";

export class Layout {
	private topLeftPositionsInRelationToRelativeMap: RelPos[] = [];
	private areaPositionsInRelationToLayout: RelPos[] = [];

	constructor(private allPositions: number[][], private exitSides: ExitSide[][]) {
		this.calcAreaPositions();
		this.calcTopLeftPositions();
	}

	private calcAreaPositions() {
		for (let row = 0; row < this.allPositions.length; row++) {
			for (let column = 0; column < this.allPositions[0].length; column++) {
				if (this.allPositions[row][column] === 1) {
					this.areaPositionsInRelationToLayout.push(new RelPos(row, column));
				}
			}
		}
	}

	private calcTopLeftPositions() {
		this.topLeftPositionsInRelationToRelativeMap = this.areaPositionsInRelationToLayout.map((pos: RelPos) => {
			return new RelPos(pos.row * EnvSetup.areaSize, pos.column * EnvSetup.areaSize);
		});
	}

	addExitsAndAreas(areas: Areas, factory: WallFactory) {
		const exits = [];
		const areaArr = [];

		const dims: AreaDimensions = { sizeOfXAxis: EnvSetup.areaSize, sizeOfYAxis: EnvSetup.areaSize };

		for (let index = 0; index < this.areaPositionsInRelationToLayout.length; index++) {
			const topLeft = this.topLeftPositionsInRelationToRelativeMap[index];

			const areaPosition = this.areaPositionsInRelationToLayout[index];
			const exitSide = this.exitSides[areaPosition.row][areaPosition.column];
			const exit = new Exit(topLeft, exitSide, EnvSetup.exitWidth);
			exits.push(exit);

			const area = new Area(exit, dims, topLeft, factory);
			areaArr.push(area);
		}

		areas.exits = exits;
		areas.areaArr = areaArr;
	}

	getMapDims(): MapDimensions {
		return {
			sizeOfXAxis: this.allPositions[0].length * EnvSetup.areaSize,
			sizeOfYAxis: this.allPositions.length * EnvSetup.areaSize,
		};
	}

	static layout1() {
		return new Layout(Layout.areaPositions, Layout.exitSides);
	}

	static areaPositions = [
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
	];

	static exitSides: ExitSide[][] = [
		["none", "down", "down", "none"],
		["right", "none", "none", "left"],
		["none", "up", "up", "none"],
	];

	static areaPositions2 = [
		[0, 1, 0],
		[1, 0, 1],
		[1, 0, 1],
		[0, 1, 0],
	];

	static exitSides2: ExitSide[][] = [
		["none", "down", "none"],
		["right", "none", "left"],
		["right", "none", "left"],
		["none", "up", "none"],
	];

	static areaPositions3 = [
		[0, 1, 1],
		[0, 0, 0],
		[1, 0, 1],
		[0, 0, 0],
		[1, 1, 0],
	];

	static exitSides3: ExitSide[][] = [
		["none", "down", "down"],
		["none", "none", "none"],
		["up", "none", "down"],
		["none", "none", "none"],
		["up", "up", "none"],
	];
}
