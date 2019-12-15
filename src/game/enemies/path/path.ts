import EasyStar from "easystarjs";
import { Gameplay } from "../../../scenes/Gameplay";
import { ZeroOneMap, RelativePosition } from "../../base/types";
import { exitToGlobalRelativePosition } from "../../base/position";
import { AreaConfig, BuildingInfo } from "../../base/interfaces";
import { calculatePathsFromExit } from "./pathToMiddle";
import { calculateAllBuildingSpecificPaths } from "./pathFromExit";

export interface PathCalcConfig {
	scene: Gameplay;
	pathDict: {};
	unifiedMap: ZeroOneMap;
	areaConfigs: AreaConfig[];
	middlePos: RelativePosition;
	buildingInfos: BuildingInfo[];
}

export function calculatePaths(config: PathCalcConfig) {
	const easyStar = new EasyStar.js();
	let exitPositions: RelativePosition[] = [];
	for (let index = 0, length = config.areaConfigs.length; index < length; index++) {
		exitPositions.push(exitToGlobalRelativePosition(config.areaConfigs[index]));
	}
	calculatePathsFromExit(config, easyStar);
	calculateAllBuildingSpecificPaths(config, easyStar, exitPositions);
}
