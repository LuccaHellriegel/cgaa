import { RelPos } from "../base/RelPos";
import { EnvSetup } from "../setup/EnvSetup";
import { Gameplay } from "../../scenes/Gameplay";
import { Point } from "../base/types";
import { RealDict } from "../base/Dict";
import { Camp } from "../camp/Camp";

function arrayMiddle(array: any[]) {
	return array[Math.floor(array.length / 2)];
}

function relPosOverlapsWith(array: RelPos[], pos: RelPos) {
	for (const otherPos of array) {
		if (otherPos.column === pos.column && otherPos.row === pos.row) return true;
	}
	return false;
}

export class Exit {
	relativePositions: RelPos[];
	constructor(areaTopLeft: RelPos, public exitSide: ExitSide, exitWidth: number) {
		switch (exitSide) {
			case "down":
				this.relativePositions = this.vertical(false, areaTopLeft, exitWidth);
				break;
			case "up":
				this.relativePositions = this.vertical(true, areaTopLeft, exitWidth);
				break;
			case "left":
				this.relativePositions = this.horizontal(true, areaTopLeft, exitWidth);
				break;
			case "right":
				this.relativePositions = this.horizontal(false, areaTopLeft, exitWidth);
				break;
		}
	}

	private vertical(up: boolean, areaTopLeft: RelPos, exitWidth: number) {
		let row;
		if (up) {
			row = areaTopLeft.row;
		} else {
			// down
			row = areaTopLeft.row + EnvSetup.areaSize - 1;
		}

		const column = areaTopLeft.column + EnvSetup.areaExit;

		return this.calcPos(column, row, exitWidth).map((arr) => {
			return new RelPos(arr[1], arr[0]);
		});
	}

	private horizontal(left: boolean, areaTopLeft: RelPos, exitWidth: number) {
		const row = areaTopLeft.row + EnvSetup.areaExit;

		let column;
		if (left) {
			column = areaTopLeft.column;
		} else {
			// right
			column = areaTopLeft.column + EnvSetup.areaSize - 1;
		}

		return this.calcPos(row, column, exitWidth).map((arr) => {
			return new RelPos(arr[0], arr[1]);
		});
	}

	private calcPos(toBeIncremented, otherNumb, exitWidth) {
		let result = [];
		for (let index = 0; index < exitWidth; index++) {
			result.push([toBeIncremented + index, otherNumb]);
		}
		return result;
	}

	getMiddle(): RelPos {
		return arrayMiddle(this.relativePositions);
	}

	isOverlapping(pos: RelPos) {
		return relPosOverlapsWith(this.relativePositions, pos);
	}
}

function areaMiddle(topLeftInRelationToMap: RelPos, dims: AreaDimensions) {
	return new RelPos(
		topLeftInRelationToMap.row + Math.floor(dims.sizeOfYAxis / 2),
		topLeftInRelationToMap.column + Math.floor(dims.sizeOfXAxis / 2)
	);
}

function splitRelPosArrAtGaps(positions: RelPos[]): RelPos[][] {
	let splitArrs = [[positions[0]]];
	let splitArrsIndex = 0;

	let lastPos = positions[0];
	for (let posIndex = 1; posIndex < positions.length; posIndex++) {
		const pos = positions[posIndex];
		// 1 or 0 means the positions are next to each other/ the same
		const distanceInOneDirectionDetected =
			(Math.abs(lastPos.column - pos.column) > 1 && Math.abs(lastPos.row - pos.row) == 0) ||
			(Math.abs(lastPos.row - pos.row) > 1 && Math.abs(lastPos.column - pos.column) == 0);

		// switch to next arr
		if (distanceInOneDirectionDetected) {
			splitArrsIndex++;
			splitArrs.push([]);
		}

		splitArrs[splitArrsIndex].push(pos);
		lastPos = pos;
	}

	return splitArrs;
}

function splitRelPosArrays(arrays: RelPos[][]) {
	const newPositionsArr = [];
	arrays.forEach((positions) => newPositionsArr.push(...splitRelPosArrAtGaps(positions)));
	return newPositionsArr;
}

