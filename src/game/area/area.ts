import { StaticConfig, ZeroOneMap, WallBase } from "../base/types";
import { createWalls } from "./wall/wall";
import { calculateUnifiedAreasMap, createEmptyMap } from "./map";
import { mainBorderwall } from "./wall/borderwall";
import { areaSize, layout } from "../base/globals/globalConfig";
import { relativeCoordinateToReal } from "../base/position";
import { exitSymbol } from "../base/globals/globalSymbols";
import { AreaConfig } from "../base/interfaces";

const exitWidth = 3;
const exitRow = 6;

export function constructAreaConfigs(staticConfig: StaticConfig): [AreaConfig[], AreaConfig, AreaConfig] {
	let areaConfigs: AreaConfig[] = [];

	let playerAreaConfig: AreaConfig;
	let bossAreaConfig: AreaConfig;

	let wallBase: WallBase = { staticConfig, sizeOfXAxis: areaSize, sizeOfYAxis: areaSize };

	let startX = 0;
	let startY = 0;

	for (let layoutRow = 0; layoutRow < layout.length; layoutRow++) {
		for (let layoutColumn = 0; layoutColumn < layout[0].length; layoutColumn++) {
			//TODO: duplication
			if (layout[layoutRow][layoutColumn] === "area") {
				let topLeftX = relativeCoordinateToReal(startX + layoutColumn * wallBase.sizeOfXAxis);
				let topLeftY = relativeCoordinateToReal(startY + layoutRow * wallBase.sizeOfYAxis);

				//TODO: is hardcoded
				let wallSide = layoutColumn === 1 ? "right" : "left";
				let column = layoutColumn === 1 ? wallBase.sizeOfXAxis - 1 : 0;
				let row = exitRow;
				let exit = { exitPosition: { column, row }, exitWidth, wallSide };

				areaConfigs.push({
					wallBase,
					topLeftX,
					topLeftY,
					exit
				});
			} else if (layout[layoutRow][layoutColumn] === "player") {
				//TODO: player exit is always to the right with current layout, might need to expand
				let topLeftX = relativeCoordinateToReal(startX + layoutColumn * wallBase.sizeOfXAxis);
				let topLeftY = relativeCoordinateToReal(startY + layoutRow * wallBase.sizeOfYAxis);

				let wallSide = layoutColumn === 0 ? "right" : "left";
				let column = layoutColumn === 0 ? wallBase.sizeOfXAxis - 1 : 0;
				let row = exitRow;
				let exit = { exitPosition: { column, row }, exitWidth, wallSide };

				playerAreaConfig = {
					wallBase,
					topLeftX,
					topLeftY,
					exit
				};

				areaConfigs.push(playerAreaConfig);
			} else if (layout[layoutRow][layoutColumn] === "boss") {
				//TODO: boss exit is always to the left with current layout, might need to expand

				let topLeftX = relativeCoordinateToReal(startX + layoutColumn * wallBase.sizeOfXAxis);
				let topLeftY = relativeCoordinateToReal(startY + layoutRow * wallBase.sizeOfYAxis);

				let wallSide = layoutColumn === 0 ? "right" : "left";
				let column = layoutColumn === 0 ? wallBase.sizeOfXAxis - 1 : 0;
				let row = exitRow;
				let exit = { exitPosition: { column, row }, exitWidth, wallSide };

				bossAreaConfig = {
					wallBase,
					topLeftX,
					topLeftY,
					exit
				};

				areaConfigs.push(bossAreaConfig);
			}
		}
	}

	return [areaConfigs, playerAreaConfig, bossAreaConfig];
}

function addAreaExitsToMap(map, config: AreaConfig) {
	for (let index = 0; index < config.exit.exitWidth; index++) {
		map[config.exit.exitPosition.row + index][config.exit.exitPosition.column] = exitSymbol;
	}
}

function createArea(config: AreaConfig) {
	let map: ZeroOneMap = createEmptyMap(config.wallBase);
	addAreaExitsToMap(map, config);
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

export function removeNonEnemyAreas(configs: AreaConfig[], playerConfig: AreaConfig, bossConfig: AreaConfig) {
	return configs.filter(
		config =>
			(config.topLeftX !== playerConfig.topLeftX || config.topLeftY !== playerConfig.topLeftY) &&
			(config.topLeftX !== bossConfig.topLeftX || config.topLeftY !== bossConfig.topLeftY)
	);
}
