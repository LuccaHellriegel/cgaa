import { Paths } from "./Paths";
import { EnemyCircle } from "../unit/EnemyCircle";
import { CampRouting } from "../camp/CampRouting";
import { CampID } from "../setup/CampSetup";
import { RelPos } from "../base/RelPos";
import { Path } from "./Path";

export class PathAssigner {
	constructor(private paths: Paths, private router: CampRouting) {}

	assign(unit: EnemyCircle, relPos: RelPos): Path {
		let otherCampID = this.router.getRouting(unit.campID);
		return this.paths.getPathToCamp(relPos, otherCampID as CampID);
	}
}
