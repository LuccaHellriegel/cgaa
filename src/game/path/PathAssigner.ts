import { Paths } from "./Paths";
import { DangerousCircle } from "../unit/DangerousCircle";
import { CampRouting } from "../camp/CampRouting";
import { CampID } from "../setup/CampSetup";
import { RelPos } from "../base/RelPos";
import { Path } from "./Path";

export class PathAssigner {
	constructor(private paths: Paths, private router: CampRouting) {}

	assign(unit: DangerousCircle, relPos: RelPos): Path {
		let otherCampID = this.router.getRouting(unit.campID);
		return this.paths.getPathToCamp(relPos, otherCampID as CampID);
	}
}
