import { Quests } from "../../engine/quest/Quests";
import { Rivalries } from "./Rivalries";
import { CampSetup } from "../setup/CampSetup";
import { Cooperation } from "../../engine/Cooperation";
import { EventSetup } from "../setup/EventSetup";
import { CampRouting } from "../camp/CampRouting";

export class CGAAData {
	quests = new Quests();
	rivalries: Rivalries;
	cooperation: Cooperation;
	router: CampRouting;

	constructor(scene: Phaser.Scene) {
		this.rivalries = new Rivalries(CampSetup.ordinaryCampIDs);

		this.router = new CampRouting(scene.events, this.rivalries);

		this.cooperation = new Cooperation((id) => {
			scene.events.emit(EventSetup.cooperationEvent, id);
		});
		this.cooperation.init(CampSetup.campIDs);
	}
}
