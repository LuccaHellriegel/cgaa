import { StaticConfig, ZeroOneMap } from "../../base/types";
import { relativeCoordinateToReal } from "../../base/position";
import { circleSizeNames, rectBuildinghalfHeight } from "../../base/globals/globalSizes";
import { Building, BuildingSpawnConfig } from "./unit/Building";
import { buildingSymbol } from "../../base/globals/globalSymbols";
import { HealthBar } from "../../base/classes/HealthBar";

interface BuildingsConfig {
	staticConfig: StaticConfig;
	color: string;
	spawnConfig: BuildingSpawnConfig;
}

export function spawnBuildings(spawnPositions, config: BuildingsConfig) {
	for (let index = 0, length = spawnPositions.length; index < length; index++) {
		let pos = spawnPositions[index];

		let x = relativeCoordinateToReal(pos[0]);
		let y = relativeCoordinateToReal(pos[1]);

		let healthbar = new HealthBar(x - 25, y - rectBuildinghalfHeight, {
			posCorrectionX: 0,
			posCorrectionY: -rectBuildinghalfHeight,
			healthWidth: 46,
			healthLength: 12,
			value: 100,
			scene: config.staticConfig.scene
		});

		new Building(
			config.staticConfig.scene,
			x,
			y,
			config.staticConfig.physicsGroup,
			circleSizeNames[index],
			config.color,
			healthbar,
			config.spawnConfig
		);
	}
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
