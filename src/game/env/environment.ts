import { RelPos } from "../base/RelPos";
import { AreaDimensions, RelativeMap, MapDimensions, ExitSide } from "./types";
import { WallFactory } from "./wall/WallFactory";
import { EnvSetup } from "../setup/EnvSetup";

export class Area {
	private wallPosArr: RelPos[][];

	constructor(public exit: Exit, public dims: AreaDimensions, public topLeft: RelPos, factory: WallFactory) {
		this.createWalls(factory);
	}

	private splitUp(positions: RelPos[]) {
		//Assumes there is only one exit with consecutive points
		let newPositionsArr = [[], []];
		let index = 0;

		let lastPos = positions[0];
		for (const pos of positions) {
			const distanceIsOne =
				(Math.abs(lastPos.column - pos.column) == 1 && Math.abs(lastPos.row - pos.row) == 0) ||
				(Math.abs(lastPos.row - pos.row) == 1 && Math.abs(lastPos.column - pos.column) == 0);
			const distanceIsZero = Math.abs(lastPos.column - pos.column) == 0 && Math.abs(lastPos.row - pos.row) == 0;
			const distanceIsOneOrZero = distanceIsOne || distanceIsZero;

			if (!distanceIsOneOrZero) index = 1;
			newPositionsArr[index].push(pos);
			lastPos = pos;
		}
		return newPositionsArr;
	}

	private splitupAtExit(positionsArr) {
		let newPositionsArr = [];
		positionsArr.forEach((positions) =>
			newPositionsArr.push(...this.splitUp(positions).filter((arr) => arr.length > 0))
		);
		return newPositionsArr;
	}

	private createWalls(factory: WallFactory) {
		//Assumes Walls are always around the area
		let leftPartPositions: RelPos[] = [];
		let rightPartPositions: RelPos[] = [];
		let topPartPositions: RelPos[] = [];
		let bottomPartPositions: RelPos[] = [];

		let rowIndex = this.topLeft.row;
		let columnIndex = this.topLeft.column;

		for (let row = 0; row < this.dims.sizeOfYAxis; row++) {
			for (let column = 0; column < this.dims.sizeOfXAxis; column++) {
				//Comparisons are relative to area
				let isLeftWall = column === 0;
				let isRightWall = column === this.dims.sizeOfXAxis - 1;
				let isTopWall = row === 0;
				let isBottomWall = row === this.dims.sizeOfYAxis - 1;
				//Comparisons are relative to global
				let isExit = this.exit.isOverlapping(new RelPos(rowIndex, columnIndex));
				if (isLeftWall && !isExit) leftPartPositions.push(new RelPos(rowIndex, columnIndex));
				if (isRightWall && !isExit) rightPartPositions.push(new RelPos(rowIndex, columnIndex));
				if (isTopWall && !isExit) topPartPositions.push(new RelPos(rowIndex, columnIndex));
				if (isBottomWall && !isExit) bottomPartPositions.push(new RelPos(rowIndex, columnIndex));

				columnIndex++;
			}
			rowIndex++;
			columnIndex = this.topLeft.column;
		}

		let positions = [leftPartPositions, rightPartPositions, bottomPartPositions, topPartPositions];
		this.wallPosArr = this.splitupAtExit(positions);
		factory.produce(this.wallPosArr);
	}

	addTo(map: RelativeMap) {
		this.wallPosArr.forEach((arr) => arr.forEach((pos) => (map[pos.row][pos.column] = EnvSetup.wallSymbol)));
		return map;
	}

	isInside(relPos: RelPos) {
		return (
			relPos.column < this.topLeft.column + this.dims.sizeOfXAxis &&
			relPos.column >= this.topLeft.column &&
			relPos.row < this.topLeft.row + this.dims.sizeOfYAxis &&
			relPos.row >= this.topLeft.row
		);
	}

	getMiddle(): RelPos {
		return new RelPos(
			this.topLeft.row + Math.floor(this.dims.sizeOfYAxis / 2),
			this.topLeft.column + Math.floor(this.dims.sizeOfXAxis / 2)
		);
	}
}

export class Areas {
	areaArr: Area[];
	dims: MapDimensions;
	exits: Exit[];

	constructor(factory: WallFactory, gameLayout: Layout) {
		this.dims = gameLayout.getMapDims();
		gameLayout.addExitsAndAreas(this, factory);
	}

	addTo(map: RelativeMap) {
		this.areaArr.forEach((area) => {
			map = area.addTo(map);
		});

		this.exits.forEach((exit) => {
			map = exit.addTo(map);
		});
		return map;
	}
}

type CommonWaypoints = "middle" | "up" | "down" | "right" | "left";

export class CommonWaypoint extends RelPos {
	constructor(layout: Layout, config: CommonWaypoints) {
		const pos = CommonWaypoint.calculate(layout, config);
		super(pos.row, pos.column);
	}

	static calculate(layout: Layout, config: CommonWaypoints): RelPos {
		console.log(layout.getMiddle());
		switch (config) {
			case "middle":
				return layout.getMiddle();
			case "up":
				return CommonWaypoint.vertical(true, layout);
			case "down":
				return CommonWaypoint.vertical(false, layout);
			case "left":
				return CommonWaypoint.horizontal(true, layout);
			case "right":
				return CommonWaypoint.horizontal(false, layout);
		}
	}

