import { EnvSetup } from "../config/EnvSetup";
import { array2DApplyConcat, array2DApply } from "../engine/array";
import { posAround2DPosition } from "../engine/navigation";
import { randomizeArr } from "../engine/random";
import { RelPos } from "../engine/RelPos";
import { WallSide, Exit, GameMap } from "../types";
import { CampArea } from "./data";

export type ExitSide = { side: "left" | "right" | "up" | "down" | "none"; width: number; middlePosition: number };

function areaLayoutToMapDimensions(areaLayout: any[][], areaSize: number) {
	return { xAxis: areaLayout[0].length * areaSize, yAxis: areaLayout.length * areaSize };
}

export function areaLayoutToMap(areaLayout: any[][], areaSize: number, defaultValue: number) {
	const { xAxis, yAxis } = areaLayoutToMapDimensions(areaLayout, areaSize);
	const map = [];
	for (let row = 0; row < yAxis; row++) {
		const rowArr = [];
		for (let column = 0; column < xAxis; column++) {
			rowArr.push(defaultValue);
		}
		map.push(rowArr);
	}
	return map;
}

export function layoutAreaToMapTopLeft(area: RelPos, areaSize: number) {
	return new RelPos(area.row * areaSize, area.column * areaSize);
}

function layoutAreaToWallSides(area: RelPos, areaSize: number): WallSide[] {
	const topLeft = layoutAreaToMapTopLeft(area, areaSize);

	//Assumes Walls are always around the area
	let leftPartPositions: RelPos[] = [];
	let rightPartPositions: RelPos[] = [];
	let topPartPositions: RelPos[] = [];
	let bottomPartPositions: RelPos[] = [];

	let areaRowIndexInRelationToMap = topLeft.row;
	let areaColumnIndexInRelationToMap = topLeft.column;

	// Assumes symmetrical areas
	for (let row = 0; row < areaSize; row++) {
		for (let column = 0; column < areaSize; column++) {
			//Comparisons are relative to area
			let isLeftWall = column === 0;
			let isRightWall = column === areaSize - 1;
			let isTopWall = row === 0;
			let isBottomWall = row === areaSize - 1;

			if (isLeftWall) leftPartPositions.push(new RelPos(areaRowIndexInRelationToMap, areaColumnIndexInRelationToMap));
			if (isRightWall) rightPartPositions.push(new RelPos(areaRowIndexInRelationToMap, areaColumnIndexInRelationToMap));
			if (isTopWall) topPartPositions.push(new RelPos(areaRowIndexInRelationToMap, areaColumnIndexInRelationToMap));
			if (isBottomWall)
				bottomPartPositions.push(new RelPos(areaRowIndexInRelationToMap, areaColumnIndexInRelationToMap));

			areaColumnIndexInRelationToMap++;
		}
		areaRowIndexInRelationToMap++;
		areaColumnIndexInRelationToMap = topLeft.column;
	}

	return [
		{ positionsInMap: leftPartPositions },
		{ positionsInMap: rightPartPositions },
		{ positionsInMap: bottomPartPositions },
		{ positionsInMap: topPartPositions },
	];
}

export function areaLayoutToWallSides(areaLayout: (0 | 1)[][], areaSize: number): WallSide[] {
	const areaSymbol = 1;

	// Assumes all areas are the same size
	return array2DApplyConcat(areaLayout, (value, row, column) => {
		if (value == areaSymbol) {
			return layoutAreaToWallSides(new RelPos(row, column), areaSize);
		} else {
			return null;
		}
	});
}

function layoutExitToExitPositions(areaTopLeft: RelPos, exitSide: ExitSide, areaSize: number) {
	switch (exitSide.side) {
		case "down":
			return vertical(false, areaTopLeft, exitSide.width, areaSize, exitSide.middlePosition);
		case "up":
			return vertical(true, areaTopLeft, exitSide.width, areaSize, exitSide.middlePosition);
		case "left":
			return horizontal(true, areaTopLeft, exitSide.width, areaSize, exitSide.middlePosition);
		case "right":
			return horizontal(false, areaTopLeft, exitSide.width, areaSize, exitSide.middlePosition);
	}

	function vertical(up: boolean, areaTopLeft: RelPos, exitWidth: number, areaSize: number, areaExit: number) {
		let row;
		if (up) {
			row = areaTopLeft.row;
		} else {
			// down
			row = areaTopLeft.row + areaSize - 1;
		}

		const column = areaTopLeft.column + areaExit;

		return calcPos(column, row, exitWidth).map((arr) => {
			return new RelPos(arr[1], arr[0]);
		});
	}

	function horizontal(left: boolean, areaTopLeft: RelPos, exitWidth: number, areaSize: number, areaExit: number) {
		const row = areaTopLeft.row + areaExit;

		let column;
		if (left) {
			column = areaTopLeft.column;
		} else {
			// right
			column = areaTopLeft.column + areaSize - 1;
		}

		return calcPos(row, column, exitWidth).map((arr) => {
			return new RelPos(arr[0], arr[1]);
		});
	}

	function calcPos(toBeIncremented, otherNumb, exitWidth) {
		let result = [];
		for (let index = 0; index < exitWidth; index++) {
			result.push([toBeIncremented + index, otherNumb]);
		}
		return result;
	}
}

