import { CampID } from "../config/CampSetup";
import { CampMap } from "../data/data";
import { RelPos } from "../engine/RelPos";
import { Path } from "./Path";
import { PathDict } from "./PathFactory";

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

  getPathToCamp(start: RelPos, campID: CampID): Path {
    return this.getPath(start, this.campMap.get(campID).areaMapMiddle);
  }
}
