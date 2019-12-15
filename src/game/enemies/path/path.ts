import EasyStar from "easystarjs";
import { PathCalcConfig } from "./pathBase";
import { RelativePosition } from "../../base/types";
import { exitToGlobalRelativePosition } from "../../base/position";
import { calculatePathsFromExit } from "./pathToMiddle";
import { calculateAllBuildingSpecificPaths } from "./pathFromExit";
import { calculatePathToOtherExits } from "./pathToOtherExit";

export function calculatePaths(config: PathCalcConfig) {
	const easyStar = new EasyStar.js();
	let exitPositions: RelativePosition[] = [];
	for (let index = 0, length = config.areaConfigs.length; index < length; index++) {
		exitPositions.push(exitToGlobalRelativePosition(config.areaConfigs[index]));
	}
	calculatePathsFromExit(config, easyStar);
	calculateAllBuildingSpecificPaths(config, easyStar, exitPositions);
	calculatePathToOtherExits(config, exitPositions);
}
