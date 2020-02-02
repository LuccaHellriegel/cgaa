import { RelativePosition, Point } from "../../base/types";
import { realCoordinateToRelative, relativeCoordinateToReal } from "../../base/position";
import { gridPartHalfSize } from "../../base/globals/globalSizes";
import { findClosestRelativePosition } from "./pathBase";
import { Area } from "../../area/Area";

export class Exits {
	exitsAsRelativePositions: RelativePosition[];
	exitsAsRealPoints: Point[];

	constructor(areas: Area[]) {
		this.exitsAsRelativePositions = areas.map(area => this.exitToGlobalRelativePosition(area));
		this.exitsAsRealPoints = areas.map(area => Exits.exitToGlobalPoint(area));
	}

	private exitToGlobalRelativePosition(area: Area): RelativePosition {
		let column = area.exit.relPositions[0].column + realCoordinateToRelative(area.topLeft.x);
		let row = area.exit.relPositions[0].row + realCoordinateToRelative(area.topLeft.y);
		return { column, row };
	}

	static exitToGlobalPoint(area: Area): Point {
		let x = relativeCoordinateToReal(area.exit.relPositions[0].column) + area.topLeft.x - gridPartHalfSize;
		let y = relativeCoordinateToReal(area.exit.relPositions[0].row) + area.topLeft.y - gridPartHalfSize;
		return { x, y };
	}

	static exitRelPointToGlobalPoint(relPoint: RelativePosition, topLeft: Point): Point {
		let x = relativeCoordinateToReal(relPoint.column) + topLeft.x - gridPartHalfSize;
		let y = relativeCoordinateToReal(relPoint.row) + topLeft.y - gridPartHalfSize;
		return { x, y };
	}

	getClosestRelativeExit(relativePosition: RelativePosition): RelativePosition {
		return findClosestRelativePosition(this.exitsAsRelativePositions, relativePosition.column, relativePosition.row);
	}
}
