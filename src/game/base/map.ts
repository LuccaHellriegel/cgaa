import { getRelativePosOfElementsAndAroundElements, realPosToRelativePos } from "./position";
import { walkableSymbol } from "../../globals/globalSymbols";

//TODO: assumes element is one long (gets correct around but not correct in element)
export function updateMapWithElementAndAroundElements(map, element, eleSymbol, removed, width, height) {
	let positions = getRelativePosOfElementsAndAroundElements([element], width, height);
	positions.forEach(pos => {
		if (removed) {
			map[pos.row][pos.column] = walkableSymbol;
		} else {
			map[pos.row][pos.column] = eleSymbol;
		}
	});
}

export function updateMapWithElement(map, element, eleSymbol, removed) {
	let { row, column } = realPosToRelativePos(element.x, element.y);

	if (removed) {
		map[row][column] = walkableSymbol;
	} else {
		map[row][column] = eleSymbol;
	}
}

export function calculateUnifiedMap(areaMaps) {
	//assummption that all areas have the same number of rows, and that the input arr is symmetric
	let map: any[] = [];

	for (let rowIndexArea = 0; rowIndexArea < areaMaps.length; rowIndexArea++) {
		for (let rowIndex = 0; rowIndex < areaMaps[0][0].length; rowIndex++) {
			let cumulativeRow = [];

			for (let columnIndexArea = 0; columnIndexArea < areaMaps[0].length; columnIndexArea++) {
				cumulativeRow = cumulativeRow.concat(areaMaps[rowIndexArea][columnIndexArea][rowIndex]);
			}
			map.push(cumulativeRow);
		}
	}
	return map;
}
