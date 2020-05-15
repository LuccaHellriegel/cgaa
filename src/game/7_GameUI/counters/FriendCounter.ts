import { Gameplay } from "../../../scenes/Gameplay";
import { subscribable, notifyWithVal, ObserverWrapper } from "../Observer";
import { EventSetup } from "../../0_GameBase/setup/EventSetup";

export class FriendCounter {
	count;
	constructor(protected scene: Gameplay, subs: subscribable[], protected guiElement: notifyWithVal) {
		this.count = subs.length;
		new ObserverWrapper(subs, "destroy", this.decrement.bind(this));
	}

	decrement() {
		this.count--;
		this.guiElement.notify(this.count);
		if (this.count === 0) {
			this.scene.events.emit(EventSetup.gameOverEvent);
		}
	}
}
