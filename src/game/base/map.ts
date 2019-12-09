import { AreaPosition } from "../areas/AreaPosition";
import { getRelativePosOfElementsAndAroundElements, realPosToRelativePos } from "./position";
import { walkableSymbol } from "../../globals/globalSymbols";

export function createBuildingSpawnableArr(parts: AreaPosition[][]) {
	let walkabkleArr: number[][] = [];
	for (let i = 0; i < parts.length; i++) {
		let row: number[] = [];
		for (let k = 0; k < parts[0].length; k++) {
			let notWalkableSymbol = parts[i][k].contentType === "building" ? 2 : 1;

			row.push(parts[i][k].isSpawnable() ? 0 : notWalkableSymbol);
		}
		walkabkleArr.push(row);
	}
	return walkabkleArr;
}

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
