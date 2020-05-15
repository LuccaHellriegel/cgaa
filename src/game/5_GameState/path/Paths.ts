import { PathDict } from "./PathFactory";
import { RelPos } from "../../0_GameBase/engine/RelPos";
import { CampID } from "../../0_GameBase/setup/CampSetup";
import { CampMap } from "../../3_GameData";

export class Paths {
	constructor(private campMap: CampMap, private pathDict: PathDict) {}

	static makeID(start: RelPos, goal: RelPos) {
		return start.row + " " + start.column + " " + goal.row + " " + goal.column;
	}

	getPath(start: RelPos, goal: RelPos) {
		let path = this.pathDict[Paths.makeID(start, goal)];
		if (path) {
			return path;
		} else {
			throw "Path not found: " + start + " " + goal;
		}
	}

	getPathToCamp(start: RelPos, campID: CampID) {
		return this.getPath(start, this.campMap.get(campID).areaMapMiddle);
	}
}