	static vertical(up: boolean, layout: Layout) {
		let column = layout.getMiddleColumnInRelationToLayout();
		let row = layout.getMiddleRowInRelationToLayout();

		while (layout.allPositions[row][column] !== 0) {
			if (up) {
				row++;
			} else {
				row--;
			}
			if (layout.allPositions[row] === undefined) throw "Impossible CommonWaypoint!";
		}
		let columnIsEven = (column + 1) % 2 == 0;
		if (columnIsEven) column += 0.5;
		let rowIsEven = (row + 1) % 2 == 0;
		if (rowIsEven) row += 0.5;

		row = layout.convertLayoutRelationToMapRelation(row);
		column = layout.convertLayoutRelationToMapRelation(column);
		return new RelPos(row, column);
	}

	static horizontal(left: boolean, layout: Layout) {
		let column = layout.getMiddleColumnInRelationToLayout();
		let row = layout.getMiddleRowInRelationToLayout();
		row = layout.allPositions.length % 2 == 0 ? row - 1 : row;

		while (layout.allPositions[row][column] !== 0) {
			if (left) {
				column--;
			} else {
				column++;
			}
			if (layout.allPositions[row][column] === undefined) throw "Impossible CommonWaypoint!";
		}
		let columnIsEven = (column + 1) % 2 == 0;
		if (columnIsEven) column += 0.5;
		let rowIsEven = (row + 1) % 2 == 0;
		if (rowIsEven) row += 0.5;

		row = layout.convertLayoutRelationToMapRelation(row);
		column = layout.convertLayoutRelationToMapRelation(column);
		console.log(row, column);

		return new RelPos(row, column);
	}
}

export class Exit {
	relativePositions: RelPos[];
	constructor(areaTopLeft: RelPos, public exitSide: ExitSide, exitWidth: number) {
		let column;
		let row;
		switch (exitSide) {
			case "down":
				column = areaTopLeft.column + EnvSetup.areaExit;
				row = areaTopLeft.row + EnvSetup.areaSize - 1;
				this.relativePositions = this.calcPos(column, row, exitWidth).map((arr) => {
					return new RelPos(arr[1], arr[0]);
				});
				break;
			case "up":
				column = areaTopLeft.column + EnvSetup.areaExit;
				row = areaTopLeft.row;
				this.relativePositions = this.calcPos(column, row, exitWidth).map((arr) => {
					return new RelPos(arr[1], arr[0]);
				});
				break;
			case "left":
				column = areaTopLeft.column;
				row = areaTopLeft.row + EnvSetup.areaExit;
				this.relativePositions = this.calcPos(row, column, exitWidth).map((arr) => {
					return new RelPos(arr[0], arr[1]);
				});
				break;
			case "right":
				column = areaTopLeft.column + EnvSetup.areaSize - 1;
				row = areaTopLeft.row + EnvSetup.areaExit;
				this.relativePositions = this.calcPos(row, column, exitWidth).map((arr) => {
					return new RelPos(arr[0], arr[1]);
				});
				break;
		}
	}
	private calcPos(toBeIncremented, otherNumb, exitWidth) {
		let result = [];
		for (let index = 0; index < exitWidth; index++) {
			result.push([toBeIncremented + index, otherNumb]);
		}
		return result;
	}

	getMiddle(): RelPos {
		return this.relativePositions[Math.floor(this.relativePositions.length / 2)];
	}

	isOverlapping(pos: RelPos) {
		for (let index = 0; index < this.relativePositions.length; index++) {
			const element = this.relativePositions[index];
			if (element.column === pos.column && element.row === pos.row) return true;
		}
		return false;
	}

	addTo(map: RelativeMap) {
		this.relativePositions.forEach((pos) => {
			map[pos.row][pos.column] = EnvSetup.exitSymbol;
		});
		return map;
	}
}

export class Layout {
	private topLeftPositionsInRelationToRelativeMap: RelPos[] = [];
	private areaPositionsInRelationToLayout: RelPos[] = [];

	constructor(public allPositions: number[][], private exitSides: ExitSide[][]) {
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

	getMiddle(): RelPos {
		return new RelPos(
			Math.floor((this.allPositions.length * EnvSetup.areaSize) / 2),
			Math.floor((this.allPositions[0].length * EnvSetup.areaSize) / 2)
		);
	}

	getMiddleColumnInRelationToLayout(): number {
		return Math.floor(this.allPositions[0].length / 2);
	}

	getMiddleRowInRelationToMap(): number {
		return Math.floor((this.allPositions.length * EnvSetup.areaSize) / 2);
	}

	getMiddleColumnInRelationToMap(): number {
		return Math.floor((this.allPositions[0].length * EnvSetup.areaSize) / 2);
	}

	getMiddleRowInRelationToLayout(): number {
		return Math.floor(this.allPositions.length / 2);
	}

	convertLayoutRelationToMapRelation(number) {
		return number * EnvSetup.areaSize;
	}

	static layout1() {
		return new Layout(Layout.areaPositions, Layout.exitSides);
	}
	static layout2() {
		return new Layout(Layout.areaPositions2, Layout.exitSides2);
	}
	static layout3() {
		return new Layout(Layout.areaPositions3, Layout.exitSides3);
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
