import { areaSize, layout } from "../base/globals/globalConfig";
import { ZeroOneMap } from "../base/types";

interface MapConfig {
	sizeOfXAxis: number;
	sizeOfYAxis: number;
}

export function createEmptyMap(config: MapConfig) {
	let map: ZeroOneMap = [];
	for (let row = 0; row < config.sizeOfYAxis; row++) {
		map[row] = [];
		for (let column = 0; column < config.sizeOfXAxis; column++) {
			map[row].push(0);
		}
	}
	return map;
}

export function calculateUnifiedAreasMap(maps: ZeroOneMap[]) {
	//assummption that all areas have the same number of rows, and that the input arr is symmetric
	let unifiedMap: ZeroOneMap = [];
	let numberOfRows = maps[0].length;

	//assumes areasize x areasize maps
	const emptyRow = [];
	for (let index = 0; index < areaSize; index++) {
		emptyRow.push(0);
	}

	const emptyMap = [];
	for (let index = 0; index < areaSize; index++) {
		emptyMap.push(emptyRow);
	}

	//TODO: somehow make more transparent that this is linked to the layout var
	const filledLayout = [
		[emptyMap, maps[0], emptyMap, maps[1], emptyMap],
		[emptyMap, emptyMap, emptyMap, emptyMap, emptyMap],
		[emptyMap, maps[2], emptyMap, maps[3], emptyMap]
	];

	for (let layoutRow = 0; layoutRow < layout.length; layoutRow++) {
		for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
			let cumulativeRow = [];

			for (let layoutColumn = 0; layoutColumn < layout[0].length; layoutColumn++) {
				cumulativeRow = cumulativeRow.concat(filledLayout[layoutRow][layoutColumn][rowIndex]);
			}
			unifiedMap.push(cumulativeRow);
		}
	}
	return unifiedMap;
}
