import { Exit } from "../base/types";
import { createWalls, WallBase } from "./walls";
import { ZeroOneMap, createEmptyMap, updateMapWithExit } from "../base/map/map";
import { calculateUnifiedAreasMap } from "./calculate";

export interface AreaConfig {
	wallBase: WallBase;
	topLeftX: number;
	topLeftY: number;
	exit: Exit;
}

export function createArea(config: AreaConfig) {
	let map: ZeroOneMap = createEmptyMap(config.wallBase);
	if (config.exit) updateMapWithExit(map, config.exit);
	createWalls(config, map);
	return map;
}

export function createAreas(configs: AreaConfig[]) {
	let maps: ZeroOneMap[] = [];
	configs.forEach(config => {
		maps.push(createArea(config));
	});
	return calculateUnifiedAreasMap(maps);
}
