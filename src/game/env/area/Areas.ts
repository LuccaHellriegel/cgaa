import { AreaDimensions, MapDimensions, ExitSide, EmptyArea, RelativeMap } from "../types";
import { EnvSetup } from "../../setup/EnvSetup";
import { Area } from "./Area";
import { Exit } from "./Exit";
import { WallFactory } from "../wall/WallFactory";
import { RelPos } from "../../base/RelPos";

export class Areas {
	arr: (Area | EmptyArea)[][];
	nonEmpty: Area[] = [];
	dims: MapDimensions;
	exits: Exit[] = [];

	constructor(factory: WallFactory) {
		let dims: AreaDimensions = { sizeOfXAxis: EnvSetup.areaSize, sizeOfYAxis: EnvSetup.areaSize };

		let layout = [
			[0, 1, 1, 0],
			[1, 0, 0, 1],
			[0, 1, 1, 0]
		];

		let exitSides: ExitSide[][] = [
			["none", "down", "down", "none"],
			["right", "none", "none", "left"],
			["none", "up", "up", "none"]
		];

		let topLeftPositions = layout.map((row, rowIndex) => {
			return row.map((_, columnIndex) => {
				return new RelPos(rowIndex * EnvSetup.areaSize, columnIndex * EnvSetup.areaSize);
			});
		});

		this.arr = layout.map((row, rowIndex) => {
			return row.map((column, columnIndex) => {
				if (column === 0) {
					return "empty";
				} else {
					let exit = new Exit(
						topLeftPositions[rowIndex][columnIndex],
						exitSides[rowIndex][columnIndex],
						EnvSetup.exitWidth
					);

					this.exits.push(exit);

					return new Area(exit, dims, topLeftPositions[rowIndex][columnIndex], factory);
				}
			});
		});

		this.dims = {
			sizeOfXAxis: layout[0].length * EnvSetup.areaSize,
			sizeOfYAxis: layout.length * EnvSetup.areaSize
		};

		this.arr.forEach(row =>
			row.forEach(column => {
				if (column !== "empty") this.nonEmpty.push(column);
			})
		);
	}

	addTo(map: RelativeMap) {
		this.nonEmpty.forEach(area => {
			map = area.addTo(map);
		});

		this.exits.forEach(exit => {
			map = exit.addTo(map);
		});
		return map;
	}
}
