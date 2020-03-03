import { notifyWithVal, ObserverWrapper, subscribable } from "./Observer";
import { Gameplay } from "../../scenes/Gameplay";
import { EventSetup } from "../setup/EventSetup";

export abstract class SubsCounterGUI {
	count;
	constructor(protected scene: Gameplay, subs: subscribable[], protected guiElement: notifyWithVal) {
		this.count = subs.length;
		new ObserverWrapper(subs, "destroy", this.decrement.bind(this));
	}

	abstract decrement();
}
export class FriendCounter extends SubsCounterGUI {
	decrement() {
		this.count--;
		this.guiElement.notify(this.count);
		if (this.count === 0) {
			this.scene.events.emit(EventSetup.gameOverEvent);
		}
	}
}
