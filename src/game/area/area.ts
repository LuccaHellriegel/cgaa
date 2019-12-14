import { StaticConfig, ZeroOneMap, WallBase } from "../base/types";
import { createWalls } from "./wall/wall";
import { calculateUnifiedAreasMap, createEmptyMap } from "./map";
import { mainBorderwall } from "./wall/borderwall";
import { areaSize, layout } from "../base/globals/globalConfig";
import { relativeCoordinateToReal } from "../base/position";
import { exitSymbol } from "../base/globals/globalSymbols";
import { AreaConfig } from "../base/interfaces";

const exitWidth = 3;

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
				let column = layoutColumn === 0 ? wallBase.sizeOfXAxis - 1 : 0;
				let row = 6;
				let exit = { exitPosition: { column, row }, exitWidth };
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

function createArea(config: AreaConfig) {
	let map: ZeroOneMap = createEmptyMap(config.wallBase);
	for (let index = 0; index < config.exit.exitWidth; index++) {
		map[config.exit.exitPosition.row + index][config.exit.exitPosition.column] = exitSymbol;
	}
	createWalls(config, map);
	return map;
}

export function createAreas(configs: AreaConfig[]) {
	let maps: ZeroOneMap[] = [];
	configs.forEach(config => {
		maps.push(createArea(config));
	});

	let middlePos = mainBorderwall(configs[0].wallBase.staticConfig);
	return { unifiedMap: calculateUnifiedAreasMap(maps), middlePos };
}
