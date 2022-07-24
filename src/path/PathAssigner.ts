import { Paths } from "./Paths";
import { Path } from "./Path";
import { CampRouting } from "../state/CampRouting";
import { CampID } from "../config/CampSetup";
import { RelPos } from "../engine/RelPos";
import { DangerousCircle } from "../units/DangerousCircle/DangerousCircle";
import { Point } from "../engine/Point";

export class PathAssigner {
  constructor(private paths: Paths, private router: CampRouting) {}

  assign(unit: DangerousCircle, relPos: RelPos): Point[] {
    let otherCampID = this.router.getRouting(unit.campID);
    return this.paths
      .getPathToCamp(relPos, otherCampID as CampID)
      .getRealPath();
  }
}
