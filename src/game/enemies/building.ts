import { BuildingSpawnObj } from "../spawn/BuildingSpawnObj";
import { StaticConfig } from "../base/types";
import { relativeCoordinateToReal } from "../base/map/position";
import { circleSizeNames } from "../../globals/globalSizes";
import { Building } from "./units/Building";
import { ZeroOneMap } from "../base/map/map";
import { buildingSymbol } from "../../globals/globalSymbols";

export interface BuildingsConfig {
	staticConfig: StaticConfig;
	buildingSpawnObj: BuildingSpawnObj;
	color: string;
}

const numberOfBuildings = 3;

export function spawnBuildings(config: BuildingsConfig) {
	let positions = config.buildingSpawnObj.getRandomSpawnPositions(numberOfBuildings);
	for (let index = 0, length = positions.length; index < length; index++) {
		let pos = positions[index];

		let x = relativeCoordinateToReal(pos[0]);
		let y = relativeCoordinateToReal(pos[1]);
		new Building(
			config.staticConfig.scene,
			x,
			y,
			config.staticConfig.physicsGroup,
			circleSizeNames[index],
			config.color
		);
	}
	return positions;
}

export function updateMapWithBuildings(map: ZeroOneMap, positions) {
	for (let index = 0, length = positions.length; index < length; index++) {
		let pos = positions[index];
		let column = pos[0];
		let row = pos[1];
		map[row][column] = buildingSymbol;
		map[row][column - 1] = buildingSymbol;
		map[row][column + 1] = buildingSymbol;
	}
}
