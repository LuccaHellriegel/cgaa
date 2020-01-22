import { RelativePosition, Point } from "../../base/types";
import { constructXYIDfromColumnRow, constructXYID } from "../../base/id";
import { Rerouter } from "./Rerouter";
import { Path } from "./Path";

export class Paths {
	private pathDict = {};

	constructor(private rerouter: Rerouter) {}

	setPathForRelPos(relPos: RelativePosition, path) {
		this.pathDict[constructXYIDfromColumnRow(relPos.column, relPos.row)] = path;
	}

	setPathForRealPos(realPos: Point, path) {
		this.pathDict[constructXYID(realPos.x, realPos.y)] = path;
	}

	setPathForID(id, path) {
		this.pathDict[id] = path;
	}

	setReroutedPathForRelPos(relativePosition: RelativePosition, color, path) {
		let id = constructXYIDfromColumnRow(relativePosition.column, relativePosition.row) + " " + color;
		this.setPathForID(id, path);
	}

	getPathForRelPos(relPos: RelativePosition): Path {
		return Path.createPathFromArr([...this.pathDict[constructXYIDfromColumnRow(relPos.column, relPos.row)].pathArr]);
	}

	getPathForID(id): Path {
		return Path.createPathFromArr([...this.pathDict[id].pathArr]);
	}

	getReroutedPathForRealPos(realPos: Point, color): Path {
		let id = this.rerouter.appendRerouting(color, constructXYID(realPos.x, realPos.y));
		return this.getPathForID(id);
	}
}
