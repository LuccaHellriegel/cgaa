import { Gameplay } from "../../scenes/Gameplay";
import { enableable } from "../base/interfaces";

export class Enabler {
	constructor(private scene: Gameplay, private enableEvent, private disableEvent) {}

	listenWith(obj: enableable) {
		this.scene.events.on(this.enableEvent, obj.enable.bind(obj));
		this.scene.events.on(this.disableEvent, obj.disable.bind(obj));
	}
}
