import { RelPos } from "../base/RelPos";
import { CampID, CampSetup } from "../setup/CampSetup";
import { Camps } from "../camp/Camps";

export class Orientation {
	commonWaypoint: RelPos;

	constructor(
		public middleOfGameMap: RelPos,
		public middleOfPlayerArea: RelPos,
		public middleOfBossArea: RelPos,
		public camps: Camps
	) {}

	setCommonWaypoint(pos: RelPos) {
		this.commonWaypoint = pos;
	}

	getPosFor(campID: CampID) {
		switch (campID) {
			case CampSetup.playerCampID:
				return this.middleOfPlayerArea;
			case CampSetup.bossCampID:
				return this.middleOfBossArea;
			default:
				return this.camps.get(campID).area.getMiddle();
		}
	}
}
