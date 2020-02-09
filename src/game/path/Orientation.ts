import { RelPos } from "../base/RelPos";
import { CampExits } from "../camp/CampExits";
import { CampID, CampSetup } from "../setup/CampSetup";

export class Orientation {
	constructor(
		public middleOfGameMap: RelPos,
		public middleOfPlayerArea: RelPos,
		public middleOfBossArea: RelPos,
		public exits: CampExits
	) {}

	//TODO: switch to using middle of camps too, otherwise cooperation not really helpful
	getPosFor(campID: CampID) {
		switch (campID) {
			case CampSetup.playerCampID:
				return this.middleOfPlayerArea;
			case CampSetup.bossCampID:
				return this.middleOfBossArea;
			default:
				return this.exits.getExitFor(campID);
		}
	}
}