function calculateWallSidePositions(topLeft: RelPos, exit: Exit, areaDimensions: AreaDimensions) {
	//Assumes Walls are always around the area
	let leftPartPositions: RelPos[] = [];
	let rightPartPositions: RelPos[] = [];
	let topPartPositions: RelPos[] = [];
	let bottomPartPositions: RelPos[] = [];

	let areaRowIndexInRelationToMap = topLeft.row;
	let areaColumnIndexInRelationToMap = topLeft.column;

	for (let row = 0; row < areaDimensions.sizeOfYAxis; row++) {
		for (let column = 0; column < areaDimensions.sizeOfXAxis; column++) {
			//Comparisons are relative to area
			let isLeftWall = column === 0;
			let isRightWall = column === areaDimensions.sizeOfXAxis - 1;
			let isTopWall = row === 0;
			let isBottomWall = row === areaDimensions.sizeOfYAxis - 1;

			//Comparison is relative to global
			let isExit = exit.isOverlapping(new RelPos(areaRowIndexInRelationToMap, areaColumnIndexInRelationToMap));

			if (isLeftWall && !isExit)
				leftPartPositions.push(new RelPos(areaRowIndexInRelationToMap, areaColumnIndexInRelationToMap));
			if (isRightWall && !isExit)
				rightPartPositions.push(new RelPos(areaRowIndexInRelationToMap, areaColumnIndexInRelationToMap));
			if (isTopWall && !isExit)
				topPartPositions.push(new RelPos(areaRowIndexInRelationToMap, areaColumnIndexInRelationToMap));
			if (isBottomWall && !isExit)
				bottomPartPositions.push(new RelPos(areaRowIndexInRelationToMap, areaColumnIndexInRelationToMap));

			areaColumnIndexInRelationToMap++;
		}
		areaRowIndexInRelationToMap++;
		areaColumnIndexInRelationToMap = topLeft.column;
	}

	const positions = [leftPartPositions, rightPartPositions, bottomPartPositions, topPartPositions];
	return splitRelPosArrays(positions);
}

function isInsideArea(pos: RelPos, areaMapTopLeft: RelPos, areaDims: AreaDimensions) {
	return (
		pos.column < areaMapTopLeft.column + areaDims.sizeOfXAxis &&
		pos.column >= areaMapTopLeft.column &&
		pos.row < areaMapTopLeft.row + areaDims.sizeOfYAxis &&
		pos.row >= areaMapTopLeft.row
	);
}

export class Area {
	public wallPosArr: RelPos[][];

	constructor(public exit: Exit, public dims: AreaDimensions, public topLeft: RelPos) {
		this.wallPosArr = calculateWallSidePositions(this.topLeft, this.exit, this.dims);
	}

	getMiddle(): RelPos {
		return areaMiddle(this.topLeft, this.dims);
	}
}

class WallSide extends Phaser.Physics.Arcade.Image {
	constructor(scene: Gameplay, x: number, y: number, width, height, addEnv) {
		super(scene, x, y, "");
		scene.add.existing(this);
		addEnv(this);
		this.setSize(width, height).setVisible(false).setActive(false);
	}
}

function addWallside(scene: Gameplay, addEnv, partPositions: Point[]) {
	partPositions.forEach((partPosition) => {
		scene.add.image(partPosition.x, partPosition.y, "wallPart");
	});

	const firstPositionX = partPositions[0].x;
	const lastPositionX = partPositions[partPositions.length - 1].x;
	const width = lastPositionX - firstPositionX + EnvSetup.gridPartSize;

	const firstPositionY = partPositions[0].y;
	const lastPositionY = partPositions[partPositions.length - 1].y;
	const height = lastPositionY - firstPositionY + EnvSetup.gridPartSize;

	const middleX = firstPositionX + width / 2 - EnvSetup.halfGridPartSize;
	const middleY = firstPositionY + height / 2 - EnvSetup.halfGridPartSize;
	new WallSide(scene, middleX, middleY, width, height, addEnv);
}

export class Areas {
	areaArr: Area[];
	exits: Exit[];

	constructor(gameLayout: Layout, scene: Gameplay, addEnv) {
		const exits = [];
		const areaArr = [];

		for (let index = 0; index < gameLayout.areaLayoutPositions.length; index++) {
			const topLeft = gameLayout.areaTopLeftMapPositions[index];

			const areaPosition = gameLayout.areaLayoutPositions[index];
			const exitSide = gameLayout.exitSides[areaPosition.row][areaPosition.column];
			const exit = new Exit(topLeft, exitSide, EnvSetup.exitWidth);
			exits.push(exit);

			const area = new Area(exit, gameLayout.areaDims, topLeft);
			areaArr.push(area);
		}

		this.exits = exits;
		this.areaArr = areaArr;

		for (const area of this.areaArr) {
			for (const side of area.wallPosArr) {
				addWallside(
					scene,
					addEnv,
					side.map((pos) => pos.toPoint())
				);
			}
		}
	}
}

