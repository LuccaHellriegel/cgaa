import { CampRouting } from "../state/CampRouting";
import { CampID } from "../config/CampSetup";
import { RelPos } from "../engine/RelPos";
import { DangerousCircle } from "../units/DangerousCircle";
import { Point } from "../engine/Point";
import { CampMap } from "../data/data";
import { PathDict } from "./calculation";
import { makePathId } from "./makePathId";

export class PathAssigner {
  constructor(
    private campMap: CampMap,
    private pathDict: PathDict,
    private router: CampRouting
  ) {}

  private getPathToCamp(start: RelPos, campID: CampID) {
    let goal = this.campMap.get(campID).areaMapMiddle;

    let path = this.pathDict[makePathId(start, goal)];
    if (path) {
      return path;
    } else {
      throw "Path not found: " + start + " " + goal;
    }
  }

  assign(unit: DangerousCircle, relPos: RelPos): Point[] {
    let otherCampID = this.router.getRouting(unit.campID);
    return this.getPathToCamp(relPos, otherCampID as CampID).realPathArr;
  }
}
