import { AreaConfig } from "../../base/interfaces";
import { RelativePosition, Point } from "../../base/types";
import { realCoordinateToRelative, relativeCoordinateToReal } from "../../base/position";
import { gridPartHalfSize } from "../../base/globals/globalSizes";
import { findClosestRelativePosition } from "./pathBase";

export class Exits {
	exitsAsRelativePositions: RelativePosition[];
	exitsAsRealPoints: Point[];

	constructor(areaConfigs: AreaConfig[]) {
		this.exitsAsRelativePositions = areaConfigs.map(config => this.exitToGlobalRelativePosition(config));
		this.exitsAsRealPoints = areaConfigs.map(config => Exits.exitToGlobalPoint(config));
	}

	private exitToGlobalRelativePosition(areaConfig): RelativePosition {
		let column = areaConfig.exit.exitPosition.column + realCoordinateToRelative(areaConfig.topLeftX);
		let row = areaConfig.exit.exitPosition.row + realCoordinateToRelative(areaConfig.topLeftY);
		return { column, row };
	}

	static exitToGlobalPoint(areaConfig): Point {
		let x = relativeCoordinateToReal(areaConfig.exit.exitPosition.column) + areaConfig.topLeftX - gridPartHalfSize;
		let y = relativeCoordinateToReal(areaConfig.exit.exitPosition.row) + areaConfig.topLeftY - gridPartHalfSize;
		return { x, y };
	}

	getClosestRelativeExit(relativePosition: RelativePosition): RelativePosition {
		return findClosestRelativePosition(this.exitsAsRelativePositions, relativePosition.column, relativePosition.row);
	}
}
