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
