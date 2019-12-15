import { Point } from "../../base/types";
import { exitToGlobalPoint, realCoordinateToRelative } from "../../base/position";
import { constructXYID } from "../../base/id";
import { PathContainer } from "./classes/PathContainer";
import { PathCalcConfig } from "./pathBase";

export function calculatePathsFromExit(config: PathCalcConfig, easyStar) {
	const emptyPathContainer = { path: [] };
	let middleColumn = config.middlePos.column;
	let middleRow = config.middlePos.row;
	config.areaConfigs.forEach(area => {
		let pos: Point = exitToGlobalPoint(area);
		config.pathDict[constructXYID(pos.x, pos.y)] = new PathContainer(
			config.scene,
			realCoordinateToRelative(pos.x),
			realCoordinateToRelative(pos.y),
			middleColumn,
			middleRow,
			easyStar,
			config.unifiedMap,
			emptyPathContainer
		);
	});
}
