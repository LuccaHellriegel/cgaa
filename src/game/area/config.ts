import { AreaConfig } from "./create";
import { StaticConfig } from "../base/types";
import { WallBase, WallsConfig } from "./walls";
import { relativeCoordinateToReal } from "../base/map/position";
import { wallPartHalfSize, gridPartHalfSize } from "../../globals/globalSizes";

const exitPosition = 6;
const exitWidth = 3;

export const areaSize = 12;

export const layout = [
	["area", "empty", "area"],
	["empty", "empty", "empty"],
	["area", "empty", "area"]
];

export function constructAreaConfigs(staticConfig: StaticConfig): AreaConfig[] {
	let areaConfigs: AreaConfig[] = [];
	let wallBase: WallBase = { staticConfig, sizeOfXAxis: areaSize, sizeOfYAxis: areaSize };

	let startX = 0;
	let startY = 0;

	for (let layoutRow = 0; layoutRow < layout.length; layoutRow++) {
		for (let layoutColumn = 0; layoutColumn < layout[0].length; layoutColumn++) {
			if (layout[layoutRow][layoutColumn] === "area") {
				let topLeftX = relativeCoordinateToReal(startX + layoutColumn * wallBase.sizeOfXAxis);
				let topLeftY = relativeCoordinateToReal(startY + layoutRow * wallBase.sizeOfYAxis);
				let exitWallSide = layoutColumn === 0 ? "right" : "left";
				let exit = { exitPosition, exitWidth, exitWallSide };
				areaConfigs.push({
					wallBase,
					topLeftX,
					topLeftY,
					exit
				});
			}
		}
	}

	return areaConfigs;
}

export function constructBorderwallConfig(staticConfig: StaticConfig): WallsConfig {
	let wallBase: WallBase = { staticConfig, sizeOfXAxis: 2 + 3 * areaSize, sizeOfYAxis: 2 + 3 * areaSize };
	let topLeftX = -wallPartHalfSize;
	let topLeftY = -wallPartHalfSize;

	return { wallBase, topLeftX, topLeftY };
}
