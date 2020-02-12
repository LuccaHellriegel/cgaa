import { Gameplay } from "../../scenes/Gameplay";
import { UnitCollection } from "../base/UnitCollection";
import { EventSetup } from "../setup/EventSetup";
export class Quest {
	private accepted = false;
	constructor(private scene: Gameplay, private killCollection: UnitCollection, private id, private enemyID) {}

	isDone() {
		return this.accepted && !this.killCollection.hasUnitsWithCampID(this.enemyID);
	}
	accept() {
		this.accepted = true;
		this.scene.events.emit(EventSetup.questAccecptedEvent, this.enemyID);
	}

	hasAccepted() {
		return this.accepted;
	}
}
