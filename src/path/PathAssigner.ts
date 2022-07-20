import { Paths } from "./Paths";
import { Path } from "./Path";
import { CampRouting } from "../state/CampRouting";
import { DangerousCircle } from "../../4_GameUnit/units/DangerousCircle";
import { RelPos } from "../../../engine/RelPos";
import { CampID } from "../../0_GameBase/setup/CampSetup";

export class PathAssigner {
  constructor(private paths: Paths, private router: CampRouting) {}

  assign(unit: DangerousCircle, relPos: RelPos): Path {
    let otherCampID = this.router.getRouting(unit.campID);
    return this.paths.getPathToCamp(relPos, otherCampID as CampID);
  }
}
