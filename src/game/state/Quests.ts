import { CampSetup } from "../setup/CampSetup";
import { EventSetup } from "../setup/EventSetup";
import { Quest } from "../../engine/quest/Quest";

export class Quests extends Map {
	createStartQuests(scene, rivalries) {
		CampSetup.ordinaryCampIDs.forEach((id) => {
			let rivalID = rivalries.getRival(id);
			let amountToKill = CampSetup.numbOfDiplomats + CampSetup.numbOfBuildings;
			let quest = Quest.killQuest(
				scene,
				rivalries,
				this,
				id,
				scene.events,
				EventSetup.unitKilledEvent,
				rivalID,
				amountToKill,
				EventSetup.essentialUnitsKilled,
				rivalID
			);
			this.set(id, quest);
		});
	}
}
