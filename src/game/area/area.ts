import { StaticConfig, ZeroOneMap, WallBase } from "../base/types";
import { createWalls } from "./wall/wall";
import { calculateUnifiedAreasMap, createEmptyMap } from "./map";
import { areaSize, layout } from "../base/globals/globalConfig";
import { relativeCoordinateToReal } from "../base/position";
import { exitSymbol } from "../base/globals/globalSymbols";
import { AreaConfig } from "../base/interfaces";
import { gridPartHalfSize } from "../base/globals/globalSizes";

const exitWidth = 3;

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
				let wallSide = layoutRow === 0 ? "down" : "up";
				let column = 6;
				let row = layoutRow === 0 ? areaSize - 1 : 0;
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
				let row = 6 - 1;
				console.log(row);
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
				let row = 6 - 1;
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
	if (config.exit.wallSide === "up" || config.exit.wallSide === "down") {
		for (let index = 0; index < config.exit.exitWidth; index++) {
			map[config.exit.exitPosition.row][config.exit.exitPosition.column + index] = exitSymbol;
		}
	} else {
		for (let index = 0; index < config.exit.exitWidth; index++) {
			map[config.exit.exitPosition.row + index][config.exit.exitPosition.column] = exitSymbol;
		}
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

	//TODO: extract numbers to global config
	let wallBase: WallBase = {
		staticConfig: configs[0].wallBase.staticConfig,
		sizeOfXAxis: 2 + 5 * areaSize,
		sizeOfYAxis: 2 + 3 * areaSize
	};

	let size = {
		width: wallBase.sizeOfXAxis * 2 * gridPartHalfSize,
		height: wallBase.sizeOfYAxis * 2 * gridPartHalfSize
	};
	configs[0].wallBase.staticConfig.scene.physics.world.setBounds(
		0,
		0,
		size.width - 4 * gridPartHalfSize,
		size.height - 4 * gridPartHalfSize
	);

	//TODO find out why this middlePos is so wrong (clarify math)
	let middlePos = {
		column: Math.floor((wallBase.sizeOfXAxis - 16) / 2),
		row: Math.floor((wallBase.sizeOfYAxis - 4) / 2)
	};
	return { unifiedMap: calculateUnifiedAreasMap(maps), middlePos };
}

export function removeNonEnemyAreas(configs: AreaConfig[], playerConfig: AreaConfig, bossConfig: AreaConfig) {
	return configs.filter(
		config =>
			(config.topLeftX !== playerConfig.topLeftX || config.topLeftY !== playerConfig.topLeftY) &&
			(config.topLeftX !== bossConfig.topLeftX || config.topLeftY !== bossConfig.topLeftY)
	);
}
