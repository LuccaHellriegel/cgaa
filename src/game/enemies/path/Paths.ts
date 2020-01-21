import { RelativePosition, Point } from "../../base/types";
import { constructXYIDfromColumnRow, constructXYID } from "../../base/id";

export class Paths {
	private pathDict = {};

	setPathForRelPos(relPos: RelativePosition, path) {
		this.pathDict[constructXYIDfromColumnRow(relPos.column, relPos.row)] = path;
	}

	setPathForRealPos(realPos: Point, path) {
		this.pathDict[constructXYID(realPos.x, realPos.y)] = path;
	}

	setPathForID(id, path) {
		this.pathDict[id] = path;
	}

	getPathForRelPos(relPos: RelativePosition) {
		return this.pathDict[constructXYIDfromColumnRow(relPos.column, relPos.row)];
	}

	getPathForID(id) {
		return this.pathDict[id];
	}
}