interface AreaDimensions {
	sizeOfXAxis: number;
	sizeOfYAxis: number;
}

type ExitSide = "left" | "right" | "up" | "down" | "none";

interface MapDimensions {
	sizeOfXAxis: number;
	sizeOfYAxis: number;
}

function addRelPosArraysTo2DArray(array: RelativeMap, relPosArrays: RelPos[][], symbol) {
	for (const positions of relPosArrays) {
		for (const pos of positions) {
			array[pos.row][pos.column] = symbol;
		}
	}
}

function addRelPosTo2DArray(array: RelativeMap, pos: RelPos[], symbol) {
	for (const curPos of pos) {
		array[curPos.row][curPos.column] = symbol;
	}
}

function createRelativeMap(yAxis, xAxis, defaultValue) {
	const map: RelativeMap = [];

	for (let row = 0; row < yAxis; row++) {
		const rowArr = [];
		for (let column = 0; column < xAxis; column++) {
			rowArr.push(defaultValue);
		}
		map.push(rowArr);
	}

	return map;
}

function addBuildingToMap(map: RelativeMap, buildingPositions: RelPos[]) {
	for (const pos of buildingPositions) {
		map[pos.row][pos.column - 1] = EnvSetup.buildingSymbol;
		map[pos.row][pos.column] = EnvSetup.buildingSymbol;
		map[pos.row][pos.column + 1] = EnvSetup.buildingSymbol;
	}
}

export type RelativeMap = number[][];

function createBasicMap(areas: Areas, layout: Layout) {
	const dims = layout.mapDims;
	const map = createRelativeMap(dims.sizeOfYAxis, dims.sizeOfXAxis, 0);

	areas.areaArr.forEach((area) => {
		addRelPosArraysTo2DArray(map, area.wallPosArr, EnvSetup.wallSymbol);
	});

	areas.exits.forEach((exit) => {
		addRelPosTo2DArray(map, exit.relativePositions, EnvSetup.exitSymbol);
	});

	return map;
}

function filterTransform2DArray(array: RelativeMap, value, transformCallback) {
	const arr: RelPos[] = [];
	for (let row = 0; row < array.length; row++) {
		for (let column = 0; column < array[0].length; column++) {
			const isValue = array[row][column] === value;
			if (isValue) {
				arr.push(transformCallback(row, column));
			}
		}
	}
	return arr;
}

export function middleOf2DArray(array: RelativeMap) {
	return new RelPos(Math.floor(array.length / 2), Math.floor(array[0].length / 2));
}

export class GameMap {
	map: RelativeMap = [];
	spawnPos: RelPos[] = [];
	constructor(areas: Areas, layout: Layout) {
		this.map = createBasicMap(areas, layout);
		this.spawnPos = filterTransform2DArray(this.map, EnvSetup.walkableSymbol, (row, column) => new RelPos(row, column));
	}

	updateWith(ordinaryCamps: Camp[]) {
		for (const camp of ordinaryCamps) {
			addBuildingToMap(this.map, camp.buildingSetup.positions);
		}
	}
}

function filterRelPosInsideArea(areaMapTopLeft: RelPos, areaDims: AreaDimensions, pos: RelPos[]) {
	return pos.filter((pos) => isInsideArea(pos, areaMapTopLeft, areaDims));
}

function relPosToDictInput(pos: RelPos[]) {
	return pos.map((pos) => [pos.toPoint(), EnvSetup.walkableSymbol]);
}

export function areaRealSpawnDict(areaMapTopLeft: RelPos, areaDims: AreaDimensions, mapSpawnPos: RelPos[]) {
	const areaSpawnPos = filterRelPosInsideArea(areaMapTopLeft, areaDims, mapSpawnPos);
	return new RealDict(relPosToDictInput(areaSpawnPos));
}

// BUILDING PLACEMENT

function positionsAroundBuldingInclusive(row, column) {
	let positions: number[][] = [];
	let rows = [row - 1, row, row + 1];
	for (let index = 0, length = rows.length; index < length; index++) {
		positions.push([column - 2, rows[index]]);
		positions.push([column - 1, rows[index]]);
		positions.push([column, rows[index]]);
		positions.push([column + 1, rows[index]]);
		positions.push([column + 2, rows[index]]);
	}
	return positions;
}

function mapHasSpaceForBuilding(map: RelativeMap, row, column) {
	let positionArr = positionsAroundBuldingInclusive(row, column);
	for (let index = 0, positionLength = positionArr.length; index < positionLength; index++) {
		let column = positionArr[index][0];
		let row = positionArr[index][1];
		if (!(map[row][column] === EnvSetup.walkableSymbol)) return false;
	}
	return true;
}

