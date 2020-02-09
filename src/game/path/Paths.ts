import { Orientation } from "./Orientation";
import { PathDict } from "./PathFactory";
import { CampID } from "../setup/CampSetup";
import { RelPos } from "../base/RelPos";

export class Paths {
	constructor(private orientation: Orientation, private pathDict: PathDict) {}

	static makeID(start: RelPos, goal: RelPos) {
		return start.row + " " + start.column + " " + goal.row + " " + goal.column;
	}

	getPath(start: RelPos, goal: RelPos) {
		return this.pathDict[Paths.makeID(start, goal)];
	}

	getPathToCamp(start: RelPos, campID: CampID) {
		return this.getPath(start, this.orientation.getPosFor(campID));
	}
}
