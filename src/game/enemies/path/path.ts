import EasyStar from "easystarjs";
import { PathCalcConfig } from "./pathBase";
import { RelativePosition } from "../../base/types";
import { exitToGlobalRelativePosition } from "../../base/position";
import { calculatePathsFromExit } from "./pathToMiddle";
import { calculateAllBuildingSpecificPaths } from "./pathFromExit";
import { calculatePathToOtherExits } from "./pathToOtherExit";
import { ContainerFactory } from "./classes/ContainerFactory";

export function calculatePaths(config: PathCalcConfig) {
	let factory = new ContainerFactory(config.unifiedMap, new EasyStar.js());
	calculatePathsFromExit(config, factory);

	let exitPositions: RelativePosition[] = [];
	for (let index = 0, length = config.areaConfigs.length; index < length; index++) {
		exitPositions.push(exitToGlobalRelativePosition(config.areaConfigs[index]));
	}
	calculateAllBuildingSpecificPaths(config, factory, exitPositions);
	calculatePathToOtherExits(config, exitPositions);
}