export function buildingSpawnDict(
	areaMapTopLeft: RelPos,
	areaDims: AreaDimensions,
	mapSpawnPos: RelPos[],
	map: RelativeMap
) {
	const buildingSpawnPos = filterRelPosInsideArea(areaMapTopLeft, areaDims, mapSpawnPos).filter((pos) =>
		mapHasSpaceForBuilding(map, pos.row, pos.column)
	);
	const dict = {};
	buildingSpawnPos.forEach((pos) => (dict[pos.column + " " + pos.row] = EnvSetup.walkableSymbol));
	return dict;
}

// LAYOUT

function scale(value, scalingFactor) {
	return value * scalingFactor;
}

function scaleLayoutValueToMap(value) {
	return scale(value, EnvSetup.areaSize);
}

function areaLayoutPositions(layout: number[][]) {
	return filterTransform2DArray(layout, 1, (row, column) => new RelPos(row, column));
}

function areaTopLeftMapPositions(areaLayoutPositions: RelPos[]) {
	return areaLayoutPositions.map((pos: RelPos) => {
		return new RelPos(pos.row * EnvSetup.areaSize, pos.column * EnvSetup.areaSize);
	});
}

export class Layout {
	areaDims: AreaDimensions = { sizeOfXAxis: EnvSetup.areaSize, sizeOfYAxis: EnvSetup.areaSize };
	mapDims: MapDimensions;
	areaTopLeftMapPositions: RelPos[] = [];
	areaLayoutPositions: RelPos[] = [];

	constructor(public layout: number[][], public exitSides: ExitSide[][]) {
		this.areaLayoutPositions = areaLayoutPositions(this.layout);
		this.areaTopLeftMapPositions = areaTopLeftMapPositions(this.areaLayoutPositions);
		this.mapDims = {
			sizeOfXAxis: this.layout[0].length * EnvSetup.areaSize,
			sizeOfYAxis: this.layout.length * EnvSetup.areaSize,
		};
	}

	getMiddleColumnInRelationToLayout(): number {
		return Math.floor(this.layout[0].length / 2);
	}

	getMiddleRowInRelationToMap(): number {
		return Math.floor((this.layout.length * EnvSetup.areaSize) / 2);
	}

	getMiddleColumnInRelationToMap(): number {
		return Math.floor((this.layout[0].length * EnvSetup.areaSize) / 2);
	}

	getMiddleRowInRelationToLayout(): number {
		return Math.floor(this.layout.length / 2);
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

type CommonWaypoints = "middle" | "up" | "down" | "right" | "left";

export class CommonWaypoint extends RelPos {
	constructor(layout: Layout, gameMap: RelativeMap, config: CommonWaypoints) {
		const pos = CommonWaypoint.calculate(layout, gameMap, config);
		super(pos.row, pos.column);
	}

	static calculate(layout: Layout, gameMap: RelativeMap, config: CommonWaypoints): RelPos {
		switch (config) {
			case "middle":
				return middleOf2DArray(gameMap);
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

		while (layout.layout[row][column] !== 0) {
			if (up) {
				row++;
			} else {
				row--;
			}
			if (layout.layout[row] === undefined) throw "Impossible CommonWaypoint!";
		}
		let columnIsEven = (column + 1) % 2 == 0;
		if (columnIsEven) column += 0.5;
		let rowIsEven = (row + 1) % 2 == 0;
		if (rowIsEven) row += 0.5;

		row = scaleLayoutValueToMap(row);
		column = scaleLayoutValueToMap(column);
		return new RelPos(row, column);
	}

	static horizontal(left: boolean, layout: Layout) {
		let column = layout.getMiddleColumnInRelationToLayout();
		let row = layout.getMiddleRowInRelationToLayout();
		row = layout.layout.length % 2 == 0 ? row - 1 : row;

		while (layout.layout[row][column] !== 0) {
			if (left) {
				column--;
			} else {
				column++;
			}
			if (layout.layout[row][column] === undefined) throw "Impossible CommonWaypoint!";
		}
		let columnIsEven = (column + 1) % 2 == 0;
		if (columnIsEven) column += 0.5;
		let rowIsEven = (row + 1) % 2 == 0;
		if (rowIsEven) row += 0.5;

		row = scaleLayoutValueToMap(row);
		column = scaleLayoutValueToMap(column);
		console.log(row, column);

		return new RelPos(row, column);
	}
}