export function exitLayoutToExits(exitLayout: ExitSide[][][], areaSize: number): Exit[] {
	let result: Exit[] = [];

	for (let row = 0; row < exitLayout.length; row++) {
		for (let column = 0; column < exitLayout[0].length; column++) {
			// Assumes exitLayout has same dimensions as areaLayout
			const areaInLayout = new RelPos(row, column);
			const areaTopLeft = layoutAreaToMapTopLeft(new RelPos(row, column), areaSize);

			for (const exitSide of exitLayout[row][column]) {
				if (exitSide.side !== "none") {
					const positionsInMap = layoutExitToExitPositions(areaTopLeft, exitSide, areaSize);
					result = result.concat({ areaInLayout, positionsInMap });
				}
			}
		}
	}
	return result;
}

export function mapAreaTopLeftToMapMiddle(topLeftInRelationToMap: RelPos, areaSize: number) {
	// Assumes symmetric areas
	return new RelPos(
		topLeftInRelationToMap.row + Math.floor(areaSize / 2),
		topLeftInRelationToMap.column + Math.floor(areaSize / 2)
	);
}

function isInsideMapArea(pos: RelPos, areaMapTopLeft: RelPos, areaSize: number) {
	return (
		pos.column < areaMapTopLeft.column + areaSize &&
		pos.column >= areaMapTopLeft.column &&
		pos.row < areaMapTopLeft.row + areaSize &&
		pos.row >= areaMapTopLeft.row
	);
}

export function filterRelPosInsideArea(areaMapTopLeft: RelPos, areaSize: number, pos: RelPos[]) {
	return pos.filter((pos) => isInsideMapArea(pos, areaMapTopLeft, areaSize));
}

export function mapSpawnablePos(map: GameMap, mapDefaultValue, exits: Exit[]) {
	const forbiddenShape = [
		[1, 1, 1],
		[1, 0, 1],
		[1, 1, 1],
	];

	let posAroundExit = [];
	for (const exit of exits) {
		for (const pos of exit.positionsInMap) {
			posAroundExit = posAroundExit.concat(posAround2DPosition(pos.row, pos.column, forbiddenShape));
		}
	}

	const tester = (value, row, column) => {
		if (value !== mapDefaultValue) return false;

		for (const pos of posAroundExit) {
			if (pos.column === column && pos.row === row) return false;
		}

		return true;
	};

	return array2DApply(map, (value, row, column) => {
		if (tester(value, row, column)) {
			return new RelPos(row, column);
		} else {
			return null;
		}
	});
}

export function randomMapCampIDsToAreas(campIDs: string[], areaLayout: any[][], areaSymbol): CampArea[] {
	const result: CampArea[] = [];

	// assumes there are enough areas for the ids
	const areas: RelPos[] = array2DApply(areaLayout, (value, row, column) => {
		if (value == areaSymbol) {
			return new RelPos(row, column);
		} else {
			return null;
		}
	});

	const randomOrder = randomizeArr(campIDs);
	for (const campID of randomOrder) {
		// mutability is contained inside function
		result.push({ areaInLayout: areas.pop(), id: campID });
	}

	return result;
}

export class Layouts {
	private constructor() {}

	static areaPositions: (0 | 1)[][] = [
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
	];

	static exitSides: ExitSide[][][] = [
		[
			[{ side: "none", width: undefined, middlePosition: undefined }],
			[{ side: "down", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
			[{ side: "down", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
			[{ side: "none", width: undefined, middlePosition: undefined }],
		],
		[
			[{ side: "right", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
			[{ side: "none", width: undefined, middlePosition: undefined }],
			[{ side: "none", width: undefined, middlePosition: undefined }],
			[{ side: "left", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
		],
		[
			[{ side: "none", width: undefined, middlePosition: undefined }],
			[{ side: "up", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
			[{ side: "up", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
			[{ side: "none", width: undefined, middlePosition: undefined }],
		],
	];

	static areaPositions2 = [
		[0, 1, 0],
		[1, 0, 1],
		[1, 0, 1],
		[0, 1, 0],
	];

	static exitSides2: ExitSide[][][] = [
		[
			[{ side: "none", width: undefined, middlePosition: undefined }],
			[{ side: "down", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
			[{ side: "none", width: undefined, middlePosition: undefined }],
		],
		[
			[{ side: "right", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
			[{ side: "none", width: undefined, middlePosition: undefined }],
			[{ side: "left", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
		],
		[
			[{ side: "right", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
			[{ side: "none", width: undefined, middlePosition: undefined }],
			[{ side: "left", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
		],
		[
			[{ side: "none", width: undefined, middlePosition: undefined }],
			[{ side: "up", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
			[{ side: "none", width: undefined, middlePosition: undefined }],
		],
	];

	static areaPositions3 = [
		[0, 1, 1],
		[0, 0, 0],
		[1, 0, 1],
		[0, 0, 0],
		[1, 1, 0],
	];

	static exitSides3: ExitSide[][][] = [
		[
			[{ side: "none", width: undefined, middlePosition: undefined }],
			[{ side: "down", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
			[{ side: "down", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
		],
		[
			[{ side: "none", width: undefined, middlePosition: undefined }],
			[{ side: "none", width: undefined, middlePosition: undefined }],
			[{ side: "none", width: undefined, middlePosition: undefined }],
		],
		[
			[{ side: "up", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
			[{ side: "none", width: undefined, middlePosition: undefined }],
			[{ side: "down", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
		],
		[
			[{ side: "none", width: undefined, middlePosition: undefined }],
			[{ side: "none", width: undefined, middlePosition: undefined }],
			[{ side: "none", width: undefined, middlePosition: undefined }],
		],
		[
			[{ side: "up", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
			[{ side: "up", width: EnvSetup.exitWidth, middlePosition: EnvSetup.areaExit }],
			[{ side: "none", width: undefined, middlePosition: undefined }],
		],
	];
}
