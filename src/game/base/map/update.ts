import { walkableSymbol, wallSymbol, exitSymbol, buildingSymbol } from "../../../globals/globalSymbols";
import { realPosToRelativePos, realPosToRelativePosInArea } from "./position";

export function updateMapWithElement(map, element, eleSymbol, removed) {
	let { row, column } = realPosToRelativePos(element.x, element.y);

	if (removed) {
		map[row][column] = walkableSymbol;
	} else {
		map[row][column] = eleSymbol;
	}
}

export function updateAreaMapWithBuilding(map, building, area, remove) {
	let { row, column } = realPosToRelativePosInArea(building.x, building.y, area);
	updateMapWithRelativeBuilding(map, row, column, remove);
}

export function updateMapWithRelativeBuilding(map, row, column, remove) {
	let symbol = remove ? walkableSymbol : buildingSymbol;

	//TODO: only works if building is 3 long
	map[row][column] = symbol;
	map[row][column - 2] = symbol;
	map[row][column - 1] = symbol;
	map[row][column + 1] = symbol;
	map[row][column + 2] = symbol;

	map[row - 1][column] = symbol;
	map[row - 1][column - 2] = symbol;
	map[row - 1][column - 1] = symbol;
	map[row - 1][column + 1] = symbol;
	map[row - 1][column + 2] = symbol;

	map[row + 2][column] = symbol;
	map[row + 2][column - 2] = symbol;
	map[row + 2][column - 1] = symbol;
	map[row + 2][column + 1] = symbol;
	map[row + 2][column + 2] = symbol;
}

export function updateMapWithBuilding(map, building, remove) {
	let { row, column } = realPosToRelativePos(building.x, building.y);
	updateMapWithRelativeBuilding(map, row, column, remove);
}

export function markCampsAsNonWalkable(map) {
	let numberOfWallParts = 0;
	for (let row = 0; row < map.length; row++) {
		for (let column = 0; column < map[0].length; column++) {
			if (map[row][column] === wallSymbol || map[row][column] === exitSymbol) {
				numberOfWallParts++;
			}
			if (numberOfWallParts === 1) {
				map[row][column] = wallSymbol;
			}
			if (numberOfWallParts === 2) {
				numberOfWallParts = 0;
			}
		}
	}
}
