import { notifyWithVal } from "./Observer";
import { Gameplay } from "../../scenes/Gameplay";
import { EventSetup } from "../setup/EventSetup";
export class TowerCounter {
	count = 0;
	constructor(private type: string, protected scene: Gameplay, protected guiElement: notifyWithVal) {
		scene.events.on(EventSetup.towerSoldEvent, this.decrement.bind(this));
		scene.events.on(EventSetup.towerBuildEvent, this.increment.bind(this));
	}
	increment(type) {
		if (this.type == type) {
			this.count++;
			this.guiElement.notify(this.count);
		}
	}
	decrement(type) {
		if (this.type == type) {
			this.count--;
			this.guiElement.notify(this.count);
		}
	}
}
