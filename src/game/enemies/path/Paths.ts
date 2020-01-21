import { RelativePosition, Point } from "../../base/types";
import { constructXYIDfromColumnRow, constructXYID } from "../../base/id";
import { Rerouter } from "./Rerouter";

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

	getPathForRelPos(relPos: RelativePosition) {
		return this.pathDict[constructXYIDfromColumnRow(relPos.column, relPos.row)];
	}

	getPathForID(id) {
		return this.pathDict[id];
	}

	getReroutedPathForRealPos(realPos: Point, color) {
		let id = this.rerouter.appendRerouting(color, constructXYID(realPos.x, realPos.y));
		return this.getPathForID(id);
	}
}
