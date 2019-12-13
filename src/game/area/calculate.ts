import { WallsConfig } from "./walls";
import { wallPartHalfSize } from "../../globals/globalSizes";
import { ZeroOneMap } from "../base/map/map";
import { layout, areaSize } from "./config";
import { AreaConfig } from "./create";
import { realCoordinateToRelative } from "../base/map/position";
import { RelativePosition } from "../base/types";

export function calculateBorderWallSize(config: WallsConfig): { width: number; height: number } {
	return {
		width: config.wallBase.sizeOfXAxis * 2 * wallPartHalfSize,
		height: config.wallBase.sizeOfYAxis * 2 * wallPartHalfSize
	};
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

	const filledLayout = [
		[maps[0], emptyMap, maps[1]],
		[emptyMap, emptyMap, emptyMap],
		[maps[2], emptyMap, maps[3]]
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

export function exitToPosition(areaConfig: AreaConfig): RelativePosition {
	let relativeAreaTopLeftX = realCoordinateToRelative(areaConfig.topLeftX);
	let relativeAreaTopLeftY = realCoordinateToRelative(areaConfig.topLeftY);
	if (areaConfig.exit.exitWallSide === "left") {
		return { column: 0 + relativeAreaTopLeftX, row: areaConfig.exit.exitPosition + relativeAreaTopLeftY };
	} else {
		return {
			column: areaConfig.wallBase.sizeOfXAxis - 1 + relativeAreaTopLeftX,
			row: areaConfig.exit.exitPosition + relativeAreaTopLeftY
		};
	}
}
