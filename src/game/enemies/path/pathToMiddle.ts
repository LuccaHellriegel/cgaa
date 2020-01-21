import { Point } from "../../base/types";
import { exitToGlobalPoint, realCoordinateToRelative } from "../../base/position";
import { PathCalcConfig } from "./pathBase";
import { Paths } from "./Paths";
import { PathFactory } from "./classes/PathFactory";

export function calculatePathsFromExit(config: PathCalcConfig, factory: PathFactory) {
	let middleColumn = config.middlePos.column;
	let middleRow = config.middlePos.row;
	config.areaConfigs.forEach(area => {
		let pos: Point = exitToGlobalPoint(area);
		(config.scene.cgaa.paths as Paths).setPathForRealPos(
			pos,
			factory.createContainer(
				realCoordinateToRelative(pos.x),
				realCoordinateToRelative(pos.y),
				middleColumn,
				middleRow,
				[]
			)
		);
	});
}
