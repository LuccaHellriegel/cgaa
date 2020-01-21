import { Point } from "../../base/types";
import { exitToGlobalPoint, realCoordinateToRelative } from "../../base/position";
import { PathContainer } from "./classes/PathContainer";
import { PathCalcConfig } from "./pathBase";
import { Paths } from "./Paths";

export function calculatePathsFromExit(config: PathCalcConfig, easyStar) {
	const emptyPathContainer = { path: [] };
	let middleColumn = config.middlePos.column;
	let middleRow = config.middlePos.row;
	config.areaConfigs.forEach(area => {
		let pos: Point = exitToGlobalPoint(area);
		(config.scene.cgaa.paths as Paths).setPathForRealPos(
			pos,
			new PathContainer(
				realCoordinateToRelative(pos.x),
				realCoordinateToRelative(pos.y),
				middleColumn,
				middleRow,
				easyStar,
				config.unifiedMap,
				emptyPathContainer
			)
		);
	});
}
