import { PlayerFriend } from "../unit/PlayerFriend";
import { notifyWithVal, ObserverWrapper } from "./Observer";
import { Gameplay } from "../../scenes/Gameplay";
import { EventSetup } from "../setup/EventSetup";
export class FriendCounter {
	count;
	constructor(private scene: Gameplay, friends: PlayerFriend[], private guiElement: notifyWithVal) {
		this.count = friends.length;
		new ObserverWrapper(friends, "destroy", this.decrement.bind(this));
	}
	decrement() {
		this.count--;
		this.guiElement.notify(this.count);
		if (this.count === 0) {
			this.scene.events.emit(EventSetup.gameOverEvent);
		}
	}
}
